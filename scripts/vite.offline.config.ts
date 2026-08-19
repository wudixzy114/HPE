// 单文件离线打包的 vite 配置：复用 app/vite.config.ts，强制单 JS chunk。
// HPE_DECK_ROOT 由调用方（scripts/package-offline.mjs）设置为 deck 的绝对路径。
import { resolve } from "node:path";
import { defineConfig, type UserConfig } from "vite";

const appConfig = (await import("../app/vite.config.ts")).default as (
  env: Record<string, string>,
) => Promise<UserConfig> | UserConfig;

const base = await appConfig({ command: "build", mode: "production" });

export default defineConfig({
  ...base,
  root: resolve(import.meta.dirname, "../app"),
  build: {
    ...base.build,
    sourcemap: false,
    rollupOptions: {
      output: { codeSplitting: false },
    },
  },
});
