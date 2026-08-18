import { readFile, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import process from "node:process";

const [inputPath, outputPath] = process.argv.slice(2);

if (!inputPath || !outputPath) {
  throw new Error(
    "Usage: node scripts/inline-share-html.mjs <input-index.html> <output.html>",
  );
}

const inputFile = resolve(inputPath);
const outputFile = resolve(outputPath);
const outputDirectory = dirname(inputFile);
const html = await readFile(inputFile, "utf8");
const scriptMatch = html.match(
  /<script[^>]*\ssrc=["']([^"']+)["'][^>]*><\/script>/,
);
const stylesheetMatch = html.match(
  /<link[^>]*\srel=["']stylesheet["'][^>]*\shref=["']([^"']+)["'][^>]*>/,
);

if (!scriptMatch || !stylesheetMatch) {
  throw new Error(
    `Could not find app script and stylesheet in ${basename(inputFile)}`,
  );
}

const [scriptTag, scriptPath] = scriptMatch;
const [stylesheetTag, stylesheetPath] = stylesheetMatch;
const [script, stylesheet] = await Promise.all([
  readFile(resolve(outputDirectory, scriptPath), "utf8"),
  readFile(resolve(outputDirectory, stylesheetPath), "utf8"),
]);

const inlineScript = `<script>\n${script.replaceAll("</script", "<\\/script")}\n</script>`;
const standaloneHtml = html
  .replace(stylesheetTag, () => `<style>\n${stylesheet}\n</style>`)
  .replace(scriptTag, "")
  .replace("</body>", () => `  ${inlineScript}\n  </body>`);

await writeFile(outputFile, standaloneHtml, "utf8");
