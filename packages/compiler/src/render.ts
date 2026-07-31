import { resolve } from "node:path";

import { build } from "vite";

export interface RenderOptions {
  readonly root: string;
  readonly outDir?: string;
}

export async function renderDeck(options: RenderOptions): Promise<void> {
  await build({
    root: resolve(options.root),
    build: { outDir: options.outDir ?? "dist", emptyOutDir: true },
  });
}
