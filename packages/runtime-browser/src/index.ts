import type { DeckEngine } from "@hpe/runtime-core";

import { bindFullscreenState, type FullscreenDocument } from "./fullscreen.js";
import {
  bindKeyboardNavigation,
  type BrowserBinding,
  type BrowserEventTarget,
} from "./keyboard.js";
import { bindTouchNavigation } from "./touch.js";

export interface BrowserControlsOptions {
  readonly keyboardTarget?: BrowserEventTarget;
  readonly touchTarget?: BrowserEventTarget;
  readonly fullscreenTarget?: FullscreenDocument;
}

export type BrowserControls = BrowserBinding;

/** Standard preset. Granular adapters remain available through package subpaths. */
export function bindBrowserControls(
  engine: DeckEngine,
  options: BrowserControlsOptions = {},
): BrowserControls {
  const keyboard = bindKeyboardNavigation(engine, {
    ...(options.keyboardTarget === undefined
      ? {}
      : { target: options.keyboardTarget }),
  });
  const touch = bindTouchNavigation(engine, {
    ...(options.touchTarget === undefined
      ? {}
      : { target: options.touchTarget }),
  });
  const fullscreen = bindFullscreenState(engine, options.fullscreenTarget);
  return {
    destroy() {
      keyboard.destroy();
      touch.destroy();
      fullscreen.destroy();
    },
  };
}

export { toggleFullscreen } from "./fullscreen.js";
export type { BrowserBinding, BrowserEventTarget } from "./keyboard.js";
