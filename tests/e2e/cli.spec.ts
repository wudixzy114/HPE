import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { expect, test } from "@playwright/test";

const execute = promisify(execFile);

function cleanColorEnvironment(): NodeJS.ProcessEnv {
  return Object.fromEntries(
    Object.entries(process.env).filter(
      ([key]) => key !== "NO_COLOR" && key !== "FORCE_COLOR",
    ),
  );
}

test("managed CLI inspection emits isolated JSON and closes its private server", async () => {
  const { stdout, stderr } = await execute(
    process.execPath,
    [
      "packages/cli/dist/bin.js",
      "--root",
      "app",
      "inspect",
      "--slide",
      "slide-00",
      "--states",
      "default",
      "--output",
      "artifacts/e2e-report.json",
      "--json",
    ],
    {
      cwd: process.cwd(),
      timeout: 30_000,
      env: cleanColorEnvironment(),
    },
  );
  expect(stderr).toBe("");
  const report = JSON.parse(stdout) as {
    statesChecked: number;
    summary: { error: number; warning: number };
  };
  expect(report.statesChecked).toBe(1);
  expect(report.summary).toEqual({ error: 0, warning: 0, info: 0 });
});

test("managed CLI inspection reuses the player for a nested deck root", async () => {
  const { stdout, stderr } = await execute(
    process.execPath,
    [
      "packages/cli/dist/bin.js",
      "--root",
      "tests/fixtures/isolated-deck",
      "inspect",
      "--slide",
      "intro",
      "--states",
      "default",
      "--output",
      "artifacts/e2e-nested-report.json",
      "--json",
    ],
    {
      cwd: process.cwd(),
      timeout: 30_000,
      env: cleanColorEnvironment(),
    },
  );
  expect(stderr).toBe("");
  const report = JSON.parse(stdout) as {
    statesChecked: number;
    summary: { error: number; warning: number; info: number };
  };
  expect(report.statesChecked).toBe(1);
  expect(report.summary.error).toBe(0);
});
