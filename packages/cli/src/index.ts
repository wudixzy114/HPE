import {
  access,
  mkdir,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";

import type { CompiledDeck } from "@hpe/compiler";
import type { DeckManifest, SlideEntry } from "@hpe/schema";
import { validateDeckManifest } from "@hpe/schema/validate";

import { CliError } from "./errors.js";
import { withFileLock } from "./lock.js";

export interface CreateSlideOptions {
  readonly after?: string;
  readonly before?: string;
  readonly title?: string;
}

export interface MoveSlideOptions {
  readonly after?: string;
  readonly before?: string;
}

export interface MutationResult {
  readonly manifest: DeckManifest;
  readonly compiled: CompiledDeck;
}

export interface DeleteSlideResult extends MutationResult {
  readonly trashedFile: string;
}

export interface RenameSlideResult extends MutationResult {
  readonly oldId: string;
  readonly newId: string;
  readonly oldFile: string;
  readonly newFile: string;
}

export interface DeckRepositoryOptions {
  readonly compile?: (root: string) => Promise<CompiledDeck>;
}

const SLIDE_ID = /^[a-z][a-z0-9-]*$/u;

function assertSlideId(id: string): void {
  if (!SLIDE_ID.test(id)) {
    throw new CliError(
      "SLIDE_ID_INVALID",
      `Slide id must match ${SLIDE_ID.source}: ${id}`,
      { exitCode: 2 },
    );
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function slideTemplate(title: string): string {
  return `<template>\n  <Slide>\n    <h1 data-node="title">${escapeHtml(
    title,
  )}</h1>\n  </Slide>\n</template>\n\n<notes lang="md">\n</notes>\n`;
}

function insertionIndex(
  slides: readonly SlideEntry[],
  options: { readonly before?: string; readonly after?: string },
): number {
  if (options.before !== undefined && options.after !== undefined) {
    throw new CliError(
      "SLIDE_POSITION_INVALID",
      "Choose exactly one of --before or --after",
      { exitCode: 2 },
    );
  }
  if (options.before !== undefined) {
    const index = slides.findIndex((slide) => slide.id === options.before);
    if (index < 0) {
      throw new CliError(
        "SLIDE_NOT_FOUND",
        `Unknown target slide: ${options.before}`,
        {
          exitCode: 3,
        },
      );
    }
    return index;
  }
  if (options.after !== undefined) {
    const index = slides.findIndex((slide) => slide.id === options.after);
    if (index < 0) {
      throw new CliError(
        "SLIDE_NOT_FOUND",
        `Unknown target slide: ${options.after}`,
        {
          exitCode: 3,
        },
      );
    }
    return index + 1;
  }
  return slides.length;
}

export class DeckRepository {
  public readonly root: string;
  private readonly manifestFile: string;
  private readonly lockFile: string;
  private readonly compile:
    ((root: string) => Promise<CompiledDeck>) | undefined;

  public constructor(root: string, options: DeckRepositoryOptions = {}) {
    this.root = resolve(root);
    this.manifestFile = resolve(this.root, "deck.json");
    this.lockFile = resolve(this.root, ".hpe", "deck.lock");
    this.compile = options.compile;
  }

  public async read(): Promise<DeckManifest> {
    let input: string;
    try {
      input = await readFile(this.manifestFile, "utf8");
    } catch (error) {
      throw new CliError(
        "DECK_NOT_FOUND",
        `Unable to read ${this.manifestFile}`,
        {
          exitCode: 3,
          cause: error,
        },
      );
    }
    try {
      return validateDeckManifest(JSON.parse(input) as unknown);
    } catch (error) {
      throw new CliError(
        "DECK_INVALID",
        `Invalid deck manifest: ${this.manifestFile}`,
        {
          exitCode: 2,
          cause: error,
          details: error instanceof Error ? error.message : String(error),
        },
      );
    }
  }

  public async validate(): Promise<CompiledDeck> {
    try {
      if (this.compile) return await this.compile(this.root);
      const { compileDeck } = await import("@hpe/compiler");
      return await compileDeck(this.root);
    } catch (error) {
      throw new CliError("DECK_INVALID", "Deck compilation failed", {
        exitCode: 2,
        cause: error,
        details:
          error instanceof Error && "issues" in error
            ? (error as { readonly issues: unknown }).issues
            : error instanceof Error
              ? error.message
              : String(error),
      });
    }
  }

  private async atomicWrite(path: string, contents: string): Promise<void> {
    const temporary = `${path}.${process.pid}.${randomUUID()}.tmp`;
    await writeFile(temporary, contents, { encoding: "utf8", mode: 0o644 });
    try {
      await rename(temporary, path);
    } catch (error) {
      await rm(temporary, { force: true });
      throw error;
    }
  }

  private async writeManifest(manifest: DeckManifest): Promise<void> {
    validateDeckManifest(manifest);
    await this.atomicWrite(
      this.manifestFile,
      `${JSON.stringify(manifest, null, 2)}\n`,
    );
  }

  private async locked<T>(operation: () => Promise<T>): Promise<T> {
    return withFileLock(this.lockFile, operation);
  }

  private async rollback(
    originalError: unknown,
    actions: readonly (() => Promise<void>)[],
  ): Promise<never> {
    const failures: string[] = [];
    for (const action of actions) {
      try {
        await action();
      } catch (error) {
        failures.push(error instanceof Error ? error.message : String(error));
      }
    }
    if (failures.length > 0) {
      throw new CliError(
        "TRANSACTION_FAILED",
        "Deck mutation failed and rollback was incomplete",
        {
          cause: originalError,
          details: {
            original:
              originalError instanceof Error
                ? originalError.message
                : String(originalError),
            rollback: failures,
          },
        },
      );
    }
    throw originalError;
  }

  public async createSlide(
    id: string,
    options: CreateSlideOptions = {},
  ): Promise<MutationResult> {
    assertSlideId(id);
    return this.locked(async () => {
      const current = await this.read();
      await this.validate();
      if (current.slides.some((slide) => slide.id === id)) {
        throw new CliError("SLIDE_EXISTS", `Slide already exists: ${id}`, {
          exitCode: 3,
        });
      }
      const file = `slides/${id}.slide.vue`;
      if (current.slides.some((slide) => slide.file === file)) {
        throw new CliError(
          "SLIDE_EXISTS",
          `Slide file already exists in the manifest: ${file}`,
        );
      }
      const title = options.title?.trim() || id;
      const entry: SlideEntry = { id, file, title };
      const slides = [...current.slides];
      slides.splice(insertionIndex(slides, options), 0, entry);
      const next = { ...current, slides };
      const target = resolve(this.root, file);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, slideTemplate(title), {
        encoding: "utf8",
        flag: "wx",
      }).catch((error: unknown) => {
        throw new CliError(
          "SLIDE_EXISTS",
          `Slide file already exists: ${file}`,
          {
            cause: error,
          },
        );
      });
      try {
        await this.writeManifest(next);
        const compiled = await this.validate();
        return { manifest: next, compiled };
      } catch (error) {
        return this.rollback(error, [
          () => rm(target, { force: true }),
          () => this.writeManifest(current),
        ]);
      }
    });
  }

  public async moveSlide(
    id: string,
    options: MoveSlideOptions,
  ): Promise<MutationResult> {
    return this.locked(async () => {
      if (options.before === undefined && options.after === undefined) {
        throw new CliError(
          "SLIDE_POSITION_INVALID",
          "Move requires exactly one of --before or --after",
          { exitCode: 2 },
        );
      }
      const current = await this.read();
      await this.validate();
      const moving = current.slides.find((slide) => slide.id === id);
      if (!moving)
        throw new CliError("SLIDE_NOT_FOUND", `Unknown slide: ${id}`, {
          exitCode: 3,
        });
      if (options.before === id || options.after === id) {
        return { manifest: current, compiled: await this.validate() };
      }
      const slides = current.slides.filter((slide) => slide.id !== id);
      slides.splice(insertionIndex(slides, options), 0, moving);
      const next = { ...current, slides };
      try {
        await this.writeManifest(next);
        return { manifest: next, compiled: await this.validate() };
      } catch (error) {
        return this.rollback(error, [() => this.writeManifest(current)]);
      }
    });
  }

  public async deleteSlide(id: string): Promise<DeleteSlideResult> {
    return this.locked(async () => {
      const current = await this.read();
      await this.validate();
      if (current.slides.length === 1) {
        throw new CliError(
          "SLIDE_LAST_DELETE",
          "A deck must contain at least one slide",
          {
            exitCode: 3,
          },
        );
      }
      const deleting = current.slides.find((slide) => slide.id === id);
      if (!deleting)
        throw new CliError("SLIDE_NOT_FOUND", `Unknown slide: ${id}`, {
          exitCode: 3,
        });
      const next = {
        ...current,
        slides: current.slides.filter((slide) => slide.id !== id),
      };
      const source = resolve(this.root, deleting.file);
      const trashDirectory = resolve(this.root, ".hpe", "trash");
      const trashedFile = resolve(
        trashDirectory,
        `${new Date().toISOString().replaceAll(/[:.]/gu, "-")}-${randomUUID()}-${basename(
          deleting.file,
        )}`,
      );
      await mkdir(trashDirectory, { recursive: true });
      await rename(source, trashedFile);
      try {
        await this.writeManifest(next);
        const compiled = await this.validate();
        return { manifest: next, compiled, trashedFile };
      } catch (error) {
        return this.rollback(error, [
          () => rename(trashedFile, source),
          () => this.writeManifest(current),
        ]);
      }
    });
  }

  public async renameSlide(
    id: string,
    newId: string,
  ): Promise<RenameSlideResult> {
    assertSlideId(newId);
    return this.locked(async () => {
      const current = await this.read();
      await this.validate();
      const slide = current.slides.find((entry) => entry.id === id);
      if (!slide)
        throw new CliError("SLIDE_NOT_FOUND", `Unknown slide: ${id}`, {
          exitCode: 3,
        });
      if (current.slides.some((entry) => entry.id === newId)) {
        throw new CliError("SLIDE_EXISTS", `Slide already exists: ${newId}`, {
          exitCode: 3,
        });
      }
      const oldFile = slide.file;
      const newFile = `slides/${newId}.slide.vue`;
      const oldAbsoluteFile = resolve(this.root, oldFile);
      const newAbsoluteFile = resolve(this.root, newFile);
      try {
        await access(newAbsoluteFile);
        throw new CliError(
          "SLIDE_EXISTS",
          `Slide file already exists: ${newFile}`,
          {
            exitCode: 3,
          },
        );
      } catch (error) {
        if (error instanceof CliError) throw error;
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      }
      await rename(oldAbsoluteFile, newAbsoluteFile).catch((error: unknown) => {
        throw new CliError(
          "SLIDE_EXISTS",
          `Unable to rename slide file to ${newFile}`,
          {
            cause: error,
          },
        );
      });
      const next = {
        ...current,
        slides: current.slides.map((entry) =>
          entry.id === id ? { ...entry, id: newId, file: newFile } : entry,
        ),
      };
      try {
        await this.writeManifest(next);
        const compiled = await this.validate();
        return { manifest: next, compiled, oldId: id, newId, oldFile, newFile };
      } catch (error) {
        return this.rollback(error, [
          () => rename(newAbsoluteFile, oldAbsoluteFile),
          () => this.writeManifest(current),
        ]);
      }
    });
  }

  public async getNotes(id: string): Promise<string> {
    const deck = await this.validate();
    const slide = deck.slides.find((entry) => entry.id === id);
    if (!slide)
      throw new CliError("SLIDE_NOT_FOUND", `Unknown slide: ${id}`, {
        exitCode: 3,
      });
    return slide.notes;
  }

  public async setNotes(id: string, notes: string): Promise<MutationResult> {
    if (/<\/notes\s*>/iu.test(notes)) {
      throw new CliError(
        "NOTES_INVALID",
        "Notes cannot contain a closing </notes> tag",
        {
          exitCode: 2,
        },
      );
    }
    return this.locked(async () => {
      const current = await this.read();
      await this.validate();
      const slide = current.slides.find((entry) => entry.id === id);
      if (!slide)
        throw new CliError("SLIDE_NOT_FOUND", `Unknown slide: ${id}`, {
          exitCode: 3,
        });
      const target = resolve(this.root, slide.file);
      const original = await readFile(target, "utf8");
      const notesPattern = /<notes(?:\s[^>]*)?>[\s\S]*?<\/notes\s*>/iu;
      const block = `<notes lang="md">\n${notes.trim()}\n</notes>`;
      const nextSource = notesPattern.test(original)
        ? original.replace(notesPattern, block)
        : `${original.trimEnd()}\n\n${block}\n`;
      try {
        await this.atomicWrite(target, nextSource);
        return { manifest: current, compiled: await this.validate() };
      } catch (error) {
        return this.rollback(error, [() => this.atomicWrite(target, original)]);
      }
    });
  }
}

export { CliError, errorPayload, normalizeCliError } from "./errors.js";
