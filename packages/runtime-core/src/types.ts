import type { SlideMode } from "@hpe/schema";

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

/** Stable minimal port implemented by any compatible deck state engine. */
export interface DeckEngine {
  getSnapshot(): DeckState;
  dispatch(event: DeckEvent): DeckState;
  subscribe(listener: DeckListener): Unsubscribe;
  destroy(): void;
}

export interface DeckEngineOptions {
  readonly initialState?: DeckState;
}
