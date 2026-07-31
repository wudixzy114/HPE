<template>
  <Slide>
    <div class="grid h-full content-center px-24">
      <p class="mb-5 text-xl font-medium tracking-[0.24em] text-emerald-300">
        HTML PRESENTATION ENGINE
      </p>
      <h1
        data-node="title"
        class="max-w-5xl text-8xl leading-none font-semibold tracking-tight"
      >
        A strict core.<br />Replaceable edges.
      </h1>
      <Step :at="1">
        <p
          data-node="subtitle"
          class="mt-10 max-w-3xl text-2xl leading-relaxed text-slate-400"
        >
          TypeScript contracts connect independent compiler, runtime, renderer,
          browser and checker adapters.
        </p>
      </Step>
      <Timeline v-slot="{ progress }" :to="1200">
        <div class="mt-10 h-1 w-80 overflow-hidden rounded-full bg-slate-800">
          <div
            class="h-full origin-left bg-emerald-300"
            :style="{ transform: `scaleX(${progress})` }"
          />
        </div>
      </Timeline>
    </div>
  </Slide>
</template>

<notes lang="md">
This slide verifies notes extraction and step-based rendering.
</notes>
