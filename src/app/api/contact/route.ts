import "server-only";

import { isIP } from "node:net";
import { z } from "zod";

import { services, teamDisciplines } from "@/content/content";
import { env } from "@/lib/env";

const serviceSlugs = new Set(services.map(({ slug }) => slug));
const contactSchema = z
  .object({
    fullName: z.string().trim().min(2).max(120),
    email: z.email().max(254),
    company: z.string().trim().max(160).optional().default(""),
    website: z
      .union([z.literal(""), z.url().max(2048)])
      .optional()
      .default("")
      .refine((value) => {
        if (!value) return true;
        const protocol = new URL(value).protocol;
        return protocol === "http:" || protocol === "https:";
      }, "Website must use HTTP or HTTPS."),
    services: z
      .array(z.string())
      .min(1, "Choose at least one service.")
      .max(12)
      .refine((values) => values.every((value) => serviceSlugs.has(value))),
    teamMember: z
      .string()
      .optional()
      .refine(
        (value) =>
          value === undefined ||
          teamDisciplines.some((member) => member.slug === value),
        "Choose a valid team member.",
      ),
    budget: z
      .enum(["", "under-5k", "5k-15k", "15k-50k", "50k-plus", "not-sure"])
      .optional()
      .default(""),
    timeline: z
      .enum(["", "asap", "1-3-months", "3-6-months", "exploring"])
      .optional()
      .default(""),
    details: z.string().trim().min(20).max(5000),
    faxNumber: z.string().max(200).optional().default(""),
  })
  .strict();

const rateLimitWindowMs = 15 * 60 * 1000;
const maximumRequests = 5;
const maximumTrackedClients = 10_000;
const maximumBodyBytes = 16_384;
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function jsonResponse(body: unknown, status: number, headers?: HeadersInit) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

function isRateLimited(request: Request) {
  const headerIp = request.headers.get("x-real-ip")?.trim();
  const key = headerIp && isIP(headerIp) ? headerIp : "unknown";
  const now = Date.now();
  const current = requestCounts.get(key);

  if (!current || current.resetAt <= now) {
    if (requestCounts.size >= maximumTrackedClients) {
      for (const [storedKey, value] of requestCounts) {
        if (value.resetAt <= now) requestCounts.delete(storedKey);
      }
      if (requestCounts.size >= maximumTrackedClients) return true;
    }
    requestCounts.set(key, { count: 1, resetAt: now + rateLimitWindowMs });
    return false;
  }

  current.count += 1;
  return current.count > maximumRequests;
}

async function readLimitedBody(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) return { kind: "body" as const, value: "" };

  const chunks: Uint8Array[] = [];
  let byteLength = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    byteLength += value.byteLength;
    if (byteLength > maximumBodyBytes) {
      await reader.cancel();
      return { kind: "too-large" as const };
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(byteLength);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return { kind: "body" as const, value: new TextDecoder().decode(bytes) };
}

function formatInquiry(data: z.infer<typeof contactSchema>) {
  const selectedServices = data.services.length
    ? data.services
        .map((slug) => services.find((service) => service.slug === slug)?.title)
        .filter(Boolean)
        .join(", ")
    : "Not specified";

  return [
    `Name: ${data.fullName}`,
    `Email: ${data.email}`,
    `Company: ${data.company || "Not provided"}`,
    `Website: ${data.website || "Not provided"}`,
    `Team member requested: ${teamDisciplines.find((member) => member.slug === data.teamMember)?.name ?? "Not specified"}`,
    `Services: ${selectedServices}`,
    `Budget: ${data.budget || "Not provided"}`,
    `Timeline: ${data.timeline || "Not provided"}`,
    "",
    "Project details:",
    data.details,
  ].join("\n");
}

export async function POST(request: Request) {
  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader !== null) {
    const contentLength = Number(contentLengthHeader);
    if (!Number.isSafeInteger(contentLength) || contentLength < 0) {
      return jsonResponse({ message: "The content length is invalid." }, 400);
    }
    if (contentLength > maximumBodyBytes) {
      return jsonResponse({ message: "The submitted form is too large." }, 413);
    }
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (
    contentType.split(";", 1)[0]?.trim().toLowerCase() !== "application/json"
  ) {
    return jsonResponse(
      { message: "Submit the contact form using JSON." },
      415,
    );
  }

  if (isRateLimited(request)) {
    return jsonResponse(
      {
        message:
          "Too many attempts. Please wait a little while before trying again.",
      },
      429,
      { "Retry-After": String(Math.ceil(rateLimitWindowMs / 1000)) },
    );
  }

  let bodyRead: Awaited<ReturnType<typeof readLimitedBody>>;
  try {
    bodyRead = await readLimitedBody(request);
  } catch (error) {
    console.error("Contact request body could not be read.", error);
    return jsonResponse({ message: "We could not read the submission." }, 400);
  }
  if (bodyRead.kind === "too-large") {
    return jsonResponse({ message: "The submitted form is too large." }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(bodyRead.value);
  } catch {
    return jsonResponse(
      { message: "The submitted form is not valid JSON." },
      400,
    );
  }

  const result = contactSchema.safeParse(body);
  if (!result.success) {
    return jsonResponse(
      {
        message: "Please check the highlighted fields and try again.",
        fieldErrors: result.error.flatten().fieldErrors,
      },
      400,
    );
  }

  if (result.data.faxNumber) {
    return jsonResponse({ message: "The inquiry could not be accepted." }, 400);
  }
  if (!env.RESEND_API_KEY || !env.CONTACT_FROM_EMAIL || !env.CONTACT_TO_EMAIL) {
    return jsonResponse(
      {
        message:
          "Contact delivery is not configured yet. Your inquiry was not sent. Please try again later.",
      },
      503,
    );
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: result.data.email,
        subject: result.data.teamMember
          ? `New project inquiry for ${teamDisciplines.find((member) => member.slug === result.data.teamMember)?.name}`
          : "New project inquiry",
        text: formatInquiry(result.data),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error("Contact email provider rejected a request.", {
        status: response.status,
      });
      return jsonResponse(
        {
          message:
            "We could not deliver your inquiry. It was not sent; please try again later.",
        },
        502,
      );
    }
  } catch (error) {
    console.error("Contact email provider could not be reached.", error);
    return jsonResponse(
      {
        message:
          "We could not deliver your inquiry. It was not sent; please try again later.",
      },
      502,
    );
  }

  return jsonResponse(
    { message: "Your inquiry has been sent. Thank you for reaching out." },
    200,
  );
}
