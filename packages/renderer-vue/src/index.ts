import {
  computed,
  defineComponent,
  h,
  inject,
  onScopeDispose,
  provide,
  readonly,
  shallowRef,
  type InjectionKey,
  type PropType,
  type ShallowRef,
} from "vue";

import type { DeckEngine, DeckState } from "@hpe/runtime-core";

export interface DeckVueContext {
  readonly engine: DeckEngine;
  readonly state: Readonly<ShallowRef<DeckState>>;
}

const deckContextKey: InjectionKey<DeckVueContext> = Symbol("hpe-deck-context");

export function provideDeckEngine(engine: DeckEngine): DeckVueContext {
  const state = shallowRef(engine.getSnapshot());
  const unsubscribe = engine.subscribe((next) => {
    state.value = next;
  });
  onScopeDispose(unsubscribe);
  const context = { engine, state: readonly(state) };
  provide(deckContextKey, context);
  return context;
}

export function useDeck(): DeckVueContext {
  const context = inject(deckContextKey);
  if (!context) throw new Error("No deck engine was provided");
  return context;
}

export const Slide = defineComponent({
  name: "HpeSlide",
  inheritAttrs: false,
  setup(_props, { attrs, slots }) {
    return () => {
      const { class: inheritedClass, ...rest } = attrs;
      return h(
        "section",
        {
          ...rest,
          class: ["hpe-slide", inheritedClass],
          "data-hpe-slide": "",
        },
        slots.default?.(),
      );
    };
  },
});

export const Step = defineComponent({
  name: "HpeStep",
  props: {
    at: { type: Number, required: true },
    display: {
      type: String as PropType<"visibility" | "mount">,
      default: "visibility",
    },
  },
  setup(props, { slots }) {
    const { state } = useDeck();
    const visible = computed(() => state.value.step >= props.at);
    return () => {
      if (props.display === "mount" && !visible.value) return null;
      return h(
        "div",
        {
          class: ["hpe-step", { "hpe-step--hidden": !visible.value }],
          "aria-hidden": String(!visible.value),
          "data-step": props.at,
        },
        slots.default?.(),
      );
    };
  },
});
