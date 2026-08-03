import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import process from "node:process";

const root = resolve(import.meta.dirname, "..");
const packages = [
  "schema",
  "theme",
  "runtime-core",
  "runtime-browser",
  "renderer-vue",
  "compiler",
  "checker",
  "cli",
];
const binary = (name) =>
  resolve(
    root,
    "node_modules",
    ".bin",
    `${name}${process.platform === "win32" ? ".cmd" : ""}`,
  );

function run(command, args, cwd = root) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    env: { ...process.env, FORCE_COLOR: "0" },
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout);
    process.stderr.write(result.stderr);
    throw new Error(
      `${command} ${args.join(" ")} failed with exit code ${result.status}`,
    );
  }
  return result.stdout;
}

function exportTargets(value, targets = []) {
  if (typeof value === "string") targets.push(value);
  else if (value && typeof value === "object") {
    for (const nested of Object.values(value)) exportTargets(nested, targets);
  }
  return targets;
}

for (const name of packages) {
  const directory = resolve(root, "packages", name);
  const manifest = JSON.parse(
    readFileSync(resolve(directory, "package.json"), "utf8"),
  );
  if (manifest.private !== true)
    throw new Error(
      `${manifest.name} must remain private until release approval`,
    );
  if (manifest.license !== "UNLICENSED")
    throw new Error(`${manifest.name} must declare its current license status`);
  if (manifest.engines?.node !== ">=22.12")
    throw new Error(
      `${manifest.name} must declare the supported Node baseline`,
    );

  run(binary("publint"), [directory]);
  run(binary("attw"), [
    "--pack",
    directory,
    "--profile",
    "esm-only",
    "--quiet",
  ]);

  const pack = JSON.parse(
    run(
      process.platform === "win32" ? "npm.cmd" : "npm",
      ["pack", "--dry-run", "--json"],
      directory,
    ),
  )[0];
  const files = new Map(pack.files.map((file) => [file.path, file]));
  for (const target of exportTargets(manifest.exports)) {
    const path = target.replace(/^\.\//u, "");
    if (!files.has(path))
      throw new Error(
        `${manifest.name} export target is absent from its package: ${target}`,
      );
  }
  const sourceFiles = [...files.keys()].filter(
    (path) =>
      path.startsWith("src/") ||
      (/\.tsx?$/u.test(path) && !/\.d\.ts$/u.test(path)),
  );
  if (sourceFiles.length > 0) {
    throw new Error(
      `${manifest.name} leaks authoring sources: ${sourceFiles.join(", ")}`,
    );
  }
  if (manifest.bin) {
    for (const target of Object.values(manifest.bin)) {
      const file = files.get(target.replace(/^\.\//u, ""));
      if (!file || (file.mode & 0o111) === 0) {
        throw new Error(
          `${manifest.name} binary is missing or not executable: ${target}`,
        );
      }
    }
  }
  process.stdout.write(
    `verified ${manifest.name} (${files.size} packed files)\n`,
  );
}
