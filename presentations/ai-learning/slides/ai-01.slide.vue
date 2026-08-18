<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">开场 · 一个问题</div>
    <h2 data-node="title">
      过去一年查过的问题更多了——<span class="ac-teal-text"
        >能力真的提升了吗？</span
      >
    </h2>

    <div data-node="equation" class="ac-equation-stage">
      <section class="ac-equation-side ac-glass">
        <div class="ac-number">10×</div>
        <div class="ac-unit">信息输入量</div>
        <strong>答案边际成本 → 0</strong>
      </section>
      <div class="ac-not-equal">≠</div>
      <section class="ac-equation-side ac-glass">
        <div class="ac-number">?</div>
        <div class="ac-unit">能力提升量</div>
        <strong>取决于压缩与实践</strong>
      </section>
    </div>

    <Step :at="1">
      <div data-node="illusion" class="ac-takeaway" style="margin-top: 18px">
        很多人把“信息的输入量”误当成“能力的提升量”。AI
        让你每天知道得更多，但“知道”从来不等于“学到”。
      </div>
    </Step>
    <Step :at="2">
      <div
        data-node="thesis"
        class="ac-takeaway"
        style="margin-top: 12px; border-left-color: var(--ac-yellow)"
      >
        真正值钱的，是把知识压缩成分辨率更高的思维模型，并用 AI 加速这个过程。
      </div>
    </Step>
    <div class="ac-footer">
      <span>开场 · 信息不等于能力</span><span>02 / 28</span>
    </div>
  </Slide>
</template>

<notes lang="md">
停两秒让观众回答。左右两边不是优劣对比，而是刻意制造“不等式”。
</notes>
