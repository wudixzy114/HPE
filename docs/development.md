# Development and release gates

## Supported environment

- Node.js `>=22.12`
- npm `11.16.0` (pinned by `packageManager`)
- Chromium installed automatically by `npm install`
- TypeScript strict mode with exact optional properties and unchecked-index protection

Install once:

```bash
npm install
```

No feature phase should require adding an undeclared production dependency. Optional capabilities are exposed through package subpaths and become part of a browser bundle only when imported.

Large decks keep each page in an independent lazy chunk. After a page commits, the player prefetches the previous page and the next two pages. Navigation never unmounts the displayed page before the target module resolves; a failed chunk leaves the previous page visible and exposes an accessible error instead of a blank frame.

## Module replacement contract

| Module | Stable port / public entrypoint | May depend on |
| --- | --- | --- |
| `@hpe/schema` | `DeckManifest`, JSON Schema, `validateDeckManifest` | Zod only |
| `@hpe/theme` | `ThemeDefinition`, `defineTheme` | no package dependencies |
| `@hpe/runtime-core` | `DeckEngine` | schema types |
| `@hpe/runtime-core/timeline` | `TimelineController`, injected `TimelineClock` | minimal core port |
| `@hpe/runtime-core/slide-state` | `SlideStateStore` | minimal core port |
| `@hpe/runtime-browser/*` | keyboard, touch, fullscreen, URL, sync adapters | core ports |
| `@hpe/renderer-vue/*` | Vue providers/components | Vue peer + core ports |
| `@hpe/compiler/*` | SFC compiler, Vite plugin, renderer | schema |
| `@hpe/checker/*` | diagnostic/report protocol, Playwright adapter | schema |
| `@hpe/cli` | `DeckRepository` transactional application service | public compiler/schema ports |

Consumers must import declared package `exports`; importing another package's `src` is prohibited by ESLint and dependency-cruiser. Replacing a module means implementing the same port and changing composition at the application boundary—core reducers and document files do not change.

Boundary analysis includes package sources, the application shell, authored slides, and theme modules.

## Required gates

```bash
npm run check          # formatting, lint, boundaries, types, unit tests, build
npm run test:coverage  # unit coverage ratchet
npm run test:packages  # npm pack, publint, ESM type-resolution checks
npm run test:bundle    # gzip budget and tooling-exclusion contracts
npm run test:e2e       # Chromium player, speaker, print and managed CLI
npm run test:licenses  # production dependency license allowlist
npm audit              # known dependency vulnerabilities
```

`npm run verify` executes the complete sequence above for release candidates.

`npm run test:packages` verifies every declared export exists in the packed artifact, authoring TypeScript is not leaked, and the CLI binary retains its executable bit. Packages remain `private` and `UNLICENSED` until an explicit release and licensing decision.

## Git discipline

Each independently reviewable phase is committed only after its proportional gates pass. Generated directories (`dist`, `artifacts`, `.hpe`, Playwright reports) are ignored. `.hpe/trash` is intentionally not removed by `npm run clean`; it contains recoverable user files.

## Failure handling

- Structural CLI changes acquire `.hpe/deck.lock`.
- Manifest/source writes use same-directory temporary files and atomic rename.
- A full compile runs before and after every mutation.
- Failed mutations execute ordered rollback actions; incomplete rollback is surfaced as `TRANSACTION_FAILED` with both original and rollback details.
- Inspection state spaces have a default hard limit of 512.
- Browser inspection always closes managed servers and Chromium in `finally` blocks.
