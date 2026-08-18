<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">一 · 什么才算真正学到</div>
    <h2 data-node="title">三个检验标准，决定你是否真的获得了解决问题的能力</h2>

    <div data-node="criteria" class="ac-ability-map">
      <Step :at="1" class="ac-ability-slot slot-left">
        <section class="ac-ability-criterion">
          <b>01 · 认知重塑</b><strong>预测世界的模型变了</strong>
          <p>以前看不懂的局，现在能看清结构与运转逻辑。</p>
        </section>
      </Step>
      <Step :at="2" class="ac-ability-slot slot-top">
        <section class="ac-ability-criterion">
          <b>02 · 行为改变</b><strong>相同情境的反应变了</strong>
          <p>学习的终点不是复述，而是决策和行动被重塑。</p>
        </section>
      </Step>
      <div class="ac-ability-core">
        <b>能力</b><span>在不确定性中<br />做出正确决策并解决问题</span>
      </div>
      <Step :at="3" class="ac-ability-slot slot-right">
        <section class="ac-ability-criterion">
          <b>03 · 知识迁移</b><strong>未知场景也能解决</strong>
          <p>没有现成答案时，仍能调用底层逻辑拆解新问题。</p>
        </section>
      </Step>
    </div>

    <Step :at="4">
      <div data-node="dimensions" class="ac-ability-dimensions">
        <div>
          <b>更高质量</b><span>判断更准确，抓住真正影响结果的变量</span>
        </div>
        <div><b>更低成本</b><span>少走弯路，用更少资源完成同样目标</span></div>
        <div><b>更快速度</b><span>更快识别结构、形成判断并采取行动</span></div>
        <div>
          <b>面对不确定性</b><span>没有标准答案时，仍能做出可解释的选择</span>
        </div>
      </div>
    </Step>
    <div class="ac-footer">
      <span>一 · 三个检验标准</span><span>03 / 28</span>
    </div>
  </Slide>
</template>

<notes lang="md">
三个检验标准从左、上、右围绕“能力”出现，避免互相覆盖。最后解释能力定义中的四个维度；“更高概率”按审核意见改为“更高质量”。
</notes>
