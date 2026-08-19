# Offline single-file packaging

Turn a deck into one self-contained HTML file that opens by double-click from `file://` — no server, no network, no Node.js on the viewer's machine. Use this when a deck must be shared (chat, email, USB) and played anywhere.

## Why single-file

- `file://` blocks ES module imports across files (CORS), so a normal multi-asset build cannot run offline. Inlining one IIFE/ESM chunk plus the stylesheet into `index.html` avoids every request.
- One file is one artifact: it cannot be broken by partial copying, and viewers cannot accidentally open a asset-only file.

## Build steps

1. Build with a single-chunk Vite config (no code splitting, no sourcemaps) and the deck root pinned via `HPE_DECK_ROOT`:

```bash
HPE_DECK_ROOT="$(pwd)/presentations/<slug>" \
  npx vite build --config <single-chunk-config.ts> --outDir dist-offline
```

2. Verify `dist-offline/assets` contains exactly one `.js` file. More than one means code splitting was not disabled — the inline step below would silently drop chunks.
3. Inline the emitted JS and CSS into `index.html`:
   - replace the `<link rel="stylesheet">` tag with a `<style>` block;
   - remove the `<script src>` tag and append its contents (with `</script` escaped as `<\/script`) as `<script type="module">` before `</body>`.
4. Replace the placeholder `<title>` (for example `HPE Deck`) with the deck's `title` from `deck.json`, so browser tabs and window lists show the real deck name.
5. Never hand-edit the bundled JS beyond that title string.

## Mandatory release verification

A packaging script that runs green is not evidence. Before sharing, load the file in a real browser over `file://` and assert all of the following:

- zero console errors and zero page errors;
- `document.title` equals the deck title from `deck.json`;
- the rendered text of the first slide is present (match a distinctive phrase from slide 01);
- `ArrowRight` advances until the last slide id from the manifest appears in the URL hash, and `Home` returns to the first;
- `O` (overview), `S` (speaker view), `N` (notes) toggle without errors;
- screenshots of the cover, the densest slide, and the closing slide are reviewed by a human.

The single most common packaging bug is a stale or wrong `HPE_DECK_ROOT`: the build succeeds, but it embeds a different deck than intended. The title and slide-count assertions above exist to catch exactly that. Always compare against `deck.json`, not against memory.

## Ship

Distribute a ZIP containing the HTML plus a short README (open instructions, keyboard shortcuts, and a note that the file is fully offline). Prefer sending the ZIP over a bare HTML attachment — mail and chat clients are likelier to block or sanitize HTML attachments.
