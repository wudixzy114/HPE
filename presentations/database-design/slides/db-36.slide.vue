<template>
  <Slide class="db-slide db-cover">
    <div class="db-kicker">设计评审 · 最终检查</div>
    <h2 data-node="title" style="color: #fff; font-size: 46px">
      一套可复用的数据库设计评审清单
    </h2>
    <div
      data-node="final-checklist"
      class="db-check-grid"
      style="margin-top: 24px; gap: 8px 16px"
    >
      <div class="db-check">
        <i>1</i
        ><span><strong>事实：</strong>每张表能否用一句话说明只保存什么？</span>
      </div>
      <div class="db-check">
        <i>2</i
        ><span
          ><strong>身份：</strong>内部 ID、公开 ID、业务编号是否各司其职？</span
        >
      </div>
      <div class="db-check">
        <i>3</i
        ><span
          ><strong>关系：</strong>一对多和多对多是否使用子表 / 关系表？</span
        >
      </div>
      <div class="db-check">
        <i>4</i
        ><span
          ><strong>归属：</strong>字段是否依赖正确的键并跟随正确生命周期？</span
        >
      </div>
      <div class="db-check">
        <i>5</i
        ><span
          ><strong>重复：</strong
          >同一事实是否有唯一权威来源？快照是否明确？</span
        >
      </div>
      <div class="db-check">
        <i>6</i
        ><span
          ><strong>类型：</strong
          >范围、精度、长度、单位与空值含义是否明确？</span
        >
      </div>
      <div class="db-check">
        <i>7</i
        ><span
          ><strong>动态：</strong>JSON 是否有 Schema、版本和字段提升规则？</span
        >
      </div>
      <div class="db-check">
        <i>8</i
        ><span
          ><strong>约束：</strong>主键、唯一、外键、非空、范围是否落库？</span
        >
      </div>
      <div class="db-check">
        <i>9</i
        ><span
          ><strong>租户：</strong
          >唯一性、关联、查询和鉴权是否包含租户边界？</span
        >
      </div>
      <div class="db-check">
        <i>10</i
        ><span
          ><strong>历史：</strong>当前快照与过程事件是否按实际需要拆分？</span
        >
      </div>
      <div class="db-check">
        <i>11</i
        ><span
          ><strong>事务：</strong>一个用户动作中哪些事实必须一起成功？</span
        >
      </div>
      <div class="db-check">
        <i>12</i
        ><span
          ><strong>并发：</strong>重复、覆盖、超额、状态倒退如何阻止？</span
        >
      </div>
      <div class="db-check">
        <i>13</i
        ><span
          ><strong>跨系统：</strong
          >重复投递、乱序、失败补偿和对账是否定义？</span
        >
      </div>
      <div class="db-check">
        <i>14</i
        ><span
          ><strong>查询：</strong>高频过滤、排序、分页是否能对应候选索引？</span
        >
      </div>
      <div class="db-check">
        <i>15</i
        ><span
          ><strong>容量：</strong>行数、QPS、保留期与响应目标是否有数字？</span
        >
      </div>
      <div class="db-check">
        <i>16</i
        ><span
          ><strong>恢复：</strong
          >备份、归档、重建、人工修复与审计是否可执行？</span
        >
      </div>
    </div>
    <div data-node="final-principle" class="db-band" style="margin-top: 20px">
      <strong>最终标准：</strong
      >需求变化、数据增长、多人并发和局部故障发生时，业务事实仍然一致、可解释、可恢复。
    </div>
    <div class="db-footer">
      <span>数据库设计专业讲义</span><span>36 / 36</span>
    </div>
  </Slide>
</template>

<notes lang="md">
收尾逐类回顾，不再新增概念。这张清单既可用于 PRD 自检，也可用于产品与研发联合评审。最终评价不是表数量多少，而是面对变化、并发、增长和故障时，数据能否保持正确、可解释和可恢复。
</notes>
