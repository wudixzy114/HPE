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
            ><span>它会坚持自己，沿着原来的路径继续自洽。</span>
          </div>
          <div>
            <b>换另一个模型</b><span>你拿到的只是另一份“最大公约数”。</span>
          </div>
          <div>
            <b>大家用的就是同几个 AI</b
            ><span>答案高度同质——所有人都在照着同一份平均答案做事。</span>
          </div>
        </section>
      </Step>
    </div>

    <Step :at="3">
      <div data-node="practice-examples" class="ac-practice-examples">
        <div>
          <b>代码</b
          ><span
            >答案对不对，再问问不出来；跑一遍测试和 Benchmark 才知道。</span
          >
        </div>
        <div>
          <b>决策</b
          ><span>小规模实验上线，让用户、成本和结果给纸面判断打分。</span>
        </div>
        <div>
          <b>技能</b
          ><span>放进真实任务里承担约束，才知道自己是不是真的会。</span>
        </div>
      </div>
    </Step>
    <Step :at="4">
      <div class="ac-practice-verdict">
        <b>这一步必须由人完成</b>
        <span
          >知识第一次这么便宜，也第一次这么趋同；当答案人人相同时，差距只能产生在答案之外——实践就是答案之外的部分。</span
        >
      </div>
    </Step>
    <div class="ac-footer"><span>二 · 实践检验</span><span>09 / 28</span></div>
  </Slide>
</template>

<notes lang="md">
先逐字解释“学而时习之”，再说明为什么答案对不对再问问不出来，最后给代码、决策、技能三个实践样例。AI 可以沙盘推演、扫清盲区，但下场的肉身和后果它替不了。
</notes>
