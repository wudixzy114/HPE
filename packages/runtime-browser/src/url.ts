import type { DeckEngine, DeckState } from "@hpe/runtime-core";
import type { BrowserBinding, BrowserEventTarget } from "./keyboard.js";

type SlideMode = DeckState["mode"];

export interface DeckUrlState {
  readonly slideId?: string;
  readonly step?: number;
  readonly mode?: SlideMode;
}

export interface HistoryPort {
  replaceState(data: unknown, unused: string, url?: string | URL | null): void;
}

export interface UrlHost extends BrowserEventTarget {
  readonly location: Pick<Location, "hash">;
  readonly history: HistoryPort;
}

export interface UrlBindingOptions {
  readonly host?: UrlHost;
  readonly onInvalidUrl?: (error: Error) => void;
}

const SLIDE_MODES = new Set<SlideMode>(["present", "speaker", "inspect"]);

export function parseDeckUrl(hash: string): DeckUrlState {
  const value = hash.startsWith("#") ? hash.slice(1) : hash;
  const parameters = new URLSearchParams(value);
  const slideId = parameters.get("slide")?.trim() || undefined;
  const rawStep = parameters.get("step");
  const parsedStep =
    rawStep === null || rawStep === "" ? undefined : Number(rawStep);
  if (
    parsedStep !== undefined &&
    (!Number.isInteger(parsedStep) || parsedStep < 0)
  ) {
    throw new Error(`Invalid deck URL step: ${rawStep}`);
  }
  const rawMode = parameters.get("mode") ?? undefined;
  if (rawMode !== undefined && !SLIDE_MODES.has(rawMode as SlideMode)) {
    throw new Error(`Invalid deck URL mode: ${rawMode}`);
  }
  return {
    ...(slideId === undefined ? {} : { slideId }),
    ...(parsedStep === undefined ? {} : { step: parsedStep }),
    ...(rawMode === undefined ? {} : { mode: rawMode as SlideMode }),
  };
}

export function serializeDeckUrl(state: DeckState): string {
  const parameters = new URLSearchParams({
    slide: state.slideId,
    step: String(state.step),
    mode: state.mode,
  });
  return `#${parameters.toString()}`;
}

export function bindUrlState(
  engine: DeckEngine,
  options: UrlBindingOptions = {},
): BrowserBinding {
  const host = options.host ?? window;
  let writing = false;

  const applyHash = (): void => {
    if (writing) return;
    try {
      const state = parseDeckUrl(host.location.hash);
      if (state.slideId !== undefined)
        engine.dispatch({ type: "GOTO", slideId: state.slideId });
      if (state.step !== undefined)
        engine.dispatch({ type: "SET_STEP", step: state.step });
      if (state.mode !== undefined)
        engine.dispatch({ type: "SET_MODE", mode: state.mode });
    } catch (error) {
      options.onInvalidUrl?.(
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  };
  applyHash();

  const unsubscribe = engine.subscribe((state) => {
    const hash = serializeDeckUrl(state);
    if (host.location.hash === hash) return;
    writing = true;
    host.history.replaceState(null, "", hash);
    writing = false;
  });
  const onHashChange: EventListener = () => applyHash();
  host.addEventListener("hashchange", onHashChange);
  if (!host.location.hash) {
    const hash = serializeDeckUrl(engine.getSnapshot());
    host.history.replaceState(null, "", hash);
  }

  return {
    destroy() {
      unsubscribe();
      host.removeEventListener("hashchange", onHashChange);
    },
  };
}
