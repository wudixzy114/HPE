<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

import { manifest } from "virtual:hpe-deck";

const props = withDefaults(
  defineProps<{
    fit?: boolean;
    label?: string;
  }>(),
  { fit: true, label: "Slide preview" },
);

const root = ref<HTMLElement>();
const scale = ref(1);
let observer: ResizeObserver | undefined;

function resize(): void {
  if (!props.fit || !root.value) {
    scale.value = 1;
    return;
  }
  scale.value = Math.min(
    root.value.clientWidth / manifest.size.width,
    root.value.clientHeight / manifest.size.height,
  );
}

onMounted(() => {
  resize();
  if (props.fit) {
    observer = new ResizeObserver(resize);
    observer.observe(root.value!);
  }
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <div
    ref="root"
    class="hpe-scaled-frame"
    :class="{ 'hpe-scaled-frame--fixed': !fit }"
    role="group"
    :aria-label="label"
  >
    <div
      class="hpe-scaled-frame__canvas"
      :style="{
        width: `${manifest.size.width}px`,
        height: `${manifest.size.height}px`,
        transform: `scale(${scale})`,
      }"
    >
      <slot />
    </div>
  </div>
</template>
