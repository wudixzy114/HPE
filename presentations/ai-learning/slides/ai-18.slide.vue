<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">三 · 私教④</div>
    <h2 data-node="title">
      压力测试：资料读厚靠原作者，读薄靠自己，AI 负责检查你压丢了什么
    </h2>

    <div data-node="pressure" class="ac-pressure">
      <Step :at="1">
        <section class="ac-pressure-copy ac-glass">
          <h3>原始资料 · 把书读厚</h3>
          <p>
            变量、例外、边缘条件和原作者的细微限定都完整存在——这是检查压缩质量的“原始分辨率”。
          </p>
          <div class="ac-outliers">
            <span>主干</span><span class="hot">例外</span><span>前提</span
            ><span class="hot">边界</span><span>变量</span
            ><span class="hot">反例</span>
          </div>
        </section>
      </Step>
      <div data-node="compression-audit" class="ac-compression-audit">
        <small>压缩质检</small>
        <div
          class="ac-compression-audit__docs"
          aria-label="对照原文检查摘要中的缺失信息"
        >
          <div class="ac-mini-doc source"><b>原文</b><i /><i /><i /><i /></div>
          <span class="ac-audit-arrow">→</span>
          <div class="ac-mini-doc summary">
            <b>摘要</b><i /><i class="missing" /><i />
          </div>
          <div class="ac-audit-lens" aria-hidden="true" />
        </div>
        <strong>找出压丢的变量</strong>
        <span>逐项对照，而不是重新总结</span>
      </div>
      <Step :at="2">
        <section class="ac-pressure-copy ac-glass">
          <h3>你的总结 · 把书读薄</h3>
          <p>
            这个用法和五步闭环的第②步正好是一对：AI 不替你总结，
            而是把你的总结与原文对照，检查你丢了哪些关键变量、理解有哪些偏差。
          </p>
          <div class="ac-prompt" style="margin-top: 22px">
            我读完资料，把它压缩成这几句话：【贴入总结】。<span class="mark"
              >对照原文检查</span
            >我丢了什么。
          </div>
        </section>
      </Step>
    </div>
    <Step :at="3">
      <div class="ac-no-source-test">
        <b>手头没有资料，也能做同样的灵魂拷问</b>
        <span
          >“我把这套理论压缩成了这一句话：【贴入】。你觉得它丢失了哪些致命的关键变量？”</span
        >
      </div>
    </Step>
    <div class="ac-footer"><span>三 · 压力测试</span><span>19 / 28</span></div>
  </Slide>
</template>

<notes lang="md">
这是第②步压缩建模的质量检查。中间的“原文—摘要—放大镜”图标表示逐项对照并定位缺失信息。资料读厚靠原作者，读薄靠自己，AI 负责检查你压丢了什么；无资料时也保留同样的压力测试问法。
</notes>
