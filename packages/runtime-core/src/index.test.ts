import { describe, expect, it, vi } from "vitest";

import type { DeckManifest } from "@hpe/schema";

import {
  createDeckEngine,
  createInitialState,
  reduceDeckState,
} from "./index.js";

const manifest: DeckManifest = {
  schemaVersion: 1,
  id: "test-deck",
  title: "Test deck",
  size: { width: 1280, height: 720 },
  theme: "theme.css",
  slides: [
    { id: "one", file: "slides/one.slide.vue", maxStep: 1, durationMs: 1000 },
    { id: "two", file: "slides/two.slide.vue" },
  ],
};

describe("deck state", () => {
  it("consumes steps before changing slides", () => {
    const initial = createInitialState(manifest);
    const stepped = reduceDeckState(manifest, initial, { type: "NEXT" });
    expect(stepped).toMatchObject({ slideId: "one", step: 1 });
    expect(reduceDeckState(manifest, stepped, { type: "NEXT" })).toMatchObject({
      slideId: "two",
      step: 0,
    });
  });

  it("notifies subscribers only when state changes", () => {
    const engine = createDeckEngine(manifest);
    const listener = vi.fn();
    engine.subscribe(listener);
    engine.dispatch({ type: "PREVIOUS" });
    engine.dispatch({ type: "NEXT" });
    expect(listener).toHaveBeenCalledOnce();
  });

  it("rejects unknown slide identifiers", () => {
    const engine = createDeckEngine(manifest);
    expect(() => engine.dispatch({ type: "GOTO", slideId: "missing" })).toThrow(
      "Unknown slide",
    );
  });
});
