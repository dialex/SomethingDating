import { test, expect } from "@playwright/test";

test.describe("Credits page", () => {
  test("renders credits with unsplash attribution links", async ({ page }) => {
    await page.goto("/#credits");
    await page.locator(".credits-card").waitFor();
    const unsplashLinks = page.locator(".credits-card a[href*='unsplash.com']");
    await expect(unsplashLinks.first()).toBeVisible();
    expect(await unsplashLinks.count()).toBeGreaterThan(0);
  });
});
