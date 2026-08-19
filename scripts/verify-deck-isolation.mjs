import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import process from "node:process";

import { build } from "vite";

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) => {
        const path = join(directory, entry.name);
        return entry.isDirectory() ? files(path) : [path];
      }),
    )
  ).flat();
}

const output = await mkdtemp(join(tmpdir(), "hpe-isolated-deck-"));
const previousRoot = process.env.HPE_DECK_ROOT;
process.env.HPE_DECK_ROOT = resolve("tests/fixtures/isolated-deck");

try {
  await build({
    root: resolve("app"),
    configFile: resolve("app/vite.config.ts"),
    logLevel: "silent",
    build: { outDir: output, emptyOutDir: true },
  });
  const outputFiles = await files(output);
  const text = (
    await Promise.all(
      outputFiles
        .filter((path) => /\.(?:css|html|js)$/u.test(path))
        .map((path) => readFile(path, "utf8")),
    )
  ).join("\n");
  if (!text.includes("Independent deck root")) {
    throw new Error("The selected deck content was not emitted");
  }
  if (text.includes("Hello HPE")) {
    throw new Error("The default deck leaked into the selected deck build");
  }
  if (!text.includes(".text-7xl")) {
    throw new Error("Tailwind did not scan the selected deck root");
  }
  if (outputFiles.some((path) => /cover\.slide/u.test(path))) {
    throw new Error("The default deck slide chunks leaked into the build");
  }
  process.stdout.write("deck-root isolation verified\n");
} finally {
  if (previousRoot === undefined) delete process.env.HPE_DECK_ROOT;
  else process.env.HPE_DECK_ROOT = previousRoot;
  await rm(output, { recursive: true, force: true });
}
