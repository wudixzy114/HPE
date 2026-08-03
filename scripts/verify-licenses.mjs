import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import process from "node:process";

const root = resolve(import.meta.dirname, "..");
const executable = resolve(
  root,
  "node_modules",
  ".bin",
  `license-checker-rseidelsohn${process.platform === "win32" ? ".cmd" : ""}`,
);
const excluded = [
  "hpe",
  "@hpe/schema",
  "@hpe/theme",
  "@hpe/runtime-core",
  "@hpe/runtime-browser",
  "@hpe/renderer-vue",
  "@hpe/compiler",
  "@hpe/checker",
  "@hpe/cli",
  "@hpe/app",
].join(";");
const allowed = [
  "0BSD",
  "Apache-2.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "BlueOak-1.0.0",
  "CC-BY-3.0",
  "CC-BY-4.0",
  "CC0-1.0",
  "ISC",
  "MIT",
  "MIT*",
  "(MIT AND CC-BY-3.0)",
  "MPL-2.0",
  "Python-2.0",
  "Unlicense",
].join(";");
const result = spawnSync(
  executable,
  ["--excludePackages", excluded, "--onlyAllow", allowed, "--summary"],
  { cwd: root, encoding: "utf8" },
);
process.stdout.write(result.stdout);
process.stderr.write(result.stderr);
if (result.status !== 0) {
  throw new Error(
    `Dependency license policy failed with exit code ${result.status}`,
  );
}
