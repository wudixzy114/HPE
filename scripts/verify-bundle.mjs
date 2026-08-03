import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";
import process from "node:process";

const root = resolve(import.meta.dirname, "..");
const assets = resolve(root, "app", "dist", "assets");
const files = readdirSync(assets);
const javascript = files.filter((file) => file.endsWith(".js"));
const styles = files.filter((file) => file.endsWith(".css"));
if (javascript.length !== 1)
  throw new Error(
    `Expected one application JS chunk, received ${javascript.length}`,
  );
if (styles.length !== 1)
  throw new Error(
    `Expected one application CSS chunk, received ${styles.length}`,
  );

const js = readFileSync(resolve(assets, javascript[0]), "utf8");
const css = readFileSync(resolve(assets, styles[0]), "utf8");
const forbidden = [
  "createHighlighter",
  "vscode-textmate",
  "@vue/compiler-sfc",
  "playwright",
  "commander",
];
for (const marker of forbidden) {
  if (js.includes(marker))
    throw new Error(`Browser bundle contains tooling-only marker: ${marker}`);
}
const jsGzip = gzipSync(js).byteLength;
const cssGzip = gzipSync(css).byteLength;
if (jsGzip > 45 * 1024)
  throw new Error(`Browser JS gzip budget exceeded: ${jsGzip} bytes`);
if (cssGzip > 8 * 1024)
  throw new Error(`Browser CSS gzip budget exceeded: ${cssGzip} bytes`);

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

const mapFile = `${javascript[0]}.map`;
const sourceMap = JSON.parse(readFileSync(resolve(assets, mapFile), "utf8"));
if (
  !sourceMap.sources.some((source) => source.includes("slides/code.slide.vue"))
) {
  throw new Error("Production source map does not retain slide sources");
}
process.stdout.write(
  `bundle contracts verified (JS ${jsGzip} B gzip, CSS ${cssGzip} B gzip)\n`,
);
