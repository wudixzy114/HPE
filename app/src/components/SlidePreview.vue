<script setup lang="ts">
import { onBeforeUnmount, watch, type Component } from "vue";

import { provideDeckEngine } from "@hpe/renderer-vue";
import { provideSlideStateStore } from "@hpe/renderer-vue/slide-state";
import { provideTimeline } from "@hpe/renderer-vue/timeline";
import { createDeckEngine } from "@hpe/runtime-core";
import { createSlideStateStore } from "@hpe/runtime-core/slide-state";
import { createTimelineController } from "@hpe/runtime-core/timeline";
import { manifest } from "virtual:hpe-deck";

import ScaledFrame from "./ScaledFrame.vue";

const props = withDefaults(
  defineProps<{
    component: Component;
    slideId: string;
    step?: number;
    timelineMs?: number;
    fit?: boolean;
    label?: string;
    interactive?: boolean;
  }>(),
  {
    step: 0,
    timelineMs: 0,
    fit: true,
    label: "Slide preview",
    interactive: false,
  },
);

const engine = createDeckEngine(manifest);
const timeline = createTimelineController();
const slideState = createSlideStateStore(engine);
provideDeckEngine(engine);
provideTimeline(timeline);
provideSlideStateStore(slideState);

watch(
  () => [props.slideId, props.step, props.timelineMs] as const,
  ([slideId, step, timelineMs]) => {
    engine.dispatch({ type: "GOTO", slideId });
    engine.dispatch({ type: "SET_STEP", step });
    const durationMs = manifest.slides.find(
      (slide) => slide.id === slideId,
    )?.durationMs;
    timeline.dispatch({
      type: "RESET",
      ...(durationMs === undefined ? {} : { durationMs }),
    });
    timeline.dispatch({ type: "SEEK", timeMs: timelineMs });
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  slideState.destroy();
  timeline.destroy();
  engine.destroy();
});
</script>

<template>
  <ScaledFrame :fit="fit" :label="label" :inert="!interactive">
    <component :is="component" :data-slide-id="slideId" data-hpe-preview="" />
  </ScaledFrame>
</template>
