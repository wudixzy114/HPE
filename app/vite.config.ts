import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

import { hpeDeck } from "@hpe/compiler/vite";

export default defineConfig({
  plugins: [hpeDeck(), vue(), tailwindcss()],
  build: { target: "es2022", sourcemap: true },
});
