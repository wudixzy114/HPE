<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">二 · 第④步</div>
    <h2 data-node="title">答案对不对，再问一次问不出来；必须让假说撞上现实</h2>

    <div data-node="lab" class="ac-lab-stage">
      <Step :at="1">
        <section class="ac-hypothesis ac-glass">
          <div>
            <b>纸面模型</b>
            <p>逻辑自洽、表达完整，看起来像已经解释了一切。</p>
          </div>
        </section>
      </Step>
      <div class="ac-wall">物理世界</div>
      <Step :at="2">
        <section class="ac-evidence ac-glass">
          <div>
            <b>真实反馈</b>
            <p>遗漏变量、边缘条件、代价和副作用，只有运行之后才出现。</p>
          </div>
        </section>
      </Step>
    </div>

    <Step :at="3">
      <div
        data-node="practice"
        class="ac-takeaway"
        style="margin-top: 18px; border-left-color: var(--ac-yellow)"
      >
        “习”的本义是雏鸟反复练飞。知识人人相同时，差距只能产生在答案之外——<strong
          >实践就是答案之外的部分。</strong
        >
      </div>
    </Step>
    <div class="ac-footer"><span>二 · 实践检验</span><span>09 / 28</span></div>
  </Slide>
</template>

<notes lang="md">
模型撞墙后再出现反馈。强调换模型也只是另一份平均答案。
</notes>
