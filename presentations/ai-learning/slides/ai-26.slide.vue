<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">五 · 出路三</div>
    <h2 data-node="title">
      GPT 找漏洞已经比选手强，为什么 CTF 冠军仍然不可替代？
    </h2>

    <div data-node="command" class="ac-command-stage">
      <section class="ac-command-map">
        <div class="ac-commander"><b>人类指挥官</b><span>CTF 冠军</span></div>

        <Step :at="1" class="ac-command-slot t4">
          <div class="ac-target">
            <b>GPT 工具能力</b>
            <p>搜索漏洞、生成脚本、并行分析——纯工具能力已经远比选手本人强。</p>
          </div>
        </Step>
        <Step :at="2" class="ac-command-slot t1">
          <div class="ac-target">
            <b>比赛特点</b>
            <p>人知道题型、规则、赛场节奏，以及这场比赛与其他比赛哪里不同。</p>
          </div>
        </Step>
        <Step :at="3" class="ac-command-slot t2">
          <div class="ac-target">
            <b>出题人与陷阱</b>
            <p>
              人更懂人，知道出题人的喜好，也知道裁判可能在哪些地方设置陷阱。
            </p>
          </div>
        </Step>
        <Step :at="4" class="ac-command-slot t3">
          <div class="ac-target">
            <b>组织进攻</b>
            <p>
              人在规定时间内决定先打哪、如何分配注意力，以及什么题应该果断放弃。
            </p>
          </div>
        </Step>
      </section>

      <section class="ac-command-copy">
        <div class="ac-command-question">
          <b>工具它比你强，但战场日志不在任何通用语料里。</b>
          <span
            >真正稀缺的不是“知道多少”，而是长期浸泡在一条战线后形成的工作流与判断力。</span
          >
        </div>
        <Step :at="5">
          <div class="ac-command-principle">
            <b>经验 = 稀缺上下文 + 直觉</b>
            <p>
              哪里不对劲、先打哪、什么可以放弃；AI
              有通用语料，没有你的战场日志。
            </p>
          </div>
          <div class="ac-command-principle">
            <b>实践 = 承担后果</b>
            <p>下场的肉身、承担的风险、撞墙后的顿悟，永远属于人。</p>
          </div>
          <div class="ac-takeaway">
            <strong>成为 AI 的指挥官。</strong
            >&nbsp;往哪打、何时打、为什么打，你说了算。
          </div>
        </Step>
      </section>
    </div>
    <div class="ac-footer">
      <span>五 · 经验与实践</span><span>27 / 28</span>
    </div>
  </Slide>
</template>

<notes lang="md">
初始状态只有中心指挥官与问题。依次出现 GPT 工具能力、比赛上下文、识别人性陷阱和组织进攻；最后才出现经验、实践和指挥官结论。所有地图节点由 Step 外壳固定坐标，不会瞬移。
</notes>
