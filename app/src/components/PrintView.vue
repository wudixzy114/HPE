<script setup lang="ts">
import { manifest, slides } from "virtual:hpe-deck";

import SlidePreview from "./SlidePreview.vue";
</script>

<template>
  <section class="hpe-print-deck" aria-label="Printable deck">
    <article
      v-for="slide in manifest.slides"
      :key="slide.id"
      class="hpe-print-page"
    >
      <SlidePreview
        :component="slides[slide.id]!"
        :slide-id="slide.id"
        :step="slide.maxStep ?? 0"
        :fit="false"
        :label="`Printable slide: ${slide.title ?? slide.id}`"
      />
    </article>
  </section>
</template>
