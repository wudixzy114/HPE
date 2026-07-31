import type {
  DeckEngine,
  DeckEvent,
  DeckState,
  Unsubscribe,
} from "@hpe/runtime-core";

type NavigationEvent = Extract<
  DeckEvent,
  | { readonly type: "NEXT" }
  | { readonly type: "PREVIOUS" }
  | { readonly type: "GOTO" }
  | { readonly type: "SET_STEP" }
>;

interface NavigationSnapshot {
  readonly slideId: string;
  readonly step: number;
}

type SyncMessage =
  | {
      readonly source: string;
      readonly type: "event";
      readonly event: NavigationEvent;
    }
  | { readonly source: string; readonly type: "snapshot-request" }
  | {
      readonly source: string;
      readonly type: "snapshot";
      readonly state: NavigationSnapshot;
    };

export interface BroadcastChannelPort {
  postMessage(message: unknown): void;
  addEventListener(
    type: "message",
    listener: (event: MessageEvent<unknown>) => void,
  ): void;
  removeEventListener(
    type: "message",
    listener: (event: MessageEvent<unknown>) => void,
  ): void;
  close(): void;
}

export interface BroadcastSyncOptions {
  readonly source?: string;
  readonly channelFactory?: (name: string) => BroadcastChannelPort;
  readonly onInvalidMessage?: (error: Error) => void;
}

export interface DeckSync {
  requestSnapshot(): void;
  destroy(): void;
}

function isNavigationEvent(value: unknown): value is NavigationEvent {
  if (!value || typeof value !== "object" || !("type" in value)) return false;
  const event = value as { type?: unknown; slideId?: unknown; step?: unknown };
  if (event.type === "NEXT" || event.type === "PREVIOUS") return true;
  if (event.type === "GOTO") return typeof event.slideId === "string";
  return (
    event.type === "SET_STEP" &&
    Number.isInteger(event.step) &&
    Number(event.step) >= 0
  );
}

function isSyncMessage(value: unknown): value is SyncMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as {
    source?: unknown;
    type?: unknown;
    event?: unknown;
    state?: unknown;
  };
  if (typeof message.source !== "string") return false;
  if (message.type === "snapshot-request") return true;
  if (message.type === "event") return isNavigationEvent(message.event);
  if (
    message.type !== "snapshot" ||
    !message.state ||
    typeof message.state !== "object"
  )
    return false;
  const state = message.state as { slideId?: unknown; step?: unknown };
  return (
    typeof state.slideId === "string" &&
    Number.isInteger(state.step) &&
    Number(state.step) >= 0
  );
}

function isNavigationEventFromEngine(
  event: DeckEvent,
): event is NavigationEvent {
  return (
    event.type === "NEXT" ||
    event.type === "PREVIOUS" ||
    event.type === "GOTO" ||
    event.type === "SET_STEP"
  );
}

function navigationSnapshot(state: DeckState): NavigationSnapshot {
  return { slideId: state.slideId, step: state.step };
}

function defaultSource(): string {
  return (
    globalThis.crypto?.randomUUID() ??
    `hpe-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}

/** Optional cross-window adapter. Fullscreen and mode deliberately remain local to each window. */
export function createBroadcastSync(
  engine: DeckEngine,
  channelName: string,
  options: BroadcastSyncOptions = {},
): DeckSync {
  const channel = (
    options.channelFactory ?? ((name) => new BroadcastChannel(name))
  )(channelName);
  const source = options.source ?? defaultSource();
  let applyingRemote = false;
  let active = true;

  const unsubscribe: Unsubscribe = engine.subscribe((_state, event) => {
    if (!applyingRemote && isNavigationEventFromEngine(event)) {
      channel.postMessage({
        source,
        type: "event",
        event,
      } satisfies SyncMessage);
    }
  });

  const onMessage = (event: MessageEvent<unknown>): void => {
    if (!isSyncMessage(event.data) || event.data.source === source) return;
    if (event.data.type === "snapshot-request") {
      channel.postMessage({
        source,
        type: "snapshot",
        state: navigationSnapshot(engine.getSnapshot()),
      } satisfies SyncMessage);
      return;
    }
    applyingRemote = true;
    try {
      if (event.data.type === "event") {
        engine.dispatch(event.data.event);
      } else {
        engine.dispatch({ type: "GOTO", slideId: event.data.state.slideId });
        engine.dispatch({ type: "SET_STEP", step: event.data.state.step });
      }
    } catch (error) {
      options.onInvalidMessage?.(
        error instanceof Error ? error : new Error(String(error)),
      );
    } finally {
      applyingRemote = false;
    }
  };
  channel.addEventListener("message", onMessage);

  return {
    requestSnapshot() {
      if (!active) throw new Error("Deck sync has been destroyed");
      channel.postMessage({
        source,
        type: "snapshot-request",
      } satisfies SyncMessage);
    },
    destroy() {
      if (!active) return;
      active = false;
      unsubscribe();
      channel.removeEventListener("message", onMessage);
      channel.close();
    },
  };
}
