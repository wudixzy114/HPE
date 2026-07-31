import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { transformCodeBlocks } from "./code-block.js";
import { compileDeck, DeckCompilationError } from "./index.js";

async function createDeck(slideSource: string): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "hpe-compiler-"));
  await writeFile(
    join(root, "deck.json"),
    JSON.stringify({
      schemaVersion: 1,
      id: "test",
      title: "Test",
      size: { width: 1280, height: 720 },
      theme: "theme.css",
      slides: [{ id: "intro", file: "slides/intro.slide.vue" }],
    }),
  );
  await writeFile(join(root, "theme.css"), ":root {}", "utf8");
  await mkdir(join(root, "slides", "assets"), { recursive: true });
  await writeFile(
    join(root, "slides", "assets", "logo.svg"),
    '<svg xmlns="http://www.w3.org/2000/svg"/>',
  );
  await writeFile(join(root, "slides", "intro.slide.vue"), slideSource);
  return root;
}

describe("compileDeck", () => {
  it("extracts notes, source locations and verified assets without executing slide code", async () => {
    const root = await createDeck(`<template>
  <img data-node="hero" src="./assets/logo.svg" />
</template>
<script setup lang="ts">throw new Error('must not execute')</script>
<notes lang="md">Speaker note</notes>`);
    const deck = await compileDeck(root);
    expect(deck.slides[0]?.notes).toBe("Speaker note");
    expect(deck.slides[0]?.nodes.hero).toEqual({
      file: "slides/intro.slide.vue",
      line: 2,
      column: 8,
    });
    expect(deck.slides[0]?.assets).toHaveLength(1);
  });

  it("rejects classes that Tailwind cannot scan statically", async () => {
    const root = await createDeck(`<template>
  <div :class="'text-' + size">Invalid</div>
</template>
<script setup lang="ts">const size = 'xl'</script>`);
    const error = await compileDeck(root).catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(DeckCompilationError);
    expect((error as DeckCompilationError).issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "DYNAMIC_CLASS_UNSCANNABLE",
          slideId: "intro",
        }),
      ]),
    );
  });

  it("rejects missing assets and duplicate node identifiers together", async () => {
    const root = await createDeck(`<template>
  <div data-node="item"><img src="./missing.png" /></div>
  <div data-node="item" />
</template>`);
    const error = await compileDeck(root).catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(DeckCompilationError);
    expect(
      (error as DeckCompilationError).issues.map((issue) => issue.code),
    ).toEqual(expect.arrayContaining(["ASSET_NOT_FOUND", "NODE_ID_DUPLICATE"]));
  });
});

describe("compile-time Shiki transform", () => {
  it("replaces static ShikiCode components with highlighted HTML and a source map", async () => {
    const source = `<template><ShikiCode lang="typescript" code="const answer = 42" /></template>`;
    const result = await transformCodeBlocks(source, "example.slide.vue");
    expect(result?.code).not.toContain("<ShikiCode");
    expect(result?.code).toContain('class="shiki');
    expect(result?.map.sources).toContain("example.slide.vue");
  });
});
