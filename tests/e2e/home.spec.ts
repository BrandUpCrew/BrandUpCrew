import { expect, test } from "@playwright/test";

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

test("contact form reports honestly when delivery is not configured", async ({
  page,
}) => {
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
    data: {
      fullName: "Avery Example",
      email: "avery@example.org",
      company: "",
      website: "",
      services: [],
      budget: "",
      timeline: "",
      details: "We would like to discuss a digital project.",
      faxNumber: "",
    },
  });
  expect(response.status()).toBe(400);
  expect(await response.json()).toMatchObject({
    message: "Please check the highlighted fields and try again.",
    fieldErrors: { services: ["Choose at least one service."] },
  });
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
