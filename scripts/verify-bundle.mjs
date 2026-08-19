import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";
import { gzipSync } from "node:zlib";

const root = resolve(import.meta.dirname, "..");
const assets = resolve(root, "app", "dist", "assets");
const files = readdirSync(assets);
const javascript = files.filter((file) => file.endsWith(".js"));
const styles = files.filter((file) => file.endsWith(".css"));
if (styles.length !== 1) {
  throw new Error(
    `Expected one application CSS chunk, received ${styles.length}`,
  );
}

const html = readFileSync(resolve(root, "app", "dist", "index.html"), "utf8");
const entryFile = html.match(
  /<script[^>]+src="(?:\.\/|\/)assets\/([^"]+\.js)"/u,
)?.[1];
if (!entryFile) throw new Error("Unable to resolve the production entry chunk");
const entry = readFileSync(resolve(assets, entryFile), "utf8");
const css = readFileSync(resolve(assets, styles[0]), "utf8");
const forbidden = [
  "createHighlighter",
  "vscode-textmate",
  "@vue/compiler-sfc",
  "playwright",
  "commander",
];
for (const marker of forbidden) {
  const containing = javascript.find((file) =>
    readFileSync(resolve(assets, file), "utf8").includes(marker),
  );
  if (containing) {
    throw new Error(
      `Browser chunk ${containing} contains tooling-only marker: ${marker}`,
    );
  }
}

const jsGzip = gzipSync(entry).byteLength;
const cssGzip = gzipSync(css).byteLength;
if (jsGzip > 45 * 1024) {
  throw new Error(`Browser entry JS gzip budget exceeded: ${jsGzip} bytes`);
}
if (cssGzip > 16 * 1024) {
  throw new Error(`Browser CSS gzip budget exceeded: ${cssGzip} bytes`);
}
const slideChunks = javascript.filter((file) =>
  /^slide-\d+\.slide-/u.test(file),
);
if (slideChunks.length !== 12) {
  throw new Error(
    `Expected 12 lazy slide chunks, received ${slideChunks.length}`,
  );
}
if (entry.includes("interactive sync target") || entry.includes('"nodes":{')) {
  throw new Error("Initial entry eagerly embeds speaker notes or source maps");
}
if (!javascript.some((file) => file.startsWith("notes-"))) {
  throw new Error("Speaker notes were not isolated into an optional chunk");
}
if (!javascript.some((file) => file.startsWith("sources-"))) {
  throw new Error("Source maps were not isolated into an optional chunk");
}

const coreIndex = readFileSync(
  resolve(root, "packages/runtime-core/dist/index.js"),
  "utf8",
);
if (/timeline|slide-state/u.test(coreIndex)) {
  throw new Error(
    "Minimal runtime-core entrypoint references optional capabilities",
  );
}
const browserIndex = readFileSync(
  resolve(root, "packages/runtime-browser/dist/index.js"),
  "utf8",
);
if (/\.\/(?:sync|url|timeline|presentation-sync)\.js/u.test(browserIndex)) {
  throw new Error("Standard browser entrypoint references optional adapters");
}
const cliProgram = readFileSync(
  resolve(root, "packages/cli/dist/program.js"),
  "utf8",
);
if (/^import .*@hpe\/(?:checker|compiler)/mu.test(cliProgram)) {
  throw new Error(
    "Base CLI eagerly imports compiler or browser checker tooling",
  );
}

const sourceMaps = files
  .filter((file) => file.endsWith(".js.map"))
  .map((file) => JSON.parse(readFileSync(resolve(assets, file), "utf8")));
for (const expected of [
  "slides/slide-00.slide.vue",
  "slides/slide-11.slide.vue",
]) {
  if (
    !sourceMaps.some((sourceMap) =>
      sourceMap.sources.some((source) => source.includes(expected)),
    )
  ) {
    throw new Error(`Production source maps do not retain ${expected}`);
  }
}
process.stdout.write(
  `bundle contracts verified (entry JS ${jsGzip} B gzip, CSS ${cssGzip} B gzip, ${slideChunks.length} lazy slides)\n`,
);
