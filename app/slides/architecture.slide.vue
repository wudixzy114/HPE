<template>
  <Slide>
    <div class="flex h-full flex-col px-20 py-16">
      <p class="text-lg tracking-[0.2em] text-emerald-300">
        DEPENDENCY DIRECTION
      </p>
      <h1 data-node="title" class="mt-3 text-6xl font-semibold">
        Ports in the center, adapters at the edge
      </h1>
      <div data-node="modules" class="mt-16 grid flex-1 grid-cols-3 gap-5">
        <button
          v-for="item in modules"
          :key="item.name"
          type="button"
          class="rounded-2xl border bg-slate-900/70 p-7 text-left"
          :class="{
            'border-emerald-300': focus === item.key,
            'border-slate-700': focus !== item.key,
          }"
          @click="focus = item.key"
        >
          <h2 class="text-2xl font-semibold">{{ item.name }}</h2>
          <p class="mt-4 text-lg leading-relaxed text-slate-400">
            {{ item.role }}
          </p>
        </button>
      </div>
    </div>
  </Slide>
</template>

<script setup lang="ts">
import { useSlideState } from "@hpe/renderer-vue/slide-state";

const focus = useSlideState("focus", {
  initial: "core",
  inspect: ["core", "adapters", "tools"],
});

const modules = [
  {
    key: "core",
    name: "Core",
    role: "Pure state transitions and stable ports. No browser, framework or tooling.",
  },
  {
    key: "adapters",
    name: "Adapters",
    role: "Vue and browser capabilities depend inward and can be replaced independently.",
  },
  {
    key: "tools",
    name: "Tools",
    role: "Compiler, checker and CLI stay outside the shipped presentation runtime.",
  },
] as const;
</script>

<notes lang="md">
The dependency checker enforces these boundaries in CI.
</notes>
