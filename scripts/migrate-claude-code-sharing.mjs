import {
  existsSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { resolve } from "node:path";
import process from "node:process";

const root = resolve(import.meta.dirname, "..");
const sourceRoot = resolve(root, "..", "claude-code-sharing");
const html = readFileSync(resolve(sourceRoot, "index.html"), "utf8");
const output = resolve(root, "app", "slides");
const interactiveSlides = new Set([5, 10, 13, 27]);
const forceInteractive = process.argv.includes("--force-interactive");

const namedEntities = new Map([
  ["amp", "&"],
  ["lt", "<"],
  ["gt", ">"],
  ["quot", '"'],
  ["apos", "'"],
  ["nbsp", " "],
]);
const decode = (value) =>
  value.replaceAll(/&(#x[\da-f]+|#\d+|[a-z]+);/giu, (entity, key) => {
    if (key.startsWith("#x"))
      return String.fromCodePoint(Number.parseInt(key.slice(2), 16));
    if (key.startsWith("#"))
      return String.fromCodePoint(Number.parseInt(key.slice(1), 10));
    return namedEntities.get(key.toLowerCase()) ?? entity;
  });
const text = (value) =>
  decode(
    value
      .replaceAll(/<[^>]+>/gu, " ")
      .replaceAll(/\s+/gu, " ")
      .trim(),
  );
const escapeNotes = (value) =>
  decode(value).replaceAll("</notes>", "&lt;/notes&gt;");
const markNodes = (value) => {
  let output = value.replace(
    /<(h1|h2)(?![^>]*\bdata-node=)/u,
    '<$1 data-node="title"',
  );
  output = output.replace(
    /<p(?![^>]*\bdata-node=)([^>]*\bclass="[^"]*\bsubtitle\b[^"]*"[^>]*)>/u,
    '<p data-node="subtitle"$1>',
  );
  const counts = new Map();
  const visualClasses =
    "larch|trust|ladder|demo|code|grid|matrix|priostack|hierarchy|permission|decflow|memflow|lanes|extension|scope-ladder|exttable|pjudge|compdemo|budgetdemo|inject-flow|tool-eg|four-keys";
  return output.replace(
    new RegExp(
      `<(?<tag>div|table|ol|ul)(?![^>]*\\bdata-node=)(?<before>[^>]*\\bclass="[^"]*\\b(?<kind>${visualClasses})\\b[^"]*"[^>]*)>`,
      "gu",
    ),
    (...arguments_) => {
      const groups = arguments_.at(-1);
      const kind = groups.kind;
      const next = (counts.get(kind) ?? 0) + 1;
      counts.set(kind, next);
      return `<${groups.tag} data-node="${kind}-${next}"${groups.before}>`;
    },
  );
};

const sectionBlocks = [];
let cursor = 0;
while (true) {
  const start = html.indexOf("<section", cursor);
  if (start < 0) break;
  let quote;
  let tagEnd = -1;
  for (let index = start; index < html.length; index += 1) {
    const character = html[index];
    if ((character === '"' || character === "'") && quote === undefined)
      quote = character;
    else if (character === quote) quote = undefined;
    else if (character === ">" && quote === undefined) {
      tagEnd = index;
      break;
    }
  }
  if (tagEnd < 0) throw new Error(`Unclosed section start tag at ${start}`);
  const end = html.indexOf("</section>", tagEnd);
  if (end < 0) throw new Error(`Unclosed section at ${start}`);
  const startTag = html.slice(start, tagEnd + 1);
  const className = startTag.match(/\bclass="([^"]*\bslide\b[^"]*)"/u)?.[1];
  if (className) {
    sectionBlocks.push({
      startTag,
      className,
      body: html.slice(tagEnd + 1, end),
    });
  }
  cursor = end + "</section>".length;
}
const sections = sectionBlocks;
if (sections.length !== 50)
  throw new Error(`Expected 50 slides, received ${sections.length}`);

mkdirSync(output, { recursive: true });
for (const file of readdirSync(output)) {
  const generated = file.match(/^slide-(\d+)\.slide\.vue$/u);
  if (!generated) continue;
  const index = Number(generated[1]);
  if (
    file.endsWith(".slide.vue") &&
    (!interactiveSlides.has(index) || forceInteractive)
  ) {
    rmSync(resolve(output, file));
  }
}

const entries = [];
const report = [];
for (const [index, section] of sections.entries()) {
  const attributes = section.startTag;
  const originalClasses = section.className.split(/\s+/u).filter(Boolean);
  const classes = [
    ...new Set(originalClasses.filter((name) => name !== "active")),
  ].join(" ");
  const body = markNodes(
    section.body
      .trim()
      .replaceAll(/\s+onclick="return false"/gu, " @click.prevent")
      .replaceAll(/href="#"\s+@click\.prevent/gu, 'href="#" @click.prevent'),
  );
  const heading = body.match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/u)?.[1];
  const title = heading
    ? text(heading)
    : index === 0
      ? "封面"
      : `Slide ${index + 1}`;
  const note = attributes.match(/data-note="([\s\S]*?)"(?=\s|>)/u)?.[1] ?? "";
  const id = `slide-${String(index).padStart(2, "0")}`;
  const file = `slides/${id}.slide.vue`;
  const controls = [...body.matchAll(/<(button|input|select|textarea)\b/giu)]
    .length;
  const locked = /data-locked="true"/u.test(attributes);
  const target = resolve(root, "app", file);
  if (
    !interactiveSlides.has(index) ||
    forceInteractive ||
    !existsSync(target)
  ) {
    writeFileSync(
      target,
      `<template>\n  <Slide class="${classes}"${locked ? ' data-locked="true"' : ""}>\n${body
        .split("\n")
        .map((line) => `    ${line}`)
        .join(
          "\n",
        )}\n  </Slide>\n</template>\n\n<notes lang="md">\n${escapeNotes(note)}\n</notes>\n`,
      "utf8",
    );
  }
  entries.push({ id, file, title });
  report.push({ index, id, title, controls, locked });
}

const manifest = {
  $schema: "../packages/schema/src/deck.schema.json",
  schemaVersion: 1,
  id: "claude-code-architecture",
  title: "Claude Code 的五块拼图",
  size: { width: 1600, height: 900 },
  theme: { entry: "themes/claude-code/theme.ts" },
  slides: entries,
};
writeFileSync(
  resolve(root, "app", "deck.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
writeFileSync(
  resolve(root, ".hpe", "migration-report.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
process.stdout.write(
  `Migrated ${entries.length} slides (${report.filter((slide) => slide.controls).length} interactive)\n`,
);
