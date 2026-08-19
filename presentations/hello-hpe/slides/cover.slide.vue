<template>
  <Slide class="hello-slide">
    <div>
      <div class="hello-kicker">HPE Runtime</div>
      <h1 data-node="title">Hello HPE</h1>
    </div>
    <div class="hello-body">
      <p class="hello-lede" data-node="lede">
        This is the demo deck that ships with the HPE runtime shell. Replace
        everything in <code>presentations/hello-hpe/</code> with your own slides
        — the engine, player, checker, and CLI stay untouched.
      </p>
    </div>
    <div class="hello-footer"><span>Hello HPE</span><span>1 / 4</span></div>
  </Slide>
</template>

<notes lang="md">
Cover page. Mention that the deck is fully self-contained: one deck.json, one
theme, one `.slide.vue` per page. Nothing outside the deck folder needs to
change when authoring content.
</notes>
