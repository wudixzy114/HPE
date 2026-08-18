<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">三 · 私教④</div>
    <h2 data-node="title">压力测试：读薄靠自己，AI 只负责检查你压丢了什么</h2>

    <div data-node="pressure" class="ac-pressure">
      <Step :at="1">
        <section class="ac-pressure-copy ac-glass">
          <h3>原始资料 · 把书读厚</h3>
          <p>
            变量、例外、边缘条件和原作者的细微限定都完整存在。资料提供分辨率。
          </p>
          <div class="ac-outliers">
            <span>主干</span><span class="hot">例外</span><span>前提</span
            ><span class="hot">边界</span><span>变量</span
            ><span class="hot">反例</span>
          </div>
        </section>
      </Step>
      <div class="ac-pressure-meter">
        <span>原文分辨率</span><span>你的压缩</span>
      </div>
      <Step :at="2">
        <section class="ac-pressure-copy ac-glass">
          <h3>你的总结 · 把书读薄</h3>
          <p>“对照原文检查：我丢了哪些关键变量？理解有哪些偏差？”</p>
          <div class="ac-prompt" style="margin-top: 22px">
            我读完资料，把它压缩成这几句话：【贴入总结】。<span class="mark"
              >对照原文检查</span
            >我丢了什么。
          </div>
        </section>
      </Step>
    </div>
    <div class="ac-footer"><span>三 · 压力测试</span><span>19 / 28</span></div>
  </Slide>
</template>

<notes lang="md">
这是第②步压缩建模的质量检查。AI 不是替你总结，而是检查你的总结。
</notes>
