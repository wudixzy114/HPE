import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { DeckRepository } from "./index.js";

describe("DeckRepository", () => {
  it("creates a slide and atomically updates the manifest", async () => {
    const root = await mkdtemp(join(tmpdir(), "hpe-cli-"));
    await mkdir(join(root, "slides"));
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
    await new DeckRepository(root).createSlide("second", "intro");
    const manifest = await new DeckRepository(root).read();
    expect(manifest.slides.map((slide) => slide.id)).toEqual([
      "intro",
      "second",
    ]);
    expect(
      await readFile(join(root, "slides/second.slide.vue"), "utf8"),
    ).toContain('data-node="title"');

    await new DeckRepository(root).setNotes("second", "Updated note");
    expect(
      await readFile(join(root, "slides/second.slide.vue"), "utf8"),
    ).toContain("Updated note");

    const deleted = await new DeckRepository(root).deleteSlide("second");
    expect(deleted.trashedFile).toContain(".hpe/trash/");
    expect((await new DeckRepository(root).read()).slides).toHaveLength(1);
  });
});
