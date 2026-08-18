import { defineConfig, mergeConfig } from "vite";

import appConfig from "./vite.config.ts";

export default defineConfig((environment) =>
  mergeConfig(appConfig(environment), {
    base: "./",
    build: {
      assetsInlineLimit: 10_000_000,
      cssCodeSplit: false,
      sourcemap: false,
      rollupOptions: {
        output: {
          format: "iife",
          inlineDynamicImports: true,
        },
      },
    },
  }),
);
