import { test, expect } from "@playwright/test";

test.describe("Rendeering", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("#section-intro").click();
  });

  test("renders a step card on load", async ({ page }) => {
    await expect(page.locator(".step-card")).toBeVisible();
  });

  test("renders step 1 on load", async ({ page }) => {
    await expect(page.locator("#progress-text")).toContainText("Step 1");
  });
});
