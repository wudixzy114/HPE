// 用真实浏览器以 file:// 协议验证离线包：加载、控制台报错、标题、翻页、快捷键。
// 用法：node scripts/verify-offline.mjs <offline-html> <deck-dir>
import { chromium } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import process from "node:process";

const [htmlArg, deckDirArg] = process.argv.slice(2);
if (!htmlArg || !deckDirArg) {
  throw new Error(
    "Usage: node scripts/verify-offline.mjs <offline-html> <deck-dir>",
  );
}

const html = resolve(htmlArg);
const manifest = JSON.parse(
  await readFile(resolve(deckDirArg, "deck.json"), "utf8"),
);
const firstSlide = manifest.slides[0];
const lastSlide = manifest.slides.at(-1);
// 取第 2 页正文里的一句独特文案，避免封面词与浏览器 UI 撞词
const secondSlideFile = resolve(deckDirArg, manifest.slides[1].file);
const secondSlideSource = await readFile(secondSlideFile, "utf8");
const titleMatch = secondSlideSource.match(/<h2[^>]*>([^<]{6,})<\/h2>/);
const probeText = titleMatch
  ? titleMatch[1].replace(/\s+/g, "").slice(0, 12)
  : manifest.slides[1].title.replace(/\s+/g, "").slice(0, 12);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });

const errors = [];
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
page.on("pageerror", (error) => errors.push(String(error)));

await page.goto(`file://${html}`);
await page.waitForSelector("#app *", { timeout: 15000 });
await page.waitForTimeout(1500);

const title = await page.title();
const bodyText = (await page.textContent("body")) || "";
const hasProbe = bodyText.replace(/\s+/g, "").includes(probeText);

// 1) 标题必须是 deck.json 的 title（防止打包错 deck）
if (title !== manifest.title) {
  errors.push(`title mismatch: expected "${manifest.title}", got "${title}"`);
}
// 2) 正文里能找到内容探针（防止渲染空白）
if (!hasProbe) {
  errors.push(`probe text not found in body: "${probeText}"`);
}

// 3) 翻页：一路按到最后一页，hash 应出现最后一页 id；Home 回到第一页。
// 每页有多个 step，按键次数按 (slides × steps) 上限放宽，间隔 15ms。
const hash = () => page.evaluate(() => window.location.hash);
const maxSteps = manifest.slides.reduce(
  (max, slide) => Math.max(max, slide.maxStep ?? 0),
  0,
);
const pressBudget = manifest.slides.length * (maxSteps + 2) + 10;
let reachedLast = false;
for (let i = 0; i < pressBudget; i++) {
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(15);
  if ((await hash()).startsWith(`#slide=${lastSlide.id}&`)) {
    reachedLast = true;
    break;
  }
}
if (!reachedLast) {
  errors.push(`never reached last slide ${lastSlide.id} via ArrowRight`);
}
await page.keyboard.press("Home");
await page.waitForTimeout(300);
if (!(await hash()).startsWith(`#slide=${firstSlide.id}&`)) {
  errors.push(`Home did not return to first slide ${firstSlide.id}`);
}

// 4) 总览 / 讲稿 / 演讲者视图不报错
for (const key of ["o", "o", "n", "n", "s", "s"]) {
  await page.keyboard.press(key);
  await page.waitForTimeout(200);
}

process.stdout.write(
  `${JSON.stringify(
    {
      ok: errors.length === 0,
      title,
      slides: manifest.slides.length,
      probe: probeText,
      reachedLastSlide: reachedLast,
      errors,
    },
    null,
    2,
  )}\n`,
);
await browser.close();
if (errors.length > 0) {
  process.exit(1);
}
