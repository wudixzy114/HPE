import type { DeckEngine } from "@hpe/runtime-core";

export interface BrowserEventTarget {
  addEventListener(
    type: string,
    listener: EventListener,
    options?: AddEventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListener,
    options?: EventListenerOptions,
  ): void;
}

export interface KeyboardNavigationOptions {
  readonly target?: BrowserEventTarget;
}

export interface BrowserBinding {
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
const INTERACTIVE_TAGS = new Set([
  "INPUT",
  "TEXTAREA",
  "SELECT",
  "BUTTON",
  "A",
]);

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!target || typeof target !== "object") return false;
  const candidate = target as { isContentEditable?: boolean; tagName?: string };
  return (
    candidate.isContentEditable === true ||
    INTERACTIVE_TAGS.has(candidate.tagName ?? "")
  );
}

export function bindKeyboardNavigation(
  engine: DeckEngine,
  options: KeyboardNavigationOptions = {},
): BrowserBinding {
  const target = options.target ?? document;
  const onKeyDown: EventListener = (rawEvent) => {
    const event = rawEvent as KeyboardEvent;
    if (
      event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      isInteractiveTarget(event.target)
    ) {
      return;
    }
    if (event.key === " " && event.shiftKey) {
      event.preventDefault();
      engine.dispatch({ type: "PREVIOUS" });
    } else if (FORWARD_KEYS.has(event.key)) {
      event.preventDefault();
      engine.dispatch({ type: "NEXT" });
    } else if (BACKWARD_KEYS.has(event.key)) {
      event.preventDefault();
      engine.dispatch({ type: "PREVIOUS" });
    }
  };
  target.addEventListener("keydown", onKeyDown);
  return {
    destroy() {
      target.removeEventListener("keydown", onKeyDown);
    },
  };
}
