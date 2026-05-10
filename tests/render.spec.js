import { test, expect } from "@playwright/test";

test.describe("Rendering", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#intro/1");
    await page.locator(".wizard-step-card:not(.peek)").waitFor();
  });

  test("renders a step card on load", async ({ page }) => {
    await expect(page.locator(".wizard-step-card:not(.peek)")).toBeVisible();
  });

  test("renders step 1 badge on load", async ({ page }) => {
    await expect(page.locator(".wizard-step-badge")).toContainText("Step 1");
  });
});
