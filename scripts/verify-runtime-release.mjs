import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { lstat, mkdtemp, readFile, readdir, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const full = process.argv.includes("--full");
const archiveArgument = process.argv
  .slice(2)
  .find((value) => value !== "--full");

async function latestArchive() {
  const releaseDir = resolve(repoRoot, "artifacts/releases");
  const entries = await readdir(releaseDir);
  const candidates = entries.filter((entry) =>
    /^hpe-runtime-shell-\d{8}(?:-[a-z0-9-]+)?\.zip$/u.test(entry),
  );
  if (candidates.length === 0) {
    throw new Error("No hpe-runtime-shell release archive found");
  }
  const ranked = await Promise.all(
    candidates.map(async (entry) => ({
      entry,
      modified: (await stat(resolve(releaseDir, entry))).mtimeMs,
    })),
  );
  ranked.sort((left, right) => right.modified - left.modified);
  return resolve(releaseDir, ranked[0].entry);
}

const archive = archiveArgument
  ? resolve(repoRoot, archiveArgument)
  : await latestArchive();
const temporaryRoot = await mkdtemp(join(tmpdir(), "hpe-runtime-verify-"));
const extractedRoot = resolve(temporaryRoot, "hpe-runtime");

function run(command, args, cwd = repoRoot, env = {}) {
  const result = spawnSync(command, args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: "inherit",
  });
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} failed with ${result.status}`,
    );
  }
}

async function walk(root, current = root) {
  const output = [];
  for (const entry of await readdir(current)) {
    const absolute = resolve(current, entry);
    const metadata = await lstat(absolute);
    output.push({
      absolute,
      path: relative(root, absolute).replaceAll("\\", "/"),
      metadata,
    });
    if (metadata.isDirectory()) output.push(...(await walk(root, absolute)));
  }
  return output;
}

async function directoryDigest(root) {
  const entries = (await walk(root))
    .filter((entry) => entry.metadata.isFile())
    .sort((left, right) => left.path.localeCompare(right.path));
  const digest = createHash("sha256");
  for (const entry of entries) {
    digest.update(entry.path);
    digest.update(await readFile(entry.absolute));
  }
  return digest.digest("hex");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function versionAtLeast(version, minimum) {
  const current = version.split(".").map(Number);
  const required = minimum.split(".").map(Number);
  for (
    let index = 0;
    index < Math.max(current.length, required.length);
    index++
  ) {
    const difference = (current[index] || 0) - (required[index] || 0);
    if (difference !== 0) return difference > 0;
  }
  return true;
}

try {
  run("unzip", ["-q", archive, "-d", temporaryRoot]);
  const entries = await walk(extractedRoot);
  const paths = new Set(entries.map((entry) => entry.path));
  const required = [
    "RUNTIME-RELEASE.json",
    "README.md",
    "package.json",
    "package-lock.json",
    "app/src/App.vue",
    "packages/runtime-core/src/index.ts",
    "packages/cli/src/bin.ts",
    ".agents/skills/hpe-slides/SKILL.md",
    ".claude/skills/hpe-slides/SKILL.md",
    "tests/fixtures/e2e-deck/deck.json",
  ];
  for (const path of required) assert(paths.has(path), `Missing ${path}`);

  const forbidden = [
    /^presentations(?:\/|$)/u,
    /^app\/(?:deck\.json|slides|themes|content)(?:\/|$)/u,
    /(?:^|\/)(?:node_modules|dist|coverage|artifacts|\.git|\.hpe)(?:\/|$)/u,
    /(?:^|\/)\.DS_Store$/u,
  ];
  for (const entry of entries) {
    assert(
      !forbidden.some((pattern) => pattern.test(entry.path)),
      `Forbidden release path: ${entry.path}`,
    );
    assert(
      !entry.metadata.isSymbolicLink(),
      `Symlink in release: ${entry.path}`,
    );
  }

  const manifest = JSON.parse(
    await readFile(resolve(extractedRoot, "RUNTIME-RELEASE.json"), "utf8"),
  );
  assert(
    Array.isArray(manifest.bundledPresentations) &&
      manifest.bundledPresentations.length === 0,
    "Runtime manifest must declare zero bundled presentations",
  );

  const packageJson = JSON.parse(
    await readFile(resolve(extractedRoot, "package.json"), "utf8"),
  );
  assert(
    packageJson.scripts.build.includes("tests/fixtures/e2e-deck"),
    "Runtime build must use the verification fixture",
  );
  assert(
    !packageJson.scripts.boundaries.includes("presentations"),
    "Runtime boundaries must not require repository presentations",
  );

  const lock = JSON.parse(
    await readFile(resolve(extractedRoot, "package-lock.json"), "utf8"),
  );
  const nanoidVersion = lock.packages?.["node_modules/nanoid"]?.version;
  assert(
    nanoidVersion === undefined || versionAtLeast(nanoidVersion, "3.3.18"),
    `Vulnerable nanoid lock entry: ${nanoidVersion}`,
  );

  const agentSkillDigest = await directoryDigest(
    resolve(extractedRoot, ".agents/skills/hpe-slides"),
  );
  const claudeSkillDigest = await directoryDigest(
    resolve(extractedRoot, ".claude/skills/hpe-slides"),
  );
  assert(
    agentSkillDigest === claudeSkillDigest,
    "Materialized Skill copies are not identical",
  );

  if (full) {
    const npm = process.platform === "win32" ? "npm.cmd" : "npm";
    run(npm, ["ci"], extractedRoot, {
      PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: "1",
    });
    run(npm, ["run", "verify"], extractedRoot);
    run(
      npm,
      [
        "run",
        "deck",
        "--",
        "list",
        "--json",
        "--root",
        "tests/fixtures/e2e-deck",
      ],
      extractedRoot,
    );
  }

  const archiveBytes = await readFile(archive);
  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        archive: relative(repoRoot, archive),
        sha256: createHash("sha256").update(archiveBytes).digest("hex"),
        files: entries.filter((entry) => entry.metadata.isFile()).length,
        bundledPresentations: 0,
        fullVerification: full,
      },
      null,
      2,
    )}\n`,
  );
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
