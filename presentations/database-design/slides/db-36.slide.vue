<template>
  <Slide class="db-slide db-cover">
    <div class="db-kicker">设计评审 · 最终检查</div>
    <h2 data-node="title" style="color: #fff; font-size: 46px">
      用 14 个问题检查一份数据库设计
    </h2>
    <div
      data-node="final-checklist"
      class="db-check-grid"
      style="margin-top: 25px; gap: 9px 16px"
    >
      <div class="db-check">
        <i>1</i><span>每张表能否用一句话说明保存什么？</span>
      </div>
      <div class="db-check">
        <i>2</i><span>一个对象下面有多条数据时，是否使用子表？</span>
      </div>
      <div class="db-check">
        <i>3</i><span>多对多关系是否使用关系表？</span>
      </div>
      <div class="db-check">
        <i>4</i><span>字段是否放在真正拥有它的表中？</span>
      </div>
      <div class="db-check">
        <i>5</i><span>同一个当前事实是否只维护一份？</span>
      </div>
      <div class="db-check">
        <i>6</i><span>内部 ID、公开 ID、业务编号是否分清？</span>
      </div>
      <div class="db-check">
        <i>7</i><span>字段类型、长度、范围、单位是否明确？</span>
      </div>
      <div class="db-check">
        <i>8</i><span>NULL、空字符串、0 和 false 的含义是否明确？</span>
      </div>
      <div class="db-check">
        <i>9</i><span>主键、唯一、外键、非空和范围约束是否齐全？</span>
      </div>
      <div class="db-check">
        <i>10</i><span>状态有哪些，允许怎样变化，是否需要历史？</span>
      </div>
      <div class="db-check">
        <i>11</i><span>重复提交和多人修改冲突如何处理？</span>
      </div>
      <div class="db-check">
        <i>12</i><span>高频筛选、排序和分页方式是否明确？</span>
      </div>
      <div class="db-check">
        <i>13</i><span>数据量、访问高峰和保留期是否有数字？</span>
      </div>
      <div class="db-check">
        <i>14</i><span>批量导出、定时处理和历史清理是否有上限？</span>
      </div>
    </div>
    <div data-node="final-principle" class="db-band" style="margin-top: 23px">
      <strong>核心目标：</strong
      >每个事实有清晰位置，每段关系能够扩展，每条关键规则有约束，数据增长后仍然容易查询和维护。
    </div>
    <div class="db-footer"><span>数据库设计专业讲义</span><span>END</span></div>
  </Slide>
</template>

<notes lang="md">
最后按表、关系、字段、约束、状态、冲突和性能逐类检查。这张清单可直接用于 PRD 自检和产品研发联合评审。
</notes>
