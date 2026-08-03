import { readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";

import { parse as parseJavaScript } from "@babel/parser";
import * as t from "@babel/types";
import { parse, type SFCDescriptor } from "@vue/compiler-sfc";
import { baseParse } from "@vue/compiler-core";
import { parserOptions } from "@vue/compiler-dom";

import type { DeckManifest, SlideEntry, SourceLocation } from "@hpe/schema";
import { validateDeckManifest } from "@hpe/schema/validate";

import {
  findCssAssetReferences,
  validateAssetReferences,
  type AssetReference,
  type ResolvedAsset,
} from "./assets.js";
import { DeckCompilationError, type CompilationIssue } from "./diagnostics.js";
import { analyzeTemplate } from "./template.js";

export { DeckCompilationError } from "./diagnostics.js";
export type { CompilationIssue } from "./diagnostics.js";

export interface SlideSourceMap {
  readonly source: SourceLocation;
  readonly nodes: Readonly<Record<string, SourceLocation>>;
}

export interface CompiledSlide extends SlideSourceMap {
  readonly id: string;
  readonly absoluteFile: string;
  readonly notes: string;
  readonly descriptor: SFCDescriptor;
  readonly assets: readonly ResolvedAsset[];
}

export interface CompiledDeck {
  readonly root: string;
  readonly themeAbsoluteFile: string;
  readonly manifest: DeckManifest;
  readonly slides: readonly CompiledSlide[];
  readonly assets: readonly ResolvedAsset[];
}

interface SlideCompilationResult {
  readonly slide?: CompiledSlide;
  readonly issues: readonly CompilationIssue[];
}

interface ThemeCompilationResult {
  readonly absoluteFile: string;
  readonly module: boolean;
  readonly assets: readonly ResolvedAsset[];
  readonly issues: readonly CompilationIssue[];
}

function source(file: string, line = 1, column = 1): SourceLocation {
  return { file, line, column };
}

async function compileTheme(
  root: string,
  manifest: DeckManifest,
): Promise<ThemeCompilationResult> {
  const themeFile =
    typeof manifest.theme === "string" ? manifest.theme : manifest.theme.entry;
  const absoluteFile = resolve(root, themeFile);
  const issues: CompilationIssue[] = [];
  let contents = "";
  try {
    contents = await readFile(absoluteFile, "utf8");
  } catch (error) {
    issues.push({
      code: "THEME_READ_FAILED",
      message: error instanceof Error ? error.message : String(error),
      source: source(themeFile),
    });
    return { absoluteFile, module: false, assets: [], issues };
  }

  if (typeof manifest.theme === "string") {
    if (!themeFile.endsWith(".css")) {
      issues.push({
        code: "THEME_FILE_EXTENSION_INVALID",
        message: "Legacy theme references must point to a CSS file",
        source: source(themeFile),
      });
    }
    const validated = await validateAssetReferences(
      root,
      findCssAssetReferences(contents, absoluteFile, source(themeFile)),
    );
    return {
      absoluteFile,
      module: false,
      assets: validated.assets,
      issues: [...issues, ...validated.issues],
    };
  }

  if (!themeFile.endsWith(".ts")) {
    issues.push({
      code: "THEME_MODULE_EXTENSION_INVALID",
      message: "Theme module entries must end with .ts",
      source: source(themeFile),
    });
  }
  let ast: ReturnType<typeof parseJavaScript> | undefined;
  try {
    ast = parseJavaScript(contents, {
      sourceType: "module",
      plugins: ["typescript"],
    });
  } catch (error) {
    const location = (error as { loc?: { line?: number; column?: number } })
      .loc;
    issues.push({
      code: "THEME_MODULE_PARSE_ERROR",
      message: error instanceof Error ? error.message : String(error),
      source: source(
        themeFile,
        location?.line ?? 1,
        (location?.column ?? 0) + 1,
      ),
    });
  }
  const cssImports: Array<{ path: string; line: number; column: number }> = [];
  let hasDefaultExport = false;
  let hasDefineThemeImport = false;
  let defaultUsesDefineTheme = false;
  if (ast) {
    for (const statement of ast.program.body) {
      if (t.isExportDefaultDeclaration(statement)) {
        hasDefaultExport = true;
        defaultUsesDefineTheme =
          t.isCallExpression(statement.declaration) &&
          t.isIdentifier(statement.declaration.callee, { name: "defineTheme" });
      }
      if (
        t.isImportDeclaration(statement) &&
        statement.source.value === "@hpe/theme" &&
        statement.specifiers.some(
          (specifier) =>
            t.isImportSpecifier(specifier) &&
            t.isIdentifier(specifier.imported, { name: "defineTheme" }) &&
            t.isIdentifier(specifier.local, { name: "defineTheme" }),
        )
      ) {
        hasDefineThemeImport = true;
      }
      if (
        t.isImportDeclaration(statement) &&
        statement.source.value.endsWith(".css")
      ) {
        cssImports.push({
          path: statement.source.value,
          line: statement.loc?.start.line ?? 1,
          column: (statement.loc?.start.column ?? 0) + 1,
        });
      }
    }
  }
  if (!hasDefaultExport) {
    issues.push({
      code: "THEME_DEFAULT_EXPORT_MISSING",
      message: "Theme modules must default-export defineTheme(...) metadata",
      source: source(themeFile),
    });
  }
  if (hasDefaultExport && (!hasDefineThemeImport || !defaultUsesDefineTheme)) {
    issues.push({
      code: "THEME_DEFINE_CALL_MISSING",
      message:
        'Theme modules must import { defineTheme } from "@hpe/theme" and default-export defineTheme(...)',
      source: source(themeFile),
    });
  }
  if (cssImports.length === 0) {
    issues.push({
      code: "THEME_CSS_IMPORT_MISSING",
      message: "Theme modules must import at least one CSS file",
      source: source(themeFile),
    });
  }

  const assets: ResolvedAsset[] = [];
  for (const cssImport of cssImports) {
    if (!cssImport.path.startsWith(".")) {
      issues.push({
        code: "THEME_CSS_IMPORT_EXTERNAL",
        message: `Theme CSS imports must be relative: ${cssImport.path}`,
        source: source(themeFile, cssImport.line, cssImport.column),
      });
      continue;
    }
    const cssFile = resolve(dirname(absoluteFile), cssImport.path);
    if (relative(root, cssFile).startsWith("..")) {
      issues.push({
        code: "THEME_CSS_OUTSIDE_DECK",
        message: `Theme CSS must remain inside the deck root: ${cssImport.path}`,
        source: source(themeFile, cssImport.line, cssImport.column),
      });
      continue;
    }
    try {
      const css = await readFile(cssFile, "utf8");
      const validated = await validateAssetReferences(
        root,
        findCssAssetReferences(
          css,
          cssFile,
          source(relative(root, cssFile).replaceAll("\\", "/")),
        ),
      );
      assets.push(...validated.assets);
      issues.push(...validated.issues);
    } catch (error) {
      issues.push({
        code: "THEME_CSS_READ_FAILED",
        message: error instanceof Error ? error.message : String(error),
        source: source(themeFile, cssImport.line, cssImport.column),
      });
    }
  }
  return { absoluteFile, module: true, assets, issues };
}

function parseIssue(error: unknown, entry: SlideEntry): CompilationIssue {
  const candidate = error as {
    message?: unknown;
    loc?: { start?: { line?: number; column?: number } };
  };
  return {
    code: "SFC_PARSE_ERROR",
    message:
      typeof candidate.message === "string" ? candidate.message : String(error),
    slideId: entry.id,
    source: source(
      entry.file,
      candidate.loc?.start?.line ?? 1,
      (candidate.loc?.start?.column ?? 0) + 1,
    ),
  };
}

function validateSfcContract(
  descriptor: SFCDescriptor,
  entry: SlideEntry,
): readonly CompilationIssue[] {
  const issues: CompilationIssue[] = [];
  if (!descriptor.template) {
    issues.push({
      code: "SLIDE_TEMPLATE_MISSING",
      message: "Every slide must contain an inline template block",
      slideId: entry.id,
      source: source(entry.file),
    });
  } else if (descriptor.template.src) {
    issues.push({
      code: "SLIDE_TEMPLATE_EXTERNAL",
      message: "Slide templates must be inline to preserve source locations",
      slideId: entry.id,
      source: source(
        entry.file,
        descriptor.template.loc.start.line,
        descriptor.template.loc.start.column,
      ),
    });
  }
  for (const script of [descriptor.script, descriptor.scriptSetup]) {
    if (!script) continue;
    if (script.lang !== "ts" && script.lang !== "tsx") {
      issues.push({
        code: "SLIDE_SCRIPT_NOT_TYPESCRIPT",
        message: 'Slide scripts must declare lang="ts" or lang="tsx"',
        slideId: entry.id,
        source: source(
          entry.file,
          script.loc.start.line,
          script.loc.start.column,
        ),
      });
    }
  }
  const notes = descriptor.customBlocks.filter(
    (block) => block.type === "notes",
  );
  if (notes.length > 1) {
    issues.push({
      code: "SLIDE_NOTES_DUPLICATE",
      message: "A slide may contain at most one notes block",
      slideId: entry.id,
      source: source(
        entry.file,
        notes[1]?.loc.start.line ?? 1,
        notes[1]?.loc.start.column ?? 1,
      ),
    });
  }
  for (const block of descriptor.customBlocks) {
    if (block.type !== "notes") {
      issues.push({
        code: "SLIDE_CUSTOM_BLOCK_UNKNOWN",
        message: `Unsupported custom block: ${block.type}`,
        slideId: entry.id,
        source: source(
          entry.file,
          block.loc.start.line,
          block.loc.start.column,
        ),
      });
    } else if (block.lang !== "md") {
      issues.push({
        code: "SLIDE_NOTES_LANGUAGE_INVALID",
        message: 'Notes blocks must declare lang="md"',
        slideId: entry.id,
        source: source(
          entry.file,
          block.loc.start.line,
          block.loc.start.column,
        ),
      });
    }
  }
  for (const style of descriptor.styles) {
    if (style.lang && style.lang !== "css") {
      issues.push({
        code: "SLIDE_STYLE_LANGUAGE_UNSUPPORTED",
        message: `Unsupported style language without an explicit compiler adapter: ${style.lang}`,
        slideId: entry.id,
        source: source(
          entry.file,
          style.loc.start.line,
          style.loc.start.column,
        ),
      });
    }
  }
  return issues;
}

async function compileSlide(
  root: string,
  entry: SlideEntry,
): Promise<SlideCompilationResult> {
  const absoluteFile = resolve(root, entry.file);
  let contents: string;
  try {
    contents = await readFile(absoluteFile, "utf8");
  } catch (error) {
    return {
      issues: [
        {
          code: "SLIDE_READ_FAILED",
          message: error instanceof Error ? error.message : String(error),
          slideId: entry.id,
          source: source(entry.file),
        },
      ],
    };
  }
  if (!entry.file.endsWith(".slide.vue")) {
    return {
      issues: [
        {
          code: "SLIDE_FILE_EXTENSION_INVALID",
          message: "Slide files must end with .slide.vue",
          slideId: entry.id,
          source: source(entry.file),
        },
      ],
    };
  }
  const parsed = parse(contents, { filename: absoluteFile, sourceMap: true });
  const issues: CompilationIssue[] = parsed.errors.map((error) =>
    parseIssue(error, entry),
  );
  issues.push(...validateSfcContract(parsed.descriptor, entry));

  const template = parsed.descriptor.template;
  const analysis = template
    ? analyzeTemplate(
        baseParse(template.content, parserOptions),
        entry.file,
        entry.id,
        {
          line: template.loc.start.line,
          column: template.loc.start.column,
        },
      )
    : { nodes: {}, assets: [], inlineStyles: [], issues: [] };
  issues.push(...analysis.issues);
  const references: AssetReference[] = analysis.assets.map((asset) => ({
    ...asset,
    baseFile: absoluteFile,
    slideId: entry.id,
  }));
  for (const inlineStyle of analysis.inlineStyles) {
    references.push(
      ...findCssAssetReferences(
        inlineStyle.value,
        absoluteFile,
        inlineStyle.source,
        entry.id,
      ),
    );
  }
  for (const style of parsed.descriptor.styles) {
    references.push(
      ...findCssAssetReferences(
        style.content,
        absoluteFile,
        source(entry.file, style.loc.start.line, style.loc.start.column),
        entry.id,
      ),
    );
  }
  const validatedAssets = await validateAssetReferences(root, references);
  issues.push(...validatedAssets.issues);
  if (issues.length > 0 || !template) return { issues };

  const notes =
    parsed.descriptor.customBlocks
      .find((block) => block.type === "notes")
      ?.content.trim() ?? "";
  return {
    issues: [],
    slide: {
      id: entry.id,
      absoluteFile,
      notes,
      descriptor: parsed.descriptor,
      source: source(
        entry.file,
        template.loc.start.line,
        template.loc.start.column,
      ),
      nodes: analysis.nodes,
      assets: validatedAssets.assets,
    },
  };
}

export async function loadManifest(root: string): Promise<DeckManifest> {
  const contents = await readFile(resolve(root, "deck.json"), "utf8");
  return validateDeckManifest(JSON.parse(contents) as unknown);
}

export async function compileDeck(root: string): Promise<CompiledDeck> {
  const absoluteRoot = resolve(root);
  const manifest = await loadManifest(absoluteRoot);
  const issues: CompilationIssue[] = [];
  const theme = await compileTheme(absoluteRoot, manifest);
  issues.push(...theme.issues);

  const results = await Promise.all(
    manifest.slides.map((entry) => compileSlide(absoluteRoot, entry)),
  );
  issues.push(...results.flatMap((result) => result.issues));
  if (issues.length > 0) throw new DeckCompilationError(issues);
  const slides = results.flatMap((result) =>
    result.slide ? [result.slide] : [],
  );
  return {
    root: absoluteRoot,
    themeAbsoluteFile: theme.absoluteFile,
    manifest,
    slides,
    assets: [...theme.assets, ...slides.flatMap((slide) => slide.assets)],
  };
}
