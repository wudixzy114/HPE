import { describe, expect, it } from "vitest";

import type { DeckManifest } from "@hpe/schema";

import { createDeckEngine } from "./index.js";
import {
  createSlideStateStore,
  enumerateSlideStateScenarios,
} from "./slide-state.js";

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

describe("optional slide state store", () => {
  it("registers inspectable state and resets values on navigation", () => {
    const engine = createDeckEngine(manifest);
    const store = createSlideStateStore(engine);
    const unregister = store.register({
      key: "tab",
      initial: "overview",
      inspect: ["overview", "details"],
    });
    expect(store.getSnapshot().values).toEqual({ tab: "overview" });
    store.set("tab", "details");
    expect(store.getSnapshot().values).toEqual({ tab: "details" });
    engine.dispatch({ type: "GOTO", slideId: "two" });
    expect(store.getSnapshot()).toEqual({ slideId: "two", values: {} });
    unregister();
    unregister();
    expect(store.declarations("one")).toHaveLength(0);
  });

  it("enumerates combinations in stable key order and enforces a bound", () => {
    const declarations = [
      { slideId: "one", key: "tab", initial: "a", inspect: ["a", "b"] },
      {
        slideId: "one",
        key: "enabled",
        initial: false,
        inspect: [false, true],
      },
    ] as const;
    const scenarios = enumerateSlideStateScenarios(declarations);
    expect(scenarios).toHaveLength(4);
    expect(scenarios[0]).toEqual({
      id: "enabled=false&tab=a",
      values: { enabled: false, tab: "a" },
    });
    expect(() => enumerateSlideStateScenarios(declarations, 3)).toThrow(
      "exceed the limit",
    );
  });

  it("rejects undeclared and non-serializable state", () => {
    const store = createSlideStateStore(createDeckEngine(manifest));
    expect(() => store.set("missing", true)).toThrow("Undeclared slide state");
    expect(() =>
      store.register({
        key: "invalid",
        initial: Number.NaN,
        inspect: [Number.NaN],
      }),
    ).toThrow("JSON-safe primitives");
  });
});
