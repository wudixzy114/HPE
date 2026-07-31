import { MagicString, parse } from "@vue/compiler-sfc";

import { getStaticAttribute, walkTemplateElements } from "./template.js";

export interface CodeBlockTransformResult {
  readonly code: string;
  readonly map: ReturnType<MagicString["generateMap"]>;
}

export async function transformCodeBlocks(
  source: string,
  filename: string,
): Promise<CodeBlockTransformResult | undefined> {
  const parsed = parse(source, { filename, sourceMap: true });
  const template = parsed.descriptor.template;
  if (!template?.ast) return undefined;
  const blocks: Array<{
    readonly start: number;
    readonly end: number;
    readonly language: string;
    readonly code: string;
    readonly theme?: string;
  }> = [];
  walkTemplateElements(template.ast, (element) => {
    if (element.tag !== "ShikiCode") return;
    const language = getStaticAttribute(element, "lang");
    const code = getStaticAttribute(element, "code");
    if (!language || code === undefined) {
      throw new Error(
        `${filename}:${element.loc.start.line}:${element.loc.start.column} ShikiCode requires static lang and code attributes`,
      );
    }
    const theme = getStaticAttribute(element, "theme");
    blocks.push({
      start: element.loc.start.offset,
      end: element.loc.end.offset,
      language,
      code,
      ...(theme === undefined ? {} : { theme }),
    });
  });
  if (blocks.length === 0) return undefined;

  const { highlightCode } = await import("./highlight.js");
  const output = new MagicString(source);
  for (const block of [...blocks].sort(
    (left, right) => right.start - left.start,
  )) {
    const html = await highlightCode(block.code, {
      language: block.language as Parameters<
        typeof highlightCode
      >[1]["language"],
      ...(block.theme === undefined
        ? {}
        : {
            theme: block.theme as NonNullable<
              Parameters<typeof highlightCode>[1]["theme"]
            >,
          }),
    });
    output.overwrite(
      block.start,
      block.end,
      `<div class="hpe-shiki">${html}</div>`,
    );
  }
  return {
    code: output.toString(),
    map: output.generateMap({
      source: filename,
      includeContent: true,
      hires: true,
    }),
  };
}
