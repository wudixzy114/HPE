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
  ).toBe("claude-code-architecture");
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

test("deep links, keyboard navigation and overview preserve a 50-slide deck", async ({
  page,
}) => {
  await page.goto("/#slide=slide-00&step=0&mode=present");
  await expect(
    page.locator("[data-hpe-slide][data-slide-id=slide-00]"),
  ).toBeVisible();
  await expect(page).toHaveTitle("Claude Code 的五块拼图");

  await page.keyboard.press("ArrowRight");
  await expect
    .poll(() => page.evaluate(() => window.__HPE__.getState().slideId))
    .toBe("slide-01");
  await expect(page).toHaveURL(/#slide=slide-01&step=0&mode=present$/u);

  await page.keyboard.press("o");
  await expect(page.locator(".hpe-overview")).toBeVisible();
  await expect(page.locator(".hpe-overview__slide")).toHaveCount(50);
  expect(await page.evaluate(() => window.__HPE__.getState().slideId)).toBe(
    "slide-01",
  );

  await page
    .getByRole("button", {
      name: /Go to slide 3: 五个入口怎么汇到一套核心/u,
    })
    .click();
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

  await page.getByRole("button", { name: "下一步 ▶" }).click();
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
    "全场地基",
  );
  await expect(speaker.locator(".hpe-speaker__next")).toContainText(
    "queryLoop",
  );
  await speaker.close();
});

test("notes, spotlight, Home and End preserve the legacy presentation affordances", async ({
  page,
}) => {
  await page.goto("/#slide=slide-05&step=0&mode=present");
  await page.keyboard.press("n");
  await expect(page.locator(".hpe-notes-overlay")).toContainText("全场地基");
  await page.keyboard.press("h");
  await page.mouse.move(500, 300);
  await expect(page.locator(".hpe-spotlight")).toBeVisible();

  await page.keyboard.press("End");
  await expect
    .poll(() => page.evaluate(() => window.__HPE__.getState().slideId))
    .toBe("slide-49");
  await page.keyboard.press("Home");
  await expect
    .poll(() => page.evaluate(() => window.__HPE__.getState().slideId))
    .toBe("slide-00");
});

test("source mapping and manifest-sized printing cover every migrated slide", async ({
  page,
}) => {
  await page.goto("/#slide=slide-25&step=0&mode=inspect");
  await expect(
    page.getByRole("heading", { name: /后台分类器/u }),
  ).toBeVisible();
  const mapping = await page.evaluate(() => window.__HPE__.getSourceMap());
  expect(mapping?.nodes.title).toEqual({
    file: "slides/slide-25.slide.vue",
    line: 7,
    column: 9,
  });

  await page.evaluate(() => window.__HPE__.preparePrint());
  const pdf = await page.pdf({
    printBackground: true,
    preferCSSPageSize: true,
  });
  const pageObjects = pdf.toString("latin1").match(/\/Type\s*\/Page\b/gu) ?? [];
  expect(pageObjects).toHaveLength(50);
});
