import { normalizePath } from "vite";
import type { Plugin } from "vite";

import { compileDeck } from "./index.js";
import { transformCodeBlocks } from "./code-block.js";

const VIRTUAL_ID = "virtual:hpe-deck";
const RESOLVED_ID = `\0${VIRTUAL_ID}`;
const NOTES_ID = `${VIRTUAL_ID}/notes`;
const RESOLVED_NOTES_ID = `\0${NOTES_ID}`;
const SOURCES_ID = `${VIRTUAL_ID}/sources`;
const RESOLVED_SOURCES_ID = `\0${SOURCES_ID}`;

export interface HpeVitePluginOptions {
  readonly root?: string;
}

export function hpeDeck(options: HpeVitePluginOptions = {}): Plugin {
  let root = options.root;
  return {
    name: "hpe-deck",
    enforce: "pre",
    configResolved(config) {
      root ??= config.root;
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
      if (id === NOTES_ID) return RESOLVED_NOTES_ID;
      if (id === SOURCES_ID) return RESOLVED_SOURCES_ID;
      return null;
    },
    async load(id) {
      if (
        id !== RESOLVED_ID &&
        id !== RESOLVED_NOTES_ID &&
        id !== RESOLVED_SOURCES_ID
      ) {
        return null;
      }
      if (!root) throw new Error("Vite root is not available");
      const deck = await compileDeck(root);
      if (id === RESOLVED_NOTES_ID) {
        return `export const notes = ${JSON.stringify(
          Object.fromEntries(
            deck.slides.map((slide) => [slide.id, slide.notes]),
          ),
        )};`;
      }
      if (id === RESOLVED_SOURCES_ID) {
        return `export const sources = ${JSON.stringify(
          Object.fromEntries(
            deck.slides.map((slide) => [
              slide.id,
              { source: slide.source, nodes: slide.nodes },
            ]),
          ),
        )};`;
      }
      const entries = deck.slides.map((slide) => {
        const slidePath = `/@fs/${normalizePath(slide.absoluteFile)}`;
        return `${JSON.stringify(slide.id)}: defineAsyncComponent(() => import(${JSON.stringify(slidePath)}))`;
      });
      const loaders = deck.slides.map((slide) => {
        const slidePath = `/@fs/${normalizePath(slide.absoluteFile)}`;
        return `${JSON.stringify(slide.id)}: () => import(${JSON.stringify(slidePath)})`;
      });
      const themeLines =
        typeof deck.manifest.theme === "string"
          ? [
              `import ${JSON.stringify(`/@fs/${normalizePath(deck.themeAbsoluteFile)}`)};`,
              "export const theme = undefined;",
              "export const themes = [];",
            ]
          : deck.themeAbsoluteFiles.map((themeFile, index) => {
              const variable = `themeDefinition${index}`;
              return `import ${variable} from ${JSON.stringify(`/@fs/${normalizePath(themeFile)}`)};`;
            });
      if (typeof deck.manifest.theme !== "string") {
        const variables = deck.themeAbsoluteFiles.map(
          (_themeFile, index) => `themeDefinition${index}`,
        );
        themeLines.push(
          `export const theme = ${variables[0]};`,
          `export const themes = [${variables.join(",")}];`,
        );
      }
      return [
        `import { defineAsyncComponent } from "vue";`,
        ...themeLines,
        `export const manifest = ${JSON.stringify(deck.manifest)};`,
        `export const slideLoaders = {${loaders.join(",")}};`,
        `export const slides = {${entries.join(",")}};`,
      ].join("\n");
    },
    async transform(_code, id) {
      if (
        id.includes(".vue?") &&
        (id.includes("type=notes") || id.includes("blockType=notes"))
      ) {
        return {
          code: "export default () => {}",
          map: {
            version: 3,
            sources: [id],
            sourcesContent: [_code],
            names: [],
            mappings: "",
          },
        };
      }
      if (id.endsWith(".slide.vue")) {
        return (await transformCodeBlocks(_code, id)) ?? undefined;
      }
      return undefined;
    },
    handleHotUpdate(context) {
      if (
        !root ||
        (!context.file.endsWith(".slide.vue") &&
          !context.file.endsWith("deck.json") &&
          !deckThemeFile(context.file, root))
      )
        return;
      const virtualModules = [
        RESOLVED_ID,
        RESOLVED_NOTES_ID,
        RESOLVED_SOURCES_ID,
      ]
        .map((moduleId) => context.server.moduleGraph.getModuleById(moduleId))
        .filter((module) => module !== undefined);
      for (const virtualModule of virtualModules) {
        context.server.moduleGraph.invalidateModule(virtualModule);
      }
      if (virtualModules.length > 0) return virtualModules;
      return undefined;
    },
  };
}

function deckThemeFile(file: string, root: string): boolean {
  const normalizedFile = normalizePath(file);
  const normalizedThemeRoot = `${normalizePath(root)}/themes/`;
  return (
    normalizedFile.startsWith(normalizedThemeRoot) &&
    (normalizedFile.endsWith(".ts") || normalizedFile.endsWith(".css"))
  );
}
