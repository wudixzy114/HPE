<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">五 · 行动与结语</div>
    <h2 data-node="title">今天开始，建立三种不能外包给 AI 的思考习惯</h2>

    <div data-node="human-premium" class="ac-final-principles">
      <span
        ><i /><b>不外包问题定义</b> AI
        可以提供信息，但“真正要解决什么”必须由你决定</span
      >
      <span
        ><i /><b>不外包最终判断</b> AI
        可以生成选项，但选择方向与承担后果必须由你完成</span
      >
    </div>

    <div data-node="actions" class="ac-action-path">
      <Step :at="1">
        <section class="ac-action">
          <div class="ac-action-no">01</div>
          <h3>先写下自己的判断</h3>
          <p>
            打开 AI
            前，先写四句话：我真正要解决什么？当前判断是什么？判断依赖哪些假设？出现什么证据，我会承认自己错了？
          </p>
        </section>
      </Step>
      <Step :at="2">
        <section class="ac-action">
          <div class="ac-action-no">02</div>
          <h3>把答案压缩成模型</h3>
          <p>
            不收藏“看起来很对”的答案。追问它的因果、边界与反例；然后关掉
            AI，用自己的话写出一条能解释新问题的模型。
          </p>
        </section>
      </Step>
      <Step :at="3">
        <section class="ac-action">
          <div class="ac-action-no">03</div>
          <h3>让现实更新模型</h3>
          <p>
            把判断改写成可证伪的假设，设计一个最小实验；记录结果与预期的偏差，再决定保留、修正还是推翻原来的模型。
          </p>
        </section>
      </Step>
    </div>

    <blockquote data-node="closing" class="ac-closing">
      把<strong>问题定义</strong>留给自己，把探索空间交给 AI，<br />把<strong>最终判断</strong>交给现实。
    </blockquote>
    <div
      class="ac-takeaway"
      style="margin: 22px auto 0; max-width: 1120px; justify-content: center"
    >
      AI
      可以加速学习；真正的能力来自提出问题、形成判断、付诸行动，再根据反馈持续修正。
    </div>
    <div class="ac-footer">
      <span>用 AI 学习 · 行动清单</span><span>28 / 28</span>
    </div>
  </Slide>
</template>

<notes lang="md">
最后一页不再给零散的工具技巧，而是回收整套演讲的思考闭环：先独立定义问题和可证伪条件，再把答案压缩成自己的模型，最后让现实反馈更新模型。收束句强调人、AI 与现实三者的清晰分工。
</notes>
