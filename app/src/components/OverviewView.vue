<script setup lang="ts">
import type { DeckEngine } from "@hpe/runtime-core";
import { manifest, slides } from "virtual:hpe-deck";

import SlidePreview from "./SlidePreview.vue";

const props = defineProps<{ engine: DeckEngine; currentSlideId: string }>();
const emit = defineEmits<{ close: [] }>();

function select(slideId: string): void {
  props.engine.dispatch({ type: "GOTO", slideId });
  emit("close");
}
</script>

<template>
  <section class="hpe-overview" aria-label="Slide overview">
    <header class="hpe-overview__header">
      <div>
        <p>OVERVIEW</p>
        <h1>{{ manifest.title }}</h1>
      </div>
      <button type="button" @click="$emit('close')">
        Close <kbd>Esc</kbd>
      </button>
    </header>
    <ol class="hpe-overview__grid">
      <li v-for="(slide, index) in manifest.slides" :key="slide.id">
        <div
          class="hpe-overview__slide"
          :class="{
            'hpe-overview__slide--current': slide.id === currentSlideId,
          }"
        >
          <SlidePreview
            :component="slides[slide.id]!"
            :slide-id="slide.id"
            :label="`Preview of ${slide.title ?? slide.id}`"
          />
          <span>{{ index + 1 }}. {{ slide.title ?? slide.id }}</span>
          <button
            type="button"
            class="hpe-overview__select"
            :aria-label="`Go to slide ${index + 1}: ${slide.title ?? slide.id}`"
            @click="select(slide.id)"
          />
        </div>
      </li>
    </ol>
  </section>
</template>
