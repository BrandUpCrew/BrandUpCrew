import { expect, test } from "@playwright/test";

test("starter route renders its configured identity", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "A clearer foundation for what's next.",
    }),
  ).toBeVisible();
  await expect(page.getByText("Independent Studio / Phase 1")).toBeVisible();
});
