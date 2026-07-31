import type {
  DeckEngine,
  DeckEvent,
  DeckState,
  Unsubscribe,
} from "@hpe/runtime-core";

type SyncMessage =
  | {
      readonly source: string;
      readonly type: "event";
      readonly event: DeckEvent;
    }
  | {
      readonly source: string;
      readonly type: "snapshot-request";
    }
  | {
      readonly source: string;
      readonly type: "snapshot";
      readonly state: DeckState;
    };

export interface DeckSync {
  requestSnapshot(): void;
  destroy(): void;
}

/** Optional cross-window adapter; importing the base browser package does not load it. */
export function createBroadcastSync(
  engine: DeckEngine,
  channelName: string,
  source = crypto.randomUUID(),
): DeckSync {
  const channel = new BroadcastChannel(channelName);
  let applyingRemote = false;

  const unsubscribe: Unsubscribe = engine.subscribe((_state, event) => {
    if (!applyingRemote)
      channel.postMessage({
        source,
        type: "event",
        event,
      } satisfies SyncMessage);
  });

  channel.addEventListener("message", (message: MessageEvent<SyncMessage>) => {
    if (!message.data || message.data.source === source) return;
    if (message.data.type === "snapshot-request") {
      channel.postMessage({
        source,
        type: "snapshot",
        state: engine.getSnapshot(),
      } satisfies SyncMessage);
    } else if (message.data.type === "event") {
      applyingRemote = true;
      try {
        engine.dispatch(message.data.event);
      } finally {
        applyingRemote = false;
      }
    } else {
      applyingRemote = true;
      try {
        engine.dispatch({ type: "GOTO", slideId: message.data.state.slideId });
        engine.dispatch({ type: "SET_STEP", step: message.data.state.step });
        engine.dispatch({ type: "SET_MODE", mode: message.data.state.mode });
      } finally {
        applyingRemote = false;
      }
    }
  });

  return {
    requestSnapshot() {
      channel.postMessage({
        source,
        type: "snapshot-request",
      } satisfies SyncMessage);
    },
    destroy() {
      unsubscribe();
      channel.close();
    },
  };
}
