import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const archiveRootName = "hpe-runtime";

function releaseDate() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const value = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );
  return `${value.year}${value.month}${value.day}`;
}

const output = resolve(
  repoRoot,
  process.argv[2] ||
    `artifacts/releases/hpe-runtime-shell-${releaseDate()}.zip`,
);
const temporaryRoot = await mkdtemp(join(tmpdir(), "hpe-runtime-release-"));
const stagingRoot = join(temporaryRoot, archiveRootName);

const rootFiles = [
  ".dependency-cruiser.cjs",
  ".editorconfig",
  ".gitignore",
  ".npmrc",
  ".prettierignore",
  "README.md",
  "eslint.config.js",
  "package-lock.json",
  "package.json",
  "playwright.config.ts",
  "tsconfig.base.json",
  "tsconfig.json",
  "tsconfig.tests.json",
  "vitest.config.ts",
];

const sourcePaths = [
  ...rootFiles,
  ".agents/skills/hpe-slides",
  ".github",
  "app/index.html",
  "app/package.json",
  "app/src",
  "app/theme.css",
  "app/tsconfig.json",
  "app/vite.config.ts",
  "app/vite.share.config.ts",
  "docs/architecture.md",
  "docs/cli.md",
  "docs/development.md",
  "docs/open-source-landscape.md",
  "docs/runtime-release.md",
  "docs/themes.md",
  "packages",
  "scripts/package-offline.mjs",
  "scripts/package-runtime.mjs",
  "scripts/run-deck.mjs",
  "scripts/verify-bundle.mjs",
  "scripts/verify-deck-isolation.mjs",
  "scripts/verify-licenses.mjs",
  "scripts/verify-offline.mjs",
  "scripts/verify-packages.mjs",
  "scripts/verify-runtime-release.mjs",
  "scripts/vite.offline.config.ts",
  "tests",
];

const blockedNames = new Set([
  ".DS_Store",
  ".hpe",
  ".playwright-cli",
  "artifacts",
  "coverage",
  "dist",
  "node_modules",
  "playwright-report",
  "test-results",
]);

function copyFilter(source) {
  const name = basename(source);
  return !blockedNames.has(name) && !name.endsWith(".tsbuildinfo");
}

async function copySource(path) {
  const source = resolve(repoRoot, path);
  const destination = resolve(stagingRoot, path);
  await mkdir(dirname(destination), { recursive: true });
  await cp(source, destination, {
    recursive: true,
    dereference: true,
    filter: copyFilter,
  });
}

function run(command, args, cwd = repoRoot) {
  const result = spawnSync(command, args, { cwd, stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} failed with ${result.status}`,
    );
  }
}

try {
  await mkdir(stagingRoot, { recursive: true });
  for (const path of sourcePaths) await copySource(path);

  // Claude Code releases must not depend on symlink preservation by ZIP clients.
  await mkdir(resolve(stagingRoot, ".claude/skills"), { recursive: true });
  await cp(
    resolve(stagingRoot, ".agents/skills/hpe-slides"),
    resolve(stagingRoot, ".claude/skills/hpe-slides"),
    { recursive: true, dereference: true },
  );

  // The runtime archive deliberately excludes every repository presentation.
  // Its smoke-test fixture remains available for install/build verification.
  const packageFile = resolve(stagingRoot, "package.json");
  const packageJson = JSON.parse(await readFile(packageFile, "utf8"));
  packageJson.scripts = {
    ...packageJson.scripts,
    build:
      "npm run build:packages && node scripts/run-deck.mjs build --deck-root tests/fixtures/e2e-deck",
    boundaries:
      "dependency-cruiser packages/*/src app/src tests/fixtures/*/slides tests/fixtures/*/themes --config .dependency-cruiser.cjs",
    dev: "node scripts/run-deck.mjs dev --deck-root tests/fixtures/e2e-deck",
    preview:
      "node scripts/run-deck.mjs preview --deck-root tests/fixtures/e2e-deck",
  };
  await writeFile(
    packageFile,
    `${JSON.stringify(packageJson, null, 2)}\n`,
    "utf8",
  );

  const { format } = await import("prettier");
  const releaseManifest = {
    schemaVersion: 1,
    name: "hpe-runtime-shell",
    version: packageJson.version,
    createdAt: new Date().toISOString(),
    bundledPresentations: [],
    verificationDecks: [
      "tests/fixtures/e2e-deck",
      "tests/fixtures/isolated-deck",
    ],
    excludedRepositoryDecks: ["app", "presentations"],
    skillCopies: [".agents/skills/hpe-slides", ".claude/skills/hpe-slides"],
  };
  await writeFile(
    resolve(stagingRoot, "RUNTIME-RELEASE.json"),
    await format(JSON.stringify(releaseManifest), { parser: "json" }),
    "utf8",
  );

  await mkdir(dirname(output), { recursive: true });
  await rm(output, { force: true });
  run("zip", ["-X", "-q", "-r", output, archiveRootName], temporaryRoot);

  const bytes = await readFile(output);
  const metadata = await stat(output);
  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        archive: relative(repoRoot, output),
        bytes: metadata.size,
        sha256: createHash("sha256").update(bytes).digest("hex"),
        bundledPresentations: 0,
      },
      null,
      2,
    )}\n`,
  );
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
