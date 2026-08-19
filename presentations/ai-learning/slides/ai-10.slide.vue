<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">二 · 人机分工</div>
    <h2 data-node="title">五步之中，只有实践是 AI 完全无法代劳的</h2>

    <div class="ac-responsibility-head">
      <span>学习步骤</span><span>人的责任</span><span>AI 的角色</span>
    </div>
    <div data-node="responsibility" class="ac-responsibility">
      <Step :at="1">
        <div class="ac-responsibility-row">
          <div class="step"><b>01</b>采样输入</div>
          <div class="human">定方向；其余交给 AI</div>
          <div class="ai">
            <strong>AI 全权代理</strong
            >：最强采样机——案例、特例、边缘情况，瞬间把书读厚
          </div>
        </div>
      </Step>
      <Step :at="2">
        <div class="ac-responsibility-row">
          <div class="step"><b>02</b>压缩建模</div>
          <div class="human"><strong>压缩必须发生在你的脑子里</strong></div>
          <div class="ai">人机协同：AI 洞察力很强，陪你一起提炼蒸馏</div>
        </div>
      </Step>
      <Step :at="3">
        <div class="ac-responsibility-row">
          <div class="step"><b>03</b>迁移连接</div>
          <div class="human">判断映射是真同构，还是表面相似</div>
          <div class="ai">人机协同：连接器 + 考官，也出题考你的迁移能力</div>
        </div>
      </Step>
      <Step :at="4">
        <div class="ac-responsibility-row">
          <div class="step"><b>04</b>实践检验</div>
          <div class="human">
            <strong>必须是人：下场的肉身和后果，它替不了</strong>
          </div>
          <div class="ai">AI 只能沙盘推演、扫清盲区</div>
        </div>
      </Step>
      <Step :at="5">
        <div class="ac-responsibility-row">
          <div class="step"><b>05</b>复盘迭代</div>
          <div class="human">把看见的偏差，落实成下一轮学法的改变</div>
          <div class="ai">人机协同：听你讲思考历程，帮你分析低效与偏差</div>
        </div>
      </Step>
    </div>

    <div data-node="laws" class="ac-two-laws">
      <Step :at="6">
        <section>
          <b>铁律一 · 只有实践无法代劳</b>
          <p>
            ① AI
            可以全权代理，②③⑤都能深度协同；但下场的肉身、承担的风险、撞墙后的顿悟，永远属于人。
          </p>
        </section>
      </Step>
      <Step :at="7">
        <section>
          <b>铁律二 · 协同是匹配，不是外包</b>
          <p>
            它给出的洞察，你要能接得住、驳得动、消化成自己的；否则“用 AI
            学习”就退化成“让 AI 替你学”。
          </p>
        </section>
      </Step>
    </div>
    <div class="ac-human-ai-verdict">AI 负责提出假说，物理世界负责审判。</div>
    <div class="ac-footer"><span>二 · 人机分工</span><span>11 / 28</span></div>
  </Slide>
</template>

<notes lang="md">
第四行是视觉和论点中心。五步完成后再揭示两条铁律，保留原稿关于代理、协同、实践与外包风险的完整阐释。
</notes>
