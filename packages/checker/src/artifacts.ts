import { readFile, readdir, rm, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

import type { Browser, Page } from "playwright";

import type { BrowserFinding } from "./browser-checks.js";
import type { CheckArtifact, CheckReport } from "./index.js";

const GENERATED_ARTIFACT =
  /^(?:\d{4}-.+\.(?:raw|annotated)\.png|.+\.step-\d+\.png|contact-sheet\.png|report\.(?:json|html))$/u;

export async function cleanupCheckArtifacts(directory: string): Promise<void> {
  const entries = await readdir(directory, { withFileTypes: true });
  await Promise.all(
    entries
      .filter((entry) => entry.isFile() && GENERATED_ARTIFACT.test(entry.name))
      .map((entry) => rm(join(directory, entry.name))),
  );
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function captureAnnotatedSlide(
  page: Page,
  findings: readonly BrowserFinding[],
  path: string,
  safeArea: number,
): Promise<void> {
  const slide = page.locator("[data-hpe-slide]").first();
  await slide.evaluate(
    (root, input) => {
      root.querySelector("[data-hpe-annotation]")?.remove();
      const overlay = document.createElement("div");
      overlay.dataset.hpeAnnotation = "";
      Object.assign(overlay.style, {
        position: "absolute",
        inset: "0",
        zIndex: "2147483647",
        pointerEvents: "none",
        fontFamily: "ui-monospace, monospace",
        fontSize: "12px",
      });
      const rootRect = root.getBoundingClientRect();
      const box = (
        x: number,
        y: number,
        width: number,
        height: number,
        color: string,
        label: string,
        fill = true,
      ): void => {
        const element = document.createElement("div");
        Object.assign(element.style, {
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
          width: `${width}px`,
          height: `${height}px`,
          border: `2px solid ${color}`,
          background: fill ? `${color}12` : "transparent",
          boxSizing: "border-box",
        });
        const caption = document.createElement("span");
        caption.textContent = label;
        Object.assign(caption.style, {
          position: "absolute",
          top: "0",
          left: "0",
          maxWidth: `${Math.max(width, 120)}px`,
          padding: "2px 4px",
          color: "white",
          background: color,
          lineHeight: "1.2",
          whiteSpace: "nowrap",
        });
        element.append(caption);
        overlay.append(element);
      };
      box(
        input.safeArea,
        input.safeArea,
        rootRect.width - input.safeArea * 2,
        rootRect.height - input.safeArea * 2,
        "#f59e0b",
        `safe ${input.safeArea}px`,
        false,
      );
      for (const node of root.querySelectorAll<HTMLElement>("[data-node]")) {
        const rect = node.getBoundingClientRect();
        box(
          rect.left - rootRect.left,
          rect.top - rootRect.top,
          rect.width,
          rect.height,
          "#38bdf8",
          node.dataset.node ?? "node",
        );
      }
      for (const finding of input.findings) {
        if (!finding.bounds) continue;
        box(
          finding.bounds.x,
          finding.bounds.y,
          finding.bounds.width,
          finding.bounds.height,
          finding.severity === "error" ? "#ef4444" : "#a855f7",
          finding.code,
        );
      }
      root.append(overlay);
    },
    { findings, safeArea },
  );
  try {
    await slide.screenshot({ path });
  } finally {
    await slide.evaluate((root) =>
      root.querySelector("[data-hpe-annotation]")?.remove(),
    );
  }
}

export async function createContactSheet(
  browser: Browser,
  screenshots: readonly CheckArtifact[],
  path: string,
): Promise<void> {
  const cards = await Promise.all(
    screenshots.map(async (artifact) => {
      const data = await readFile(artifact.path);
      return `<figure><img src="data:image/png;base64,${data.toString("base64")}" alt=""><figcaption>${escapeHtml(
        `${artifact.slideId ?? "slide"} · ${artifact.stateId ?? "state"}`,
      )}</figcaption></figure>`;
    }),
  );
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  try {
    await page.setContent(`<!doctype html><html><head><style>
      *{box-sizing:border-box}body{margin:0;padding:24px;background:#090b10;color:#e2e8f0;font:14px ui-sans-serif,system-ui}
      h1{margin:0 0 20px;font-size:24px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
      figure{margin:0;padding:8px;border:1px solid #334155;border-radius:10px;background:#111827}
      img{display:block;width:100%;aspect-ratio:16/9;object-fit:contain;background:#020306}figcaption{padding:8px 2px 2px;color:#94a3b8}
    </style></head><body><h1>HPE inspection contact sheet</h1><main class="grid">${cards.join(
      "",
    )}</main></body></html>`);
    await page.screenshot({ path, fullPage: true });
  } finally {
    await page.close();
  }
}

export async function writeReportFiles(
  report: CheckReport,
  jsonPath: string,
  htmlPath: string,
): Promise<void> {
  await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  const screenshots = report.artifacts.filter(
    (artifact) => artifact.type === "annotated-screenshot",
  );
  const diagnostics = report.diagnostics
    .map(
      (diagnostic) =>
        `<tr class="${diagnostic.severity}"><td>${escapeHtml(
          diagnostic.severity,
        )}</td><td><code>${escapeHtml(diagnostic.code)}</code></td><td>${escapeHtml(
          diagnostic.slideId ?? "deck",
        )}</td><td>${escapeHtml(diagnostic.stateId ?? "-")}</td><td>${escapeHtml(
          diagnostic.nodeId ?? "-",
        )}</td><td>${escapeHtml(diagnostic.message)}</td></tr>`,
    )
    .join("");
  const gallery = screenshots
    .map(
      (artifact) =>
        `<figure><a href="${escapeHtml(basename(artifact.path))}"><img src="${escapeHtml(
          basename(artifact.path),
        )}" alt=""></a><figcaption>${escapeHtml(
          `${artifact.slideId ?? "slide"} · ${artifact.stateId ?? "state"}`,
        )}</figcaption></figure>`,
    )
    .join("");
  await writeFile(
    htmlPath,
    `<!doctype html><html><head><meta charset="utf-8"><title>HPE inspection report</title><style>
      :root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;padding:32px;background:#090b10;color:#e2e8f0;font:14px/1.5 ui-sans-serif,system-ui}
      h1,h2{color:#f8fafc}.summary{display:flex;gap:12px;margin:20px 0}.summary span{padding:8px 12px;border:1px solid #334155;border-radius:8px}
      table{width:100%;border-collapse:collapse;margin-bottom:36px}th,td{padding:9px;border-bottom:1px solid #263247;text-align:left;vertical-align:top}.error td:first-child{color:#f87171}.warning td:first-child{color:#fbbf24}
      .gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:18px}figure{margin:0}img{display:block;width:100%;border:1px solid #334155;border-radius:8px}figcaption{padding:6px;color:#94a3b8}
    </style></head><body><h1>HPE inspection report</h1><p>Generated ${escapeHtml(
      report.generatedAt,
    )}; ${report.statesChecked} states checked.</p><div class="summary"><span>Errors: ${
      report.summary.error
    }</span><span>Warnings: ${report.summary.warning}</span><span>Info: ${
      report.summary.info
    }</span></div><h2>Diagnostics</h2><table><thead><tr><th>Severity</th><th>Code</th><th>Slide</th><th>State</th><th>Node</th><th>Message</th></tr></thead><tbody>${diagnostics}</tbody></table><h2>Annotated states</h2><div class="gallery">${gallery}</div></body></html>`,
    "utf8",
  );
}
