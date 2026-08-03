import {
  mkdir,
  open,
  readFile,
  rm,
  stat,
  type FileHandle,
} from "node:fs/promises";
import { hostname } from "node:os";
import { dirname } from "node:path";

import { CliError } from "./errors.js";

interface LockRecord {
  readonly pid: number;
  readonly hostname: string;
  readonly createdAt: string;
}

const STALE_LOCK_MS = 30 * 60 * 1000;

function processIsAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return (error as NodeJS.ErrnoException).code !== "ESRCH";
  }
}

async function staleLock(path: string): Promise<boolean> {
  try {
    const information = await stat(path);
    if (Date.now() - information.mtimeMs > STALE_LOCK_MS) return true;
    const record = JSON.parse(
      await readFile(path, "utf8"),
    ) as Partial<LockRecord>;
    return (
      record.hostname === hostname() &&
      typeof record.pid === "number" &&
      !processIsAlive(record.pid)
    );
  } catch {
    return false;
  }
}

export async function withFileLock<T>(
  path: string,
  operation: () => Promise<T>,
): Promise<T> {
  await mkdir(dirname(path), { recursive: true });
  let handle: FileHandle | undefined;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      handle = await open(path, "wx", 0o600);
      break;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      if (attempt === 0 && (await staleLock(path))) {
        await rm(path, { force: true });
        continue;
      }
      throw new CliError(
        "DECK_LOCKED",
        `Another deck mutation owns the lock: ${path}`,
        { exitCode: 4 },
      );
    }
  }
  if (!handle)
    throw new CliError("DECK_LOCKED", `Unable to acquire deck lock: ${path}`);
  const record: LockRecord = {
    pid: process.pid,
    hostname: hostname(),
    createdAt: new Date().toISOString(),
  };
  try {
    await handle.writeFile(`${JSON.stringify(record)}\n`, "utf8");
    return await operation();
  } finally {
    await handle.close();
    await rm(path, { force: true });
  }
}
