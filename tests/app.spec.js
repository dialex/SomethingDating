import { test, expect } from "@playwright/test";

test.describe("Dating Guide app", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders a step card on load", async ({ page }) => {
    await expect(page.locator(".step-card")).toBeVisible();
  });

  test("shows step 1 progress on load", async ({ page }) => {
    await expect(page.locator("#progress-text")).toContainText("Step 1");
  });

  test("Previous button is disabled on the first step", async ({ page }) => {
    await expect(page.locator("#btn-prev")).toBeDisabled();
  });

  test("Next button is enabled on the first step", async ({ page }) => {
    await expect(page.locator("#btn-next")).toBeEnabled();
  });

  test("navigating forward advances the step", async ({ page }) => {
    await page.locator("#btn-next").click();
    await expect(page.locator("#progress-text")).toContainText("Step 2");
  });

  test("Previous button becomes enabled after navigating forward", async ({ page }) => {
    await page.locator("#btn-next").click();
    await expect(page.locator("#btn-prev")).toBeEnabled();
  });

  test("Reset returns to step 1", async ({ page }) => {
    await page.locator("#btn-next").click();
    await page.locator("#btn-reset").click();
    await expect(page.locator("#progress-text")).toContainText("Step 1");
    await expect(page.locator("#btn-prev")).toBeDisabled();
  });
});
