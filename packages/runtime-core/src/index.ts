import type { DeckManifest, SlideMode } from "@hpe/schema";

export interface DeckState {
  readonly slideId: string;
  readonly slideIndex: number;
  readonly step: number;
  readonly mode: SlideMode;
  readonly fullscreen: boolean;
}

export type DeckEvent =
  | { readonly type: "NEXT" }
  | { readonly type: "PREVIOUS" }
  | { readonly type: "GOTO"; readonly slideId: string }
  | { readonly type: "SET_STEP"; readonly step: number }
  | { readonly type: "SET_MODE"; readonly mode: SlideMode }
  | { readonly type: "SET_FULLSCREEN"; readonly fullscreen: boolean };

export type DeckListener = (state: DeckState, event: DeckEvent) => void;
export type Unsubscribe = () => void;

/** The stable port implemented by any deck state engine. */
export interface DeckEngine {
  getSnapshot(): DeckState;
  dispatch(event: DeckEvent): DeckState;
  subscribe(listener: DeckListener): Unsubscribe;
  destroy(): void;
}

function maxStep(manifest: DeckManifest, slideIndex: number): number {
  return manifest.slides[slideIndex]?.maxStep ?? 0;
}

export function createInitialState(
  manifest: DeckManifest,
  mode: SlideMode = "present",
): DeckState {
  const first = manifest.slides[0];
  if (!first) throw new Error("A deck must contain at least one slide");
  return { slideId: first.id, slideIndex: 0, step: 0, mode, fullscreen: false };
}

export function reduceDeckState(
  manifest: DeckManifest,
  state: DeckState,
  event: DeckEvent,
): DeckState {
  switch (event.type) {
    case "NEXT": {
      if (state.step < maxStep(manifest, state.slideIndex))
        return { ...state, step: state.step + 1 };
      const nextIndex = Math.min(
        state.slideIndex + 1,
        manifest.slides.length - 1,
      );
      const next = manifest.slides[nextIndex];
      return next && nextIndex !== state.slideIndex
        ? { ...state, slideId: next.id, slideIndex: nextIndex, step: 0 }
        : state;
    }
    case "PREVIOUS": {
      if (state.step > 0) return { ...state, step: state.step - 1 };
      const previousIndex = Math.max(state.slideIndex - 1, 0);
      const previous = manifest.slides[previousIndex];
      return previous && previousIndex !== state.slideIndex
        ? {
            ...state,
            slideId: previous.id,
            slideIndex: previousIndex,
            step: maxStep(manifest, previousIndex),
          }
        : state;
    }
    case "GOTO": {
      const index = manifest.slides.findIndex(
        (slide) => slide.id === event.slideId,
      );
      if (index < 0) throw new Error(`Unknown slide: ${event.slideId}`);
      return { ...state, slideId: event.slideId, slideIndex: index, step: 0 };
    }
    case "SET_STEP": {
      const step = Math.max(
        0,
        Math.min(Math.trunc(event.step), maxStep(manifest, state.slideIndex)),
      );
      return step === state.step ? state : { ...state, step };
    }
    case "SET_MODE":
      return event.mode === state.mode ? state : { ...state, mode: event.mode };
    case "SET_FULLSCREEN":
      return event.fullscreen === state.fullscreen
        ? state
        : { ...state, fullscreen: event.fullscreen };
  }
}

export function createDeckEngine(
  manifest: DeckManifest,
  initial = createInitialState(manifest),
): DeckEngine {
  let state = initial;
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
