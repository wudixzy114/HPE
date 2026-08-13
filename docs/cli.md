# HPE CLI contract

`deck` is the stable automation boundary for humans, CI and AI agents. Commands operate on stable slide IDs; structural writes are lock-protected, atomic, compiled after mutation and rolled back on failure.

## Global options

```text
-r, --root <directory>  Deck application root (default: app)
--json                  Emit one machine-readable JSON value
```

## Selecting a deck in the shared player

The player shell is independent from deck content. Development, production builds and previews accept the same deck-root switch:

```bash
npm run dev -- --deck-root ./presentations/product-launch
npm run build -- --deck-root ./presentations/product-launch
npm run preview -- --deck-root ./presentations/product-launch
```

When omitted, `--deck-root` defaults to `app`, the bundled example deck. A selected deck owns only `deck.json`, `slides/`, `themes/` and `assets/`; it does not copy or modify the player shell. The compiler and dev server allow source files from that root while keeping manifest, theme, asset and slide validation scoped to it.

`--json` may appear before or after a subcommand. Successful JSON responses include `ok: true` where the command has a natural response envelope. Errors always use:

```json
{
  "ok": false,
  "error": {
    "code": "SLIDE_NOT_FOUND",
    "message": "Unknown slide: missing"
  }
}
```

Exit codes are stable by category:

| Exit code | Meaning |
| --- | --- |
| `0` | Success, no hard diagnostics |
| `1` | Command/runtime failure or inspection errors |
| `2` | Invalid deck or invalid user input |
| `3` | Missing/conflicting deck entity |
| `4` | Another process owns the deck mutation lock |

## Query and build commands

```bash
deck list --json
deck validate --json
deck render --out-dir dist --json
```

`validate` parses the manifest and every SFC, verifies assets, source mappings, static Tailwind classes and node IDs. `render` validates before creating static HTML.

## Transactional slide operations

```bash
deck slide create summary --after architecture --title "Summary" --json
deck slide move summary --before appendix --json
deck slide rename summary conclusion --json
deck slide delete legacy --json
```

Create/move accept exactly one of `--before` or `--after` when positioning is required. Delete moves source into `.hpe/trash` rather than permanently removing it. Rename updates both the stable ID and source filename. Every operation:

1. acquires `.hpe/deck.lock`;
2. validates the current deck;
3. writes files and manifest atomically;
4. compiles the resulting deck;
5. restores the original state if compilation fails.

## Notes

```bash
deck notes get architecture --json
deck notes set architecture --file notes.md --json
```

Notes are stored in the slide's `<notes lang="md">` block and the SFC is recompiled before the transaction commits.

## Inspection and screenshots

```bash
deck inspect --slide all --states all --json
deck inspect --slide intro,architecture --states default --max-states 64 --json
deck screenshot --slide all --states all --annotate --json
```

These commands build and launch a private local preview automatically, then close it in a `finally` block. `--url` can point at an already-running presentation when desired. Selection rules:

- `--slide all` or comma-separated stable IDs;
- `--states all` for every step × declared interaction × timeline checkpoint;
- `--states default` for one baseline state per slide;
- `--max-states` as a hard CI safety bound.

Artifacts include JSON/HTML reports and, for `screenshot`, raw images, annotated images and a contact sheet.
