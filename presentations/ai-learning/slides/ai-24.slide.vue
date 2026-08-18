<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">五 · 出路一</div>
    <h2 data-node="title">
      OpenAI 说：当今最有价值的竞争力，就是用 AI 学习 AI
    </h2>

    <div
      data-node="growth"
      class="ac-growth-stage ac-growth-stage--exponential"
    >
      <section class="ac-exp-chart">
        <span class="ac-exp-axis-y">模型能力</span>
        <span class="ac-exp-axis-x">时间</span>
        <div class="ac-exp-grid" />
        <div class="ac-exp-bars" aria-label="前期平缓、后期陡增的指数增长示意">
          <i class="b1" /><i class="b2" /><i class="b3" /><i class="b4" />
          <i class="b5" /><i class="b6" /><i class="b7" /><i class="b8" />
          <i class="b9" /><i class="b10" /><i class="b11" /><i class="b12" />
        </div>
        <div class="ac-exp-early">早期：变化不显眼</div>
        <div class="ac-exp-late">后期：增长越来越陡</div>
        <div class="ac-exp-label">指数增长</div>
      </section>

      <section class="ac-growth-actions">
        <Step :at="1">
          <div class="ac-growth-action">
            <b>01 · 直接读一手材料</b>
            <p>
              最新模型架构论文——Attention、MoE、Mamba；让 AI
              帮你写代码，拆解其中的数学原理。
            </p>
          </div>
        </Step>
        <Step :at="2">
          <div class="ac-growth-action">
            <b>02 · 直接动手测试</b>
            <p>
              用 API
              测不同模型的上下文边界、温度系数和能力水位，建立第一手体感，而不是第二手转述。
            </p>
          </div>
        </Step>
        <Step :at="3">
          <div class="ac-growth-action">
            <b>03 · 用本篇的方法学 AI</b>
            <p>
              五步闭环、穿透式提问和私教模式，全部可以应用在“以 AI
              为对象”的学习上。
            </p>
          </div>
        </Step>
      </section>
    </div>

    <div class="ac-takeaway" style="margin-top: 18px">
      AI 的能力呈指数级增长，靠“等人嚼碎了喂”的二手信息追赶，注定越落越远——<strong
        >把学习工具本身，变成学习对象。</strong
      >你对 AI 的运作方式理解越深，前面所有模板的威力就越大。
    </div>
    <div class="ac-footer">
      <span>五 · 用 AI 学习 AI</span><span>25 / 28</span>
    </div>
  </Slide>
</template>

<notes lang="md">
柱列高度按指数序列设计：前半段几乎贴近基线，后半段快速陡增。图表初始即展示，三种追赶方式依次出现。
</notes>
