<template>
  <Slide class="db-slide">
    <div class="db-kicker">字段类型 · 动态配置</div>
    <h2 data-node="title">
      “动态配置”指结构因类型或版本而变化，不代表没有结构
    </h2>
    <div
      data-node="dynamic-definition"
      class="db-grid-3"
      style="margin-top: 23px"
    >
      <div class="db-card teal">
        <div class="db-label">结构按任务类型变化</div>
        <p>
          数据处理任务有
          SQL、输出表；质量检查任务有规则集；报表任务有统计维度和通知方式。
        </p>
      </div>
      <div class="db-card blue">
        <div class="db-label">结构按版本演进</div>
        <p>
          模板 v1 只有单输入；v2 支持多输入；历史任务必须仍能按提交时版本解释。
        </p>
      </div>
      <div class="db-card orange">
        <div class="db-label">通常整体读取</div>
        <p>
          执行器取整份配置启动任务，而不是频繁并发修改 JSON 中某一个小字段。
        </p>
      </div>
    </div>
    <table
      data-node="json-eav-table"
      class="db-table dense"
      style="margin-top: 19px"
    >
      <thead>
        <tr>
          <th>方案</th>
          <th>优点</th>
          <th>失去什么</th>
          <th>何时使用</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>普通列</strong></td>
          <td>类型、外键、唯一、索引与统计最清楚</td>
          <td>结构变更需要迁移与发版</td>
          <td>通用、稳定、强约束、高频查询字段</td>
        </tr>
        <tr>
          <td><strong>JSON / JSONB</strong></td>
          <td>结构可按模板版本变化，整体保存方便</td>
          <td>跨字段约束、外键与统一分析更复杂</td>
          <td>类型特有、低频筛选、整体读取的配置</td>
        </tr>
        <tr>
          <td><strong>EAV</strong><br />attribute_name/value</td>
          <td>字段可任意增加，极度稀疏</td>
          <td>数字日期都易变字符串；查询需多次自连接；必填与范围难约束</td>
          <td>真正的元数据平台，不能作为普通业务默认方案</td>
        </tr>
      </tbody>
    </table>
    <div data-node="json-rules" class="db-grid-2" style="margin-top: 18px">
      <div class="db-note">
        <strong>JSON 必须一起保存：</strong>schema_version、校验
        Schema、默认值规则和模板版本。否则同一 key 可能先是数字，后来变字符串。
      </div>
      <div class="db-note">
        <strong>字段提升规则：</strong
        >一旦成为高频筛选、排序、统计、关联或强约束字段，就从 JSON
        提升为明确列或专门结构。
      </div>
    </div>
    <div class="db-footer">
      <span>JSON 是版本化扩展区，不是无结构垃圾桶</span><span>10</span>
    </div>
  </Slide>
</template>

<notes lang="md">
先定义什么才算动态配置，避免把“暂时没想清楚”也叫动态。JSON 的灵活来自结构由模板 Schema 管理，而不是完全无校验。EAV 看似更灵活，但会损失类型、约束和查询能力，只适合非常特殊的元数据场景。
</notes>
