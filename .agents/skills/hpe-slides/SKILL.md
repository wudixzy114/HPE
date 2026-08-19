---
name: hpe-slides
description: Create, migrate, edit, theme, verify, and release HPE HTML presentations and the HPE runtime shell. Use when an agent needs to build or reorganize a Vue `.slide.vue` deck, port HTML/PPT-style content, create a theme, preserve notes or interactions, diagnose visual defects, produce screenshots/static HTML/print/offline output, or audit and package a runtime-only HPE source release without bundled decks.
---

# HPE Slides

Author in standard Vue, TypeScript, and CSS. Do not invent a slide DSL, JSON layout language, SVG page generator, or string-built Tailwind classes.

## Route the task

- Create or edit slides: read [references/authoring.md](references/authoring.md).
- Create/select a theme: read [references/themes.md](references/themes.md).
- Migrate HTML or another deck: read [references/migration.md](references/migration.md), then also read the authoring and theme references.
- Package a deck as a single offline HTML file for sharing: read [references/offline-packaging.md](references/offline-packaging.md).
- Audit or package the runtime shell without repository decks: read [references/runtime-release.md](references/runtime-release.md).

## Locate the deck first

A repository may contain several decks (`app/`, `presentations/<slug>/`). For deck work, every CLI command accepts `--root <deck-dir>` and Vite builds read `HPE_DECK_ROOT`. Confirm which deck you are editing before running anything:

```bash
npm run deck -- list --json --root presentations/<slug>
```

The returned `deckId`, `title`, and slide count must match the deck you intend to edit. If they do not, you are pointing at the wrong root — stop and fix the flag instead of editing files.

For a runtime-only release, work from the repository root instead and do not select, copy, or package a repository deck.

## Required workflow

1. Locate `deck.json` (see above), read the active theme module, and run `npm run deck -- list --json --root <deck-dir>`.
2. Preserve the manifest's stable IDs. Use CLI graph operations instead of editing imports:
   - `deck slide create/move/rename/delete`
   - `deck notes get/set`
3. Write each page as a normal `.slide.vue` SFC. Prefer static template markup; add `<script setup lang="ts">` only for real interaction.
4. Give important layout objects unique `data-node` identifiers.
5. Express reveals with `<Step>`, deterministic time with `<Timeline>`, and inspectable interaction with `useSlideState`.
6. Run `npm run deck -- validate --json --root <deck-dir>` after structural edits.
7. Inspect every changed state with `deck screenshot --slide <ids> --states all --annotate --json --root <deck-dir>`.
8. Open the contact sheet/raw images and fix actual rendering defects. Repeat until the report has zero errors; do not silence a defect with allow markers unless the overflow/contrast is intentional and documented.
9. Run `npm run check` before handoff. Run `npm run verify` for engine/theme/package changes.

For a runtime-only release, follow the separate release reference. Its extracted-archive verification replaces slide screenshot review; do not package or visually re-review repository decks unless the user also asked for deck changes.

## Non-negotiable rules

- Keep text complete. Rewrite or split content; never truncate with `...` to make it fit.
- Keep same-level typography consistent. Do not shrink one heading independently.
- Do not use arbitrary timers for authored animation. Timeline state must be seekable by the checker.
- Do not hide interactive state from inspection. Every finite choice must appear in `inspect`.
- Do not put editing UI, selection state, or temporary guides into deck files.
- Do not copy unlicensed online themes. Reuse design principles; create owned CSS/Vue assets.
- Do not claim visual completion from a green build alone. Review rendered artifacts.
- Do not trust a build whose embedded deck title or slide count disagrees with the source manifest — that means the wrong deck root was compiled. Rebuild with the correct root before sharing.
- Keep on-slide page numbers, footer labels, and the manifest in sync after adding, removing, or reordering slides.
- Treat deck delivery and runtime delivery as different artifacts. A runtime-only ZIP must contain zero repository presentations and must pass `release:runtime:verify --full`.

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
