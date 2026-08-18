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
          <div class="human">定义方向与边界</div>
          <div class="ai">全权代理：案例、特例、边缘情况</div>
        </div>
      </Step>
      <Step :at="2">
        <div class="ac-responsibility-row">
          <div class="step"><b>02</b>压缩建模</div>
          <div class="human">模型必须在自己的脑中形成</div>
          <div class="ai">陪同提炼、蒸馏和反驳</div>
        </div>
      </Step>
      <Step :at="3">
        <div class="ac-responsibility-row">
          <div class="step"><b>03</b>迁移连接</div>
          <div class="human">判断映射是否真实有效</div>
          <div class="ai">连接器 + 考官</div>
        </div>
      </Step>
      <Step :at="4">
        <div class="ac-responsibility-row">
          <div class="step"><b>04</b>实践检验</div>
          <div class="human">
            <strong>必须由人完成：下场、风险、后果</strong>
          </div>
          <div class="ai">只能沙盘推演、扫清盲区</div>
        </div>
      </Step>
      <Step :at="5">
        <div class="ac-responsibility-row">
          <div class="step"><b>05</b>复盘迭代</div>
          <div class="human">看见问题后改变自己</div>
          <div class="ai">分析低效与偏差</div>
        </div>
      </Step>
    </div>

    <div class="ac-takeaway" style="margin-top: 16px">
      <strong>匹配，不是外包。</strong>&nbsp;AI 负责提出假说，物理世界负责审判。
    </div>
    <div class="ac-footer"><span>二 · 人机分工</span><span>11 / 28</span></div>
  </Slide>
</template>

<notes lang="md">
第四行是视觉和论点中心。表格不逐格念，只讲代理、协同、必须由人三种关系。
</notes>
