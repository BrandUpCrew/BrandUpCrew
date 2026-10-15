import { z } from "zod";

const envSchema = z
  .object({
    NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
    RESEND_API_KEY: z.string().min(1).optional(),
    CONTACT_FROM_EMAIL: z.email().optional(),
    CONTACT_TO_EMAIL: z.email().optional(),
  })
  .superRefine((values, context) => {
    const deliveryValues = [
      values.RESEND_API_KEY,
      values.CONTACT_FROM_EMAIL,
      values.CONTACT_TO_EMAIL,
    ];
    if (deliveryValues.some(Boolean) && !deliveryValues.every(Boolean)) {
      context.addIssue({
        code: "custom",
        message:
          "Configure RESEND_API_KEY, CONTACT_FROM_EMAIL, and CONTACT_TO_EMAIL together.",
        path: ["RESEND_API_KEY"],
      });
    }
  });

export const env = envSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
