<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">二 · 人机分工</div>
    <h2 data-node="title">AI 可以参与每一步，但只有人能下场并承担后果</h2>

    <div class="ac-responsibility-head">
      <span>学习步骤</span><span>人的责任</span><span>AI 的角色</span>
    </div>
    <div data-node="responsibility" class="ac-responsibility">
      <Step :at="1">
        <div class="ac-responsibility-row">
          <div class="step"><b>01</b>采样输入</div>
          <div class="human">定义学习方向、问题边界和判断标准</div>
          <div class="ai">
            最强采样机：瞬间补齐案例、特例、边缘情况，把书读厚
          </div>
        </div>
      </Step>
      <Step :at="2">
        <div class="ac-responsibility-row">
          <div class="step"><b>02</b>压缩建模</div>
          <div class="human">压缩必须发生在自己的脑中，最终模型由自己负责</div>
          <div class="ai">陪同提炼、蒸馏和反驳，帮助发现更简洁的因果结构</div>
        </div>
      </Step>
      <Step :at="3">
        <div class="ac-responsibility-row">
          <div class="step"><b>03</b>迁移连接</div>
          <div class="human">判断跨界映射是真同构，还是只有表面相似</div>
          <div class="ai">
            连接器 + 考官：寻找跨界映射，也用陌生情境检验迁移
          </div>
        </div>
      </Step>
      <Step :at="4">
        <div class="ac-responsibility-row">
          <div class="step"><b>04</b>实践检验</div>
          <div class="human">
            <strong>必须由人完成：下场、风险、后果</strong>
          </div>
          <div class="ai">只能沙盘推演、扫清盲区，不能替你承担现实后果</div>
        </div>
      </Step>
      <Step :at="5">
        <div class="ac-responsibility-row">
          <div class="step"><b>05</b>复盘迭代</div>
          <div class="human">把看见的偏差落实成下一轮学习方式的改变</div>
          <div class="ai">听你讲思考历程，分析低效、归因错误与认知偏差</div>
        </div>
      </Step>
    </div>

    <div data-node="laws" class="ac-two-laws">
      <Step :at="6">
        <section>
          <b>铁律一 · 只有实践无法代劳</b>
          <p>
            ① AI
            可以全权代理，②③⑤可以深度协同；但下场的肉身、承担的风险和撞墙后的顿悟，永远属于人。
          </p>
        </section>
      </Step>
      <Step :at="7">
        <section>
          <b>铁律二 · 匹配，不是外包</b>
          <p>
            它给出的洞察，你要能接得住、驳得动、消化成自己的；否则“用 AI
            学习”会退化成“让 AI 替你学”。
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
