import { expect, test } from "@playwright/test";

interface InspectionPort {
  getState(): { slideId: string; step: number; mode: string };
  getTimelineState(): { timeMs: number; playing: boolean };
  getSlideState(): {
    slideId: string;
    values: Readonly<Record<string, string | number | boolean | null>>;
  };
  getSourceMap():
    | {
        source: { file: string; line: number; column: number };
        nodes: Readonly<
          Record<string, { file: string; line: number; column: number }>
        >;
      }
    | undefined;
  seekTimeline(timeMs: number): void;
  dispatch(event: { type: string; slideId?: string; step?: number }): void;
}

declare global {
  interface Window {
    __HPE__: InspectionPort;
  }
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("deep links, keyboard navigation and overview preserve deterministic state", async ({
  page,
}) => {
  await page.goto("/#slide=intro&step=0&mode=present");
  await expect(
    page.locator("[data-hpe-slide][data-slide-id=intro]"),
  ).toBeVisible();

  await page.keyboard.press("ArrowRight");
  await expect
    .poll(() => page.evaluate(() => window.__HPE__.getState().step))
    .toBe(1);
  await expect(page).toHaveURL(/#slide=intro&step=1&mode=present$/u);

  await page.keyboard.press("o");
  await expect(page.locator(".hpe-overview")).toBeVisible();
  await expect(page.locator(".hpe-overview__slide")).toHaveCount(3);
  expect(await page.evaluate(() => window.__HPE__.getState().slideId)).toBe(
    "intro",
  );

  await page
    .getByRole("button", { name: "Go to slide 2: Architecture" })
    .click();
  await expect(
    page.locator("[data-hpe-slide][data-slide-id=architecture]"),
  ).toBeVisible();
  await expect(page).toHaveURL(/#slide=architecture&step=0&mode=present$/u);
});

test("speaker view synchronizes navigation, timeline and declared interaction state", async ({
  context,
  page,
}) => {
  await page.goto("/#slide=intro&step=0&mode=present");
  const speaker = await context.newPage();
  await speaker.goto("/#slide=intro&step=0&mode=speaker");
  await expect(speaker.locator(".hpe-speaker")).toBeVisible();

  await page.evaluate(() => window.__HPE__.seekTimeline(600));
  await expect
    .poll(() =>
      speaker.evaluate(() => window.__HPE__.getTimelineState().timeMs),
    )
    .toBe(600);

  await page.keyboard.press("ArrowRight");
  await expect
    .poll(() => speaker.evaluate(() => window.__HPE__.getState().step))
    .toBe(1);
  expect(await speaker.evaluate(() => window.__HPE__.getState().mode)).toBe(
    "speaker",
  );
  await expect(speaker.locator(".hpe-speaker__notes pre")).toContainText(
    "notes extraction",
  );

  await page.evaluate(() =>
    window.__HPE__.dispatch({ type: "GOTO", slideId: "architecture" }),
  );
  await page.getByRole("button", { name: /Tools/u }).click();
  await expect
    .poll(() =>
      speaker.evaluate(() => window.__HPE__.getSlideState().values.focus),
    )
    .toBe("tools");
  await speaker.close();
});

test("compile-time code, source mapping and printable pages are present", async ({
  page,
}) => {
  await page.goto("/#slide=code&step=0&mode=inspect");
  await expect(page.locator(".hpe-shiki .shiki")).toBeVisible();
  const mapping = await page.evaluate(() => window.__HPE__.getSourceMap());
  expect(mapping?.nodes.code).toEqual({
    file: "slides/code.slide.vue",
    line: 9,
    column: 9,
  });

  const pdf = await page.pdf({
    printBackground: true,
    preferCSSPageSize: true,
  });
  const pageObjects = pdf.toString("latin1").match(/\/Type\s*\/Page\b/gu) ?? [];
  expect(pageObjects).toHaveLength(3);
});
