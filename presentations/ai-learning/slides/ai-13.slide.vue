<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">三 · 生成模板</div>
    <h2 data-node="title">模板①向上抽象，模板②横向迁移：一纵一横建立模型</h2>

    <div data-node="templates" class="ac-template-pair">
      <Step :at="1">
        <section class="ac-template ac-glass">
          <div class="ac-template-head">
            <div class="ac-template-no">01</div>
            <h3>提炼模型 · 向上抽象</h3>
          </div>
          <div class="ac-prompt">
            我学完了《国富论》。<span class="mark">不要总结章节</span
            >，请提炼亚当·斯密思考经济行为时最底层的 3
            个心智模型，每个配一个非经济学领域的应用例子。
          </div>
          <p class="ac-template-note">
            “总结章节”得到的是 L1 的事实罗列；“提炼心智模型”直接指向 L3。
            “配一个非经济学例子”——强迫模型在输出时就完成一次迁移演示。
          </p>
        </section>
      </Step>
      <Step :at="2">
        <section class="ac-template ac-glass">
          <div class="ac-template-head">
            <div class="ac-template-no">02</div>
            <h3>同构迁移 · 横向连接</h3>
          </div>
          <div class="ac-prompt">
            请用控制工程中的<span class="cue">闭环负反馈</span
            >原理解释：为什么习惯养成这么难？如何利用这个原理设计一个戒烟系统？
          </div>
          <p class="ac-template-note">
            前半句“解释”检验 AI 能否迁移，后半句“应用”检验你能否落地。
            句式可泛化：<strong>用 A 领域的 X 原理，解释 B 领域的 Y 现象，并给出一个利用它的方案。</strong>
          </p>
        </section>
      </Step>
    </div>
    <div class="ac-footer"><span>三 · 模板①②</span><span>14 / 28</span></div>
  </Slide>
</template>

<notes lang="md">
两个模板保持完整可抄。用“纵向抽象 / 横向迁移”建立记忆钩子。
</notes>
