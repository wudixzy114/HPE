<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">二 · 第⑤步</div>
    <h2 data-node="title">复盘不是补知识，而是跳出自己，审视“我是怎么想的”</h2>

    <div data-node="reflection" class="ac-reflection-stage">
      <Step :at="1">
        <section class="ac-mirror">
          <b>L4 · 元认知</b>
          <span
            >哪一步低效？哪里卡住？我的判断有没有归因偏差、幸存者偏差，或把相关当成因果？</span
          >
        </section>
      </Step>
      <section>
        <div class="ac-chip">模板⑩ · 思维审判</div>
        <div class="ac-prompt" style="margin-top: 18px">
          这是我对【某问题】的完整思考过程，包括我怎么理解、在哪里卡住、为什么这样判断【贴入】。

          <span class="mark">不要补充新的事实</span
          >，请只审视我的推理：有没有归因偏差、幸存者偏差，有没有把相关当成因果？
        </div>
        <Step :at="2">
          <div class="ac-takeaway" style="margin-top: 18px">
            讲述本身就是复盘的一半：把“我是怎么想的”说清楚，就已经开始跳出自己。
          </div>
        </Step>
      </section>
    </div>
    <div class="ac-footer"><span>二 · 复盘迭代</span><span>10 / 28</span></div>
  </Slide>
</template>

<notes lang="md">
AI 的任务是照镜子，不是继续灌输新事实。提示词中的限制条件必须讲清。
</notes>
