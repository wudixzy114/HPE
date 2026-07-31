import {
  computed,
  defineComponent,
  h,
  inject,
  onScopeDispose,
  provide,
  readonly,
  shallowRef,
  type ComputedRef,
  type InjectionKey,
  type ShallowRef,
} from "vue";

import type {
  TimelineController,
  TimelineState,
} from "@hpe/runtime-core/timeline";

export interface TimelineVueContext {
  readonly controller: TimelineController;
  readonly state: Readonly<ShallowRef<TimelineState>>;
  readonly progress: ComputedRef<number>;
  play(): void;
  pause(): void;
  seek(timeMs: number): void;
}

const timelineKey: InjectionKey<TimelineVueContext> = Symbol(
  "hpe-timeline-context",
);

export function provideTimeline(
  controller: TimelineController,
): TimelineVueContext {
  const state = shallowRef(controller.getSnapshot());
  const unsubscribe = controller.subscribe((next) => {
    state.value = next;
  });
  onScopeDispose(unsubscribe);
  const progress = computed(() => {
    const duration = state.value.durationMs;
    return duration === undefined || duration === 0
      ? 0
      : state.value.timeMs / duration;
  });
  const context: TimelineVueContext = {
    controller,
    state: readonly(state),
    progress,
    play: () => controller.dispatch({ type: "SET_PLAYING", playing: true }),
    pause: () => controller.dispatch({ type: "SET_PLAYING", playing: false }),
    seek: (timeMs) => controller.dispatch({ type: "SEEK", timeMs }),
  };
  provide(timelineKey, context);
  return context;
}

export function useTimeline(): TimelineVueContext {
  const context = inject(timelineKey);
  if (!context) throw new Error("No timeline controller was provided");
  return context;
}

export const Timeline = defineComponent({
  name: "HpeTimeline",
  props: {
    from: { type: Number, default: 0 },
    to: { type: Number, required: true },
  },
  setup(props, { slots }) {
    const { state } = useTimeline();
    const progress = computed(() => {
      if (props.to <= props.from) return state.value.timeMs >= props.to ? 1 : 0;
      return Math.max(
        0,
        Math.min(
          1,
          (state.value.timeMs - props.from) / (props.to - props.from),
        ),
      );
    });
    return () =>
      h(
        "div",
        {
          class: "hpe-timeline",
          "data-timeline-from": props.from,
          "data-timeline-to": props.to,
          "data-timeline-progress": progress.value,
        },
        slots.default?.({
          progress: progress.value,
          timeMs: state.value.timeMs,
        }),
      );
  },
});
