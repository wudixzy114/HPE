import type { TimelineClock } from "@hpe/runtime-core/timeline";

export interface AnimationFrameHost {
  readonly performance: Pick<Performance, "now">;
  requestAnimationFrame(callback: FrameRequestCallback): number;
  cancelAnimationFrame(handle: number): void;
}

export function createBrowserTimelineClock(
  host: AnimationFrameHost = window,
): TimelineClock {
  return {
    now: () => host.performance.now(),
    requestFrame: (callback) => host.requestAnimationFrame(() => callback()),
    cancelFrame: (frameId) => host.cancelAnimationFrame(frameId),
  };
}
