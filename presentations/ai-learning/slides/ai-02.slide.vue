<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">一 · 什么才算真正学到</div>
    <h2 data-node="title">三个检验标准：学没学到，骗得了别人，骗不了这三条</h2>

    <div data-node="criteria" class="ac-ability-map">
      <Step :at="1" class="ac-ability-slot slot-left">
        <section class="ac-ability-criterion">
          <b>01 · 认知重塑</b><strong>预测世界的模型变了</strong>
          <p>
            以前看不懂的局，现在一眼看清结构；以前会激怒你的事，现在看得懂它的运转逻辑。
          </p>
        </section>
      </Step>
      <Step :at="2" class="ac-ability-slot slot-top">
        <section class="ac-ability-criterion">
          <b>02 · 行为改变</b><strong>相同情境的反应变了</strong>
          <p>学完之后，遇到相同情境的决策和反应没有任何改变，那就等于没学。</p>
        </section>
      </Step>
      <div class="ac-ability-core">
        <b>能力</b><span>在不确定性中<br />做出正确决策并解决问题</span>
      </div>
      <Step :at="3" class="ac-ability-slot slot-right">
        <section class="ac-ability-criterion">
          <b>03 · 知识迁移</b><strong>没见过的场景也能解决</strong>
          <p>
            没有现成答案时，仍能调用过往的底层逻辑拆解新问题——这才是“能力”。
          </p>
        </section>
      </Step>
    </div>

    <Step :at="4">
      <div data-node="dimensions" class="ac-ability-dimensions">
        <div><b>更高的概率</b><span>判断质量：在不确定中更常押对</span></div>
        <div><b>更低的成本</b><span>少走弯路，用更少资源达成目标</span></div>
        <div><b>更快的速度</b><span>更快识别结构、形成判断并行动</span></div>
        <div>
          <b>面对不确定性</b><span>没有标准答案的场景，才谈得上能力</span>
        </div>
      </div>
    </Step>
    <div class="ac-footer">
      <span>一 · 三个检验标准</span><span>03 / 28</span>
    </div>
  </Slide>
</template>

<notes lang="md">
三个检验标准从左、上、右围绕“能力”出现，避免互相覆盖。口播补充：这个定义里没有“记住了多少”——记忆只是原料，不是能力。
</notes>
