# Runtime-only release

Use this workflow when the deliverable is the HPE engine/toolchain rather than one or more presentations.

## Audit the candidate

1. Run `npm run verify`; dependency audit failures block release.
2. Inspect any existing archive before replacing it. Check its file list, SHA-256 digest, symlink entries, lockfile, and package scripts.
3. Keep runtime code, docs, tests, and Skill resources. Exclude every repository deck:
   - `app/deck.json`, `app/slides`, `app/themes`, `app/content`;
   - all of `presentations`.
4. Keep `tests/fixtures` only as verification inputs. Do not describe them as bundled presentations.

## Package and verify

```bash
npm run release:runtime
npm run release:runtime:verify -- artifacts/releases/hpe-runtime-shell-YYYYMMDD.zip --full
```

The packager uses an allowlist and writes `RUNTIME-RELEASE.json`. It copies `.agents/skills/hpe-slides` into `.claude/skills/hpe-slides` as real files because ZIP symlink behavior is not portable.

The full verifier must prove:

- zero paths under `presentations` and no authored `app` deck files;
- no symlinks, build output, dependencies, caches, Git data, or OS metadata;
- identical Agent and Claude Skill copies;
- a non-vulnerable lockfile and successful clean install;
- full static, unit, package, bundle, isolation, browser, license, and audit gates inside the extracted archive;
- a working CLI against the bundled verification fixture.

Report the final archive path, byte size, SHA-256 digest, and verification result. Do not run `npm publish`, create a public GitHub release, or change licensing unless the user explicitly authorizes that separate external action.
