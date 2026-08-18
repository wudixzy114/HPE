<template>
  <Slide class="ac-slide ac-cover">
    <div class="ac-cover-grid">
      <section data-node="hero-copy">
        <div class="ac-kicker">30 分钟分享 · AI 时代的认知与学习</div>
        <h1 data-node="title">
          用 AI 学习：<br />从“知道”到<br /><span class="ac-accent"
            >举一反三</span
          >
        </h1>
        <p class="ac-lede">
          在答案触手可得的时代，学习的本质没有变，变的是每一步的打法。
        </p>
        <Step :at="2">
          <div data-node="principles" class="ac-memory-line">
            <p><i />五步之中，只有<b>实践</b>是 AI 完全无法代劳的</p>
            <p><i />人机协同是<b>匹配</b>，不是<b>外包</b></p>
          </div>
        </Step>
      </section>

      <section data-node="question-orbit" class="ac-orbit">
        <div class="ac-orbit-ring" />
        <div class="ac-orbit-core">
          <div><b>真正学到</b><small>不是得到答案</small></div>
        </div>
        <Step :at="1">
          <div class="ac-orbit-node">
            <b>学到什么程度？</b><span>三个标准 · 四层金字塔</span>
          </div>
          <div class="ac-orbit-node">
            <b>学习如何闭环？</b><span>五步循环 · 人机分工</span>
          </div>
          <div class="ac-orbit-node">
            <b>今天如何开始？</b><span>十个模板 · 三个坑</span>
          </div>
        </Step>
      </section>
    </div>
    <div class="ac-footer">
      <span>用 AI 学习 · 认知与方法</span><span>01 / 28</span>
    </div>
  </Slide>
</template>

<notes lang="md">
先给出主题，再依次揭示三个问题与两条全场记忆点。内容来自 show/PPT文稿.md P01。
</notes>
