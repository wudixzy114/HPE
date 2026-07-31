import type { DeckEngine } from "@hpe/runtime-core";

import type { BrowserBinding, BrowserEventTarget } from "./keyboard.js";

export interface TouchNavigationOptions {
  readonly target?: BrowserEventTarget;
  readonly minimumDistance?: number;
  readonly maximumDurationMs?: number;
  readonly axisDominance?: number;
  readonly now?: () => number;
}

interface TrackedTouch {
  readonly identifier: number;
  readonly clientX: number;
  readonly clientY: number;
}

interface TouchLikeEvent extends Event {
  readonly changedTouches: ArrayLike<TrackedTouch>;
  readonly touches?: ArrayLike<TrackedTouch>;
}

interface GestureStart extends TrackedTouch {
  readonly startedAt: number;
}

function findTouch(
  touches: ArrayLike<TrackedTouch>,
  identifier: number,
): TrackedTouch | undefined {
  return Array.from(touches).find((touch) => touch.identifier === identifier);
}

export function bindTouchNavigation(
  engine: DeckEngine,
  options: TouchNavigationOptions = {},
): BrowserBinding {
  const target = options.target ?? document;
  const minimumDistance = options.minimumDistance ?? 48;
  const maximumDurationMs = options.maximumDurationMs ?? 800;
  const axisDominance = options.axisDominance ?? 1.25;
  const now = options.now ?? (() => performance.now());
  if (minimumDistance <= 0 || maximumDurationMs <= 0 || axisDominance < 1) {
    throw new Error(
      "Touch navigation thresholds must be positive and axis dominance must be at least 1",
    );
  }
  let start: GestureStart | undefined;

  const onTouchStart: EventListener = (rawEvent) => {
    const event = rawEvent as TouchLikeEvent;
    const touch = event.changedTouches[0];
    if (
      !touch ||
      event.changedTouches.length !== 1 ||
      (event.touches && event.touches.length !== 1)
    ) {
      start = undefined;
      return;
    }
    start = { ...touch, startedAt: now() };
  };
  const onTouchEnd: EventListener = (rawEvent) => {
    if (!start) return;
    const event = rawEvent as TouchLikeEvent;
    const touch = findTouch(event.changedTouches, start.identifier);
    const gesture = start;
    start = undefined;
    if (!touch || now() - gesture.startedAt > maximumDurationMs) return;
    const deltaX = touch.clientX - gesture.clientX;
    const deltaY = touch.clientY - gesture.clientY;
    if (
      Math.abs(deltaX) < minimumDistance ||
      Math.abs(deltaX) < Math.abs(deltaY) * axisDominance
    )
      return;
    event.preventDefault();
    engine.dispatch({ type: deltaX < 0 ? "NEXT" : "PREVIOUS" });
  };
  const onTouchCancel: EventListener = () => {
    start = undefined;
  };

  target.addEventListener("touchstart", onTouchStart, { passive: true });
  target.addEventListener("touchend", onTouchEnd, { passive: false });
  target.addEventListener("touchcancel", onTouchCancel, { passive: true });
  return {
    destroy() {
      target.removeEventListener("touchstart", onTouchStart);
      target.removeEventListener("touchend", onTouchEnd);
      target.removeEventListener("touchcancel", onTouchCancel);
    },
  };
}
