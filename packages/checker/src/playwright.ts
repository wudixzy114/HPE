import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

import { chromium } from "playwright";

import type { DeckManifest } from "@hpe/schema";

import {
  createCheckReport,
  type CheckReport,
  type DeckDiagnostic,
} from "./index.js";

export interface PlaywrightCheckOptions {
  readonly url: string;
  readonly manifest: DeckManifest;
  readonly outputDir?: string;
  readonly screenshots?: boolean;
}

interface BrowserRuntime {
  dispatch(event: {
    type: string;
    slideId?: string;
    step?: number;
    mode?: "inspect";
  }): void;
}

interface GeometryIssue {
  readonly nodeId: string;
  readonly bounds: { x: number; y: number; width: number; height: number };
  readonly slideBounds: { width: number; height: number };
}

export async function checkWithPlaywright(
  options: PlaywrightCheckOptions,
): Promise<CheckReport> {
  const outputDir = resolve(options.outputDir ?? "artifacts");
  if (options.screenshots) await mkdir(outputDir, { recursive: true });
  const diagnostics: DeckDiagnostic[] = [];
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({
      viewport: options.manifest.size,
      reducedMotion: "reduce",
    });
    page.on("console", (message) => {
      if (message.type() === "error") {
        diagnostics.push({
          code: "BROWSER_CONSOLE_ERROR",
          severity: "error",
          message: message.text(),
        });
      }
    });
    page.on("pageerror", (error) => {
      diagnostics.push({
        code: "BROWSER_UNHANDLED_ERROR",
        severity: "error",
        message: error.message,
      });
    });
    page.on("requestfailed", (request) => {
      diagnostics.push({
        code: "RESOURCE_LOAD_FAILED",
        severity: "error",
        message: `${request.method()} ${request.url()}: ${request.failure()?.errorText ?? "unknown error"}`,
      });
    });

    await page.goto(options.url, { waitUntil: "networkidle" });
    await page.evaluate(() => {
      const runtime = (window as unknown as { __HPE__?: BrowserRuntime })
        .__HPE__;
      if (!runtime)
        throw new Error("HPE browser inspection port is not available");
      runtime.dispatch({ type: "SET_MODE", mode: "inspect" });
    });
    for (const slide of options.manifest.slides) {
      const states = Array.from(
        { length: (slide.maxStep ?? 0) + 1 },
        (_, index) => index,
      );
      for (const step of states) {
        await page.evaluate(
          ({ slideId, targetStep }) => {
            const runtime = (window as unknown as { __HPE__?: BrowserRuntime })
              .__HPE__;
            if (!runtime)
              throw new Error("HPE browser inspection port is not available");
            runtime.dispatch({ type: "GOTO", slideId });
            runtime.dispatch({ type: "SET_STEP", step: targetStep });
          },
          { slideId: slide.id, targetStep: step },
        );
        await page.waitForFunction(
          ({ slideId, targetStep }) =>
            document.querySelector<HTMLElement>("[data-hpe-slide]")?.dataset
              .slideId === slideId &&
            document.documentElement.dataset.hpeStep === String(targetStep),
          { slideId: slide.id, targetStep: step },
        );

        const issues = await page
          .locator("[data-hpe-slide]")
          .evaluate((root): GeometryIssue[] => {
            const slideBounds = root.getBoundingClientRect();
            return [...root.querySelectorAll<HTMLElement>("[data-node]")]
              .filter((node) => node.dataset.overflow !== "allow")
              .map((node) => ({ node, bounds: node.getBoundingClientRect() }))
              .filter(
                ({ bounds }) =>
                  bounds.left < slideBounds.left ||
                  bounds.top < slideBounds.top ||
                  bounds.right > slideBounds.right ||
                  bounds.bottom > slideBounds.bottom,
              )
              .map(({ node, bounds }) => ({
                nodeId: node.dataset.node ?? "unknown",
                bounds: {
                  x: bounds.x - slideBounds.x,
                  y: bounds.y - slideBounds.y,
                  width: bounds.width,
                  height: bounds.height,
                },
                slideBounds: {
                  width: slideBounds.width,
                  height: slideBounds.height,
                },
              }));
          });

        const screenshot = options.screenshots
          ? resolve(outputDir, `${slide.id}.step-${step}.png`)
          : undefined;
        if (screenshot)
          await page
            .locator("[data-hpe-slide]")
            .screenshot({ path: screenshot });
        for (const issue of issues) {
          diagnostics.push({
            code: "SLIDE_OVERFLOW",
            severity: "error",
            message: `Node ${issue.nodeId} extends outside the logical slide`,
            slideId: slide.id,
            nodeId: issue.nodeId,
            bounds: issue.bounds,
            slideBounds: issue.slideBounds,
            ...(screenshot ? { screenshot } : {}),
          });
        }
      }
    }
  } finally {
    await browser.close();
  }
  return createCheckReport(diagnostics);
}
