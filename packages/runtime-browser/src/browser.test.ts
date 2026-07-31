import { describe, expect, it, vi } from "vitest";

import { createDeckEngine } from "@hpe/runtime-core";
import { createSlideStateStore } from "@hpe/runtime-core/slide-state";
import { createTimelineController } from "@hpe/runtime-core/timeline";

import type { BroadcastChannelPort } from "./sync.js";
import {
  bindFullscreenState,
  toggleFullscreen,
  type FullscreenDocument,
} from "./fullscreen.js";
import { bindKeyboardNavigation, type BrowserEventTarget } from "./keyboard.js";
import { createPresentationSync } from "./presentation-sync.js";
import { createBroadcastSync } from "./sync.js";
import { bindTouchNavigation } from "./touch.js";
import { createBrowserTimelineClock } from "./timeline.js";
import {
  bindUrlState,
  parseDeckUrl,
  serializeDeckUrl,
  type UrlHost,
} from "./url.js";

const manifest = {
  schemaVersion: 1,
  id: "browser-test",
  title: "Browser test",
  size: { width: 1280, height: 720 },
  theme: "theme.css",
  slides: [
    { id: "one", file: "one.slide.vue", maxStep: 1 },
    { id: "two", file: "two.slide.vue" },
  ],
} as const;

class FakeEventTarget implements BrowserEventTarget {
  private readonly listeners = new Map<string, Set<EventListener>>();

  public addEventListener(type: string, listener: EventListener): void {
    const listeners = this.listeners.get(type) ?? new Set<EventListener>();
    listeners.add(listener);
    this.listeners.set(type, listeners);
  }

  public removeEventListener(type: string, listener: EventListener): void {
    this.listeners.get(type)?.delete(listener);
  }

  public emit(type: string, event: object): void {
    for (const listener of this.listeners.get(type) ?? [])
      listener(event as Event);
  }

  public listenerCount(type: string): number {
    return this.listeners.get(type)?.size ?? 0;
  }
}

class FakeUrlHost extends FakeEventTarget implements UrlHost {
  public readonly location = { hash: "" };
  public readonly history = {
    replaceState: (
      _data: unknown,
      _unused: string,
      url?: string | URL | null,
    ): void => {
      this.location.hash = String(url ?? "");
    },
  };
}

class FakeBroadcastBus {
  private readonly channels = new Set<FakeBroadcastChannel>();

  public create = (name: string): BroadcastChannelPort => {
    const channel = new FakeBroadcastChannel(this, name);
    this.channels.add(channel);
    return channel;
  };

  public send(sender: FakeBroadcastChannel, data: unknown): void {
    for (const channel of this.channels) {
      if (channel !== sender && channel.name === sender.name)
        channel.receive(data);
    }
  }

  public close(channel: FakeBroadcastChannel): void {
    this.channels.delete(channel);
  }
}

class FakeBroadcastChannel implements BroadcastChannelPort {
  private readonly listeners = new Set<
    (event: MessageEvent<unknown>) => void
  >();

  public constructor(
    private readonly bus: FakeBroadcastBus,
    public readonly name: string,
  ) {}

  public postMessage(message: unknown): void {
    this.bus.send(this, message);
  }

  public addEventListener(
    _type: "message",
    listener: (event: MessageEvent<unknown>) => void,
  ): void {
    this.listeners.add(listener);
  }

  public removeEventListener(
    _type: "message",
    listener: (event: MessageEvent<unknown>) => void,
  ): void {
    this.listeners.delete(listener);
  }

  public receive(data: unknown): void {
    for (const listener of this.listeners)
      listener({ data } as MessageEvent<unknown>);
  }

  public close(): void {
    this.bus.close(this);
    this.listeners.clear();
  }
}

describe("browser navigation adapters", () => {
  it("maps keyboard input and ignores modified or editable input", () => {
    const engine = createDeckEngine(manifest);
    const target = new FakeEventTarget();
    const binding = bindKeyboardNavigation(engine, { target });
    const preventDefault = vi.fn();
    target.emit("keydown", {
      key: "ArrowRight",
      target: null,
      defaultPrevented: false,
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      preventDefault,
    });
    expect(engine.getSnapshot().step).toBe(1);
    expect(preventDefault).toHaveBeenCalledOnce();
    target.emit("keydown", {
      key: "ArrowRight",
      target: { tagName: "INPUT" },
      defaultPrevented: false,
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      preventDefault,
    });
    expect(engine.getSnapshot().slideId).toBe("one");
    binding.destroy();
    expect(target.listenerCount("keydown")).toBe(0);
  });

  it("maps intentional horizontal touch gestures only", () => {
    const engine = createDeckEngine(manifest);
    const target = new FakeEventTarget();
    let now = 100;
    const binding = bindTouchNavigation(engine, { target, now: () => now });
    target.emit("touchstart", {
      changedTouches: [{ identifier: 1, clientX: 200, clientY: 100 }],
    });
    now += 100;
    const preventDefault = vi.fn();
    target.emit("touchend", {
      changedTouches: [{ identifier: 1, clientX: 100, clientY: 105 }],
      preventDefault,
    });
    expect(engine.getSnapshot().step).toBe(1);
    expect(preventDefault).toHaveBeenCalledOnce();
    binding.destroy();
  });

  it("tracks and toggles fullscreen through an injected document port", async () => {
    const engine = createDeckEngine(manifest);
    const events = new FakeEventTarget();
    const exitFullscreen = vi.fn(() => Promise.resolve());
    const fullscreenDocument = Object.assign(events, {
      fullscreenElement: null as Element | null,
      exitFullscreen,
    }) satisfies FullscreenDocument;
    const binding = bindFullscreenState(engine, fullscreenDocument);
    fullscreenDocument.fullscreenElement = {} as Element;
    events.emit("fullscreenchange", {});
    expect(engine.getSnapshot().fullscreen).toBe(true);
    await toggleFullscreen(
      { requestFullscreen: vi.fn(() => Promise.resolve()) },
      fullscreenDocument,
    );
    expect(exitFullscreen).toHaveBeenCalledOnce();
    binding.destroy();
  });

  it("adapts requestAnimationFrame without owning time", () => {
    const callback = vi.fn();
    const host = {
      performance: { now: () => 42 },
      requestAnimationFrame: (frame: FrameRequestCallback): number => {
        frame(99);
        return 7;
      },
      cancelAnimationFrame: vi.fn(),
    };
    const clock = createBrowserTimelineClock(host);
    expect(clock.now()).toBe(42);
    expect(clock.requestFrame(callback)).toBe(7);
    expect(callback).toHaveBeenCalledOnce();
  });
});

describe("URL state adapter", () => {
  it("round-trips stable URL state", () => {
    const parsed = parseDeckUrl("#slide=two&step=3&mode=speaker");
    expect(parsed).toEqual({ slideId: "two", step: 3, mode: "speaker" });
    expect(() => parseDeckUrl("#step=-1")).toThrow("Invalid deck URL step");
    expect(
      serializeDeckUrl({
        slideId: "one",
        slideIndex: 0,
        step: 1,
        mode: "present",
        fullscreen: false,
      }),
    ).toBe("#slide=one&step=1&mode=present");
  });

  it("hydrates the engine and writes subsequent state with history replacement", () => {
    const engine = createDeckEngine(manifest);
    const host = new FakeUrlHost();
    host.location.hash = "#slide=two&step=0&mode=speaker";
    const binding = bindUrlState(engine, { host });
    expect(engine.getSnapshot()).toMatchObject({
      slideId: "two",
      mode: "speaker",
    });
    engine.dispatch({ type: "GOTO", slideId: "one" });
    expect(host.location.hash).toBe("#slide=one&step=0&mode=speaker");
    binding.destroy();
  });
});

describe("BroadcastChannel navigation sync", () => {
  it("synchronizes navigation snapshots while preserving window-local state", () => {
    const presenter = createDeckEngine(manifest);
    const speaker = createDeckEngine(manifest);
    speaker.dispatch({ type: "GOTO", slideId: "two" });
    speaker.dispatch({ type: "SET_MODE", mode: "speaker" });
    const bus = new FakeBroadcastBus();
    const presenterSync = createBroadcastSync(presenter, "deck", {
      source: "presenter",
      channelFactory: bus.create,
    });
    const speakerSync = createBroadcastSync(speaker, "deck", {
      source: "speaker",
      channelFactory: bus.create,
    });
    speakerSync.requestSnapshot();
    expect(speaker.getSnapshot()).toMatchObject({
      slideId: "one",
      mode: "speaker",
    });
    presenter.dispatch({ type: "NEXT" });
    expect(speaker.getSnapshot()).toMatchObject({ step: 1, mode: "speaker" });
    presenter.dispatch({ type: "SET_FULLSCREEN", fullscreen: true });
    expect(speaker.getSnapshot().fullscreen).toBe(false);
    presenterSync.destroy();
    speakerSync.destroy();
  });

  it("synchronizes optional timeline and declared slide state for a follower", () => {
    const presenter = createDeckEngine(manifest);
    const speaker = createDeckEngine(manifest);
    const presenterTimeline = createTimelineController(1000);
    const speakerTimeline = createTimelineController(1000);
    const presenterState = createSlideStateStore(presenter);
    const speakerState = createSlideStateStore(speaker);
    presenterState.register({
      key: "focus",
      initial: "core",
      inspect: ["core", "tools"],
    });
    speakerState.register({
      key: "focus",
      initial: "core",
      inspect: ["core", "tools"],
    });
    const bus = new FakeBroadcastBus();
    const presenterSync = createPresentationSync(presenter, "deck", {
      role: "presenter",
      source: "presenter",
      channelFactory: bus.create,
      timeline: presenterTimeline,
      slideState: presenterState,
    });
    const speakerSync = createPresentationSync(speaker, "deck", {
      role: "follower",
      source: "speaker",
      channelFactory: bus.create,
      timeline: speakerTimeline,
      slideState: speakerState,
    });
    speakerSync.requestSnapshot();
    presenterTimeline.dispatch({ type: "SEEK", timeMs: 500 });
    presenterTimeline.dispatch({ type: "SET_PLAYING", playing: true });
    presenterState.set("focus", "tools");
    expect(speakerTimeline.getSnapshot()).toEqual({
      timeMs: 500,
      playing: true,
      durationMs: 1000,
    });
    expect(speakerState.getSnapshot().values).toEqual({ focus: "tools" });
    presenterSync.destroy();
    speakerSync.destroy();
  });
});
