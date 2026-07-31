import { normalizePath } from "vite";
import type { Plugin } from "vite";

import { compileDeck } from "./index.js";
import { transformCodeBlocks } from "./code-block.js";

const VIRTUAL_ID = "virtual:hpe-deck";
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

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
      return id === VIRTUAL_ID ? RESOLVED_ID : null;
    },
    async load(id) {
      if (id !== RESOLVED_ID) return null;
      if (!root) throw new Error("Vite root is not available");
      const deck = await compileDeck(root);
      const imports = deck.slides.map(
        (slide, index) =>
          `import Slide${index} from ${JSON.stringify(`/@fs/${normalizePath(slide.absoluteFile)}`)};`,
      );
      const entries = deck.slides.map(
        (slide, index) => `${JSON.stringify(slide.id)}: Slide${index}`,
      );
      return [
        `import ${JSON.stringify(`/@fs/${normalizePath(deck.themeAbsoluteFile)}`)};`,
        ...imports,
        `export const manifest = ${JSON.stringify(deck.manifest)};`,
        `export const slides = {${entries.join(",")}};`,
        `export const notes = ${JSON.stringify(Object.fromEntries(deck.slides.map((slide) => [slide.id, slide.notes])))};`,
        `export const sources = ${JSON.stringify(
          Object.fromEntries(
            deck.slides.map((slide) => [
              slide.id,
              { source: slide.source, nodes: slide.nodes },
            ]),
          ),
        )};`,
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
          !context.file.endsWith("deck.json"))
      )
        return;
      const virtualModule =
        context.server.moduleGraph.getModuleById(RESOLVED_ID);
      if (virtualModule) {
        context.server.moduleGraph.invalidateModule(virtualModule);
        return [virtualModule];
      }
      return undefined;
    },
  };
}
