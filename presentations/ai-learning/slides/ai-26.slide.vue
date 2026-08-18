<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">五 · 出路三</div>
    <h2 data-node="title">
      工具能力 AI 更强，但战场判断、进攻组织和后果仍由人负责
    </h2>

    <div data-node="command" class="ac-command-stage">
      <section class="ac-command-map">
        <div class="ac-commander"><b>人类指挥官</b><span>CTF 冠军</span></div>
        <Step :at="1">
          <div class="ac-target t1">
            <b>比赛特点</b>
            <p>知道题型、规则与赛场节奏</p>
          </div>
        </Step>
        <Step :at="2">
          <div class="ac-target t2">
            <b>出题人喜好</b>
            <p>更懂人，知道陷阱会藏在哪里</p>
          </div>
        </Step>
        <Step :at="3">
          <div class="ac-target t3">
            <b>组织进攻</b>
            <p>规定时间内先打哪、放弃什么</p>
          </div>
        </Step>
        <div class="ac-target t4">
          <b>GPT 工具能力</b>
          <p>搜索漏洞、生成脚本、并行分析</p>
        </div>
      </section>
      <section class="ac-command-copy">
        <div class="ac-command-principle">
          <b>经验 = 稀缺上下文 + 直觉</b>
          <p>长期浸泡在战线里积累：哪里不对劲、先打哪、什么可以放弃。</p>
        </div>
        <div class="ac-command-principle">
          <b>实践 = 承担后果</b>
          <p>下场的肉身、承担的风险、撞墙后的顿悟，永远属于人。</p>
        </div>
        <div class="ac-takeaway">
          <strong>成为 AI 的指挥官。</strong
          >&nbsp;往哪打、何时打、为什么打，你说了算。
        </div>
      </section>
    </div>
    <div class="ac-footer">
      <span>五 · 经验与实践</span><span>27 / 28</span>
    </div>
  </Slide>
</template>

<notes lang="md">
真实 CTF 案例是论证中心。强调 AI 找漏洞更强，但人拥有赛场上下文和组织能力。
</notes>
