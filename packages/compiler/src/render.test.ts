import { access, mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { renderDeck, serveDeck } from "./render.js";

describe.sequential("shared player rendering", () => {
  it("builds and serves a nested deck through the repository player", async () => {
    const outputRoot = await mkdtemp(join(tmpdir(), "hpe-render-"));
    const deckRoot = resolve("tests/fixtures/isolated-deck");
    const outDir = join(outputRoot, "dist");

    await renderDeck({ root: deckRoot, outDir, logLevel: "silent" });
    await expect(access(join(outDir, "index.html"))).resolves.toBeUndefined();
    expect(await readFile(join(outDir, "index.html"), "utf8")).toContain(
      '<div id="app"></div>',
    );

    const server = await serveDeck({
      root: deckRoot,
      outDir: join(outputRoot, "preview"),
      logLevel: "silent",
    });
    try {
      const response = await fetch(server.url);
      expect(response.ok).toBe(true);
      expect(await response.text()).toContain('<div id="app"></div>');
    } finally {
      await server.close();
    }
  });

  it("accepts an explicit player root", async () => {
    const outputRoot = await mkdtemp(join(tmpdir(), "hpe-player-root-"));
    const outDir = join(outputRoot, "dist");
    await renderDeck({
      root: "tests/fixtures/isolated-deck",
      playerRoot: "app",
      outDir,
      logLevel: "silent",
    });
    await expect(access(join(outDir, "index.html"))).resolves.toBeUndefined();
  });
});
