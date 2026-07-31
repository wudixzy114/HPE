import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { compileDeck } from "./index.js";

describe("compileDeck", () => {
  it("extracts notes without executing slide code", async () => {
    const root = await mkdtemp(join(tmpdir(), "hpe-compiler-"));
    await writeFile(
      join(root, "deck.json"),
      JSON.stringify({
        schemaVersion: 1,
        id: "test",
        title: "Test",
        size: { width: 1280, height: 720 },
        theme: "theme.css",
        slides: [{ id: "intro", file: "intro.slide.vue" }],
      }),
    );
    await writeFile(join(root, "theme.css"), ":root {}", "utf8");
    await writeFile(
      join(root, "intro.slide.vue"),
      '<template><h1>Hello</h1></template><notes lang="md">Speaker note</notes>',
    );
    const deck = await compileDeck(root);
    expect(deck.slides[0]?.notes).toBe("Speaker note");
  });
});
