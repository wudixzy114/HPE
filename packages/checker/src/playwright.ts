import { mkdir } from "node:fs/promises";
import { relative, resolve } from "node:path";

import { chromium } from "playwright";

import type { DeckManifest, SourceLocation } from "@hpe/schema";

import {
  captureAnnotatedSlide,
  cleanupCheckArtifacts,
  createContactSheet,
  writeReportFiles,
} from "./artifacts.js";
import {
  runBrowserChecks,
  type BrowserCheckOptions,
} from "./browser-checks.js";
import {
  createCheckReport,
  type CheckArtifact,
  type CheckReport,
  type DeckDiagnostic,
} from "./index.js";

export interface PlaywrightCheckOptions {
  readonly url: string;
  readonly manifest: DeckManifest;
  readonly outputDir?: string;
  readonly screenshots?: boolean;
  readonly annotate?: boolean;
  readonly reports?: boolean;
  readonly minimumFontSize?: number;
  readonly safeArea?: number;
  readonly maxStates?: number;
  readonly slideIds?: readonly string[];
  readonly stateMode?: "all" | "default";
}

interface RuntimeScenario {
  readonly id: string;
  readonly values: Readonly<Record<string, string | number | boolean | null>>;
}

interface RuntimeSourceMap {
  readonly source: SourceLocation;
  readonly nodes: Readonly<Record<string, SourceLocation>>;
}

interface BrowserRuntime {
  dispatch(event: {
    type: string;
    slideId?: string;
    step?: number;
    mode?: "inspect";
  }): void;
  seekTimeline(timeMs: number): void;
  getSlideStateScenarios(): readonly RuntimeScenario[];
  setSlideStateScenario(values: RuntimeScenario["values"]): void;
  getSourceMap(): RuntimeSourceMap | undefined;
}

interface ActiveContext {
  readonly slideId: string;
  readonly stateId: string;
  readonly step: number;
  readonly timelineMs: number;
  readonly sourceMap?: RuntimeSourceMap;
}

function safeFilename(value: string): string {
  return (
    value.replaceAll(/[^a-zA-Z0-9._-]+/gu, "-").replaceAll(/^-|-$/gu, "") ||
    "state"
  );
}

function reportPath(absolutePath: string): string {
  return relative(process.cwd(), absolutePath).replaceAll("\\", "/");
}

function timelineCheckpoints(
  durationMs: number | undefined,
): readonly number[] {
  if (durationMs === undefined || durationMs === 0) return [0];
  return [...new Set([0, Math.round(durationMs / 2), durationMs])];
}

function contextFields(
  context: ActiveContext | undefined,
): Partial<DeckDiagnostic> {
  return context
    ? {
        slideId: context.slideId,
        stateId: context.stateId,
        step: context.step,
        timelineMs: context.timelineMs,
        ...(context.sourceMap === undefined
          ? {}
          : { source: context.sourceMap.source }),
      }
    : {};
}

export async function checkWithPlaywright(
  options: PlaywrightCheckOptions,
): Promise<CheckReport> {
  const outputDir = resolve(options.outputDir ?? "artifacts");
  const screenshots = options.screenshots ?? false;
  const annotate = options.annotate ?? screenshots;
  const reports = options.reports ?? true;
  const safeArea = options.safeArea ?? 32;
  const maximumStates = options.maxStates ?? 512;
  if (!Number.isInteger(maximumStates) || maximumStates < 1) {
    throw new Error("maxStates must be a positive integer");
  }
  await mkdir(outputDir, { recursive: true });
  await cleanupCheckArtifacts(outputDir);
  const selectedSlides =
    options.slideIds === undefined
      ? options.manifest.slides
      : options.manifest.slides.filter((slide) =>
          options.slideIds?.includes(slide.id),
        );
  if (selectedSlides.length === 0) {
    throw new Error("No slides matched the requested selection");
  }
  const missingSlides =
    options.slideIds?.filter(
      (slideId) =>
        !options.manifest.slides.some((slide) => slide.id === slideId),
    ) ?? [];
  if (missingSlides.length > 0) {
    throw new Error(`Unknown slide selection: ${missingSlides.join(", ")}`);
  }
  const diagnostics: DeckDiagnostic[] = [];
  const artifacts: CheckArtifact[] = [];
  const browser = await chromium.launch({ headless: true });
  let statesChecked = 0;
  let activeContext: ActiveContext | undefined;

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
          ...contextFields(activeContext),
        });
      }
    });
    page.on("pageerror", (error) => {
      diagnostics.push({
        code: "BROWSER_UNHANDLED_ERROR",
        severity: "error",
        message: error.message,
        ...contextFields(activeContext),
      });
    });
    page.on("requestfailed", (request) => {
      diagnostics.push({
        code: "RESOURCE_LOAD_FAILED",
        severity: "error",
        message: `${request.method()} ${request.url()}: ${
          request.failure()?.errorText ?? "unknown error"
        }`,
        ...contextFields(activeContext),
      });
    });

    await page.goto(options.url, { waitUntil: "networkidle" });
    await page.waitForFunction(() =>
      Boolean((window as unknown as { __HPE__?: BrowserRuntime }).__HPE__),
    );
    await page.evaluate(async () => {
      await document.fonts.ready;
      const runtime = (window as unknown as { __HPE__?: BrowserRuntime })
        .__HPE__;
      if (!runtime)
        throw new Error("HPE browser inspection port is not available");
      runtime.dispatch({ type: "SET_MODE", mode: "inspect" });
    });

    for (const slide of selectedSlides) {
      await page.evaluate((slideId) => {
        const runtime = (window as unknown as { __HPE__?: BrowserRuntime })
          .__HPE__;
        if (!runtime)
          throw new Error("HPE browser inspection port is not available");
        runtime.dispatch({ type: "GOTO", slideId });
      }, slide.id);
      await page.waitForFunction(
        (slideId) =>
          document.querySelector<HTMLElement>("[data-hpe-slide]")?.dataset
            .slideId === slideId,
        slide.id,
      );
      const runtimeData = await page.evaluate(() => {
        const runtime = (window as unknown as { __HPE__?: BrowserRuntime })
          .__HPE__;
        if (!runtime)
          throw new Error("HPE browser inspection port is not available");
        return {
          scenarios: runtime.getSlideStateScenarios(),
          sourceMap: runtime.getSourceMap(),
        };
      });
      const allScenarios =
        runtimeData.scenarios.length > 0
          ? runtimeData.scenarios
          : [{ id: "default", values: {} }];
      const allSteps = Array.from(
        { length: (slide.maxStep ?? 0) + 1 },
        (_, index) => index,
      );
      const allTimes = timelineCheckpoints(slide.durationMs);
      const scenarios =
        options.stateMode === "default"
          ? allScenarios.slice(0, 1)
          : allScenarios;
      const steps = options.stateMode === "default" ? [0] : allSteps;
      const times = options.stateMode === "default" ? [0] : allTimes;
      const stateCount = scenarios.length * steps.length * times.length;
      if (statesChecked + stateCount > maximumStates) {
        diagnostics.push({
          code: "STATE_SPACE_LIMIT_EXCEEDED",
          severity: "error",
          message: `Checking slide ${slide.id} would exceed the configured ${maximumStates} state limit`,
          slideId: slide.id,
          ...(runtimeData.sourceMap === undefined
            ? {}
            : { source: runtimeData.sourceMap.source }),
        });
        continue;
      }

      for (const step of steps) {
        for (const scenario of scenarios) {
          for (const timeMs of times) {
            const stateId = `step=${step}&state=${scenario.id}&time=${timeMs}`;
            activeContext = {
              slideId: slide.id,
              stateId,
              step,
              timelineMs: timeMs,
              ...(runtimeData.sourceMap === undefined
                ? {}
                : { sourceMap: runtimeData.sourceMap }),
            };
            await page.evaluate(
              ({ targetStep, targetTime, values }) => {
                const runtime = (
                  window as unknown as { __HPE__?: BrowserRuntime }
                ).__HPE__;
                if (!runtime)
                  throw new Error(
                    "HPE browser inspection port is not available",
                  );
                runtime.dispatch({ type: "SET_STEP", step: targetStep });
                runtime.setSlideStateScenario(values);
                runtime.seekTimeline(targetTime);
              },
              { targetStep: step, targetTime: timeMs, values: scenario.values },
            );
            await page.evaluate(
              () =>
                new Promise<void>((resolveFrame) => {
                  requestAnimationFrame(() =>
                    requestAnimationFrame(() => resolveFrame()),
                  );
                }),
            );

            const checkOptions: BrowserCheckOptions = {
              expectedWidth: options.manifest.size.width,
              expectedHeight: options.manifest.size.height,
              minimumFontSize: options.minimumFontSize ?? 16,
              safeArea,
            };
            const findings = await page
              .locator("[data-hpe-slide]")
              .first()
              .evaluate(runBrowserChecks, checkOptions);
            const stem = `${String(statesChecked + 1).padStart(4, "0")}-${safeFilename(
              slide.id,
            )}-${safeFilename(stateId)}`;
            let annotatedPath: string | undefined;
            if (screenshots) {
              const rawPath = resolve(outputDir, `${stem}.raw.png`);
              await page
                .locator("[data-hpe-slide]")
                .first()
                .screenshot({ path: rawPath });
              artifacts.push({
                type: "raw-screenshot",
                path: reportPath(rawPath),
                slideId: slide.id,
                stateId,
              });
              if (annotate) {
                annotatedPath = resolve(outputDir, `${stem}.annotated.png`);
                await captureAnnotatedSlide(
                  page,
                  findings,
                  annotatedPath,
                  safeArea,
                );
                artifacts.push({
                  type: "annotated-screenshot",
                  path: reportPath(annotatedPath),
                  slideId: slide.id,
                  stateId,
                });
              }
            }
            for (const finding of findings) {
              const mappedSource = finding.nodeId
                ? runtimeData.sourceMap?.nodes[finding.nodeId]
                : runtimeData.sourceMap?.source;
              diagnostics.push({
                ...finding,
                slideId: slide.id,
                stateId,
                step,
                timelineMs: timeMs,
                ...(mappedSource === undefined ? {} : { source: mappedSource }),
                ...(annotatedPath === undefined
                  ? {}
                  : { screenshot: reportPath(annotatedPath) }),
              });
            }
            statesChecked += 1;
          }
        }
      }
    }

    const annotatedScreenshots = artifacts.filter(
      (artifact) => artifact.type === "annotated-screenshot",
    );
    if (annotatedScreenshots.length > 0) {
      const contactSheetPath = resolve(outputDir, "contact-sheet.png");
      await createContactSheet(browser, annotatedScreenshots, contactSheetPath);
      artifacts.push({
        type: "contact-sheet",
        path: reportPath(contactSheetPath),
      });
    }

    const jsonPath = resolve(outputDir, "report.json");
    const htmlPath = resolve(outputDir, "report.html");
    if (reports) {
      artifacts.push({ type: "json-report", path: reportPath(jsonPath) });
      artifacts.push({ type: "html-report", path: reportPath(htmlPath) });
    }
    const report = createCheckReport(diagnostics, { statesChecked, artifacts });
    if (reports) await writeReportFiles(report, jsonPath, htmlPath);
    return report;
  } finally {
    await browser.close();
  }
}
