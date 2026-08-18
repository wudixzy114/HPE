<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">一 · 学到什么程度</div>
    <h2 data-node="title">AI 把 L1 的成本打到零、L2 的价格打到很低，主战场必须上移</h2>

    <div data-node="pyramid" class="ac-flat-pyramid-stage">
      <section class="ac-flat-pyramid">
        <Step :at="4" class="ac-flat-pyramid-slot row-l4">
          <div class="ac-flat-tier l4">
            <b>L4 · 元认知</b
            ><span>审视自己的偏见，设计自己的学习系统 → 一通百通</span>
          </div>
        </Step>
        <Step :at="3" class="ac-flat-pyramid-slot row-l3">
          <div class="ac-flat-tier l3">
            <b>L3 · 心智模型</b
            ><span>供求、复利、熵增、反馈回路 → 跨领域举一反三</span>
          </div>
        </Step>
        <Step :at="2" class="ac-flat-pyramid-slot row-l2">
          <div class="ac-flat-tier l2">
            <b>L2 · 技能与套路</b
            ><span>怎么写爬虫、怎么做 PPT → 流程方法可被即时生成</span>
          </div>
        </Step>
        <Step :at="1" class="ac-flat-pyramid-slot row-l1">
          <div class="ac-flat-tier l1">
            <b>L1 · 事实与信息</b
            ><span>“Python 打印用 print()” → 随问随得、随学随忘</span>
          </div>
        </Step>
      </section>

      <section class="ac-flat-pyramid-copy ac-glass">
        <div class="ac-ai-price-line">
          <b>AI 价格线</b><span>L1 成本打到零（事实随问随得），L2 价格打到很低（套路、模板即时生成）</span>
        </div>
        <p>
          绝大多数人——包括天天用 AI 的人——停留在 L1、L2，误以为那就是学习的全部。
          而这两层恰恰是 AI 最容易覆盖的部分。
        </p>
        <p>
          懂了物理学的“熵增”，就能理解为什么公司一定会走向官僚化、为什么房间总会变乱——
          <strong>底层规律是跨学科通用的。</strong>
        </p>
      </section>
    </div>
    <div class="ac-takeaway">
      只在 L1、L2 打转的人，正处在被替代的危险区——<strong
        >学习的主战场必须上移到 L3 和 L4。</strong
      >
    </div>
    <div class="ac-footer">
      <span>一 · 四层金字塔</span><span>04 / 28</span>
    </div>
  </Slide>
</template>

<notes lang="md">
使用固定槽位的扁平宽金字塔，避免动画状态改变定位。从 L1 向上逐层揭示，右侧补足每层价值与 AI 时代处境。
</notes>
