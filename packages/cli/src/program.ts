import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";

import { Command, CommanderError, Option } from "commander";

import type { CheckReport } from "@hpe/checker";
import type { PlaywrightCheckOptions } from "@hpe/checker/playwright";

import {
  DeckRepository,
  errorPayload,
  normalizeCliError,
  type CreateSlideOptions,
  type MoveSlideOptions,
} from "./index.js";

export interface CliIO {
  readonly stdout: Pick<NodeJS.WriteStream, "write">;
  readonly stderr: Pick<NodeJS.WriteStream, "write">;
}

interface RootOptions {
  readonly root: string;
  readonly json?: boolean;
}

interface InspectionOptions {
  readonly url?: string;
  readonly slide: string;
  readonly states: "all" | "default";
  readonly output: string;
  readonly screenshots?: boolean;
  readonly annotate?: boolean;
  readonly maxStates: string;
}

function emit(io: CliIO, value: unknown, json: boolean): void {
  io.stdout.write(
    json ? `${JSON.stringify(value, null, 2)}\n` : `${String(value)}\n`,
  );
}

function globalOptions(command: Command): RootOptions {
  return command.optsWithGlobals<RootOptions>();
}

function selection(value: string): readonly string[] | undefined {
  if (value === "all") return undefined;
  const ids = [
    ...new Set(
      value
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean),
    ),
  ];
  if (ids.length === 0) throw new Error("Slide selection cannot be empty");
  return ids;
}

function positiveInteger(value: string, name: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${name} must be a positive integer`);
  }
  return parsed;
}

async function inspectDeck(
  root: string,
  options: InspectionOptions,
  screenshotMode: boolean,
): Promise<CheckReport> {
  const repository = new DeckRepository(root);
  const manifest = (await repository.validate()).manifest;
  const outputFile = resolve(options.output);
  const outputDir = dirname(outputFile);
  await mkdir(outputDir, { recursive: true });
  const { serveDeck } = await import("@hpe/compiler/render");
  const { checkWithPlaywright } = await import("@hpe/checker/playwright");
  const server = options.url
    ? undefined
    : await serveDeck({ root, outDir: ".hpe/inspect-dist" });
  try {
    const selectedSlideIds = selection(options.slide);
    const checkerOptions: PlaywrightCheckOptions = {
      url: options.url ?? server!.url,
      manifest,
      outputDir,
      screenshots: screenshotMode || (options.screenshots ?? false),
      annotate: options.annotate ?? screenshotMode,
      reports: true,
      stateMode: options.states,
      maxStates: positiveInteger(options.maxStates, "--max-states"),
      ...(selectedSlideIds === undefined ? {} : { slideIds: selectedSlideIds }),
    };
    const report = await checkWithPlaywright(checkerOptions);
    const canonicalReport = resolve(outputDir, "report.json");
    if (outputFile !== canonicalReport) {
      await writeFile(
        outputFile,
        `${JSON.stringify(report, null, 2)}\n`,
        "utf8",
      );
    }
    return report;
  } finally {
    await server?.close();
  }
}

function inspectionOptions(command: Command): Command {
  return command
    .option(
      "--url <url>",
      "existing presentation URL; otherwise launch a managed preview",
    )
    .option(
      "--slide <selection>",
      "all or comma-separated stable slide ids",
      "all",
    )
    .addOption(
      new Option("--states <mode>", "state space to inspect")
        .choices(["all", "default"])
        .default("all"),
    )
    .option("--max-states <count>", "hard state-space limit", "512")
    .option("-o, --output <file>", "JSON report path", "artifacts/report.json");
}

export function createCliProgram(
  io: CliIO = process,
  options: { readonly suppressCommanderErrors?: boolean } = {},
): Command {
  const program = new Command() as Command & { hpeExitCode?: number };
  program
    .name("deck")
    .description("Deterministic tooling for HPE decks")
    .version("0.1.0")
    .option("-r, --root <directory>", "deck root", "app")
    .option("--json", "emit a stable machine-readable response")
    .showSuggestionAfterError()
    .showHelpAfterError()
    .exitOverride()
    .configureOutput({
      writeOut: (value) => {
        io.stdout.write(value);
      },
      writeErr: (value) => {
        if (!options.suppressCommanderErrors) io.stderr.write(value);
      },
    });

  program
    .command("list")
    .description("List the deck graph in manifest order")
    .action(async (_options: unknown, command: Command) => {
      const options = globalOptions(command);
      const manifest = await new DeckRepository(options.root).read();
      emit(
        io,
        options.json
          ? {
              ok: true,
              deckId: manifest.id,
              title: manifest.title,
              slides: manifest.slides,
            }
          : manifest.slides
              .map(
                (slide, index) =>
                  `${index + 1}\t${slide.id}\t${slide.title ?? ""}`,
              )
              .join("\n"),
        options.json ?? false,
      );
    });

  program
    .command("validate")
    .description("Validate the manifest, every SFC, source map and asset")
    .action(async (_options: unknown, command: Command) => {
      const options = globalOptions(command);
      const deck = await new DeckRepository(options.root).validate();
      const result = {
        ok: true,
        deckId: deck.manifest.id,
        slides: deck.slides.length,
        nodes: deck.slides.reduce(
          (count, slide) => count + Object.keys(slide.nodes).length,
          0,
        ),
        assets: deck.assets.length,
      };
      emit(
        io,
        options.json
          ? result
          : `Valid: ${result.slides} slides, ${result.nodes} nodes`,
        options.json ?? false,
      );
    });

  program
    .command("render")
    .description("Build a static HTML presentation")
    .option("-o, --out-dir <directory>", "output directory", "dist")
    .action(async (commandOptions: { outDir: string }, command: Command) => {
      const options = globalOptions(command);
      await new DeckRepository(options.root).validate();
      const { renderDeck } = await import("@hpe/compiler/render");
      await renderDeck({
        root: options.root,
        outDir: commandOptions.outDir,
        logLevel: options.json ? "silent" : "info",
      });
      const result = {
        ok: true,
        output: relative(
          process.cwd(),
          resolve(options.root, commandOptions.outDir),
        ),
      };
      emit(io, options.json ? result : result.output, options.json ?? false);
    });

  const slide = program
    .command("slide")
    .description("Transactional slide graph operations");
  slide
    .command("create <id>")
    .description("Create and insert a new slide")
    .option("--after <slideId>")
    .option("--before <slideId>")
    .option("--title <title>")
    .action(
      async (
        id: string,
        commandOptions: CreateSlideOptions,
        command: Command,
      ) => {
        const options = globalOptions(command);
        const result = await new DeckRepository(options.root).createSlide(
          id,
          commandOptions,
        );
        const payload = {
          ok: true,
          slideId: id,
          index: result.manifest.slides.findIndex((entry) => entry.id === id),
        };
        emit(io, options.json ? payload : id, options.json ?? false);
      },
    );
  slide
    .command("move <id>")
    .description("Move a slide without changing imports or filenames")
    .option("--after <slideId>")
    .option("--before <slideId>")
    .action(
      async (
        id: string,
        commandOptions: MoveSlideOptions,
        command: Command,
      ) => {
        const options = globalOptions(command);
        const result = await new DeckRepository(options.root).moveSlide(
          id,
          commandOptions,
        );
        const payload = {
          ok: true,
          slideId: id,
          index: result.manifest.slides.findIndex((entry) => entry.id === id),
        };
        emit(io, options.json ? payload : id, options.json ?? false);
      },
    );
  slide
    .command("rename <id> <newId>")
    .description("Rename a stable slide id and its source file transactionally")
    .action(
      async (
        id: string,
        newId: string,
        _commandOptions: unknown,
        command: Command,
      ) => {
        const options = globalOptions(command);
        const result = await new DeckRepository(options.root).renameSlide(
          id,
          newId,
        );
        emit(
          io,
          options.json
            ? {
                ok: true,
                oldId: result.oldId,
                newId: result.newId,
                file: result.newFile,
              }
            : newId,
          options.json ?? false,
        );
      },
    );
  slide
    .command("delete <id>")
    .description("Remove a slide and move its file to recoverable trash")
    .action(async (id: string, _commandOptions: unknown, command: Command) => {
      const options = globalOptions(command);
      const result = await new DeckRepository(options.root).deleteSlide(id);
      const payload = {
        ok: true,
        slideId: id,
        trashedFile: relative(process.cwd(), result.trashedFile),
      };
      emit(io, options.json ? payload : id, options.json ?? false);
    });

  const notes = program
    .command("notes")
    .description("Read or replace speaker notes");
  notes
    .command("get <id>")
    .action(async (id: string, _commandOptions: unknown, command: Command) => {
      const options = globalOptions(command);
      const value = await new DeckRepository(options.root).getNotes(id);
      emit(
        io,
        options.json ? { ok: true, slideId: id, notes: value } : value,
        options.json ?? false,
      );
    });
  notes
    .command("set <id>")
    .requiredOption("--file <file>")
    .action(
      async (
        id: string,
        commandOptions: { file: string },
        command: Command,
      ) => {
        const options = globalOptions(command);
        const contents = await readFile(commandOptions.file, "utf8");
        await new DeckRepository(options.root).setNotes(id, contents);
        emit(
          io,
          options.json ? { ok: true, slideId: id } : id,
          options.json ?? false,
        );
      },
    );

  inspectionOptions(
    program
      .command("inspect")
      .description(
        "Inspect deterministic states and emit JSON/HTML diagnostics",
      )
      .option("--screenshots", "capture raw and annotated screenshots"),
  ).action(async (commandOptions: InspectionOptions, command: Command) => {
    const options = globalOptions(command);
    const report = await inspectDeck(options.root, commandOptions, false);
    emit(
      io,
      options.json ? report : JSON.stringify(report.summary),
      options.json ?? false,
    );
    if (report.summary.error > 0) program.hpeExitCode = 1;
  });

  inspectionOptions(
    program
      .command("screenshot")
      .description("Capture selected states and visual annotation artifacts")
      .option("--annotate", "draw safe area, node ids and diagnostics", true),
  ).action(async (commandOptions: InspectionOptions, command: Command) => {
    const options = globalOptions(command);
    const report = await inspectDeck(options.root, commandOptions, true);
    const payload = {
      ok: report.summary.error === 0,
      summary: report.summary,
      artifacts: report.artifacts,
    };
    emit(
      io,
      options.json ? payload : JSON.stringify(payload.summary),
      options.json ?? false,
    );
    if (report.summary.error > 0) program.hpeExitCode = 1;
  });

  return program;
}

export async function runCli(
  argv = process.argv,
  io: CliIO = process,
): Promise<number> {
  const json = argv.includes("--json");
  const program = createCliProgram(io, { suppressCommanderErrors: json });
  try {
    await program.parseAsync(argv);
    return (program as Command & { hpeExitCode?: number }).hpeExitCode ?? 0;
  } catch (caught) {
    if (caught instanceof CommanderError && caught.exitCode === 0) return 0;
    const error = normalizeCliError(caught);
    const serialized = json
      ? JSON.stringify(errorPayload(error), null, 2)
      : `${error.code}: ${error.message}`;
    io.stderr.write(`${serialized}\n`);
    return error.exitCode;
  }
}
