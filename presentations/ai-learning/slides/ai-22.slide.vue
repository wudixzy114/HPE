<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">四 · 坑三</div>
    <h2 data-node="title">
      谄媚与幻觉：语言只能提出假说，编译器和现实负责审判
    </h2>

    <div data-node="hypothesis-flow" class="ac-hypothesis-flow">
      <Step :at="1">
        <section class="ac-hypothesis-node ac-glass">
          <div>
            <b>AI 输出</b>
            <p>友好、有帮助、倾向于赞同；语言上自洽，不等于物理上正确。</p>
          </div>
        </section>
      </Step>
      <div class="ac-hypothesis-arrow">→</div>
      <Step :at="2">
        <section class="ac-hypothesis-node ac-glass">
          <div>
            <b>反方 + 验证</b>
            <p>
              先给最强反对理由；代码跑测试与 Benchmark；结论锚定资料交叉验证。
            </p>
          </div>
        </section>
      </Step>
      <div class="ac-hypothesis-arrow">→</div>
      <Step :at="3">
        <section class="ac-hypothesis-node ac-glass">
          <div>
            <b>可用结论</b>
            <p>经历编译器和现实碰撞后，答案才从草案升级为依据。</p>
          </div>
        </section>
      </Step>
    </div>

    <div
      class="ac-takeaway"
      style="margin-top: 30px; border-left-color: var(--ac-yellow)"
    >
      <strong>AI 负责提出假说，物理世界负责审判。</strong
      >&nbsp;承担错误风险，恰恰是判断的价值所在。
    </div>
    <div class="ac-footer">
      <span>四 · 谄媚与幻觉</span><span>23 / 28</span>
    </div>
  </Slide>
</template>

<notes lang="md">
用一条管线替代多个对策卡。字节对齐案例可在讲稿中口述，不再占一个文本框。
</notes>
