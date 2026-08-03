import { access, mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { compileDeck } from "@hpe/compiler";

import { CliError, DeckRepository } from "./index.js";
import { runCli, type CliIO } from "./program.js";

async function createFixture(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "hpe-cli-"));
  await mkdir(join(root, "slides"));
  await writeFile(join(root, "theme.css"), ":root {}\n", "utf8");
  await writeFile(
    join(root, "slides", "intro.slide.vue"),
    `<template>\n  <Slide><h1 data-node="title">Intro</h1></Slide>\n</template>\n\n<notes lang="md">Initial</notes>\n`,
    "utf8",
  );
  await writeFile(
    join(root, "deck.json"),
    `${JSON.stringify(
      {
        $schema: "schema.json",
        schemaVersion: 1,
        id: "test",
        title: "Test",
        size: { width: 1280, height: 720 },
        theme: "theme.css",
        slides: [{ id: "intro", file: "slides/intro.slide.vue" }],
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
  return root;
}

describe("DeckRepository transactions", () => {
  it("creates, moves, renames, updates notes and recoverably deletes a slide", async () => {
    const root = await createFixture();
    const repository = new DeckRepository(root);
    await repository.createSlide("second", {
      after: "intro",
      title: "Second <safe>",
    });
    expect(
      await readFile(join(root, "slides", "second.slide.vue"), "utf8"),
    ).toContain("Second &lt;safe&gt;");

    await repository.moveSlide("second", { before: "intro" });
    expect((await repository.read()).slides.map((slide) => slide.id)).toEqual([
      "second",
      "intro",
    ]);

    const renamed = await repository.renameSlide("second", "summary");
    expect(renamed.newFile).toBe("slides/summary.slide.vue");
    await expect(
      access(join(root, "slides", "second.slide.vue")),
    ).rejects.toThrow();

    await repository.setNotes("summary", "Updated note");
    expect(await repository.getNotes("summary")).toBe("Updated note");

    const deleted = await repository.deleteSlide("summary");
    expect(deleted.trashedFile).toContain(".hpe/trash/");
    const manifest = await repository.read();
    expect(manifest.$schema).toBe("schema.json");
    expect(manifest.slides.map((slide) => slide.id)).toEqual(["intro"]);
    await repository.validate();
  });

  it("rolls back the source file and manifest when post-mutation compilation fails", async () => {
    const root = await createFixture();
    let compilations = 0;
    const repository = new DeckRepository(root, {
      compile: async (deckRoot) => {
        compilations += 1;
        if (compilations === 2) throw new Error("injected post-write failure");
        return compileDeck(deckRoot);
      },
    });
    await expect(repository.createSlide("rollback")).rejects.toThrow(
      "Deck compilation failed",
    );
    expect((await new DeckRepository(root).read()).slides).toHaveLength(1);
    await expect(
      access(join(root, "slides", "rollback.slide.vue")),
    ).rejects.toThrow();
    await new DeckRepository(root).validate();
  });

  it("rejects concurrent mutation locks without touching the deck", async () => {
    const root = await createFixture();
    await mkdir(join(root, ".hpe"));
    await writeFile(
      join(root, ".hpe", "deck.lock"),
      `${JSON.stringify({ pid: process.pid, hostname: "ignored", createdAt: new Date().toISOString() })}\n`,
    );
    const error = await new DeckRepository(root)
      .createSlide("locked")
      .catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(CliError);
    expect((error as CliError).code).toBe("DECK_LOCKED");
    expect((await new DeckRepository(root).read()).slides).toHaveLength(1);
  });
});

describe("CLI protocol", () => {
  it("emits a stable JSON envelope for queries", async () => {
    const root = await createFixture();
    let stdout = "";
    let stderr = "";
    const io: CliIO = {
      stdout: {
        write: (value) => {
          stdout += String(value);
          return true;
        },
      },
      stderr: {
        write: (value) => {
          stderr += String(value);
          return true;
        },
      },
    };
    const exitCode = await runCli(
      ["node", "deck", "--root", root, "--json", "list"],
      io,
    );
    expect(exitCode).toBe(0);
    expect(stderr).toBe("");
    expect(JSON.parse(stdout)).toMatchObject({
      ok: true,
      deckId: "test",
      slides: [{ id: "intro" }],
    });
  });

  it("emits machine-readable errors with a non-zero exit code", async () => {
    let stderr = "";
    const io: CliIO = {
      stdout: { write: () => true },
      stderr: {
        write: (value) => {
          stderr += String(value);
          return true;
        },
      },
    };
    const exitCode = await runCli(
      ["node", "deck", "--root", "/definitely/missing", "--json", "validate"],
      io,
    );
    expect(exitCode).toBe(2);
    expect(JSON.parse(stderr)).toMatchObject({
      ok: false,
      error: { code: "DECK_INVALID" },
    });
  });
});
