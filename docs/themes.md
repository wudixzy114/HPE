# HPE theme system

HPE themes are normal TypeScript, CSS and optional Vue components. The system deliberately avoids a proprietary layout or styling language because coding agents already understand these formats well.

## Theme package

```text
themes/<slug>/
  theme.ts       required typed definition and CSS imports
  theme.css      required visual implementation
  preview.png    recommended rendered evidence
  layouts/       optional Vue components
```

Select a theme in `deck.json`:

```json
{
  "theme": { "entry": "themes/hpe-minimal/theme.ts" }
}
```

To make several complete theme modules available at runtime, keep the default
in `entry` and list the other modules in `alternates`:

```json
{
  "theme": {
    "entry": "themes/ink-wash/theme.ts",
    "alternates": [
      "themes/classic-minimal/theme.ts",
      "themes/technical-color/theme.ts"
    ]
  }
}
```

The player loads the declared modules, uses their typed metadata for the shared
theme picker, and stores the selected theme per deck. Theme CSS should scope
visual alternatives with
`html[data-hpe-theme="<theme-id>"]`; shared player controls automatically adopt
the selected theme's `typography.ui` font (falling back to `typography.body`)
and `--hpe-toolbar-*` tokens.

`theme.ts` calls `defineTheme(...)` from `@hpe/theme`. It records:

- canvas and aspect ratio;
- semantic color roles;
- display/body/code typography and optional UI typography;
- spacing scale;
- layout roles and approximate capacity;
- a concise visual objective, motif, preferred patterns, avoided patterns and content rules for AI agents.

The compiler verifies every declared module's syntax, default export, relative CSS imports, CSS assets and deck-root boundaries. The player verifies every theme canvas matches `deck.json`. Vite imports only the explicitly declared theme modules.

Legacy CSS-only theme strings remain supported for compatibility, but new themes should use the typed module form.

## Why metadata and CSS are separate

CSS controls rendering. Metadata tells an agent what the CSS means and when each layout should be used. A rendered `preview.png` proves the implementation matches the description. None of these layers duplicates page content.

## Lessons taken from public PPT skills

Public presentation skills commonly succeed when they provide:

- progressive disclosure rather than one enormous prompt;
- a template index with real previews;
- explicit design decisions before page generation;
- page-role and content-capacity guidance;
- same-level typography rules;
- mandatory content, structure and visual QA.

HPE adopts those principles but not their SVG or `edits.json` authoring pipelines. Slides remain ordinary Vue SFCs, layouts are CSS/Vue, and theme definitions are TypeScript.

The reviewed public projects have materially different licenses. Anthropic's PPTX skill is proprietary; GordenPPTSkill explicitly prohibits commercial use of its bundled templates; AIPMAndy/PPTskill is MIT but targets SVG-to-PPTX generation. HPE therefore uses no copied template/code/assets from them. The bundled themes in this repository are original works created for it.

## AI authoring

Use the project skill at `.agents/skills/hpe-slides`. Claude Code resolves the same canonical skill through `.claude/skills/hpe-slides`. The skill contains:

- the minimal creation/migration workflow;
- Vue authoring patterns;
- theme selection/generation guidance;
- migration and differential-QA rules;
- a standard TypeScript/CSS theme starter.

This keeps stable workflow instructions small while loading detailed guidance only for the active task.
