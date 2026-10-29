import { expect, test } from "@playwright/test";

const members = [
  {
    slug: "sabir-ali",
    name: "Sabir Ali",
    role: "Full-Stack Engineer",
    skills: [
      "Full-Stack Web Development",
      "Frontend Architecture & Responsive UI",
      "Backend Development & REST API Design",
      "Database Design & Integration",
      "Authentication & Authorization",
      "Application Performance & Optimization",
      "Maintainable and Scalable Architecture",
      "Third-Party Service Integration",
    ],
    technologies: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Vite",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "MongoDB",
      "REST APIs",
      "TanStack Query",
      "Stripe",
      "Cloudinary",
      "Git and GitHub",
      "Python",
      "Flask",
      "OpenCV",
      "Keras and TensorFlow",
      "Applied AI/ML",
    ],
    excludedTechnologies: [
      "PostgreSQL",
      "Socket.IO",
      "Firebase",
      "Supabase",
      "Neon",
      "FastAPI",
      "SQLAlchemy",
    ],
    projects: [
      {
        title: "StaffPilot",
        href: "https://github.com/sabiralidev/StaffPilot",
      },
      {
        title: "ECom Store",
        href: "https://github.com/sabiralidev/ECom",
      },
      {
        title: "Face-Emotions",
        href: "https://github.com/sabiralidev/Face-Emotions",
      },
    ],
    service: "custom-software",
    portraitPending: false,
    hasServices: true,
    hasFaqs: true,
  },
  {
    slug: "suleman-sagheer",
    name: "Sulman Sagheer",
    role: "WordPress & WooCommerce Specialist",
    skills: [
      "WordPress Website Development",
      "WooCommerce Store Development",
      "E-commerce Website Setup",
      "Product and Store Structure",
      "Responsive Storefront Design",
      "Website SEO and Performance Improvements",
    ],
    technologies: ["WordPress", "WooCommerce"],
    excludedTechnologies: ["PHP", "MySQL", "Node.js", "Express.js"],
    projects: [],
    service: "web-design-development",
    portraitPending: false,
    hasServices: true,
    hasFaqs: true,
  },
  {
    slug: "ali-haider",
    name: "Ali Haider",
    role: "SEO Specialist",
    skills: [
      "Technical SEO",
      "On-Page SEO and Metadata Updates",
      "Keyword Research & Search Intent",
      "Competitor Search Analysis",
      "SEO Content Strategy",
      "Website SEO Audits",
      "Search Performance Monitoring",
      "SEO Recommendations and Reporting",
    ],
    technologies: [],
    excludedTechnologies: [
      "Google Search Console",
      "Google Analytics 4",
      "Ahrefs",
      "Semrush",
      "Screaming Frog SEO Spider",
    ],
    projects: [],
    service: "search-engine-optimization",
    portraitPending: false,
    hasServices: true,
    hasFaqs: true,
  },
  {
    slug: "muhammad-abdullah",
    name: "Muhammad Abdullah",
    role: "SEO Specialist",
    skills: [
      "On-Page SEO",
      "Off-Page SEO",
      "Technical SEO",
      "Keyword Research & Search Intent",
      "Content and Metadata Optimization",
      "Link Building & Backlink Strategy",
      "Website SEO Audits",
      "Search Performance Monitoring & Reporting",
    ],
    technologies: [
      "Google Search Console",
      "Google Analytics 4",
      "Google Keyword Planner",
      "Ahrefs",
      "Semrush",
      "Screaming Frog SEO Spider",
    ],
    excludedTechnologies: ["Majestic", "Moz Pro", "Ubersuggest"],
    projects: [],
    service: "search-engine-optimization",
    portraitPending: false,
    hasServices: true,
    hasFaqs: true,
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

test("Muhammad Abdullah has a linked SEO profile with a portrait and SEO details", async ({
  page,
}) => {
  await page.goto("/");

  const profileLink = page.getByRole("link", {
    name: "View Muhammad Abdullah's full profile",
  });
  await expect(profileLink).toHaveAttribute("href", "/team/muhammad-abdullah");
  await expect(
    page.getByRole("img", {
      name: "Muhammad Abdullah, SEO Specialist",
    }),
  ).toBeVisible();

  await page.goto("/team/muhammad-abdullah");
  await expect(
    page.getByRole("heading", { name: "Muhammad Abdullah", level: 1 }),
  ).toBeVisible();
  await expect(page).toHaveTitle(/Muhammad Abdullah/);
  await expect
    .poll(() =>
      page
        .locator('link[rel="canonical"]')
        .getAttribute("href")
        .then((href) => (href ? new URL(href).pathname : null)),
    )
    .toBe("/team/muhammad-abdullah");
  await expect(
    page.getByText("SEO Specialist", { exact: true }).first(),
  ).toBeVisible();
  for (const skill of ["On-Page SEO", "Off-Page SEO", "Technical SEO"]) {
    await expect(page.getByText(skill, { exact: true }).first()).toBeVisible();
  }
  await expect(
    page.locator(".team-profile-hero-image").getByRole("img", {
      name: "Muhammad Abdullah, SEO Specialist",
    }),
  ).toBeVisible();
  await expect(page.locator(".team-profile-technologies")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Services and support" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Frequently asked questions" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Work With Me" }),
  ).toHaveAttribute(
    "href",
    "/contact?team=muhammad-abdullah&service=search-engine-optimization",
  );
});

test("team profiles load directly, refresh, and connect to the correct inquiry", async ({
  page,
}) => {
  for (const member of members.filter(({ hasServices }) => hasServices)) {
    await page.goto(`/team/${member.slug}`);
    await expect(
      page.getByRole("heading", { name: member.name, level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByText(member.role, { exact: true }).first(),
    ).toBeVisible();
    await expect(page.locator(".team-profile-lead")).toBeVisible();
    if (member.slug === "sabir-ali") {
      await expect(page.locator(".team-profile-lead")).toContainText(
        "Sabir Ali is a Full-Stack Engineer who builds modern web applications",
      );
    }
    for (const skill of member.skills) {
      await expect(
        page.getByText(skill, { exact: true }).first(),
      ).toBeVisible();
    }
    for (const technology of member.technologies) {
      await expect(
        page.getByText(technology, { exact: true }).first(),
      ).toBeVisible();
    }
    for (const technology of member.excludedTechnologies) {
      await expect(
        page
          .locator(".team-profile-technologies")
          .getByText(technology, { exact: true }),
      ).toHaveCount(0);
    }
    await expect(page.locator(".team-profile-project-card")).toHaveCount(
      member.projects.length,
    );
    for (const project of member.projects) {
      await expect(
        page.locator(".team-profile-project-card").getByRole("heading", {
          name: project.title,
        }),
      ).toBeVisible();
      await expect(
        page.locator(".team-profile-project-card").getByRole("link", {
          name: new RegExp(project.title),
        }),
      ).toHaveAttribute("href", project.href);
    }
    if (member.technologies.length === 0) {
      await expect(page.locator(".team-profile-technologies")).toHaveCount(0);
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
    if (member.portraitPending) {
      await expect(
        page.locator(".team-profile-hero-image").getByRole("img", {
          name: "Portrait pending for SEO Specialist profile",
        }),
      ).toBeVisible();
    } else {
      const heroImage = page.locator(".team-profile-hero-image img");
      await expect
        .poll(() =>
          heroImage.evaluate(
            (image) => (image as HTMLImageElement).naturalWidth,
          ),
        )
        .toBeGreaterThan(0);
    }
    if (member.hasServices) {
      await expect(
        page.getByRole("heading", { name: "Services and support" }),
      ).toBeVisible();
    } else {
      await expect(page.locator(".team-profile-services")).toHaveCount(0);
    }
    await expect(
      page.getByRole("heading", { name: "Meet the Rest of the Team" }),
    ).toBeVisible();
    await expect(page.locator(".team-profile-related-card")).toHaveCount(
      members.length - 1,
    );
    await expect(
      page.locator(".team-profile-related-card").getByText(member.name, {
        exact: true,
      }),
    ).toHaveCount(0);
    if (member.hasFaqs) {
      const firstFaq = page.locator(".team-profile-faq-list details").first();
      await firstFaq.locator("summary").click();
      await expect(firstFaq.locator("p")).toBeVisible();
    } else {
      await expect(page.locator(".team-profile-faq")).toHaveCount(0);
    }

    await page.reload();
    await expect(
      page.getByRole("heading", { name: member.name, level: 1 }),
    ).toBeVisible();
    await expect(page.locator(".brand-loader-route")).toBeHidden();

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
