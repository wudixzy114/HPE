import type { DeckEngine } from "@hpe/runtime-core";

import type { BrowserBinding, BrowserEventTarget } from "./keyboard.js";

export interface FullscreenDocument extends BrowserEventTarget {
  readonly fullscreenElement: Element | null;
  exitFullscreen(): Promise<void>;
}

export interface FullscreenElement {
  requestFullscreen(): Promise<void>;
}

export function bindFullscreenState(
  engine: DeckEngine,
  target: FullscreenDocument = document,
): BrowserBinding {
  const onFullscreenChange: EventListener = () => {
    engine.dispatch({
      type: "SET_FULLSCREEN",
      fullscreen: target.fullscreenElement !== null,
    });
  };
  target.addEventListener("fullscreenchange", onFullscreenChange);
  return {
    destroy() {
      target.removeEventListener("fullscreenchange", onFullscreenChange);
    },
  };
}

export async function toggleFullscreen(
  element: FullscreenElement = document.documentElement,
  target: FullscreenDocument = document,
): Promise<void> {
  if (target.fullscreenElement) await target.exitFullscreen();
  else await element.requestFullscreen();
}
