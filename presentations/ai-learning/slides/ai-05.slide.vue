<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">二 · 第①②步</div>
    <h2 data-node="title">先把书读厚，再把书读薄：采样是加法，建模是升维</h2>

    <div data-node="funnel" class="ac-funnel-stage ac-funnel-stage--reviewed">
      <Step :at="1">
        <section class="ac-sample-cloud">
          <div class="ac-sample">常规案例</div>
          <div class="ac-sample">极端情况</div>
          <div class="ac-sample">失败样本</div>
          <div class="ac-sample">反直觉现象</div>
          <div class="ac-sample">跨领域例子</div>
          <div class="ac-sample">边缘条件</div>
          <div class="ac-sample">不同场景</div>
          <div class="ac-sample">真实约束</div>
        </section>
      </Step>
      <div class="ac-funnel">
        <div class="ac-funnel-label">蒸发细节<br />保留因果</div>
      </div>
      <Step :at="2">
        <section class="ac-model-output">
          <div>
            <b>极简模型</b>
            <p>用最少的变量解释最多的现象，并能回答从来没背过的问题。</p>
          </div>
        </section>
      </Step>
    </div>

    <div data-node="classics" class="ac-classic-pair">
      <Step :at="1">
        <blockquote>
          <b>为学日益</b
          ><span
            >学习知识要日日增加：广采样本、看案例、看差异、看极端情况，把书读厚。</span
          >
        </blockquote>
      </Step>
      <Step :at="2">
        <blockquote>
          <b>为道日损</b
          ><span
            >逼近规律要日日减损：放下枝节，保留决定现象的因果回路，把书读薄。</span
          >
        </blockquote>
      </Step>
    </div>
    <div data-node="rules" class="ac-rule-strip ac-rule-strip--compact">
      <div><b>先后关系：</b>读厚是采样，读薄是升维</div>
      <div><b>压缩目标：</b>抓住本质，而不是停在表面</div>
      <div><b>检验标准：</b>能回答从未背过的问题</div>
    </div>
    <div class="ac-footer">
      <span>二 · 采样与压缩</span><span>06 / 28</span>
    </div>
  </Slide>
</template>

<notes lang="md">
“为学日益 / 为道日损”的解释与两步同步出现，补回原稿中的文化语境和“做加法 / 做减法”含义。
</notes>
