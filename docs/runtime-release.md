# Runtime-only release contract

`npm run release:runtime` creates `artifacts/releases/hpe-runtime-shell-YYYYMMDD.zip`. This is a source release of the HPE engine and authoring toolchain, not a deck delivery package.

## Included

- the Vue player shell without authored deck content;
- all eight `@hpe/*` source packages;
- CLI, checker, build, offline-packaging, and release scripts;
- architecture and authoring documentation;
- `.agents/skills/hpe-slides` plus a materialized `.claude/skills/hpe-slides` copy;
- deterministic test fixtures and E2E tests used to prove the extracted archive works.

## Excluded

- `app/deck.json`, `app/slides`, `app/themes`, and `app/content`;
- the complete `presentations` directory;
- `node_modules`, build outputs, coverage, artifacts, `.hpe`, Git metadata, and OS metadata.

The archive's `RUNTIME-RELEASE.json` records this boundary. Test fixtures are verification inputs and are never presented as bundled presentations.

## Release procedure

```bash
npm run verify
npm run release:runtime
npm run release:runtime:verify -- artifacts/releases/hpe-runtime-shell-YYYYMMDD.zip --full
```

`--full` extracts into a temporary directory, installs from `package-lock.json`, runs the complete `npm run verify` gate, checks the CLI, compares both Skill copies, rejects symlinks and forbidden paths, and confirms the lockfile no longer contains the vulnerable `nanoid` release.

Do not publish the ZIP when any step fails. The packages remain `private` and `UNLICENSED`; this workflow authorizes an internal source archive, not public npm publication or a licensing change.
