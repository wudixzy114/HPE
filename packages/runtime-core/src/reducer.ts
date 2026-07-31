import type { DeckManifest, SlideMode } from "@hpe/schema";

import type { DeckEvent, DeckState } from "./types.js";

function maxStep(manifest: DeckManifest, slideIndex: number): number {
  return manifest.slides[slideIndex]?.maxStep ?? 0;
}

export function createInitialState(
  manifest: DeckManifest,
  mode: SlideMode = "present",
): DeckState {
  const first = manifest.slides[0];
  if (!first) throw new Error("A deck must contain at least one slide");
  return {
    slideId: first.id,
    slideIndex: 0,
    step: 0,
    mode,
    fullscreen: false,
  };
}

export function reduceDeckState(
  manifest: DeckManifest,
  state: DeckState,
  event: DeckEvent,
): DeckState {
  switch (event.type) {
    case "NEXT": {
      if (state.step < maxStep(manifest, state.slideIndex)) {
        return { ...state, step: state.step + 1 };
      }
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
