import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const validContactData = {
  fullName: "Avery Example",
  email: "avery@example.org",
  company: "",
  website: "",
  services: ["web-design-development"],
  budget: "",
  timeline: "",
  details: "We would like to discuss a digital project for our business.",
  faxNumber: "",
};

test("home page presents the agency and primary journeys", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Make your next move matter." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Start a conversation/ }).first(),
  ).toHaveAttribute("href", "/contact");
  await expect(
    page.getByRole("link", { name: /Explore our services/ }),
  ).toHaveAttribute("href", "/services");
  await expect(
    page.getByRole("heading", {
      name: /One partner. The right mix of disciplines./,
    }),
  ).toBeVisible();
});

test("core pages and a service detail render with page headings", async ({
  page,
}) => {
  const pages = [
    ["/about", "Independent thinking, built around your next move."],
    ["/services", "The right work, in the right order."],
    ["/services/web-design-development", "Web design & development"],
    ["/services/custom-software", "Custom software development"],
    ["/services/brand-identity", "Branding & visual identity"],
    ["/services/ui-ux-design", "UI/UX design"],
    ["/services/search-engine-optimization", "Search engine optimization"],
    ["/services/google-ads", "Google Ads & paid search"],
    ["/services/paid-social", "Meta Ads & paid social"],
    ["/services/social-media", "Social media strategy & management"],
    ["/services/content-strategy", "Content strategy & creation"],
    ["/services/ai-automation", "AI integration & business automation"],
    ["/services/conversion-optimization", "Conversion rate optimization"],
    ["/services/digital-strategy", "Digital strategy & growth consulting"],
    ["/work", "A look at how we approach a challenge."],
    ["/work/northstar-financial-demo", "Northstar Financial"],
    ["/work/fieldnotes-commerce-demo", "Fieldnotes Supply"],
    ["/work/common-ground-learning-demo", "Common Ground Learning"],
    ["/process", "A good process makes room for better decisions."],
    ["/industries", "Different contexts. A shared focus on people."],
    ["/insights", "A little thinking, made useful."],
    [
      "/insights/a-better-brief-starts-with-the-problem",
      "A better brief starts with the problem",
    ],
    [
      "/insights/technical-seo-is-a-team-sport",
      "Technical SEO is a team sport",
    ],
    [
      "/insights/automation-with-a-human-fallback",
      "Design automation with a human fallback",
    ],
    ["/contact", "Start with what you are trying to change."],
    ["/faq", "A few things worth knowing."],
    ["/privacy", "Your information deserves care."],
    ["/terms", "A clear starting point."],
  ];

  for (const [path, heading] of pages) {
    await page.goto(path);
    await expect(
      page.getByRole("heading", { level: 1, name: heading }),
    ).toBeVisible();
  }
});

test("mobile navigation works and the home page fits the viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByLabel("Open navigation").click();
  const mobileNavigation = page.getByRole("navigation", {
    name: "Mobile navigation",
  });
  await expect(
    mobileNavigation.getByRole("link", { name: "Industries" }),
  ).toBeVisible();
  await mobileNavigation.getByRole("link", { name: "Industries" }).click();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Different contexts. A shared focus on people.",
    }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
});

test("dark mode maintains contrast in dark and accent sections", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/services/web-design-development");
  const heroColors = await page
    .locator(".page-intro-dark")
    .evaluate((element) => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, foreground: style.color };
    });
  expect(heroColors.background).not.toBe(heroColors.foreground);

  const buttonColors = await page
    .locator(".cta-section .button")
    .evaluate((element) => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, foreground: style.color };
    });
  expect(buttonColors.background).not.toBe(buttonColors.foreground);
});

test("representative routes pass automated WCAG 2.2 AA accessibility checks", async ({
  page,
}) => {
  for (const path of ["/", "/contact", "/services/web-design-development"]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      results.violations.map(({ id, impact, description, nodes }) => ({
        id,
        impact,
        description,
        elements: nodes.map(({ target }) => target),
      })),
      `Accessibility violations on ${path}`,
    ).toEqual([]);
  }
});

test("representative layouts do not overflow at supported viewport widths", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/contact", "/services/web-design-development"]) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `${path} overflows at ${width}px`,
      ).toBeTruthy();
    }
  }
});

test("internal home-page links resolve and public metadata is complete", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const internalLinks = await page
    .locator('a[href^="/"]')
    .evaluateAll((links) => [
      ...new Set(
        links.map((link) => new URL((link as HTMLAnchorElement).href).pathname),
      ),
    ]);
  for (const path of internalLinks) {
    const response = await request.get(path);
    expect(response.status(), `${path} should resolve`).toBe(200);
  }

  await page.goto("/insights/a-better-brief-starts-with-the-problem");
  await expect(page).toHaveTitle(/A better brief starts with the problem/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /Before choosing a platform/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/insights\/a-better-brief-starts-with-the-problem$/,
  );
  const structuredData = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  expect(structuredData).toBeTruthy();
  expect(JSON.parse(structuredData ?? "")).toMatchObject({
    "@type": "Article",
    headline: "A better brief starts with the problem",
  });
});

test("security headers are present on public pages", async ({ request }) => {
  const response = await request.get("/");
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response.headers()["x-frame-options"]).toBe("DENY");
  expect(response.headers()["referrer-policy"]).toBe(
    "strict-origin-when-cross-origin",
  );
  expect(response.headers()["permissions-policy"]).toContain("camera=()");
});

test("contact form reports a provider-unavailable response", async ({
  page,
}) => {
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        message:
          "Contact delivery is not configured yet. Your inquiry was not sent. Please try again later.",
      }),
    }),
  );
  await page.goto("/contact?service=web-design-development");
  await expect(
    page.getByRole("checkbox", { name: "Web design & development" }),
  ).toBeChecked();
  await page.getByLabel("Full name").fill("Avery Example");
  await page.getByLabel("Business email").fill("avery@example.org");
  await page
    .getByLabel("Tell us a little about the project")
    .fill("We are exploring a clearer website experience for our customers.");
  await page.getByRole("button", { name: "Send inquiry" }).click();
  await expect(page.locator(".form-message-error")).toContainText(
    "Your inquiry was not sent",
  );
});

test("unknown routes show the custom not-found page", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "This page took a different turn.",
    }),
  ).toBeVisible();
});

test("contact endpoint rejects invalid data without attempting delivery", async ({
  request,
}) => {
  const response = await request.post("/api/contact", {
    data: { ...validContactData, services: [] },
    headers: { "x-real-ip": "198.51.100.10" },
  });
  expect(response.status()).toBe(400);
  expect(await response.json()).toMatchObject({
    message: "Please check the highlighted fields and try again.",
    fieldErrors: { services: ["Choose at least one service."] },
  });
});

test("contact endpoint enforces request content type, size, and HTTP(S) URLs", async ({
  request,
}) => {
  const wrongContentType = await request.post("/api/contact", {
    data: "{}",
    headers: { "content-type": "text/plain" },
  });
  expect(wrongContentType.status()).toBe(415);

  const oversized = await request.post("/api/contact", {
    data: { ...validContactData, details: "x".repeat(17_000) },
    headers: { "x-real-ip": "198.51.100.11" },
  });
  expect(oversized.status()).toBe(413);

  const invalidWebsite = await request.post("/api/contact", {
    data: { ...validContactData, website: "javascript:alert(1)" },
    headers: { "x-real-ip": "198.51.100.12" },
  });
  expect(invalidWebsite.status()).toBe(400);
  expect((await invalidWebsite.json()).fieldErrors.website).toContain(
    "Website must use HTTP or HTTPS.",
  );
});

test("contact rate limit ignores spoofed forwarded-for values", async ({
  request,
}, testInfo) => {
  const projectIpOctets: Record<string, number> = {
    chromium: 13,
    firefox: 14,
    webkit: 15,
  };
  const clientIp = `198.51.100.${(projectIpOctets[testInfo.project.name] ?? 16) + testInfo.retry * 10}`;
  const responses = [];
  for (let attempt = 0; attempt < 6; attempt += 1) {
    responses.push(
      await request.post("/api/contact", {
        data: { ...validContactData, faxNumber: "honeypot" },
        headers: {
          "x-real-ip": clientIp,
          "x-forwarded-for": `203.0.113.${attempt + 1}`,
        },
      }),
    );
  }

  expect(responses.slice(0, 5).map((response) => response.status())).toEqual([
    400, 400, 400, 400, 400,
  ]);
  expect(responses[5].status()).toBe(429);
  expect(responses[5].headers()["retry-after"]).toBe("900");
});

test("contact form reports a failed network request", async ({ page }) => {
  await page.route("**/api/contact", (route) => route.abort());
  await page.goto("/contact?service=web-design-development");
  await page.getByLabel("Full name").fill("Avery Example");
  await page.getByLabel("Business email").fill("avery@example.org");
  await page
    .getByLabel("Tell us a little about the project")
    .fill("We would like to discuss a digital project for our business.");
  await page.getByRole("button", { name: "Send inquiry" }).click();
  await expect(page.locator(".form-message-error")).toContainText(
    "could not confirm whether your inquiry was sent",
  );
});

test("RSS feed and sitemap expose the published static content", async ({
  request,
}) => {
  const feed = await request.get("/feed.xml");
  expect(feed.ok()).toBeTruthy();
  expect(await feed.text()).toContain("<rss");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain("/services/web-design-development");
});
