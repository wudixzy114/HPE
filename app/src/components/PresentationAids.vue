<script setup lang="ts">
import { notes } from "virtual:hpe-deck/notes";

defineProps<{
  slideId: string;
}>();

defineEmits<{ closeNotes: [] }>();
</script>

<template>
  <aside class="hpe-notes-overlay" aria-label="Current slide notes">
    <header>
      <h2>讲稿</h2>
      <button
        type="button"
        aria-label="Close notes"
        @click="$emit('closeNotes')"
      >
        ×
      </button>
    </header>
    <pre>{{ notes[slideId] || "本页没有讲稿。" }}</pre>
  </aside>
</template>
