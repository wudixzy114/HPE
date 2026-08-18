<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">开场 · 一个问题</div>
    <h2 data-node="title">
      过去一年查过的问题更多了——<span class="ac-teal-text"
        >能力真的提升了吗？</span
      >
    </h2>

    <div
      data-node="equation"
      class="ac-equation-stage ac-equation-stage--compact"
    >
      <section class="ac-equation-side ac-glass">
        <div class="ac-number">10×</div>
        <div class="ac-unit">信息输入量</div>
        <strong>答案边际成本 → 0</strong>
      </section>
      <div class="ac-not-equal">≠</div>
      <section class="ac-equation-side ac-glass">
        <div class="ac-number">?</div>
        <div class="ac-unit">能力提升量</div>
        <strong>没有自动发生</strong>
      </section>
    </div>

    <Step :at="1">
      <p data-node="illusion" class="ac-opening-explanation">
        很多人把“信息的输入量”误当成“能力的提升量”。AI
        让任何事实、概念和文档都随问随得，
        “知道”因此变成最不值钱的事，但“知道”从来不等于“学到”。
      </p>
    </Step>
    <Step :at="2">
      <section data-node="thesis" class="ac-opening-thesis">
        <small>真正值钱的，变成另外两件事</small>
        <b>把知识压缩成分辨率更高的思维模型</b>
        <span>并用 AI 加速这个过程</span>
      </section>
    </Step>
    <div class="ac-footer">
      <span>开场 · 信息不等于能力</span><span>02 / 28</span>
    </div>
  </Slide>
</template>

<notes lang="md">
先停两秒让观众回答。最后出现的“真正值钱的两件事”是整页视觉中心，也是后续内容的总入口。
</notes>
