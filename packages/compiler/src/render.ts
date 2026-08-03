import { resolve } from "node:path";

import { build, preview, type LogLevel, type PreviewServer } from "vite";

export interface RenderOptions {
  readonly root: string;
  readonly outDir?: string;
  readonly logLevel?: LogLevel;
}

export async function renderDeck(options: RenderOptions): Promise<void> {
  await build({
    root: resolve(options.root),
    logLevel: options.logLevel ?? "info",
    build: { outDir: options.outDir ?? "dist", emptyOutDir: true },
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
  const root = resolve(options.root);
  const outDir = options.outDir ?? ".hpe/inspect-dist";
  await renderDeck({ root, outDir, logLevel: options.logLevel ?? "silent" });
  const server: PreviewServer = await preview({
    root,
    logLevel: options.logLevel ?? "silent",
    build: { outDir },
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
