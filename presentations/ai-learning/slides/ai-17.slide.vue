<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">三 · 私教②③</div>
    <h2 data-node="title">
      资料是教材，AI 是助教：先解释卡点，再用你的战场出题
    </h2>

    <div data-node="dialogue" class="ac-dialogue-stage">
      <Step :at="1">
        <section class="ac-teacher-mode ac-glass">
          <h3>私教② · 卡点答疑</h3>
          <div class="ac-prompt">
            资料里关于 X 的这段我没看懂：【原文】。请<span class="mark"
              >严格基于这份资料</span
            >解释，资料里没讲到的背景知识，<span class="cue">单独标注</span>。
          </div>
          <p>把“原作者说的”与“AI 补的”分开，既保留上下文，又降低幻觉。</p>
        </section>
      </Step>
      <div class="ac-versus">读 → 用</div>
      <Step :at="2">
        <section class="ac-teacher-mode ac-glass">
          <h3>私教③ · 出题考官</h3>
          <div class="ac-prompt">
            基于这份资料出 10 道题，从易到难，最后 3 道是<span class="mark"
              >实际工作场景中的应用题</span
            >。答完后批改并指出理解偏差。
          </div>
          <p>通用题库验证记忆；自己的资料与场景，才能验证 L2/L3。</p>
        </section>
      </Step>
    </div>
    <div class="ac-footer">
      <span>三 · 卡点答疑与出题</span><span>18 / 28</span>
    </div>
  </Slide>
</template>

<notes lang="md">
两个私教模式的共同点都是锚定资料；区别是一个修复理解，一个验证应用。
</notes>
