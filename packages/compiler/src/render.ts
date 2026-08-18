import { access } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { build, preview, type LogLevel, type PreviewServer } from "vite";

export interface RenderOptions {
  readonly root: string;
  readonly playerRoot?: string;
  readonly outDir?: string;
  readonly logLevel?: LogLevel;
}

interface RenderContext {
  readonly deckRoot: string;
  readonly playerRoot: string;
  readonly outDir: string;
}

let environmentQueue: Promise<void> = Promise.resolve();

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function isPlayerRoot(root: string): Promise<boolean> {
  return (
    (await pathExists(resolve(root, "index.html"))) &&
    (await pathExists(resolve(root, "vite.config.ts")))
  );
}

async function findPlayerRoot(deckRoot: string): Promise<string> {
  if (await isPlayerRoot(deckRoot)) return deckRoot;
  let directory = deckRoot;
  while (true) {
    const candidate = resolve(directory, "app");
    if (await isPlayerRoot(candidate)) return candidate;
    const parent = dirname(directory);
    if (parent === directory) break;
    directory = parent;
  }
  throw new Error(
    `Unable to locate the HPE player for deck ${deckRoot}; pass playerRoot explicitly`,
  );
}

async function renderContext(options: RenderOptions): Promise<RenderContext> {
  const deckRoot = resolve(options.root);
  return {
    deckRoot,
    playerRoot: options.playerRoot
      ? resolve(options.playerRoot)
      : await findPlayerRoot(deckRoot),
    outDir: resolve(deckRoot, options.outDir ?? "dist"),
  };
}

async function withDeckRootEnvironment<T>(
  deckRoot: string,
  operation: () => Promise<T>,
): Promise<T> {
  const previousQueue = environmentQueue;
  let release!: () => void;
  environmentQueue = new Promise<void>((resolveQueue) => {
    release = resolveQueue;
  });
  await previousQueue;
  const previousRoot = process.env.HPE_DECK_ROOT;
  process.env.HPE_DECK_ROOT = deckRoot;
  try {
    return await operation();
  } finally {
    if (previousRoot === undefined) delete process.env.HPE_DECK_ROOT;
    else process.env.HPE_DECK_ROOT = previousRoot;
    release();
  }
}

export async function renderDeck(options: RenderOptions): Promise<void> {
  const context = await renderContext(options);
  await withDeckRootEnvironment(context.deckRoot, async () => {
    await build({
      root: context.playerRoot,
      logLevel: options.logLevel ?? "info",
      build: { outDir: context.outDir, emptyOutDir: true },
    });
  });
}

export interface ServeDeckOptions extends RenderOptions {
  readonly host?: string;
  readonly port?: number;
}

export interface DeckServer {
  readonly url: string;
  close(): Promise<void>;
}

export async function serveDeck(
  options: ServeDeckOptions,
): Promise<DeckServer> {
  const context = await renderContext({
    ...options,
    outDir: options.outDir ?? ".hpe/inspect-dist",
  });
  await renderDeck({
    root: context.deckRoot,
    playerRoot: context.playerRoot,
    outDir: context.outDir,
    logLevel: options.logLevel ?? "silent",
  });
  const server: PreviewServer = await preview({
    configFile: false,
    root: context.playerRoot,
    logLevel: options.logLevel ?? "silent",
    build: { outDir: context.outDir },
    preview: {
      host: options.host ?? "127.0.0.1",
      port: options.port ?? 0,
      strictPort: false,
    },
  });
  const address = server.httpServer.address();
  if (!address || typeof address === "string") {
    await server.close();
    throw new Error("Unable to determine the inspection server address");
  }
  const host = options.host ?? "127.0.0.1";
  return {
    url: `http://${host}:${address.port}/`,
    close: async () => server.close(),
  };
}
