# Claude Code sharing deck migration

## Source

The source deck is the user-owned repository at `../claude-code-sharing`:

- `index.html`: 50 fixed-canvas sections;
- `styles.css` and `anim.css`: visual theme and demo styling;
- `anim.js`: four page-local interactive simulations;
- `app.js`: global navigation, notes, fullscreen, spotlight and scaling;
- `speaker-notes.md` and `现场演示脚本.md`: supporting delivery material.

The source title says “four pieces” in the browser `<title>` but the visible deck and current content contain five chapters. The migrated deck uses the visible/current title: “Claude Code 的五块拼图”.

## Mapping

- 50 `<section class="slide">` nodes became 50 `.slide.vue` files in original order.
- `data-note` became `<notes lang="md">` without rewriting the content.
- canvas `1600×900` became the deck manifest size and theme canvas.
- legacy visual rules became the owned `claude-code-architecture` typed theme.
- 285 important elements gained stable `data-node` source mappings.
- the four demos (loop, context budget, compression, permission simulation) were rewritten as Vue state with `useSlideState`; no global `anim.js` remains.
- global navigation, URL state, notes, spotlight, fullscreen, overview, speaker view and print now use engine/player capabilities.

The deterministic script `scripts/migrate-claude-code-sharing.mjs` reconstructs the static slide corpus and manifest from the source. Curated interactive slides are preserved unless `--force-interactive` is explicitly supplied.

## Engine improvements found during migration

The realistic 50-page deck exposed gaps that the three-page sample did not:

1. typed theme modules were needed so agents can understand design intent without a custom DSL;
2. manifest canvas dimensions had to drive preview and print instead of hard-coded `1280×720`;
3. slides, notes, source maps and auxiliary player views needed separate lazy chunks;
4. notes and pointer spotlight needed standard presentation controls;
5. Home/End navigation and document-title synchronization were missing;
6. compiler template analysis had to use a fresh DOM parser AST because Vue mutates cached compiler ASTs during concurrent Vite loads;
7. large decks required theme-aware bundle budgets and print readiness before PDF capture.
8. replacing a full slide inside the scaled stage could expose the compositor's empty backing surface; the player now paints into alternating slide buffers before an animation-free swap and prefetches the previous plus next two slides.

## Verification evidence

- original and migrated contact sheets contain the same 50 pages in the same order;
- migrated default states: 50 pages, zero errors and warnings;
- complete deterministic state space: 88 states, zero errors and warnings;
- four interactive pages expose 38 additional inspectable states;
- notes, spotlight, Home/End, speaker synchronization and 50-page print are covered by Chromium E2E;
- initial entry excludes optional notes/source maps and each slide is a separate lazy chunk.

Visual differences are intentional player improvements: HPE replaces the legacy bottom controls with its own toolbar, overview, speaker view and deterministic inspection ports. Slide content and theme remain visually equivalent.
