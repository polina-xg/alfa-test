import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./playwright/tests",

  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },

  fullyParallel: false,
  retries: 1,
  workers: 1,
  reporter: [["list"], ["allure-playwright"]],

  use: {
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    headless: true,
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
