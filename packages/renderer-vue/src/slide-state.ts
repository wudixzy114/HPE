import {
  computed,
  inject,
  onScopeDispose,
  provide,
  readonly,
  shallowRef,
  type InjectionKey,
  type ShallowRef,
  type WritableComputedRef,
} from "vue";

import type {
  SlideStateSnapshot,
  SlideStateStore,
  SlideStateValue,
} from "@hpe/runtime-core/slide-state";

export interface SlideStateVueContext {
  readonly store: SlideStateStore;
  readonly state: Readonly<ShallowRef<SlideStateSnapshot>>;
}

export interface UseSlideStateOptions<T extends SlideStateValue> {
  readonly initial: T;
  readonly inspect: readonly T[];
  readonly slideId?: string;
}

const slideStateKey: InjectionKey<SlideStateVueContext> = Symbol(
  "hpe-slide-state-context",
);

export function provideSlideStateStore(
  store: SlideStateStore,
): SlideStateVueContext {
  const state = shallowRef(store.getSnapshot());
  const unsubscribe = store.subscribe((next) => {
    state.value = next;
  });
  onScopeDispose(unsubscribe);
  const context = { store, state: readonly(state) };
  provide(slideStateKey, context);
  return context;
}

export function useSlideState<T extends SlideStateValue>(
  key: string,
  options: UseSlideStateOptions<T>,
): WritableComputedRef<T> {
  const context = inject(slideStateKey);
  if (!context) throw new Error("No slide state store was provided");
  const unregister = context.store.register({
    key,
    initial: options.initial,
    inspect: options.inspect,
    ...(options.slideId === undefined ? {} : { slideId: options.slideId }),
  });
  onScopeDispose(unregister);
  return computed<T>({
    get: () =>
      (context.state.value.values[key] as T | undefined) ?? options.initial,
    set: (value) => {
      context.store.set(key, value);
    },
  });
}
