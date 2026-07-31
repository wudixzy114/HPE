import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";

import type { DeckManifest, SlideEntry } from "@hpe/schema";
import { validateDeckManifest } from "@hpe/schema/validate";

export class DeckRepository {
  public readonly root: string;

  public constructor(root: string) {
    this.root = resolve(root);
  }

  public async read(): Promise<DeckManifest> {
    const input = await readFile(resolve(this.root, "deck.json"), "utf8");
    return validateDeckManifest(JSON.parse(input) as unknown);
  }

  public async write(manifest: DeckManifest): Promise<void> {
    validateDeckManifest(manifest);
    const target = resolve(this.root, "deck.json");
    const temporary = `${target}.${process.pid}.tmp`;
    await writeFile(
      temporary,
      `${JSON.stringify(manifest, null, 2)}\n`,
      "utf8",
    );
    await rename(temporary, target);
  }

  public async createSlide(id: string, after?: string): Promise<DeckManifest> {
    const manifest = await this.read();
    if (manifest.slides.some((slide) => slide.id === id))
      throw new Error(`Slide already exists: ${id}`);
    const entry: SlideEntry = { id, file: `slides/${id}.slide.vue`, title: id };
    const index =
      after === undefined
        ? manifest.slides.length
        : manifest.slides.findIndex((slide) => slide.id === after) + 1;
    if (index === 0) throw new Error(`Unknown slide: ${after}`);
    const slides = [...manifest.slides];
    slides.splice(index, 0, entry);
    const next = { ...manifest, slides };
    const target = resolve(this.root, entry.file);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(
      target,
      `<template>\n  <Slide>\n    <h1 data-node="title">${id}</h1>\n  </Slide>\n</template>\n\n<notes lang="md">\n</notes>\n`,
      { encoding: "utf8", flag: "wx" },
    );
    try {
      await this.write(next);
    } catch (error) {
      await rm(target);
      throw error;
    }
    return next;
  }

  public async moveSlide(id: string, before: string): Promise<DeckManifest> {
    const manifest = await this.read();
    const moving = manifest.slides.find((slide) => slide.id === id);
    if (!moving) throw new Error(`Unknown slide: ${id}`);
    const slides = manifest.slides.filter((slide) => slide.id !== id);
    const targetIndex = slides.findIndex((slide) => slide.id === before);
    if (targetIndex < 0) throw new Error(`Unknown target slide: ${before}`);
    slides.splice(targetIndex, 0, moving);
    const next = { ...manifest, slides };
    await this.write(next);
    return next;
  }

  public async deleteSlide(
    id: string,
  ): Promise<{ manifest: DeckManifest; trashedFile: string }> {
    const manifest = await this.read();
    if (manifest.slides.length === 1)
      throw new Error("A deck must contain at least one slide");
    const deleting = manifest.slides.find((slide) => slide.id === id);
    if (!deleting) throw new Error(`Unknown slide: ${id}`);
    const next = {
      ...manifest,
      slides: manifest.slides.filter((slide) => slide.id !== id),
    };
    const source = resolve(this.root, deleting.file);
    const trashDirectory = resolve(this.root, ".hpe", "trash");
    const trashedFile = resolve(
      trashDirectory,
      `${Date.now()}-${basename(deleting.file)}`,
    );
    await mkdir(trashDirectory, { recursive: true });
    await rename(source, trashedFile);
    try {
      await this.write(next);
    } catch (error) {
      await rename(trashedFile, source);
      throw error;
    }
    return { manifest: next, trashedFile };
  }

  public async setNotes(id: string, notes: string): Promise<void> {
    if (notes.includes("</notes>"))
      throw new Error("Notes cannot contain a closing </notes> tag");
    const manifest = await this.read();
    const slide = manifest.slides.find((entry) => entry.id === id);
    if (!slide) throw new Error(`Unknown slide: ${id}`);
    const target = resolve(this.root, slide.file);
    const source = await readFile(target, "utf8");
    const notesPattern = /<notes(?:\s[^>]*)?>[\s\S]*?<\/notes>/;
    const block = `<notes lang="md">\n${notes.trim()}\n</notes>`;
    const next = notesPattern.test(source)
      ? source.replace(notesPattern, block)
      : `${source.trimEnd()}\n\n${block}\n`;
    const temporary = `${target}.${process.pid}.tmp`;
    await writeFile(temporary, next, "utf8");
    await rename(temporary, target);
  }
}
