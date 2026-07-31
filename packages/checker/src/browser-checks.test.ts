import { mkdtemp, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { chromium } from "playwright";
import { describe, expect, it } from "vitest";

import { captureAnnotatedSlide } from "./artifacts.js";
import { runBrowserChecks } from "./browser-checks.js";

describe("browser diagnostics", () => {
  it("detects geometry, typography, contrast, media and overlap issues", async () => {
    const browser = await chromium.launch({ headless: true });
    try {
      const page = await browser.newPage({
        viewport: { width: 1400, height: 800 },
      });
      await page.setContent(`<!doctype html><style>body{margin:0}</style>
        <section data-hpe-slide style="position:relative;width:1280px;height:720px;overflow:hidden;background:rgb(0,0,0)">
          <h1 data-node="title" style="position:absolute;left:0;top:0;width:100px;height:18px;overflow:hidden;font-size:12px;color:rgb(10,10,10);white-space:nowrap">Clipped heading content</h1>
          <div data-node="outside" style="position:absolute;left:1270px;top:100px;width:100px;height:50px"></div>
          <div data-layout style="position:absolute;left:100px;top:200px;width:100px;height:100px"></div>
          <div data-layout data-node="overlap" style="position:absolute;left:150px;top:250px;width:100px;height:100px"></div>
          <img data-node="broken" src="data:image/png;base64,invalid" style="position:absolute;left:400px;top:200px;width:100px;height:100px">
        </section>`);
      const findings = await page
        .locator("[data-hpe-slide]")
        .evaluate(runBrowserChecks, {
          expectedWidth: 1280,
          expectedHeight: 720,
          minimumFontSize: 16,
          safeArea: 32,
        });
      const codes = findings.map((finding) => finding.code);
      expect(codes).toEqual(
        expect.arrayContaining([
          "SLIDE_SCROLL_OVERFLOW_X",
          "SLIDE_ELEMENT_OVERFLOW",
          "TEXT_CLIPPED",
          "FONT_SIZE_TOO_SMALL",
          "COLOR_CONTRAST_LOW",
          "IMAGE_DECODE_FAILED",
          "LAYOUT_OVERLAP",
        ]),
      );

      const directory = await mkdtemp(join(tmpdir(), "hpe-checker-"));
      const screenshot = join(directory, "annotated.png");
      await captureAnnotatedSlide(page, findings, screenshot, 32);
      expect((await stat(screenshot)).size).toBeGreaterThan(0);
      expect(await page.locator("[data-hpe-annotation]").count()).toBe(0);
    } finally {
      await browser.close();
    }
  });
});
