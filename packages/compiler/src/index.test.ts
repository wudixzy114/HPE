import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { transformCodeBlocks } from "./code-block.js";
import { compileDeck, DeckCompilationError } from "./index.js";
import { validateDeckManifest } from "@hpe/schema/validate";

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
  it("accepts an AI-friendly TypeScript theme module and validates its CSS assets", async () => {
    const root = await createDeck(
      '<template><h1 data-node="title">Theme</h1></template>',
    );
    const manifest = validateDeckManifest(
      JSON.parse(await readFile(join(root, "deck.json"), "utf8")) as unknown,
    );
    const themedManifest = {
      ...manifest,
      theme: { entry: "themes/custom/theme.ts" },
    };
    await mkdir(join(root, "themes", "custom"), { recursive: true });
    await writeFile(
      join(root, "themes", "custom", "theme.ts"),
      `import { defineTheme } from "@hpe/theme";\nimport "./theme.css";\nexport default defineTheme({ id: "custom", name: "Custom", description: "Custom", canvas: { width: 1280, height: 720, aspectRatio: "16:9" }, colors: {}, typography: {}, spacing: { edge: 64 }, layouts: [{ id: "content", description: "Content", useFor: ["content"] }], ai: { visualObjective: "Clear", density: "medium", motif: "Grid", prefer: [], avoid: [], contentRules: [] } });\n`,
    );
    await writeFile(
      join(root, "themes", "custom", "theme.css"),
      ":root { --accent: #007c73; }\n",
    );
    await mkdir(join(root, "themes", "alternate"), { recursive: true });
    await writeFile(
      join(root, "themes", "alternate", "theme.ts"),
      `import { defineTheme } from "@hpe/theme";\nimport "./theme.css";\nexport default defineTheme({ id: "alternate", name: "Alternate", description: "Alternate", canvas: { width: 1280, height: 720, aspectRatio: "16:9" }, colors: {}, typography: {}, spacing: { edge: 64 }, layouts: [{ id: "content", description: "Content", useFor: ["content"] }], ai: { visualObjective: "Clear", density: "medium", motif: "Grid", prefer: [], avoid: [], contentRules: [] } });\n`,
    );
    await writeFile(
      join(root, "themes", "alternate", "theme.css"),
      ":root { --accent: #7657a6; }\n",
    );
    await writeFile(
      join(root, "deck.json"),
      JSON.stringify({
        ...themedManifest,
        theme: {
          entry: "themes/custom/theme.ts",
          alternates: ["themes/alternate/theme.ts"],
        },
      }),
    );
    const deck = await compileDeck(root);
    expect(deck.themeAbsoluteFile.endsWith("themes/custom/theme.ts")).toBe(
      true,
    );
    expect(deck.themeAbsoluteFiles).toHaveLength(2);
    expect(deck.themeAbsoluteFiles[1]).toMatch(
      /themes\/alternate\/theme\.ts$/u,
    );
  });

  it("rejects theme modules that bypass the typed defineTheme contract", async () => {
    const root = await createDeck("<template><h1>Theme</h1></template>");
    const manifest = validateDeckManifest(
      JSON.parse(await readFile(join(root, "deck.json"), "utf8")) as unknown,
    );
    await mkdir(join(root, "themes", "invalid"), { recursive: true });
    await writeFile(
      join(root, "themes", "invalid", "theme.ts"),
      `import "./theme.css";\nexport default {};\n`,
    );
    await writeFile(join(root, "themes", "invalid", "theme.css"), ":root {}\n");
    await writeFile(
      join(root, "deck.json"),
      JSON.stringify({
        ...manifest,
        theme: { entry: "themes/invalid/theme.ts" },
      }),
    );
    const error = await compileDeck(root).catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(DeckCompilationError);
    expect((error as DeckCompilationError).issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "THEME_DEFINE_CALL_MISSING" }),
      ]),
    );
  });

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

  it("accepts static class maps across concurrent compiler loads", async () => {
    const root = await createDeck(`<template>
  <div :class="{ active: selected, muted: !selected }">Valid</div>
</template>
<script setup lang="ts">const selected = true</script>`);
    const decks = await Promise.all([
      compileDeck(root),
      compileDeck(root),
      compileDeck(root),
    ]);
    expect(decks.every((deck) => deck.slides.length === 1)).toBe(true);
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
