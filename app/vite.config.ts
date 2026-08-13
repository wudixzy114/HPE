import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import {
  defineConfig,
  normalizePath,
  searchForWorkspaceRoot,
  type Plugin,
} from "vite";

import { hpeDeck } from "@hpe/compiler/vite";

const appRoot = fileURLToPath(new URL(".", import.meta.url));
const deckRoot = resolve(process.env.HPE_DECK_ROOT || appRoot);
const PLAYER_STYLES_ID = "virtual:hpe-player-styles.css";
const RESOLVED_PLAYER_STYLES_ID = `\0${PLAYER_STYLES_ID}`;

function playerStyles(): Plugin {
  const playerCss = normalizePath(resolve(appRoot, "theme.css"));
  const playerSource = normalizePath(resolve(appRoot, "src"));
  const deckSource = normalizePath(deckRoot);
  return {
    name: "hpe-player-styles",
    enforce: "pre",
    resolveId(id) {
      return id === PLAYER_STYLES_ID ? RESOLVED_PLAYER_STYLES_ID : null;
    },
    load(id) {
      if (id !== RESOLVED_PLAYER_STYLES_ID) return null;
      return [
        '@import "tailwindcss" source(none);',
        `@import "/@fs/${playerCss}";`,
        `@source "${playerSource}";`,
        `@source "${deckSource}";`,
      ].join("\n");
    },
  };
}

export default defineConfig({
  plugins: [hpeDeck({ root: deckRoot }), playerStyles(), vue(), tailwindcss()],
  server: {
    fs: { allow: [searchForWorkspaceRoot(appRoot), deckRoot] },
  },
  build: { target: "es2022", sourcemap: true },
});
