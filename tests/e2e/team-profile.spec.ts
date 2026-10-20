import { expect, test } from "@playwright/test";

const members = [
  {
    slug: "sabir-ali",
    name: "Sabir Ali",
    role: "Full-Stack Engineer",
    skills: [
      "Product Strategy",
      "Full-Stack Development",
      "Web Application Architecture",
      "UI/UX Implementation",
      "API Development",
      "Performance Optimization",
      "System Design & Scalable Architecture",
    ],
    service: "custom-software",
  },
  {
    slug: "suleman-sagheer",
    name: "Suleman Sagheer",
    role: "WordPress & WooCommerce Specialist",
    skills: [
      "WordPress Development",
      "WooCommerce Solutions",
      "Responsive Web Design",
      "Website SEO Optimization",
      "E-commerce Development",
      "Website Performance Optimization",
    ],
    service: "web-design-development",
  },
  {
    slug: "ali-haider",
    name: "Ali Haider",
    role: "SEO Specialist & Organic Growth Expert",
    skills: [
      "Technical SEO",
      "On-Page & Off-Page SEO",
      "Keyword Research & Search Intent",
      "SEO Content Strategy",
      "Website Audits & Optimization",
      "Organic Traffic Growth",
      "Search Performance Analysis",
      "SEO Reporting & Analytics",
    ],
    service: "search-engine-optimization",
  },
];

test("team cards provide accessible links to their dedicated profiles", async ({
  page,
}) => {
  await page.goto("/");

  for (const member of members) {
    const profileLink = page.getByRole("link", {
      name: `View ${member.name}'s full profile`,
    });
    await expect(profileLink).toHaveAttribute("href", `/team/${member.slug}`);
    await profileLink.focus();
    await expect(profileLink).toBeFocused();
  }
});

test("team profiles load directly, refresh, and connect to the correct inquiry", async ({
  page,
}) => {
  for (const member of members) {
    await page.goto(`/team/${member.slug}`);
    await expect(
      page.getByRole("heading", { name: member.name, level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByText(member.role, { exact: true }).first(),
    ).toBeVisible();
    for (const skill of member.skills) {
      await expect(
        page.getByText(skill, { exact: true }).first(),
      ).toBeVisible();
    }
    await expect(page).toHaveTitle(new RegExp(member.name));
    await expect
      .poll(() =>
        page
          .locator('link[rel="canonical"]')
          .getAttribute("href")
          .then((href) => (href ? new URL(href).pathname : null)),
      )
      .toBe(`/team/${member.slug}`);
    const heroImage = page.locator(".team-profile-hero-image img");
    await expect
      .poll(() =>
        heroImage.evaluate((image) => (image as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
    await expect(
      page.getByRole("heading", { name: "Services and support" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Meet the Rest of the Team" }),
    ).toBeVisible();
    await expect(page.locator(".team-profile-related-card")).toHaveCount(2);
    await expect(
      page.locator(".team-profile-related-card").getByText(member.name, {
        exact: true,
      }),
    ).toHaveCount(0);
    const firstFaq = page.locator(".team-profile-faq-list details").first();
    await firstFaq.locator("summary").click();
    await expect(firstFaq.locator("p")).toBeVisible();

    await page.reload();
    await expect(
      page.getByRole("heading", { name: member.name, level: 1 }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Work With Me" }).click();
    await expect(page).toHaveURL(
      new RegExp(`/contact\\?team=${member.slug}&service=${member.service}`),
    );
    await expect(page.locator('input[name="teamMember"]')).toHaveValue(
      member.slug,
    );
    await expect(
      page.locator(`input[name="services"][value="${member.service}"]`),
    ).toBeChecked();
    await expect(page.locator(".profile-inquiry-context")).toContainText(
      "not directly to the team member",
    );
  }
});

test("contact API rejects unverified team-member routing values", async ({
  request,
}) => {
  const response = await request.post("/api/contact", {
    data: {
      fullName: "Taylor Example",
      email: "taylor@example.com",
      company: "",
      website: "",
      services: ["custom-software"],
      teamMember: "not-a-real-member",
      budget: "",
      timeline: "",
      details: "We would like to discuss a custom digital product.",
      faxNumber: "",
    },
  });

  expect(response.status()).toBe(400);
  expect(await response.json()).toMatchObject({
    message: "Please check the highlighted fields and try again.",
  });
});

test("unknown team profiles use the site's not-found page", async ({
  page,
}) => {
  const response = await page.goto("/team/not-a-real-member");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "This page took a different turn." }),
  ).toBeVisible();
});

test("team profile cards fit supported widths and retain both themes", async ({
  page,
}) => {
  await page.goto("/team/ali-haider");

  for (const theme of ["light", "dark"]) {
    await page.evaluate((value) => {
      document.documentElement.dataset.theme = value;
    }, theme);
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      theme === "dark" ? "rgb(4, 6, 15)" : "rgb(255, 255, 255)",
    );
    await expect(page.locator(".team-profile-overview")).toHaveCSS(
      "background-color",
      theme === "dark" ? "rgb(4, 6, 15)" : "rgb(255, 255, 255)",
    );

    for (const width of [1440, 900, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await expect
        .poll(() =>
          page.evaluate(() => {
            const elements = [
              document.documentElement,
              ...document.querySelectorAll<HTMLElement>(
                ".team-profile-skill-list li, .team-profile-service-card, .team-profile-process-list li, .team-profile-related-card",
              ),
            ];
            return elements.every(
              (element) => element.scrollWidth <= element.clientWidth + 1,
            );
          }),
        )
        .toBe(true);
    }
  }
});
