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
const PLAYER_STYLES_ID = "virtual:hpe-player-styles.css";
const RESOLVED_PLAYER_STYLES_ID = `\0${PLAYER_STYLES_ID}`;

function playerStyles(deckRoot: string): Plugin {
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

function deckBareImports(deckRoot: string): Plugin {
  const deckSource = `${normalizePath(deckRoot)}/`;
  const appImporter = resolve(appRoot, "src/main.ts");
  return {
    name: "hpe-deck-bare-imports",
    enforce: "pre",
    async resolveId(id, importer, options) {
      if (
        !importer ||
        id.startsWith(".") ||
        id.startsWith("/") ||
        id.startsWith("\0") ||
        !normalizePath(importer).startsWith(deckSource)
      ) {
        return null;
      }
      return this.resolve(id, appImporter, { ...options, skipSelf: true });
    },
  };
}

export default defineConfig(() => {
  const deckRoot = resolve(process.env.HPE_DECK_ROOT || appRoot);
  return {
    plugins: [
      deckBareImports(deckRoot),
      hpeDeck({ root: deckRoot }),
      playerStyles(deckRoot),
      vue(),
      tailwindcss(),
    ],
    server: {
      fs: { allow: [searchForWorkspaceRoot(appRoot), deckRoot] },
    },
    build: { target: "es2022", sourcemap: true },
  };
});
