# Migration reference

## Inventory first

Record before editing:

- ordered page count and titles;
- logical canvas size and scale behavior;
- all local/remote assets and fonts;
- notes and presentation script;
- keyboard, pointer, full-screen, URL, print, and speaker behavior;
- every page-local interaction and its reachable states;
- screenshots of representative static and interactive states.

Treat the original runtime as evidence. Do not infer behavior from markup alone.

## Map to HPE

| Legacy behavior                    | HPE form                                  |
| ---------------------------------- | ----------------------------------------- |
| ordered sections/imports           | `deck.json` stable slide entries          |
| section/page                       | one `.slide.vue`                          |
| notes attributes/files             | `<notes lang="md">`                       |
| fixed stage                        | manifest `size` + scaled frame            |
| reveal class mutation              | `<Step>`                                  |
| deterministic animation            | timeline controller/component             |
| finite demo state                  | `useSlideState`                           |
| global navigation/notes/fullscreen | standard player                           |
| global visual CSS                  | typed theme module + CSS                  |
| ad-hoc page JS                     | Vue script/component scoped to that slide |

Preserve content and visual intent before improving design. Keep a source-to-slide report for auditability.

## Do not preserve accidental architecture

- Do not bring across global IDs or global event registries when Vue state is clearer.
- Do not keep hard-coded slide indices in animation code.
- Do not eagerly bundle all pages, notes, or source maps.
- Do not hard-code 1280×720 in preview/print paths; use manifest dimensions.
- Do not carry the legacy navigation UI into page content.

## Differential QA

Compare the same viewport and state in both versions. Check title wrapping, baseline alignment, content presence, color, interaction results, notes, first/last navigation, overview, speaker sync, and print page count. Differences are acceptable only when they are deliberate engine improvements and do not alter the message.
