import type { DeckEngine } from "@hpe/runtime-core";
import type {
  SlideStateStore,
  SlideStateValues,
} from "@hpe/runtime-core/slide-state";
import type {
  TimelineController,
  TimelineState,
} from "@hpe/runtime-core/timeline";

import {
  createBroadcastSync,
  type BroadcastChannelPort,
  type BroadcastSyncOptions,
  type DeckSync,
} from "./sync.js";

type SyncRole = "presenter" | "follower";

type FeatureMessage =
  | { readonly source: string; readonly type: "feature-snapshot-request" }
  | {
      readonly source: string;
      readonly type: "timeline";
      readonly state: TimelineState;
    }
  | {
      readonly source: string;
      readonly type: "slide-state";
      readonly slideId: string;
      readonly values: SlideStateValues;
    };

export interface PresentationSyncOptions extends BroadcastSyncOptions {
  readonly role: SyncRole;
  readonly timeline?: TimelineController;
  readonly slideState?: SlideStateStore;
}

function defaultChannelFactory(name: string): BroadcastChannelPort {
  return new BroadcastChannel(name);
}

function isTimelineState(value: unknown): value is TimelineState {
  if (!value || typeof value !== "object") return false;
  const state = value as {
    timeMs?: unknown;
    playing?: unknown;
    durationMs?: unknown;
  };
  return (
    typeof state.timeMs === "number" &&
    Number.isFinite(state.timeMs) &&
    state.timeMs >= 0 &&
    typeof state.playing === "boolean" &&
    (state.durationMs === undefined ||
      (typeof state.durationMs === "number" &&
        Number.isFinite(state.durationMs) &&
        state.durationMs >= 0))
  );
}

function isSlideStateValues(value: unknown): value is SlideStateValues {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return Object.values(value).every(
    (entry) =>
      entry === null ||
      typeof entry === "string" ||
      typeof entry === "boolean" ||
      (typeof entry === "number" && Number.isFinite(entry)),
  );
}

function isFeatureMessage(value: unknown): value is FeatureMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as {
    source?: unknown;
    type?: unknown;
    state?: unknown;
    slideId?: unknown;
    values?: unknown;
  };
  if (typeof message.source !== "string") return false;
  if (message.type === "feature-snapshot-request") return true;
  if (message.type === "timeline") return isTimelineState(message.state);
  return (
    message.type === "slide-state" &&
    typeof message.slideId === "string" &&
    isSlideStateValues(message.values)
  );
}

function reportInvalid(options: PresentationSyncOptions, error: unknown): void {
  options.onInvalidMessage?.(
    error instanceof Error ? error : new Error(String(error)),
  );
}

function applyTimeline(
  controller: TimelineController,
  state: TimelineState,
): void {
  controller.dispatch({
    type: "RESET",
    ...(state.durationMs === undefined ? {} : { durationMs: state.durationMs }),
  });
  controller.dispatch({ type: "SEEK", timeMs: state.timeMs });
  controller.dispatch({ type: "SET_PLAYING", playing: state.playing });
}

/** Synchronizes optional presentation features without adding them to the minimal deck engine. */
export function createPresentationSync(
  engine: DeckEngine,
  channelName: string,
  options: PresentationSyncOptions,
): DeckSync {
  const source =
    options.source ??
    globalThis.crypto?.randomUUID() ??
    `hpe-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const channelFactory = options.channelFactory ?? defaultChannelFactory;
  const navigation = createBroadcastSync(engine, `${channelName}:navigation`, {
    source,
    channelFactory,
    ...(options.onInvalidMessage === undefined
      ? {}
      : { onInvalidMessage: options.onInvalidMessage }),
  });
  const channel = channelFactory(`${channelName}:features`);
  let active = true;
  let applyingRemote = false;
  let timelineBucket = -1;

  const postTimeline = (): void => {
    if (options.timeline) {
      channel.postMessage({
        source,
        type: "timeline",
        state: options.timeline.getSnapshot(),
      } satisfies FeatureMessage);
    }
  };
  const postSlideState = (): void => {
    if (options.slideState) {
      const snapshot = options.slideState.getSnapshot();
      channel.postMessage({
        source,
        type: "slide-state",
        slideId: snapshot.slideId,
        values: snapshot.values,
      } satisfies FeatureMessage);
    }
  };

  const unsubscribeTimeline = options.timeline?.subscribe((state, event) => {
    if (options.role !== "presenter" || applyingRemote) return;
    const bucket = Math.floor(state.timeMs / 1000);
    if (event.type !== "ADVANCE" || bucket !== timelineBucket) {
      timelineBucket = bucket;
      postTimeline();
    }
  });
  const unsubscribeSlideState = options.slideState?.subscribe(() => {
    if (options.role === "presenter" && !applyingRemote) postSlideState();
  });

  const onMessage = (event: MessageEvent<unknown>): void => {
    if (!isFeatureMessage(event.data) || event.data.source === source) return;
    if (event.data.type === "feature-snapshot-request") {
      if (options.role === "presenter") {
        postTimeline();
        postSlideState();
      }
      return;
    }
    if (options.role !== "follower") return;
    applyingRemote = true;
    try {
      if (event.data.type === "timeline" && options.timeline) {
        applyTimeline(options.timeline, event.data.state);
      } else if (
        event.data.type === "slide-state" &&
        options.slideState &&
        options.slideState.getSnapshot().slideId === event.data.slideId
      ) {
        options.slideState.setScenario(event.data.values);
      }
    } catch (error) {
      reportInvalid(options, error);
    } finally {
      applyingRemote = false;
    }
  };
  channel.addEventListener("message", onMessage);

  return {
    requestSnapshot() {
      if (!active) throw new Error("Presentation sync has been destroyed");
      navigation.requestSnapshot();
      channel.postMessage({
        source,
        type: "feature-snapshot-request",
      } satisfies FeatureMessage);
    },
    destroy() {
      if (!active) return;
      active = false;
      unsubscribeTimeline?.();
      unsubscribeSlideState?.();
      channel.removeEventListener("message", onMessage);
      channel.close();
      navigation.destroy();
    },
  };
}
