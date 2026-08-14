<template>
  <Slide class="db-slide">
    <div class="db-kicker">跨系统可靠性 · Outbox</div>
    <h2 data-node="title">写数据库再调用外部系统，必须处理“只成功了一半”</h2>
    <div
      data-node="dual-write-failures"
      class="db-grid-2"
      style="margin-top: 23px"
    >
      <div class="db-card red">
        <div class="db-label">顺序 A · 先写库，再调用外部系统</div>
        <div class="db-flow" style="margin-top: 14px">
          <div class="db-flow-node"><b>DB 成功</b></div>
          <div class="db-flow-arrow">→</div>
          <div class="db-flow-node" style="border-color: #dfa8a8">
            <b class="db-red-text">网络超时</b>
          </div>
        </div>
        <p style="margin-top: 13px">
          数据库显示任务已创建，但外部系统可能没收到，也可能已收到但响应丢失。
        </p>
      </div>
      <div class="db-card orange">
        <div class="db-label">顺序 B · 先调用外部系统，再写库</div>
        <div class="db-flow" style="margin-top: 14px">
          <div class="db-flow-node"><b>外部成功</b></div>
          <div class="db-flow-arrow">→</div>
          <div class="db-flow-node" style="border-color: #dfa8a8">
            <b class="db-red-text">DB 失败</b>
          </div>
        </div>
        <p style="margin-top: 13px">
          外部已有实际任务，但本地数据库没有记录，后续回调无法归属。
        </p>
      </div>
    </div>
    <div data-node="outbox-flow" class="db-flow" style="margin-top: 23px">
      <div class="db-flow-node" style="border-color: #79bdb4">
        <b>同一 DB 事务</b><span>写 task + run + outbox_event</span>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node">
        <b>后台扫描</b><span>锁定未发送事件，小批量投递</span>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node">
        <b>外部幂等接收</b><span>按事件 ID / 请求 ID 去重</span>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node">
        <b>标记已发送</b><span>失败则退避重试并报警</span>
      </div>
    </div>
    <table
      data-node="reliability-rules"
      class="db-table compact"
      style="margin-top: 18px"
    >
      <thead>
        <tr>
          <th>必须定义</th>
          <th>规则</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>重复投递</td>
          <td>消费者按稳定事件 ID 幂等；重复处理结果与一次相同</td>
        </tr>
        <tr>
          <td>乱序事件</td>
          <td>使用版本、状态前置条件或事件序号拒绝旧事件覆盖新状态</td>
        </tr>
        <tr>
          <td>永久失败</td>
          <td>重试上限、死信/待人工处理状态、对账与人工补偿入口</td>
        </tr>
        <tr>
          <td>可观察性</td>
          <td>监控未发送数量、最老事件延迟、重试次数和失败原因</td>
        </tr>
      </tbody>
    </table>
    <div class="db-footer">
      <span>Exactly once 常落地为：允许重复投递 + 幂等处理 + 可对账修复</span
      ><span>31</span>
    </div>
  </Slide>
</template>

<notes lang="md">
双写问题不是选择先后顺序就能解决。Outbox 让“业务记录存在”和“待发送事件存在”在一个本地事务中同时成立，后台再可靠投递。投递仍可能重复，因此消费者必须幂等，并准备永久失败后的对账和人工修复。
</notes>
