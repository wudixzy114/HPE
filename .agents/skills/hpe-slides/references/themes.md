# Theme creation reference

An HPE theme is ordinary code:

```text
themes/<slug>/
  theme.ts       typed metadata and AI guidance
  theme.css      visual implementation
  preview.png    rendered evidence, not a mock
  layouts/       optional reusable Vue components
```

`deck.json` selects it with `{ "theme": { "entry": "themes/<slug>/theme.ts" } }`.

## Selection before generation

If the deck contains multiple themes, compare their metadata and previews. Recommend one based on audience, message density, tone, canvas, and required page roles. Ask the user only when the choice materially changes the result. Never combine unrelated themes page-by-page.

## Design specification

Before writing CSS, decide:

1. canvas and safe area;
2. audience and usage context;
3. one visual objective;
4. dominant/support/accent semantic colors;
5. display/body/code typography and minimum sizes;
6. spacing scale;
7. one repeated motif;
8. layout roles and approximate content capacity;
9. image/icon policy;
10. explicit `prefer` and `avoid` rules for agents.

Encode those decisions in `defineTheme(...)`. Do not create another design-spec DSL.

## Principles adapted from public PPT skills

- Provide an indexable description and rendered preview.
- Describe layout roles and capacity, not fixed placeholder coordinates.
- Keep theme selection separate from content writing.
- Require content, structural, and visual QA.
- Keep same-level type consistent and rewrite content instead of locally shrinking it.
- Preserve complete sentences; never truncate to a character budget.

HPE deliberately differs from SVG/PPTX-oriented skills: layouts are Vue components/classes, metadata is TypeScript, and pages remain editable web components. Do not copy third-party templates whose commercial license is unclear.

## Theme QA

Create representative pages for cover, dense explanation, comparison, code, and interaction. Render all of them at the declared canvas, generate a contact sheet, and verify:

- semantic colors meet contrast requirements;
- every declared layout works at its stated capacity;
- title/body levels remain consistent;
- no theme selector depends on a particular slide ID unless it is a documented migration correction;
- player, overview, speaker, and print remain readable;
- the initial browser bundle stays inside the repository budget.
