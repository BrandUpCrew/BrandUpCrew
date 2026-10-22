import { expect, test } from "@playwright/test";

const pages = [
  "/",
  "/about",
  "/services",
  "/services/web-design-development",
  "/services/custom-software",
  "/services/brand-identity",
  "/services/ui-ux-design",
  "/services/search-engine-optimization",
  "/services/google-ads",
  "/services/paid-social",
  "/services/social-media",
  "/services/content-strategy",
  "/services/ai-automation",
  "/services/conversion-optimization",
  "/services/digital-strategy",
  "/work",
  "/work/northstar-financial-demo",
  "/work/fieldnotes-commerce-demo",
  "/work/common-ground-learning-demo",
  "/process",
  "/industries",
  "/insights",
  "/insights/a-better-brief-starts-with-the-problem",
  "/insights/technical-seo-is-a-team-sport",
  "/insights/automation-with-a-human-fallback",
  "/contact",
  "/faq",
  "/privacy",
  "/terms",
];

test("system theme, theme switching, and persistence work across all pages", async ({
  page,
}) => {
  test.setTimeout(180_000);

  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator(".brand-loader-initial")).toBeHidden({
    timeout: 10_000,
  });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect
    .poll(() =>
      page
        .locator("html")
        .evaluate((element) =>
          getComputedStyle(element)
            .getPropertyValue("--accent")
            .trim()
            .toLowerCase(),
        ),
    )
    .toBe("#fa8927");
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(4, 6, 15)",
  );

  await page
    .getByRole("button", { name: "Toggle light and dark theme" })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect
    .poll(() =>
      page
        .locator("html")
        .evaluate((element) =>
          getComputedStyle(element)
            .getPropertyValue("--accent")
            .trim()
            .toLowerCase(),
        ),
    )
    .toBe("#fa8927");

  for (const path of pages) {
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      "rgb(255, 255, 255)",
    );
    await expect(
      page.getByRole("button", { name: "Toggle light and dark theme" }),
    ).toBeVisible();
    const lightSections = await page
      .locator(
        ".hero, .process-preview, .industry-band, .about-capabilities, .page-intro-dark, .cta-section, .site-footer",
      )
      .evaluateAll((sections) =>
        sections.map((section) => getComputedStyle(section).backgroundColor),
      );
    expect(lightSections).toEqual(
      lightSections.map(() => "rgb(255, 255, 255)"),
    );
  }

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page
    .getByRole("button", { name: "Toggle light and dark theme" })
    .click();

  for (const path of pages) {
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      "rgb(4, 6, 15)",
    );
    await expect(
      page.getByRole("button", { name: "Toggle light and dark theme" }),
    ).toBeVisible();
  }

  await page.goto("/contact");
  const nameField = page.locator("#fullName");
  await expect(nameField).toHaveCSS("background-color", "rgb(4, 6, 15)");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  const mobileNavigation = page.locator(".mobile-nav");
  await expect(mobileNavigation).toBeVisible();
  await expect(mobileNavigation).toHaveCSS(
    "background-color",
    "rgb(7, 11, 28)",
  );
  await page
    .getByRole("button", { name: "Toggle light and dark theme" })
    .click();
  await expect(nameField).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(mobileNavigation).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );

  await page
    .getByRole("button", { name: "Toggle light and dark theme" })
    .click();
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(4, 6, 15)",
  );
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.emulateMedia({ colorScheme: "dark" });
  await page.evaluate(() => window.localStorage.removeItem("future-theme"));
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
