import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const require = createRequire(import.meta.url);
const scriptDir = dirname(fileURLToPath(import.meta.url));
const deckRoot = resolve(scriptDir, "..");
const mermaidScript = require.resolve("mermaid/dist/mermaid.min.js");
const outputDir = resolve(deckRoot, "assets/er");

const diagrams = [["overview", "er-overview.mmd"]];

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({
    viewport: { width: 1800, height: 1200 },
  });
  await page.setContent("<!doctype html><html><body></body></html>");
  await page.addScriptTag({ path: mermaidScript });

  for (const [id, filename] of diagrams) {
    const source = await readFile(
      resolve(deckRoot, "diagrams", filename),
      "utf8",
    );
    const svg = await page.evaluate(
      async ({ diagramId, diagramSource }) => {
        const mermaidApi = globalThis.mermaid;
        mermaidApi.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          themeVariables: {
            background: "#F7F7F2",
            primaryColor: "#FFFFFF",
            primaryTextColor: "#17233B",
            primaryBorderColor: "#315E9E",
            lineColor: "#087F75",
            tertiaryColor: "#E5F3EF",
            fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
            fontSize: "17px",
          },
          er: {
            useMaxWidth: true,
            diagramPadding: 12,
            entityPadding: 12,
            stroke: "#315E9E",
            fill: "#FFFFFF",
            fontSize: 17,
          },
        });
        const { svg: rendered } = await mermaidApi.render(
          diagramId,
          diagramSource,
        );
        return rendered;
      },
      { diagramId: `database-er-${id}`, diagramSource: source },
    );

    const normalized = svg
      .replace(/style="max-width:[^"]+;"/u, 'style="width:100%;height:100%;"')
      .replace("<svg ", '<svg preserveAspectRatio="xMidYMid meet" ');
    await writeFile(resolve(outputDir, `${id}.svg`), normalized, "utf8");
  }
} finally {
  await browser.close();
}
