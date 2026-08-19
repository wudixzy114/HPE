// 一次性生成 tests/fixtures/e2e-deck：12 页确定性 deck，供 e2e 播放器断言使用。
import { mkdirSync, writeFileSync } from "node:fs";

const dir = new URL("../fixtures/e2e-deck", import.meta.url).pathname;
mkdirSync(`${dir}/slides`, { recursive: true });
mkdirSync(`${dir}/themes/e2e-suite`, { recursive: true });

const N = 12;
const slides = [];
for (let i = 0; i < N; i++) {
  const id = `slide-${String(i).padStart(2, "0")}`;
  let body;
  let script = "";
  let button = "";
  if (i === 0) {
    body = '<h1 data-node="title">E2E Deck Cover</h1>';
  } else if (i === 5) {
    body = [
      '<h1 data-node="title">Interactive State</h1>',
      '<Step :at="1"><p>Step one revealed</p></Step>',
      '<Step :at="2"><p>Step two revealed</p></Step>',
    ].join("\n    ");
    script = [
      "",
      '<script setup lang="ts">',
      'import { useSlideState } from "@hpe/renderer-vue/slide-state";',
      "",
      'const demoStep = useSlideState("demo-step", { initial: 0, inspect: [0, 1, 2] });',
      "function nextStep() {",
      "  demoStep.value = Math.min(demoStep.value + 1, 2);",
      "}",
      "</script>",
      "",
    ].join("\n");
    button =
      '<button type="button" class="e2e-next" @click="nextStep()">Next step</button>';
  } else if (i === 10) {
    body =
      '<h1 data-node="title">Inspector</h1><p data-node="body">Inspect mode target</p>';
  } else {
    body = `<h1 data-node="title">Page ${i}</h1><p data-node="body">Deterministic body ${i}</p>`;
  }
  const notes =
    i === 5 ? "E2E notes: interactive sync target." : `Notes for page ${i}.`;
  const content = `<template>
  <Slide class="e2e-slide">
    ${body}
    ${button}
  </Slide>
</template>
${script}<notes lang="md">
${notes}
</notes>
`;
  writeFileSync(`${dir}/slides/${id}.slide.vue`, content);
  const entry = { id, file: `slides/${id}.slide.vue`, title: `Page ${i}` };
  if (i === 5) entry.maxStep = 2;
  slides.push(entry);
}

const manifest = {
  $schema: "../../../packages/schema/src/deck.schema.json",
  schemaVersion: 1,
  id: "e2e-suite",
  title: "E2E Suite Deck",
  size: { width: 1600, height: 900 },
  theme: { entry: "themes/e2e-suite/theme.ts" },
  slides,
};
writeFileSync(`${dir}/deck.json`, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`deck written: ${N} slides`);
