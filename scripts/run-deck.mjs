import { access } from "node:fs/promises";
import { resolve } from "node:path";
import { spawn } from "node:child_process";
import process from "node:process";

const [mode, ...inputArguments] = process.argv.slice(2);
if (!mode || !["dev", "build", "preview"].includes(mode)) {
  throw new Error(
    "Usage: run-deck.mjs <dev|build|preview> [--deck-root <dir>]",
  );
}

let deckRoot = process.env.HPE_DECK_ROOT || "app";
const forwardedArguments = [];
for (let index = 0; index < inputArguments.length; index += 1) {
  const argument = inputArguments[index];
  if (argument === "--deck-root") {
    const value = inputArguments[index + 1];
    if (!value) throw new Error("--deck-root requires a directory");
    deckRoot = value;
    index += 1;
  } else if (argument?.startsWith("--deck-root=")) {
    deckRoot = argument.slice("--deck-root=".length);
  } else if (argument !== undefined) {
    forwardedArguments.push(argument);
  }
}

const absoluteDeckRoot = resolve(deckRoot);
await access(resolve(absoluteDeckRoot, "deck.json"));

const child = spawn(
  process.platform === "win32" ? "npm.cmd" : "npm",
  ["run", mode, "-w", "@hpe/app", "--", ...forwardedArguments],
  {
    stdio: "inherit",
    env: { ...process.env, HPE_DECK_ROOT: absoluteDeckRoot },
  },
);

child.on("error", (error) => {
  throw error;
});

const exitCode = await new Promise((resolveExit) => {
  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    resolveExit(code ?? 1);
  });
});

process.exitCode = exitCode;
