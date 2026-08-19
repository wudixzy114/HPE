<template>
  <Slide class="hello-slide">
    <div>
      <div class="hello-kicker">Code</div>
      <h2 data-node="title">Static syntax highlighting with ShikiCode</h2>
    </div>
    <div class="hello-body">
      <div class="hello-code" data-node="code">
        <ShikiCode
          lang="typescript"
          code="const engine = createDeckEngine({ slides: deck.slides });
engine.dispatch({ type: 'NEXT' });
console.log(engine.state);"
        />
      </div>
      <Step :at="1">
        <div class="hello-panel hello-step" data-node="note">
          <p>
            <code>&lt;ShikiCode&gt;</code> compiles to static HTML at build time
            — the highlighter, grammars, and TextMate runtime never reach the
            browser bundle. The <code>code</code> attribute must be a static
            string, so avoid double quotes inside the snippet.
          </p>
        </div>
      </Step>
    </div>
    <div class="hello-footer">
      <span>Hello HPE · Code</span><span>4 / 4</span>
    </div>
  </Slide>
</template>

<notes lang="md">
The code block is pre-highlighted at compile time — view source on the built
page and there is no highlighter JS, only marked-up HTML.
</notes>
