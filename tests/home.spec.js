import { test, expect } from "@playwright/test";

test.describe("Home", () => {
  test("renders all four section cards", async ({ page }) => {
    await page.goto("/");
    await page.locator(".section-grid").waitFor();
    await expect(page.locator(".section-card")).toHaveCount(4);
    await expect(page.locator("#section-intro")).toBeVisible();
    await expect(page.locator("#section-meeting")).toBeVisible();
    await expect(page.locator("#section-dating")).toBeVisible();
    await expect(page.locator("#section-keeping")).toBeVisible();
  });
});
