// 将指定 deck 打包为可分享的单文件离线 HTML：
// 1. 用单 chunk 的 vite 配置构建（关闭 code splitting 与 sourcemap）
// 2. 校验产物只有一个 JS chunk（多了说明 code splitting 没关掉）
// 3. 把 JS/CSS 内联进 index.html，规避 file:// 下 ES module 的 CORS 限制
// 4. 用 deck.json 的 title 替换占位 <title>，防止发出去的包显示错误标题
//
// 用法：node scripts/package-offline.mjs <deck-dir> <output-html>
// 例如：node scripts/package-offline.mjs presentations/hello-hpe artifacts/releases/hello-hpe/hello-hpe.html
import { spawnSync } from "node:child_process";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import process from "node:process";

const repoRoot = resolve(dirname(new URL(import.meta.url).pathname), "..");
const [deckDirArg, outputArg] = process.argv.slice(2);

if (!deckDirArg || !outputArg) {
  throw new Error(
    "Usage: node scripts/package-offline.mjs <deck-dir> <output-html>",
  );
}

const deckRoot = resolve(repoRoot, deckDirArg);
const outHtml = resolve(repoRoot, outputArg);
const outDir = dirname(outHtml);
const distDir = resolve(repoRoot, "app/dist-offline");

process.chdir(repoRoot);

function run(command, args, env = {}) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} failed with ${result.status}`,
    );
  }
}

// 0. 从 deck.json 读取标题与页数，作为后续断言的地面真值
const manifest = JSON.parse(
  await readFile(resolve(deckRoot, "deck.json"), "utf8"),
);
const slideCount = manifest.slides.length;

// 1. 单 chunk 构建（deck root 通过环境变量钉死，防止打包到别的 deck）
run(
  "npx",
  [
    "vite",
    "build",
    "--config",
    "scripts/vite.offline.config.ts",
    "--outDir",
    "dist-offline",
  ],
  { HPE_DECK_ROOT: deckRoot },
);

// 2. 校验产物只有一个 JS chunk
const assets = await readdir(resolve(distDir, "assets"));
const jsFiles = assets.filter((file) => file.endsWith(".js"));
if (jsFiles.length !== 1) {
  throw new Error(
    `Expected exactly 1 JS chunk, got ${jsFiles.length}: ${jsFiles.join(", ")}`,
  );
}

// 3. 内联 JS 与 CSS
const html = await readFile(resolve(distDir, "index.html"), "utf8");
const scriptMatch = html.match(
  /<script[^>]*\ssrc=["']([^"']+)["'][^>]*><\/script>/,
);
const stylesheetMatch = html.match(
  /<link[^>]*\srel=["']stylesheet["'][^>]*\shref=["']([^"']+)["'][^>]*>/,
);
if (!scriptMatch || !stylesheetMatch) {
  throw new Error(
    "Could not find script/stylesheet references in dist-offline/index.html",
  );
}
const [scriptTag, scriptPath] = scriptMatch;
const [stylesheetTag, stylesheetPath] = stylesheetMatch;
const [script, stylesheet] = await Promise.all([
  readFile(resolve(distDir, scriptPath.replace(/^\//, "")), "utf8"),
  readFile(resolve(distDir, stylesheetPath.replace(/^\//, "")), "utf8"),
]);
// type="module" 让残留的 import.meta 合法；模块内联后无网络请求，
// 不触发 file:// 的 CORS 限制。
const inlineScript = `<script type="module">\n${script.replaceAll("</script", "<\\/script")}\n</script>`;
let standalone = html
  .replace(stylesheetTag, () => `<style>\n${stylesheet}\n</style>`)
  .replace(scriptTag, "")
  .replace("</body>", () => `  ${inlineScript}\n  </body>`);

// 4. 替换占位标题
standalone = standalone.replace(
  /<title>[^<]*<\/title>/,
  `<title>${manifest.title}</title>`,
);
if (!standalone.includes(`<title>${manifest.title}</title>`)) {
  throw new Error("Failed to set deck title in standalone HTML");
}

// 5. 输出到发布目录
await rm(distDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });
await writeFile(outHtml, standalone, "utf8");
console.log(
  `Wrote ${outHtml} (${(standalone.length / 1024).toFixed(0)} KB, deck "${manifest.title}", ${slideCount} slides)`,
);
