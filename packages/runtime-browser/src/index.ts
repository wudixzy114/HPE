import type { DeckEngine } from "@hpe/runtime-core";

export interface BrowserControlsOptions {
  readonly keyboardTarget?: Pick<
    Document,
    "addEventListener" | "removeEventListener"
  >;
  readonly fullscreenTarget?: Pick<
    Document,
    "addEventListener" | "removeEventListener" | "fullscreenElement"
  >;
}

export interface BrowserControls {
  destroy(): void;
}

const FORWARD_KEYS = new Set([
  "ArrowRight",
  "ArrowDown",
  "PageDown",
  " ",
  "Enter",
]);
const BACKWARD_KEYS = new Set(["ArrowLeft", "ArrowUp", "PageUp", "Backspace"]);

/** Binds browser capabilities to the core port without making the core browser-aware. */
export function bindBrowserControls(
  engine: DeckEngine,
  options: BrowserControlsOptions = {},
): BrowserControls {
  const keyboardTarget = options.keyboardTarget ?? document;
  const fullscreenTarget = options.fullscreenTarget ?? document;

  const onKeyDown: EventListener = (rawEvent) => {
    const event = rawEvent as KeyboardEvent;
    const target = event.target as HTMLElement | null;
    if (
      target?.isContentEditable ||
      /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName ?? "")
    )
      return;
    if (FORWARD_KEYS.has(event.key)) {
      event.preventDefault();
      engine.dispatch({ type: "NEXT" });
    } else if (BACKWARD_KEYS.has(event.key)) {
      event.preventDefault();
      engine.dispatch({ type: "PREVIOUS" });
    }
  };
  const onFullscreenChange: EventListener = () => {
    engine.dispatch({
      type: "SET_FULLSCREEN",
      fullscreen: fullscreenTarget.fullscreenElement !== null,
    });
  };

  keyboardTarget.addEventListener("keydown", onKeyDown);
  fullscreenTarget.addEventListener("fullscreenchange", onFullscreenChange);

  return {
    destroy() {
      keyboardTarget.removeEventListener("keydown", onKeyDown);
      fullscreenTarget.removeEventListener(
        "fullscreenchange",
        onFullscreenChange,
      );
    },
  };
}

export async function toggleFullscreen(
  element: HTMLElement = document.documentElement,
): Promise<void> {
  if (document.fullscreenElement) await document.exitFullscreen();
  else await element.requestFullscreen();
}
