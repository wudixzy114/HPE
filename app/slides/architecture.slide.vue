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
        <article
          v-for="item in modules"
          :key="item.name"
          class="rounded-2xl border border-slate-700 bg-slate-900/70 p-7"
        >
          <h2 class="text-2xl font-semibold">{{ item.name }}</h2>
          <p class="mt-4 text-lg leading-relaxed text-slate-400">
            {{ item.role }}
          </p>
        </article>
      </div>
    </div>
  </Slide>
</template>

<script setup lang="ts">
const modules = [
  {
    name: "Core",
    role: "Pure state transitions and stable ports. No browser, framework or tooling.",
  },
  {
    name: "Adapters",
    role: "Vue and browser capabilities depend inward and can be replaced independently.",
  },
  {
    name: "Tools",
    role: "Compiler, checker and CLI stay outside the shipped presentation runtime.",
  },
] as const;
</script>

<notes lang="md">
The dependency checker enforces these boundaries in CI.
</notes>
