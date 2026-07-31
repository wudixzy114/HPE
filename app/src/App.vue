<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from "vue";

import { provideDeckEngine } from "@hpe/renderer-vue";
import {
  bindBrowserControls,
  type BrowserControls,
} from "@hpe/runtime-browser";
import type { DeckEngine, DeckEvent } from "@hpe/runtime-core";
import { manifest, slides } from "virtual:hpe-deck";

const props = defineProps<{ engine: DeckEngine }>();
const { state } = provideDeckEngine(props.engine);
const currentSlide = computed(() => slides[state.value.slideId]);
const scale = ref(1);
let controls: BrowserControls | undefined;

function resize(): void {
  scale.value = Math.min(
    window.innerWidth / manifest.size.width,
    window.innerHeight / manifest.size.height,
  );
}

onMounted(() => {
  controls = bindBrowserControls(props.engine);
  resize();
  window.addEventListener("resize", resize, { passive: true });
  (
    window as unknown as { __HPE__: { dispatch: (event: DeckEvent) => void } }
  ).__HPE__ = {
    dispatch: (event) => {
      props.engine.dispatch(event);
    },
  };
});

onBeforeUnmount(() => {
  controls?.destroy();
  window.removeEventListener("resize", resize);
});

watchEffect(() => {
  document.documentElement.dataset.hpeStep = String(state.value.step);
  document.documentElement.dataset.hpeMode = state.value.mode;
});
</script>

<template>
  <main class="hpe-viewport">
    <div
      class="hpe-stage"
      :style="{
        width: `${manifest.size.width}px`,
        height: `${manifest.size.height}px`,
        transform: `scale(${scale})`,
      }"
    >
      <component
        :is="currentSlide"
        v-if="currentSlide"
        :data-slide-id="state.slideId"
      />
    </div>
    <div
      class="hpe-progress"
      :style="{
        width: `${((state.slideIndex + 1) / manifest.slides.length) * 100}%`,
      }"
    />
    <output class="hpe-page-number"
      >{{ state.slideIndex + 1 }} / {{ manifest.slides.length }}</output
    >
  </main>
</template>
