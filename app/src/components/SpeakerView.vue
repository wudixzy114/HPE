<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import { useDeck } from "@hpe/renderer-vue";
import type { DeckEngine } from "@hpe/runtime-core";
import { manifest, slides } from "virtual:hpe-deck";
import { notes } from "virtual:hpe-deck/notes";

import ScaledFrame from "./ScaledFrame.vue";
import SlidePreview from "./SlidePreview.vue";

const props = defineProps<{ engine: DeckEngine }>();
const { state } = useDeck();
const currentEntry = computed(() => manifest.slides[state.value.slideIndex]);
const nextEntry = computed(() => manifest.slides[state.value.slideIndex + 1]);
const currentComponent = computed(() => slides[state.value.slideId]);
const elapsedSeconds = ref(0);
let timer: ReturnType<typeof setInterval> | undefined;

const elapsed = computed(() => {
  const minutes = Math.floor(elapsedSeconds.value / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (elapsedSeconds.value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
});

onMounted(() => {
  timer = setInterval(() => {
    elapsedSeconds.value += 1;
  }, 1000);
});
onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <main class="hpe-speaker">
    <header class="hpe-speaker__header">
      <div>
        <strong>{{ manifest.title }}</strong>
        <span>Speaker view</span>
      </div>
      <output aria-label="Elapsed presentation time">{{ elapsed }}</output>
      <span>{{ state.slideIndex + 1 }} / {{ manifest.slides.length }}</span>
    </header>

    <section class="hpe-speaker__current" aria-label="Current slide">
      <h2>Current</h2>
      <ScaledFrame
        v-if="currentComponent"
        :label="`Current slide: ${currentEntry?.title ?? state.slideId}`"
      >
        <component :is="currentComponent" :data-slide-id="state.slideId" />
      </ScaledFrame>
    </section>

    <section class="hpe-speaker__next" aria-label="Next slide">
      <h2>Next</h2>
      <SlidePreview
        v-if="nextEntry"
        :component="slides[nextEntry.id]!"
        :slide-id="nextEntry.id"
        :label="`Next slide: ${nextEntry.title ?? nextEntry.id}`"
      />
      <div v-else class="hpe-speaker__end">End of deck</div>
    </section>

    <section class="hpe-speaker__notes" aria-label="Speaker notes">
      <h2>Notes</h2>
      <pre>{{ notes[state.slideId] || "No notes for this slide." }}</pre>
    </section>

    <nav class="hpe-speaker__controls" aria-label="Presentation controls">
      <button
        type="button"
        @click="props.engine.dispatch({ type: 'PREVIOUS' })"
      >
        ← Previous
      </button>
      <button type="button" @click="props.engine.dispatch({ type: 'NEXT' })">
        Next →
      </button>
    </nav>
  </main>
</template>
