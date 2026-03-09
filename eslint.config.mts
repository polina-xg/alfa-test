import js from "@eslint/js";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";
import prettier from "eslint-config-prettier";

export default [
  {
    ignores: [
      "node_modules",
      "playwright-report",
      "test-results",
      "dist",
      "coverage",
      "allure-report",
      "allure-results",
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },

  {
    files: ["tests/**/*.ts"],
    plugins: {
      playwright,
    },
    rules: {
      ...playwright.configs.recommended.rules,
      "playwright/no-focused-test": "error",
      "playwright/no-skipped-test": "warn",
    },
  },
  prettier,
];
