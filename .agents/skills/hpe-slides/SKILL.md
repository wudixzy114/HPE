---
name: hpe-slides
description: Create, migrate, edit, theme, and verify HPE HTML presentations made from Vue `.slide.vue` files. Use when an agent needs to build a deck, add or reorganize slides, port an HTML/PPT-style presentation, create an HPE theme, preserve speaker notes or interactions, diagnose visual defects, or produce screenshots/static HTML/print output from an HPE repository.
---

# HPE Slides

Author in standard Vue, TypeScript, and CSS. Do not invent a slide DSL, JSON layout language, SVG page generator, or string-built Tailwind classes.

## Route the task

- Create or edit slides: read [references/authoring.md](references/authoring.md).
- Create/select a theme: read [references/themes.md](references/themes.md).
- Migrate HTML or another deck: read [references/migration.md](references/migration.md), then also read the authoring and theme references.

## Required workflow

1. Locate `deck.json`, read the active theme module, and run `npm exec -- deck list --json`.
2. Preserve the manifest's stable IDs. Use CLI graph operations instead of editing imports:
   - `deck slide create/move/rename/delete`
   - `deck notes get/set`
3. Write each page as a normal `.slide.vue` SFC. Prefer static template markup; add `<script setup lang="ts">` only for real interaction.
4. Give important layout objects unique `data-node` identifiers.
5. Express reveals with `<Step>`, deterministic time with `<Timeline>`, and inspectable interaction with `useSlideState`.
6. Run `npm exec -- deck validate --json` after structural edits.
7. Inspect every changed state with `deck screenshot --slide <ids> --states all --annotate --json`.
8. Open the contact sheet/raw images and fix actual rendering defects. Repeat until the report has zero errors; do not silence a defect with allow markers unless the overflow/contrast is intentional and documented.
9. Run `npm run check` before handoff. Run `npm run verify` for engine/theme/package changes.

## Non-negotiable rules

- Keep text complete. Rewrite or split content; never truncate with `...` to make it fit.
- Keep same-level typography consistent. Do not shrink one heading independently.
- Do not use arbitrary timers for authored animation. Timeline state must be seekable by the checker.
- Do not hide interactive state from inspection. Every finite choice must appear in `inspect`.
- Do not put editing UI, selection state, or temporary guides into deck files.
- Do not copy unlicensed online themes. Reuse design principles; create owned CSS/Vue assets.
- Do not claim visual completion from a green build alone. Review rendered artifacts.

## Minimal slide

```vue
<template>
  <Slide>
    <h1 data-node="title">A conclusion, not a topic label</h1>
    <div data-node="evidence" class="grid grid-cols-2 gap-6">...</div>
  </Slide>
</template>

<notes lang="md">
Explain the evidence and the intended transition to the next page.
</notes>
```

Use [assets/theme-starter](assets/theme-starter) as a starting point only when creating a new theme. Copy it into the deck's `themes/<slug>/`, then replace every placeholder and render a preview.
