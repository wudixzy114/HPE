import { describe, expect, it } from "vitest";

import type { DeckManifest } from "@hpe/schema";

import { createDeckEngine } from "./index.js";
import {
  bindTimelineToDeck,
  createTimelineController,
  createTimelineDriver,
  type TimelineClock,
} from "./timeline.js";

const manifest: DeckManifest = {
  schemaVersion: 1,
  id: "test-deck",
  title: "Test deck",
  size: { width: 1280, height: 720 },
  theme: "theme.css",
  slides: [
    { id: "one", file: "slides/one.slide.vue", maxStep: 1, durationMs: 1000 },
    { id: "two", file: "slides/two.slide.vue" },
  ],
};

class TestClock implements TimelineClock {
  public time = 0;
  private nextId = 1;
  private readonly callbacks = new Map<number, () => void>();

  public now(): number {
    return this.time;
  }

  public requestFrame(callback: () => void): number {
    const id = this.nextId++;
    this.callbacks.set(id, callback);
    return id;
  }

  public cancelFrame(frameId: number): void {
    this.callbacks.delete(frameId);
  }

  public advance(deltaMs: number): void {
    this.time += deltaMs;
    const callbacks = [...this.callbacks.values()];
    this.callbacks.clear();
    for (const callback of callbacks) callback();
  }

  public pendingFrames(): number {
    return this.callbacks.size;
  }
}

describe("optional timeline controller", () => {
  it("advances deterministically and clamps at the declared duration", () => {
    const timeline = createTimelineController(1000);
    timeline.dispatch({ type: "SET_PLAYING", playing: true });
    timeline.dispatch({ type: "ADVANCE", deltaMs: 750 });
    expect(timeline.getSnapshot()).toEqual({
      timeMs: 750,
      playing: true,
      durationMs: 1000,
    });
    timeline.dispatch({ type: "ADVANCE", deltaMs: 500 });
    expect(timeline.getSnapshot()).toEqual({
      timeMs: 1000,
      playing: false,
      durationMs: 1000,
    });
  });

  it("uses an injected clock and cancels scheduled work on destroy", () => {
    const timeline = createTimelineController(1000);
    const clock = new TestClock();
    const driver = createTimelineDriver(timeline, clock);
    timeline.dispatch({ type: "SET_PLAYING", playing: true });
    expect(clock.pendingFrames()).toBe(1);
    clock.advance(400);
    expect(timeline.getSnapshot().timeMs).toBe(400);
    driver.destroy();
    expect(clock.pendingFrames()).toBe(0);
  });

  it("resets with the next slide duration when bound to a deck", () => {
    const engine = createDeckEngine(manifest);
    const timeline = createTimelineController();
    const unbind = bindTimelineToDeck(timeline, engine, manifest);
    expect(timeline.getSnapshot()).toEqual({
      timeMs: 0,
      playing: false,
      durationMs: 1000,
    });
    timeline.dispatch({ type: "SEEK", timeMs: 500 });
    engine.dispatch({ type: "GOTO", slideId: "two" });
    expect(timeline.getSnapshot()).toEqual({ timeMs: 0, playing: false });
    unbind();
  });
});
