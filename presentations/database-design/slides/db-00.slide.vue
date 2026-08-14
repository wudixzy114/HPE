<template>
  <Slide class="db-slide db-cover">
    <div class="db-kicker">数据库设计 · 产品与研发共同语言</div>
    <div style="margin-top: 82px">
      <h1 data-node="title">
        从业务需求到<br /><span class="db-accent">表、字段、约束与性能</span>
      </h1>
      <p class="db-subtitle" style="margin-top: 24px !important">
        以中台提交任务为完整案例：不仅知道怎么设计，还要知道为什么这样设计、设计错了会发生什么。
      </p>
    </div>
    <div data-node="chapters" class="db-cover-topics" style="margin-top: 48px">
      <div class="db-cover-topic">
        <b>字段类型</b
        ><span>INT / BIGINT、VARCHAR、金额、空值、状态、JSON</span>
      </div>
      <div class="db-cover-topic">
        <b>ID 体系</b><span>自增 ID、业务编号、UUID 与雪花算法的选择</span>
      </div>
      <div class="db-cover-topic">
        <b>建模与范式</b><span>从用户故事一步步拆实体、关系、字段和历史</span>
      </div>
      <div class="db-cover-topic">
        <b>正确性与性能</b><span>约束、事务、并发、跨系统一致性与容量保护</span>
      </div>
    </div>
    <div class="db-footer">
      <span>数据库设计专业讲义</span><span>← → 翻页 · N 讲稿 · F 全屏</span>
    </div>
  </Slide>
</template>

<notes lang="md">
开场直接说明范围：这不是 SQL 语法课，而是一套从业务需求到可落地数据结构的方法。全程用中台提交任务的场景串联，重点解释选择背后的原因以及错误设计在并发、扩展、可靠性和性能上的代价。
</notes>
