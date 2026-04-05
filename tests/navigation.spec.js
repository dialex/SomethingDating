import { test, expect } from "@playwright/test";

test.describe("Button navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("next button is enabled on the first step", async ({ page }) => {
    await expect(page.locator("#btn-next")).toBeEnabled();
  });

  test("previous button is disabled on the first step", async ({ page }) => {
    await expect(page.locator("#btn-prev")).toBeDisabled();
  });

  test("clicking next goes to the next step", async ({ page }) => {
    await page.locator("#btn-next").click();
    await expect(page.locator("#progress-text")).toContainText("Step 2");
  });

  test("previous becomes nabled enabled after first step", async ({ page }) => {
    await page.locator("#btn-next").click();
    await expect(page.locator("#btn-prev")).toBeEnabled();
  });

  test("reset button returns to step 1", async ({ page }) => {
    await page.locator("#btn-next").click();
    await page.locator("#btn-reset").click();
    await expect(page.locator("#progress-text")).toContainText("Step 1");
    await expect(page.locator("#btn-prev")).toBeDisabled();
  });
});
