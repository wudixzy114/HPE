import type { DeckManifest } from "@hpe/schema";

import type { DeckEngine, Unsubscribe } from "./types.js";

export interface TimelineState {
  readonly timeMs: number;
  readonly playing: boolean;
  readonly durationMs?: number;
}

export type TimelineEvent =
  | { readonly type: "SEEK"; readonly timeMs: number }
  | { readonly type: "SET_PLAYING"; readonly playing: boolean }
  | { readonly type: "ADVANCE"; readonly deltaMs: number }
  | { readonly type: "RESET"; readonly durationMs?: number };

export type TimelineListener = (
  state: TimelineState,
  event: TimelineEvent,
) => void;

export interface TimelineController {
  getSnapshot(): TimelineState;
  dispatch(event: TimelineEvent): TimelineState;
  subscribe(listener: TimelineListener): Unsubscribe;
  destroy(): void;
}

export interface TimelineClock {
  now(): number;
  requestFrame(callback: () => void): number;
  cancelFrame(frameId: number): void;
}

export interface TimelineDriver {
  destroy(): void;
}

function normalizeTime(timeMs: number, maximum: number | undefined): number {
  const finite = Number.isFinite(timeMs) ? Math.max(0, timeMs) : 0;
  return maximum === undefined ? finite : Math.min(finite, maximum);
}

export function reduceTimelineState(
  state: TimelineState,
  event: TimelineEvent,
): TimelineState {
  switch (event.type) {
    case "SEEK": {
      const timeMs = normalizeTime(event.timeMs, state.durationMs);
      const playing =
        state.durationMs !== undefined && timeMs >= state.durationMs
          ? false
          : state.playing;
      return timeMs === state.timeMs && playing === state.playing
        ? state
        : { ...state, timeMs, playing };
    }
    case "SET_PLAYING": {
      const atEnd =
        state.durationMs !== undefined && state.timeMs >= state.durationMs;
      const playing = event.playing && !atEnd;
      return playing === state.playing ? state : { ...state, playing };
    }
    case "ADVANCE": {
      if (
        !state.playing ||
        event.deltaMs <= 0 ||
        !Number.isFinite(event.deltaMs)
      )
        return state;
      const timeMs = normalizeTime(
        state.timeMs + event.deltaMs,
        state.durationMs,
      );
      const playing =
        state.durationMs === undefined || timeMs < state.durationMs;
      return { ...state, timeMs, playing };
    }
    case "RESET":
      return {
        timeMs: 0,
        playing: false,
        ...(event.durationMs === undefined
          ? {}
          : { durationMs: event.durationMs }),
      };
  }
}

export function createTimelineController(
  durationMs?: number,
): TimelineController {
  if (
    durationMs !== undefined &&
    (!Number.isFinite(durationMs) || durationMs < 0)
  ) {
    throw new Error("Timeline duration must be a non-negative finite number");
  }
  let state: TimelineState = {
    timeMs: 0,
    playing: false,
    ...(durationMs === undefined ? {} : { durationMs }),
  };
  let active = true;
  const listeners = new Set<TimelineListener>();
  return {
    getSnapshot: () => state,
    dispatch(event) {
      if (!active) throw new Error("Timeline controller has been destroyed");
      const next = reduceTimelineState(state, event);
      if (next !== state) {
        state = next;
        for (const listener of listeners) listener(state, event);
      }
      return state;
    },
    subscribe(listener) {
      if (!active) throw new Error("Timeline controller has been destroyed");
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    destroy() {
      active = false;
      listeners.clear();
    },
  };
}

export function bindTimelineToDeck(
  timeline: TimelineController,
  engine: DeckEngine,
  manifest: DeckManifest,
): Unsubscribe {
  let slideId = engine.getSnapshot().slideId;
  const initialDurationMs =
    manifest.slides[engine.getSnapshot().slideIndex]?.durationMs;
  timeline.dispatch({
    type: "RESET",
    ...(initialDurationMs === undefined
      ? {}
      : { durationMs: initialDurationMs }),
  });
  return engine.subscribe((state) => {
    if (state.slideId === slideId) return;
    slideId = state.slideId;
    const durationMs = manifest.slides[state.slideIndex]?.durationMs;
    timeline.dispatch({
      type: "RESET",
      ...(durationMs === undefined ? {} : { durationMs }),
    });
  });
}

/** Drives timeline events through an injected clock; this module never reads browser time directly. */
export function createTimelineDriver(
  timeline: TimelineController,
  clock: TimelineClock,
): TimelineDriver {
  let active = true;
  let frameId: number | undefined;
  let previousTime = 0;

  const cancel = (): void => {
    if (frameId === undefined) return;
    clock.cancelFrame(frameId);
    frameId = undefined;
  };
  const onFrame = (): void => {
    frameId = undefined;
    if (!active || !timeline.getSnapshot().playing) return;
    const currentTime = clock.now();
    timeline.dispatch({ type: "ADVANCE", deltaMs: currentTime - previousTime });
    request();
  };
  const request = (): void => {
    if (!active || frameId !== undefined || !timeline.getSnapshot().playing)
      return;
    previousTime = clock.now();
    frameId = clock.requestFrame(onFrame);
  };

  const unsubscribe = timeline.subscribe((state) => {
    if (state.playing) request();
    else cancel();
  });
  request();

  return {
    destroy() {
      if (!active) return;
      active = false;
      cancel();
      unsubscribe();
    },
  };
}
