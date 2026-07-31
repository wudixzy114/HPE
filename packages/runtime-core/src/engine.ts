import type { DeckManifest } from "@hpe/schema";

import { createInitialState, reduceDeckState } from "./reducer.js";
import type { DeckEngine, DeckEngineOptions, DeckListener } from "./types.js";

export function createDeckEngine(
  manifest: DeckManifest,
  options: DeckEngineOptions = {},
): DeckEngine {
  let state = options.initialState ?? createInitialState(manifest);
  let active = true;
  const listeners = new Set<DeckListener>();

  return {
    getSnapshot: () => state,
    dispatch(event) {
      if (!active) throw new Error("Deck engine has been destroyed");
      const next = reduceDeckState(manifest, state, event);
      if (next !== state) {
        state = next;
        for (const listener of listeners) listener(state, event);
      }
      return state;
    },
    subscribe(listener) {
      if (!active) throw new Error("Deck engine has been destroyed");
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    destroy() {
      active = false;
      listeners.clear();
    },
  };
}
