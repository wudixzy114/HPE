<template>
  <Slide class="hello-slide">
    <div>
      <div class="hello-kicker">Interaction</div>
      <h2 data-node="title">Inspectable interaction with useSlideState</h2>
    </div>
    <div class="hello-body">
      <div class="hello-tabs" data-node="tabs">
        <button
          v-for="option in options"
          :key="option.id"
          type="button"
          class="hello-tab"
          :aria-pressed="framework === option.id"
          @click="framework = option.id"
        >
          {{ option.label }}
        </button>
      </div>
      <div class="hello-panel" data-node="detail">
        <h3>{{ active.label }}</h3>
        <p>{{ active.detail }}</p>
      </div>
    </div>
    <div class="hello-footer">
      <span>Hello HPE · Interaction</span><span>3 / 4</span>
    </div>
  </Slide>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { useSlideState } from "@hpe/renderer-vue/slide-state";

const options = [
  {
    id: "engine",
    label: "Engine",
    detail:
      "A pure state machine in @hpe/runtime-core. Navigation, steps, and modes are plain reducer events — no browser APIs in the core.",
  },
  {
    id: "player",
    label: "Player",
    detail:
      "The Vue application in app/. Keyboard, touch, fullscreen, deep links, overview, speaker view, and print live here and in @hpe/runtime-browser.",
  },
  {
    id: "checker",
    label: "Checker",
    detail:
      "@hpe/checker drives a real browser through every slide × step × interaction state and reports overflow, contrast, and clipping as JSON.",
  },
] as const;

const framework = useSlideState("framework", {
  initial: options[0].id,
  inspect: options.map((option) => option.id),
});

const active = computed(
  () => options.find((option) => option.id === framework.value) ?? options[0],
);
</script>

<notes lang="md">
Finite interactions belong in useSlideState with an explicit `inspect` list so
the checker can render and audit every tab. Free-form Vue state is allowed,
but anything checkable should be exposed this way.
</notes>
