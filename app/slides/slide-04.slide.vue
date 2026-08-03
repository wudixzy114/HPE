<template>
  <Slide class="slide application-slide">
    <div class="top">
      <div class="kicker">一、架构总览</div>
      <div class="chapter">04 / 49</div>
    </div>
    <h2 data-node="title">应用：一次任务卡住，先在哪一层找原因？</h2>
    <p data-node="subtitle" class="subtitle">
      不急着改 Prompt。对着第 01
      页那张五层图，从症状定位到具体某一层，才能把问题交给对的地方。
    </p>
    <div data-node="grid-1" class="grid three" style="margin-top: 30px">
      <div class="card">
        <div class="label">01 · 先分是哪一层</div>
        <p>
          <b>照 L5→L1 对号入座</b><br />进不去 / 入口报错 → L5；输出乱码、渲染卡
          → L4；转圈不收敛、反复调工具 → L3；某个工具报错或被拦 →
          L2；状态丢失、跨会话没接上 → L1。
        </p>
      </div>
      <div class="card">
        <div class="label">02 · 再看横向策略</div>
        <p>
          <b>不是某层的锅，就查横向</b
          ><br />上下文被撑爆（记忆章）、权限把操作拦了（权限章）、Hook / MCP
          挂了（扩展章）——这几样贯穿所有层。
        </p>
      </div>
      <div class="card">
        <div class="label">03 · 留下交接物</div>
        <p>
          <b>写清证据与归属</b><br />复现条件 + 落在哪一层 + 观察到的证据 +
          下一步，别只留一句「它不工作」。
        </p>
      </div>
    </div>
    <div class="band purple-band" style="margin-top: 26px">
      <b>本节落地：</b
      >把五层图当<b>问题分诊表</b>——先定位到层，再定位到横向策略，最后才动手改。
    </div>
    <div class="foot">
      <span>应用页 01 · 后续补充团队真实案例</span><span>04</span>
    </div>
  </Slide>
</template>

<notes lang="md">
应用页。用一张五层图处理真实问题：先从症状入手，再顺着任务经过的入口、会话、循环、工具和横向能力定位。这里先固定排布，后续补入团队自己的真实案例与截图。
</notes>
