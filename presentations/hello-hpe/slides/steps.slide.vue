<template>
  <Slide class="hello-slide">
    <div>
      <div class="hello-kicker">Reveal</div>
      <h2 data-node="title">Steps reveal content progressively</h2>
    </div>
    <div class="hello-body">
      <Step :at="1">
        <div class="hello-panel hello-step" data-node="panel-one">
          <h3>Press → to advance a step</h3>
          <p>
            A &lt;Step :at="n"&gt; block stays hidden until the slide reaches
            step <code>n</code>. Declare the highest step as
            <code>maxStep</code> in <code>deck.json</code> so navigation and the
            checker both know the full range.
          </p>
        </div>
      </Step>
      <Step :at="2">
        <div class="hello-panel hello-step" data-node="panel-two">
          <h3>Every state is checkable</h3>
          <p>
            The checker walks the full slide × step × interaction matrix, so a
            reveal that overflows the canvas is caught automatically — not
            discovered live on stage.
          </p>
        </div>
      </Step>
    </div>
    <div class="hello-footer">
      <span>Hello HPE · Steps</span><span>2 / 4</span>
    </div>
  </Slide>
</template>

<notes lang="md">
Two-step reveal. Keep the pacing slow on the first press so the audience sees
that steps, not pages, are the unit of progress.
</notes>
