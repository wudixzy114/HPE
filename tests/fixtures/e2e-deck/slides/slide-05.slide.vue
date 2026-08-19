<template>
  <Slide class="e2e-slide">
    <h1 data-node="title">Interactive State</h1>
    <Step :at="1"><p>Step one revealed</p></Step>
    <Step :at="2"><p>Step two revealed</p></Step>
    <button type="button" class="e2e-next" @click="nextStep()">
      Next step
    </button>
  </Slide>
</template>

<script setup lang="ts">
import { useSlideState } from "@hpe/renderer-vue/slide-state";

const demoStep = useSlideState("demo-step", { initial: 0, inspect: [0, 1, 2] });
function nextStep() {
  demoStep.value = Math.min(demoStep.value + 1, 2);
}
</script>
<notes lang="md">
E2E notes: interactive sync target.
</notes>
