<template>
  <Slide class="db-slide db-cover">
    <div class="db-kicker">40 分钟实用分享</div>
    <div style="margin-top: 105px">
      <h1 data-node="title">
        产品经理的<br /><span class="db-accent">数据库设计</span>
      </h1>
      <p class="db-subtitle" style="margin-top: 24px !important">
        字段怎么选 · 表怎么拆 · 关系怎么建
      </p>
    </div>
    <div
      data-node="chapters"
      class="db-cover-topics"
      style="grid-template-columns: repeat(3, minmax(0, 1fr)); margin-top: 58px"
    >
      <div class="db-cover-topic">
        <b>选字段</b><span>类型、长度、ID、状态与空值</span>
      </div>
      <div class="db-cover-topic">
        <b>建表关系</b><span>实体、属性、一对多与多对多</span>
      </div>
      <div class="db-cover-topic">
        <b>完整案例</b><span>从用户故事逐步完成 ER 建模</span>
      </div>
    </div>
    <div class="db-footer">
      <span>数据库设计实用讲义</span><span>← → 翻页 · N 讲稿 · F 全屏</span>
    </div>
  </Slide>
</template>

<notes lang="md">
开场直接说明三件事：字段怎么选、表怎么拆、关系怎么建。随后用一个中台任务案例完整演示从用户故事到 ER 模型的过程。
</notes>
