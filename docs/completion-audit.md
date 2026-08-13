# First-phase completion audit

This audit maps every committed first-phase requirement in [`architecture.md`](architecture.md) to current executable evidence. A green build alone is not treated as proof unless the relevant test or contract covers the requirement.

## Product and format contract

| Requirement | Implementation evidence | Verification evidence |
| --- | --- | --- |
| TypeScript strict throughout owned source | [`tsconfig.base.json`](../tsconfig.base.json) | `npm run typecheck` and ESLint typed rules |
| One programmable Vue SFC per slide | [`app/slides`](../app/slides), compiler SFC contract | compiler tests reject missing/external templates and non-TS scripts |
| `<notes lang="md">` extraction | compiler `CompiledSlide.notes` | compiler test extracts notes without executing slide code; speaker E2E displays them |
| Stable manifest order and slide IDs | schema + `DeckRepository` | CLI create/move/rename/delete transaction tests |
| Versioned schema from day one | `schemaVersion`, Zod contract, packaged JSON Schema | validation in every compile/mutation; package test verifies JSON export |
| Typed AI-friendly themes | `@hpe/theme`, `theme.ts` modules and CSS imports | theme invariant tests, compiler contract tests, runtime canvas assertion and rendered preview |
| Stable `data-node` source mapping | compiler template AST analysis + virtual `sources` | compiler location assertion and browser E2E `getSourceMap()` assertion |
| Static Tailwind class scanning | compiler class-expression validation | compiler rejects concatenated class fixture |
| Theme, scoped CSS and deterministic CSS layers | `app/theme.css`, Vue scoped styles | production build + browser visual checks |

## Replaceable architecture and zero-cost abstraction

| Requirement | Implementation evidence | Verification evidence |
| --- | --- | --- |
| Pure platform-neutral playback core | `@hpe/runtime-core` reducer/engine | dependency-cruiser + restricted-import rules + unit tests |
| Browser capability is an adapter | `@hpe/runtime-browser/*` subpaths | package exports/type checks and browser adapter tests |
| Vue only maps ports to reactive context | `@hpe/renderer-vue/*` | dependency rules and full-player E2E |
| Compiler/checker/CLI remain outside player runtime | separate workspace packages and dynamic CLI imports | `scripts/verify-bundle.mjs` rejects tooling markers/eager imports |
| Optional timeline and inspectable state cost nothing when unused | independent core/renderer/browser subpaths | bundle contract ensures minimal entrypoints do not reference optional modules |
| Every package can be independently packed/replaced | explicit `exports`, peer boundaries | `npm run test:packages` runs npm pack, publint and ESM type-resolution analysis for all eight packages |

## Playback and author experience

| Requirement | Implementation evidence | Verification evidence |
| --- | --- | --- |
| Previous/next/goto and steps | core reducer + `<Step>` | reducer tests and keyboard/deep-link E2E |
| Keyboard and touch navigation | granular browser adapters | simulated adapter tests; player E2E for keyboard |
| Browser fullscreen | fullscreen adapter and toolbar | injected-port unit test |
| URL state | stable hash serialization/binding | URL adapter unit tests and deep-link E2E |
| Page number and progress | standard player | production visual inspection |
| Flicker-free lazy navigation | retained displayed slide, target-module commit and previous/next-two prefetch | throttled-network E2E proves the stage never becomes empty while an unprefetched chunk is delayed |
| Overview | isolated preview engines | E2E verifies 50 previews and no state pollution |
| Speaker view | current/next/notes/timer/controls | same-context multi-page E2E |
| Cross-window state | navigation + optional feature channels | unit and E2E prove step/timeline/declared-state sync while mode/fullscreen remain local |
| Compile-time code highlighting | `ShikiCode` compiler transform | transform test and bundle tooling exclusion |
| Deterministic timeline | injected clock/controller and Vue provider | clock unit tests, speaker synchronization E2E |
| Inspectable interaction state | declaration store and `useSlideState` | combination-limit tests and all-scenario checker traversal |
| Printing and static HTML | print view + Vite renderer | E2E asserts 50-page PDF at manifest size; `deck render` produces static output |

## AI/CLI automation

| Requirement | Implementation evidence | Verification evidence |
| --- | --- | --- |
| `list`, `validate`, `render` | CLI program | JSON protocol tests and real executable smoke |
| create/move/rename/delete | transactional `DeckRepository` | full mutation-chain test and real CLI smoke |
| notes get/set | transactional notes service | repository/CLI tests |
| inspect all/selected states | managed preview + checker selector | managed CLI Playwright E2E |
| screenshot and annotation | screenshot command and checker artifacts | real CLI run produces raw/annotated/contact-sheet artifacts |
| Stable JSON and exit codes | CLI envelopes and `CliError` codes | in-process protocol tests and isolated-stdout E2E |
| No partial structural writes | lock, atomic rename, pre/post compile, ordered rollback | injected post-write failure test proves manifest/source restoration |
| No manually started server required | `serveDeck` managed preview | CLI E2E launches and closes its private server |

## Deterministic diagnostics and artifacts

| Requirement | Implementation evidence | Verification evidence |
| --- | --- | --- |
| Slide/client overflow and node bounds | in-page browser checks | failure fixture detects scroll and element overflow |
| Text clipping | scroll/client check under clipping styles | failure fixture detects clipped heading |
| Resource/runtime/console failures | request, pageerror, console, image/media checks | checker code paths + missing-image fixture |
| Font size, contrast and safe area | computed-style checks | failure fixture detects all three classes |
| Explicit layout overlap heuristic | `data-layout` pair checks | failure fixture detects overlap warning |
| Every step/state/timeline checkpoint | bounded Cartesian traversal | migrated deck checks 88 deterministic states; managed CLI state selection E2E |
| Raw and annotated screenshots | isolated overlay capture | overlay cleanup assertion and real screenshot command |
| Contact sheet, HTML and JSON reports | artifact/report writers | CLI/checker execution and artifact protocol |
| Diagnostics map to SFC locations | compiler source map joined by node ID | report fields and source-map E2E |

## Commercial gates

| Gate | Command |
| --- | --- |
| Formatting, lint, boundaries, types, unit tests, clean production build | `npm run check` |
| Coverage regression floor | `npm run test:coverage` |
| Packed package/API correctness | `npm run test:packages` |
| Runtime gzip and tooling exclusion | `npm run test:bundle` |
| Chromium product and managed CLI flows | `npm run test:e2e` |
| Production dependency license allowlist | `npm run test:licenses` |
| Known dependency vulnerabilities | `npm audit` |
| Full local release candidate gate | `npm run verify` |

GitHub Actions repeats these from a clean lockfile install on the supported Node baseline. Dependabot covers npm and workflow actions.

## Explicit non-goals

The adopted architecture explicitly excludes the following from phase one, so they are not represented by placeholder APIs: visual drag-and-drop editing, multi-user collaboration, PowerPoint import, high-fidelity editable PPTX export, automatic enumeration of undeclared arbitrary interaction state, and binding to an AI/model provider. Adding any of these requires a separately reviewed phase and adapter contract.
