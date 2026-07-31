import { codeToHtml, type BundledLanguage, type BundledTheme } from "shiki";

export interface HighlightOptions {
  readonly language: BundledLanguage;
  readonly theme?: BundledTheme;
}

/** Build-time-only highlighter, isolated from the browser runtime export graph. */
export async function highlightCode(
  code: string,
  options: HighlightOptions,
): Promise<string> {
  return codeToHtml(code, {
    lang: options.language,
    theme: options.theme ?? "github-dark",
  });
}
