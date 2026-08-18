<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">二 · 第④步</div>
    <h2 data-node="title">
      “学而时习之”：答案人人相同时，差距只能产生在答案之外
    </h2>

    <div data-node="practice-proof" class="ac-practice-stage">
      <Step :at="1" class="ac-practice-slot quote">
        <blockquote class="ac-confucius-quote">
          <small>《论语·学而》</small>
          <b>学而时习之，不亦说乎？</b>
          <p>
            “学”是输入；“习”的本义，是雏鸟一次次练习飞翔。孔子讲的不是重复阅读，
            而是把学到的东西反复放进行动中使用。
          </p>
        </blockquote>
      </Step>

      <Step :at="2" class="ac-practice-slot reasons">
        <section class="ac-practice-reasons ac-glass">
          <h3>为什么“再问一次”不能验证答案？</h3>
          <div>
            <b>问同一个模型</b
            ><span>它会沿着原来的语言路径继续自洽，甚至更坚定地维护自己。</span>
          </div>
          <div>
            <b>换另一个模型</b
            ><span>你得到的只是另一份语料平均值，仍然不是物理世界的反馈。</span>
          </div>
          <div>
            <b>大家使用同一批 AI</b
            ><span>答案高度同质；知识第一次这么便宜，也第一次这么趋同。</span>
          </div>
        </section>
      </Step>
    </div>

    <Step :at="3">
      <div data-node="practice-examples" class="ac-practice-examples">
        <div>
          <b>代码</b
          ><span>亲自运行测试与 Benchmark，暴露性能、兼容和边缘条件。</span>
        </div>
        <div>
          <b>决策</b
          ><span>做小规模实验，让用户、成本和结果对纸面判断给出反馈。</span>
        </div>
        <div>
          <b>技能</b
          ><span>把模型用于真实任务；只有承担约束，才知道自己是否真的会。</span>
        </div>
      </div>
    </Step>
    <Step :at="4">
      <div class="ac-practice-verdict">
        <b>这一步必须由人完成</b>
        <span
          >AI
          可以提出假说、沙盘推演、提醒盲区，但它没有下场的肉身，也不能替你承担风险、代价和后果。</span
        >
      </div>
    </Step>
    <div class="ac-footer"><span>二 · 实践检验</span><span>09 / 28</span></div>
  </Slide>
</template>

<notes lang="md">
先逐字解释“学而时习之”，再说明语言模型内部无法完成验证，最后给代码、决策、技能三个实践样例。核心结论是：五步中只有实践无法由 AI 代劳。
</notes>
