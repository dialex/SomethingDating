import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://localhost:3000",
    actionTimeout: 1000,
  },
  expect: {
    timeout: 1000,
  },
  webServer: {
    command: "npx serve . --listen 3000",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
