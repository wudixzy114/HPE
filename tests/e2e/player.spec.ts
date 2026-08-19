import { expect, test } from "@playwright/test";

interface InspectionPort {
  getState(): { slideId: string; step: number; mode: string };
  getSlideState(): {
    slideId: string;
    values: Readonly<Record<string, string | number | boolean | null>>;
  };
  getSourceMap(): Promise<
    | {
        source: { file: string; line: number; column: number };
        nodes: Readonly<
          Record<string, { file: string; line: number; column: number }>
        >;
      }
    | undefined
  >;
  dispatch(event: { type: string; slideId?: string; step?: number }): void;
  preparePrint(): Promise<void>;
}

declare global {
  interface Window {
    __HPE__: InspectionPort;
  }
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("loads the active slide plus two forward slides and defers notes/source maps", async ({
  page,
}) => {
  const scripts: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "script") scripts.push(request.url());
  });
  await page.goto("/#slide=slide-00&step=0&mode=present");
  await expect(
    page.locator("[data-hpe-slide][data-slide-id=slide-00]"),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.dataset.hpeTheme),
  ).toBe("e2e-suite");
  await expect
    .poll(() =>
      scripts
        .filter((url) => /slide-\d+\.slide-/u.test(url))
        .map((url) => url.match(/slide-(\d+)\.slide-/u)?.[1])
        .filter(Boolean)
        .sort(),
    )
    .toEqual(["00", "01", "02"]);
  expect(scripts.some((url) => /slide-03\.slide-/u.test(url))).toBe(false);
  expect(scripts.some((url) => /notes-|sources-/u.test(url))).toBe(false);

  await page.keyboard.press("n");
  await expect(page.locator(".hpe-notes-overlay")).toBeVisible();
  await expect
    .poll(() => scripts.some((url) => /notes-/u.test(url)))
    .toBe(true);
  expect(scripts.some((url) => /sources-/u.test(url))).toBe(false);
});

test("keeps the previous slide visible while an unprefetched slide chunk loads", async ({
  page,
}) => {
  await page.route("**/slide-10.slide-*.js", async (route) => {
    await page.waitForTimeout(700);
    await route.continue();
  });
  await page.goto("/#slide=slide-00&step=0&mode=present");
  await expect(
    page.locator("[data-hpe-slide][data-slide-id=slide-00]"),
  ).toBeVisible();

  await page.evaluate(() =>
    window.__HPE__.dispatch({ type: "GOTO", slideId: "slide-10" }),
  );
  await page.waitForTimeout(250);
  await expect(
    page.locator("[data-hpe-slide][data-slide-id=slide-00]"),
  ).toBeVisible();
  await expect(page.locator(".hpe-stage")).toHaveAttribute("aria-busy", "true");
  await expect(page.locator("[data-hpe-slide]")).toHaveCount(1);

  await expect(
    page.locator("[data-hpe-slide][data-slide-id=slide-10]"),
  ).toBeVisible();
  await expect(page.locator(".hpe-stage")).toHaveAttribute(
    "aria-busy",
    "false",
  );
});

test("switches prefetched slides through painted buffers without animation", async ({
  page,
}) => {
  await page.goto("/#slide=slide-00&step=0&mode=present");
  await expect(
    page.locator(".hpe-slide-layer--active [data-slide-id=slide-00]"),
  ).toBeVisible();

  await page.evaluate(() =>
    window.__HPE__.dispatch({ type: "GOTO", slideId: "slide-01" }),
  );
  await expect(
    page.locator(".hpe-slide-layer--active [data-slide-id=slide-01]"),
  ).toBeVisible();
  await expect(
    page.locator(".hpe-slide-layer:not(.hpe-slide-layer--active)"),
  ).toHaveAttribute("aria-hidden", "true");
  expect(
    await page
      .locator(".hpe-slide-layer")
      .evaluateAll((layers) =>
        layers.every(
          (layer) => getComputedStyle(layer).transitionDuration === "0s",
        ),
      ),
  ).toBe(true);
});

test("ignores a stale slide chunk after rapid navigation", async ({ page }) => {
  await page.route("**/slide-10.slide-*.js", async (route) => {
    await page.waitForTimeout(700);
    await route.continue();
  });
  await page.goto("/#slide=slide-00&step=0&mode=present");
  await expect(
    page.locator("[data-hpe-slide][data-slide-id=slide-00]"),
  ).toBeVisible();

  await page.evaluate(() => {
    window.__HPE__.dispatch({ type: "GOTO", slideId: "slide-10" });
    window.__HPE__.dispatch({ type: "GOTO", slideId: "slide-11" });
  });
  await expect(
    page.locator("[data-hpe-slide][data-slide-id=slide-11]"),
  ).toBeVisible();
  await page.waitForTimeout(800);
  await expect(
    page.locator("[data-hpe-slide][data-slide-id=slide-11]"),
  ).toBeVisible();
  await expect(
    page.locator("[data-hpe-slide][data-slide-id=slide-10]"),
  ).toHaveCount(0);
});

test("deep links, keyboard navigation and overview preserve the deck", async ({
  page,
}) => {
  await page.goto("/#slide=slide-00&step=0&mode=present");
  await expect(
    page.locator("[data-hpe-slide][data-slide-id=slide-00]"),
  ).toBeVisible();
  await expect(page).toHaveTitle("E2E Suite Deck");

  await page.keyboard.press("ArrowRight");
  await expect
    .poll(() => page.evaluate(() => window.__HPE__.getState().slideId))
    .toBe("slide-01");
  await expect(page).toHaveURL(/#slide=slide-01&step=0&mode=present$/u);

  await page.keyboard.press("o");
  await expect(page.locator(".hpe-overview")).toBeVisible();
  await expect(page.locator(".hpe-overview__slide")).toHaveCount(12);
  expect(await page.evaluate(() => window.__HPE__.getState().slideId)).toBe(
    "slide-01",
  );

  await page.getByRole("button", { name: /Go to slide 3: Page 2/u }).click();
  await expect(
    page.locator("[data-hpe-slide][data-slide-id=slide-02]"),
  ).toBeVisible();
});

test("speaker view synchronizes interactive Vue state while preserving its local mode", async ({
  context,
  page,
}) => {
  await page.goto("/#slide=slide-05&step=0&mode=present");
  const speaker = await context.newPage();
  await speaker.goto("/#slide=slide-05&step=0&mode=speaker");
  await expect(speaker.locator(".hpe-speaker")).toBeVisible();

  await page.getByRole("button", { name: "Next step" }).click();
  await expect
    .poll(() =>
      speaker.evaluate(
        () => window.__HPE__.getSlideState().values["demo-step"],
      ),
    )
    .toBe(1);
  expect(await speaker.evaluate(() => window.__HPE__.getState().mode)).toBe(
    "speaker",
  );
  await expect(speaker.locator(".hpe-speaker__notes pre")).toContainText(
    "interactive sync target",
  );
  await expect(speaker.locator(".hpe-speaker__next")).toContainText("Page 6");
  await speaker.close();
});

test("toolbar collapses until hovered and the pen annotates then clears on navigation", async ({
  page,
}) => {
  await page.goto("/#slide=slide-05&step=0&mode=present");
  const toolbar = page.locator(".hpe-toolbar");
  const toolbarActions = page.locator(".hpe-toolbar__actions");
  await expect(page.locator(".hpe-annotation-dock")).toBeVisible();
  await expect(toolbarActions).toHaveCSS("visibility", "hidden");
  await toolbar.hover();
  await expect(toolbarActions).toHaveCSS("visibility", "visible");

  await page.keyboard.press("n");
  await expect(page.locator(".hpe-notes-overlay")).toContainText(
    "interactive sync target",
  );
  await page.keyboard.press("n");

  await page.keyboard.press("p");
  const annotationCanvas = page.locator(".hpe-annotation-canvas");
  await expect(annotationCanvas).toHaveClass(/hpe-annotation-canvas--active/u);
  await expect(page.locator("html")).toHaveAttribute(
    "data-hpe-annotation-tool",
    "pen",
  );
  await expect(page.locator(".hpe-stage")).toHaveCSS("cursor", "none");
  const bounds = await annotationCanvas.boundingBox();
  expect(bounds).not.toBeNull();
  if (!bounds) throw new Error("Annotation canvas has no bounds");
  await page.mouse.move(bounds.x + 200, bounds.y + 200);
  const annotationCursor = page.locator(".hpe-annotation-cursor");
  await expect(annotationCursor).toBeVisible();
  await expect(annotationCursor).toHaveClass(/hpe-annotation-cursor--pen/u);
  await page.mouse.down();
  await page.mouse.move(bounds.x + 420, bounds.y + 280, { steps: 12 });
  await page.mouse.up();
  expect(
    await annotationCanvas.evaluate((canvas: HTMLCanvasElement) => {
      const context = canvas.getContext("2d");
      if (!context) return 0;
      const pixels = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      ).data;
      let painted = 0;
      for (let index = 3; index < pixels.length; index += 4) {
        if (pixels[index] !== 0) painted += 1;
      }
      return painted;
    }),
  ).toBeGreaterThan(0);

  await page.keyboard.press("h");
  await expect(page.locator("html")).toHaveAttribute(
    "data-hpe-annotation-tool",
    "highlighter",
  );
  await page.keyboard.press("c");
  await page.mouse.move(bounds.x + 260, bounds.y + 320);
  await expect(annotationCursor).toBeVisible();
  await expect(annotationCursor).toHaveClass(
    /hpe-annotation-cursor--highlighter/u,
  );
  await expect(annotationCursor).toHaveCSS("width", "34px");
  await page.mouse.down();
  await page.mouse.move(bounds.x + 620, bounds.y + 320, { steps: 18 });
  await page.mouse.up();
  const medianAlpha = await annotationCanvas.evaluate(
    (canvas: HTMLCanvasElement) => {
      const context = canvas.getContext("2d");
      if (!context) return 0;
      const pixels = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      ).data;
      const painted: number[] = [];
      for (let index = 3; index < pixels.length; index += 4) {
        const alpha = pixels[index] ?? 0;
        if (alpha > 0) painted.push(alpha);
      }
      painted.sort((left, right) => left - right);
      return painted[Math.floor(painted.length / 2)] ?? 0;
    },
  );
  expect(medianAlpha).toBeGreaterThan(40);
  expect(medianAlpha).toBeLessThan(150);
  const alphaSamples = await annotationCanvas.evaluate(
    (canvas: HTMLCanvasElement, offsets) => {
      const context = canvas.getContext("2d");
      if (!context) return [];
      const bounds = canvas.getBoundingClientRect();
      const y = Math.round((offsets.y / bounds.height) * canvas.height);
      return Array.from({ length: 9 }, (_, index) => {
        const offsetX =
          offsets.startX + ((offsets.endX - offsets.startX) * (index + 1)) / 10;
        const x = Math.round((offsetX / bounds.width) * canvas.width);
        return context.getImageData(x, y, 1, 1).data[3] ?? 0;
      });
    },
    { startX: 260, endX: 620, y: 320 },
  );
  expect(Math.min(...alphaSamples)).toBeGreaterThan(40);
  expect(
    Math.max(...alphaSamples) - Math.min(...alphaSamples),
  ).toBeLessThanOrEqual(1);
  await page.keyboard.press("Escape");
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-hpe-annotation-active",
  );
  await page.keyboard.press("h");

  await page.keyboard.press("End");
  await expect
    .poll(() => page.evaluate(() => window.__HPE__.getState().slideId))
    .toBe("slide-11");
  await expect
    .poll(() =>
      annotationCanvas.evaluate((canvas: HTMLCanvasElement) => {
        const context = canvas.getContext("2d");
        if (!context) return false;
        return context
          .getImageData(0, 0, canvas.width, canvas.height)
          .data.every((channel) => channel === 0);
      }),
    )
    .toBe(true);
  await page.keyboard.press("Home");
  await expect
    .poll(() => page.evaluate(() => window.__HPE__.getState().slideId))
    .toBe("slide-00");
});

test("source mapping and manifest-sized printing cover every slide", async ({
  page,
}) => {
  await page.goto("/#slide=slide-10&step=0&mode=inspect");
  await expect(page.getByRole("heading", { name: /Inspector/u })).toBeVisible();
  const mapping = await page.evaluate(() => window.__HPE__.getSourceMap());
  expect(mapping?.nodes.title).toEqual({
    file: "slides/slide-10.slide.vue",
    line: 3,
    column: 9,
  });

  await page.evaluate(() => window.__HPE__.preparePrint());
  const pdf = await page.pdf({
    printBackground: true,
    preferCSSPageSize: true,
  });
  const pageObjects = pdf.toString("latin1").match(/\/Type\s*\/Page\b/gu) ?? [];
  expect(pageObjects).toHaveLength(12);
});
