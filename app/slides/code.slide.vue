<template>
  <Slide>
    <div class="flex h-full flex-col px-20 py-16">
      <p class="text-lg tracking-[0.2em] text-emerald-300">ZERO RUNTIME COST</p>
      <h1 data-node="title" class="mt-3 text-6xl font-semibold">
        Highlight once. Ship plain HTML.
      </h1>
      <div
        data-node="code"
        class="mt-14 overflow-hidden rounded-2xl border border-slate-700"
      >
        <ShikiCode
          lang="typescript"
          code="const deck: CompiledDeck = await compileDeck(source)"
        />
      </div>
      <p class="mt-8 text-xl text-slate-400">
        Shiki runs in the compiler process and never enters the presentation
        bundle.
      </p>
    </div>
  </Slide>
</template>

<style scoped>
:deep(.shiki) {
  margin: 0;
  padding: 36px;
  font-size: 24px;
  line-height: 1.7;
}
</style>

<notes lang="md">
This code block is converted to static highlighted HTML before Vue compiles the slide.
</notes>
