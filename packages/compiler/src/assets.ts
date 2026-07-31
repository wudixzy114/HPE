import { stat } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";

import type { SourceLocation } from "@hpe/schema";

import type { CompilationIssue } from "./diagnostics.js";

export interface AssetReference {
  readonly value: string;
  readonly baseFile: string;
  readonly source: SourceLocation;
  readonly slideId?: string;
}

export interface ResolvedAsset {
  readonly reference: string;
  readonly absoluteFile: string;
  readonly source: SourceLocation;
}

const EXTERNAL_REFERENCE = /^(?:[a-z][a-z\d+.-]*:|#|\/\/)/iu;

function localPath(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed || EXTERNAL_REFERENCE.test(trimmed)) return undefined;
  return trimmed.split(/[?#]/u, 1)[0];
}

function locationAt(
  file: string,
  css: string,
  offset: number,
  start: SourceLocation,
): SourceLocation {
  const prefix = css.slice(0, offset);
  const lines = prefix.split("\n");
  return {
    file,
    line: start.line + lines.length - 1,
    column:
      lines.length === 1
        ? start.column + (lines[0]?.length ?? 0)
        : (lines.at(-1)?.length ?? 0) + 1,
  };
}

export function findCssAssetReferences(
  css: string,
  baseFile: string,
  start: SourceLocation,
  slideId?: string,
): readonly AssetReference[] {
  const references: AssetReference[] = [];
  const pattern = /url\(\s*(["']?)([^"')]+)\1\s*\)/giu;
  for (const match of css.matchAll(pattern)) {
    const value = match[2]?.trim();
    if (!value) continue;
    references.push({
      value,
      baseFile,
      source: locationAt(start.file, css, match.index, start),
      ...(slideId === undefined ? {} : { slideId }),
    });
  }
  return references;
}

export async function validateAssetReferences(
  root: string,
  references: readonly AssetReference[],
): Promise<{
  readonly assets: readonly ResolvedAsset[];
  readonly issues: readonly CompilationIssue[];
}> {
  const assets: ResolvedAsset[] = [];
  const issues: CompilationIssue[] = [];
  await Promise.all(
    references.map(async (reference) => {
      const path = localPath(reference.value);
      if (path === undefined) return;
      let decoded: string;
      try {
        decoded = decodeURIComponent(path);
      } catch {
        issues.push({
          code: "ASSET_PATH_INVALID",
          message: `Invalid encoded asset path: ${reference.value}`,
          ...(reference.slideId === undefined
            ? {}
            : { slideId: reference.slideId }),
          source: reference.source,
        });
        return;
      }
      const absoluteFile = decoded.startsWith("/")
        ? resolve(root, `.${decoded}`)
        : resolve(dirname(reference.baseFile), decoded);
      const fromRoot = relative(root, absoluteFile);
      if (fromRoot.startsWith("..") || isAbsolute(fromRoot)) {
        issues.push({
          code: "ASSET_OUTSIDE_DECK",
          message: `Asset must stay inside the deck root: ${reference.value}`,
          ...(reference.slideId === undefined
            ? {}
            : { slideId: reference.slideId }),
          source: reference.source,
        });
        return;
      }
      try {
        const information = await stat(absoluteFile);
        if (!information.isFile()) throw new Error("not a file");
        assets.push({
          reference: reference.value,
          absoluteFile,
          source: reference.source,
        });
      } catch {
        issues.push({
          code: "ASSET_NOT_FOUND",
          message: `Asset does not exist: ${reference.value}`,
          ...(reference.slideId === undefined
            ? {}
            : { slideId: reference.slideId }),
          source: reference.source,
        });
      }
    }),
  );
  return { assets, issues };
}
