#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { Command } from "commander";

import { compileDeck } from "@hpe/compiler";
import { renderDeck } from "@hpe/compiler/render";

import { DeckRepository } from "./index.js";

interface RootOptions {
  readonly root: string;
}

function output(value: unknown, json: boolean): void {
  process.stdout.write(
    json ? `${JSON.stringify(value, null, 2)}\n` : `${String(value)}\n`,
  );
}

const program = new Command()
  .name("deck")
  .description("Deterministic tooling for HPE decks")
  .version("0.1.0")
  .option("-r, --root <directory>", "deck root", "app");

program
  .command("list")
  .option("--json", "emit machine-readable JSON")
  .action(async (options: { json?: boolean }) => {
    const root = program.opts<RootOptions>().root;
    const manifest = await new DeckRepository(root).read();
    output(
      options.json
        ? manifest.slides
        : manifest.slides.map((slide) => slide.id).join("\n"),
      options.json ?? false,
    );
  });

program
  .command("validate")
  .option("--json", "emit machine-readable JSON")
  .action(async (options: { json?: boolean }) => {
    const deck = await compileDeck(program.opts<RootOptions>().root);
    output(
      options.json
        ? { valid: true, slides: deck.slides.length }
        : `Valid: ${deck.slides.length} slides`,
      options.json ?? false,
    );
  });

program
  .command("render")
  .option("-o, --out-dir <directory>", "output directory", "dist")
  .action(async (options: { outDir: string }) => {
    await renderDeck({
      root: program.opts<RootOptions>().root,
      outDir: options.outDir,
    });
  });

const slide = program.command("slide");
slide
  .command("create <id>")
  .option("--after <slideId>")
  .action(async (id: string, options: { after?: string }) => {
    await new DeckRepository(program.opts<RootOptions>().root).createSlide(
      id,
      options.after,
    );
    output(id, false);
  });
slide
  .command("delete <id>")
  .option("--json", "emit machine-readable JSON")
  .action(async (id: string, options: { json?: boolean }) => {
    const result = await new DeckRepository(
      program.opts<RootOptions>().root,
    ).deleteSlide(id);
    output(
      options.json ? { id, trashedFile: result.trashedFile } : id,
      options.json ?? false,
    );
  });

const notes = program.command("notes");
notes
  .command("set <id>")
  .requiredOption("--file <file>")
  .action(async (id: string, options: { file: string }) => {
    const contents = await readFile(options.file, "utf8");
    await new DeckRepository(program.opts<RootOptions>().root).setNotes(
      id,
      contents,
    );
    output(id, false);
  });
slide
  .command("move <id>")
  .requiredOption("--before <slideId>")
  .action(async (id: string, options: { before: string }) => {
    await new DeckRepository(program.opts<RootOptions>().root).moveSlide(
      id,
      options.before,
    );
    output(id, false);
  });

program
  .command("inspect")
  .requiredOption("--url <url>")
  .option("--screenshots", "capture every declared state")
  .option("-o, --output <file>", "JSON report path", "artifacts/report.json")
  .action(
    async (options: { url: string; screenshots?: boolean; output: string }) => {
      const manifest = await new DeckRepository(
        program.opts<RootOptions>().root,
      ).read();
      const { checkWithPlaywright } = await import("@hpe/checker/playwright");
      const report = await checkWithPlaywright({
        url: options.url,
        manifest,
        screenshots: options.screenshots ?? false,
        outputDir: resolve(options.output, ".."),
      });
      await mkdir(dirname(resolve(options.output)), { recursive: true });
      await writeFile(
        options.output,
        `${JSON.stringify(report, null, 2)}\n`,
        "utf8",
      );
      output(report.summary, true);
      if (report.summary.error > 0) process.exitCode = 1;
    },
  );

await program.parseAsync();
