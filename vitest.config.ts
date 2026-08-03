import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["packages/*/src/**/*.ts"],
      exclude: ["packages/**/*.test.ts"],
      thresholds: {
        statements: 53,
        branches: 40,
        functions: 54,
        lines: 55,
      },
    },
    include: ["packages/**/*.test.ts"],
  },
});
