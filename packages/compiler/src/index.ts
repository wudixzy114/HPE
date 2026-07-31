import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { parse, type SFCDescriptor } from "@vue/compiler-sfc";

import type { DeckManifest, SourceLocation } from "@hpe/schema";
import { validateDeckManifest } from "@hpe/schema/validate";

export interface CompiledSlide {
  readonly id: string;
  readonly absoluteFile: string;
  readonly notes: string;
  readonly descriptor: SFCDescriptor;
  readonly source: SourceLocation;
}

export interface CompiledDeck {
  readonly root: string;
  readonly themeAbsoluteFile: string;
  readonly manifest: DeckManifest;
  readonly slides: readonly CompiledSlide[];
}

export async function loadManifest(root: string): Promise<DeckManifest> {
  const contents = await readFile(resolve(root, "deck.json"), "utf8");
  return validateDeckManifest(JSON.parse(contents) as unknown);
}

export async function compileDeck(root: string): Promise<CompiledDeck> {
  const manifest = await loadManifest(root);
  const themeAbsoluteFile = resolve(root, manifest.theme);
  await readFile(themeAbsoluteFile, "utf8");
  const slides = await Promise.all(
    manifest.slides.map(async (entry) => {
      const absoluteFile = resolve(root, entry.file);
      const source = await readFile(absoluteFile, "utf8");
      const result = parse(source, { filename: absoluteFile, sourceMap: true });
      if (result.errors.length > 0) {
        throw new AggregateError(
          result.errors,
          `Unable to parse slide ${entry.id}`,
        );
      }
      const notes =
        result.descriptor.customBlocks
          .find((block) => block.type === "notes")
          ?.content.trim() ?? "";
      return {
        id: entry.id,
        absoluteFile,
        notes,
        descriptor: result.descriptor,
        source: { file: entry.file, line: 1, column: 1 },
      } satisfies CompiledSlide;
    }),
  );
  return { root: resolve(root), themeAbsoluteFile, manifest, slides };
}
