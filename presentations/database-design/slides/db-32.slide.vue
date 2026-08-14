<template>
  <Slide class="db-slide">
    <div class="db-kicker">数据完整性（Data Integrity）与业务规则</div>
    <h2 data-node="title">
      数据库负责保存和约束数据，完整业务流程还需要应用系统配合
    </h2>
    <div data-node="simple-boundary" class="db-grid-2" style="margin-top: 30px">
      <div class="db-card teal">
        <div class="db-label">数据库擅长</div>
        <div
          class="db-check-grid"
          style="grid-template-columns: 1fr; margin-top: 12px"
        >
          <div class="db-check">
            <i>✓</i><span>主键保证每条记录有唯一身份</span>
          </div>
          <div class="db-check">
            <i>✓</i><span>唯一约束防止业务数据重复</span>
          </div>
          <div class="db-check">
            <i>✓</i><span>外键保证引用的任务、项目真实存在</span>
          </div>
          <div class="db-check">
            <i>✓</i><span>事务让一组数据库修改一起成功或失败</span>
          </div>
          <div class="db-check">
            <i>✓</i><span>索引帮助常用查询更快定位数据</span>
          </div>
        </div>
      </div>
      <div class="db-card blue">
        <div class="db-label">应用系统负责</div>
        <div
          class="db-check-grid"
          style="grid-template-columns: 1fr; margin-top: 12px"
        >
          <div class="db-check">
            <i>1</i><span>判断用户有没有权限查看和修改</span>
          </div>
          <div class="db-check"><i>2</i><span>定义状态可以怎样变化</span></div>
          <div class="db-check">
            <i>3</i><span>处理重复请求、失败重试和用户提示</span>
          </div>
          <div class="db-check">
            <i>4</i><span>调用外部系统失败后的补偿与查询</span>
          </div>
          <div class="db-check">
            <i>5</i><span>限制接口并发、导出规模和批处理速度</span>
          </div>
        </div>
      </div>
    </div>
    <div data-node="boundary-example" class="db-flow" style="margin-top: 25px">
      <div class="db-flow-node">
        <b>数据库</b><span>保证 task_run.task_id 对应真实任务</span>
      </div>
      <div class="db-flow-arrow">+</div>
      <div class="db-flow-node">
        <b>应用系统</b><span>保证当前用户有权查看这个任务</span>
      </div>
      <div class="db-flow-arrow">=</div>
      <div class="db-flow-node" style="border-color: #79bdb4">
        <b>完整业务保证</b><span>数据正确，同时访问合法</span>
      </div>
    </div>
    <div class="db-band teal">
      <strong>理解边界即可：</strong
      >数据库提供可靠的数据底座，业务含义、权限和外部流程由应用系统共同完成。
    </div>
    <div class="db-footer">
      <span>本节不展开分布式一致性和数据库内部机制</span><span>32</span>
    </div>
  </Slide>
</template>

<notes lang="md">
能力边界压缩为直观的一页。数据库能保证数据存在、唯一和关联正确；应用系统负责权限、状态流程、失败重试和外部调用。让产品知道哪些规则需要共同设计即可。
</notes>
