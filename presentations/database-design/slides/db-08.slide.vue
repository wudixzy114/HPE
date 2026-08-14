<template>
  <Slide class="db-slide">
    <div class="db-kicker">字段类型 · 状态</div>
    <h2 data-node="title">
      状态不是一个随便写的字符串，而是一套“合法值 + 合法迁移 + 历史”
    </h2>
    <div
      data-node="state-layout"
      class="db-grid-2"
      style="margin-top: 24px; grid-template-columns: 0.9fr 1.4fr"
    >
      <div class="db-card teal">
        <div class="db-label">短代码是什么</div>
        <div class="db-code">
          status VARCHAR(20) NOT NULL<br /><br /><span class="good">CHECK</span>
          (status IN (<br />
          'QUEUED', 'RUNNING',<br />
          'SUCCEEDED', 'FAILED',<br />
          'CANCELLED'<br />))
        </div>
        <p style="margin-top: 12px">
          数据库保存稳定代码；“运行中”“Running”由前端根据语言展示。不要直接保存展示文案。
        </p>
      </div>
      <div>
        <div class="db-flow" style="margin-bottom: 16px">
          <div class="db-flow-node"><b>QUEUED</b><span>排队中</span></div>
          <div class="db-flow-arrow">→</div>
          <div class="db-flow-node"><b>RUNNING</b><span>运行中</span></div>
          <div class="db-flow-arrow">→</div>
          <div class="db-flow-node">
            <b>SUCCEEDED</b><span>成功，终态</span>
          </div>
        </div>
        <div class="db-grid-2">
          <div class="db-note">
            <strong>合法迁移：</strong>RUNNING → FAILED；QUEUED →
            CANCELLED。应用更新时必须带当前状态条件。
          </div>
          <div class="db-note">
            <strong>非法迁移：</strong>SUCCEEDED →
            RUNNING；收到乱序旧回调时不能让状态倒退。
          </div>
          <div class="db-note">
            <strong>当前状态：</strong>放主表，支持列表快速筛选。
          </div>
          <div class="db-note">
            <strong>过程历史：</strong
            >事件表记录谁、何时、从哪到哪、原因和外部事件 ID。
          </div>
        </div>
      </div>
    </div>
    <table
      data-node="state-storage-options"
      class="db-table compact"
      style="margin-top: 18px"
    >
      <thead>
        <tr>
          <th>约束方式</th>
          <th>适合</th>
          <th>主要权衡</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>VARCHAR/整数 + CHECK</td>
          <td>值少、随代码版本发布</td>
          <td>简单清楚，通常是任务状态首选</td>
        </tr>
        <tr>
          <td>数据库 ENUM</td>
          <td>集合极稳定</td>
          <td>约束强，但改值和跨库迁移可能麻烦</td>
        </tr>
        <tr>
          <td>字典表 + 外键</td>
          <td>运营可配置且状态还有属性</td>
          <td>可扩展，但字典表本身不等于状态机</td>
        </tr>
      </tbody>
    </table>
    <div class="db-footer">
      <span>布尔值只能表达两种确定答案，不能拼出完整流程</span><span>08</span>
    </div>
  </Slide>
</template>

<notes lang="md">
解释“短代码 + 合法值限制”：短代码是稳定的机器值，不是中文展示文案。CHECK 负责阻止不存在的状态，但状态能否从 A 变到 B 通常还需要条件更新与应用状态机。只用 is_finished、is_success 会产生矛盾组合，例如两个字段同时为 false 到底是排队还是运行。
</notes>
