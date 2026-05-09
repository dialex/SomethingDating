import { test, expect } from "@playwright/test";

test.describe("Button navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#intro/1");
    await page.locator(".wizard-step-card").waitFor();
  });

  test("next button is enabled on the first step", async ({ page }) => {
    await expect(page.locator("#btn-next")).toBeEnabled();
  });

  test("previous button is hidden on the first step", async ({ page }) => {
    await expect(page.locator("#btn-prev")).toBeHidden();
  });

  test("clicking next goes to the next step", async ({ page }) => {
    await page.locator("#btn-next").click();
    await expect(page.locator(".wizard-step-badge")).toContainText("Step 2");
  });

  test("previous becomes visible after first step", async ({ page }) => {
    await page.locator("#btn-next").click();
    await expect(page.locator("#btn-prev")).toBeVisible();
  });
});
