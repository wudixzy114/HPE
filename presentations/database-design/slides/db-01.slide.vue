<template>
  <Slide class="db-slide">
    <div class="db-kicker">设计总流程</div>
    <h2 data-node="title">从一段需求到数据库，要连续完成六次判断</h2>
    <div data-node="design-flow" class="db-flow" style="margin-top: 32px">
      <div class="db-flow-node">
        <b>① 提取事实</b><span>哪些对象、动作和规则需要长期保存</span>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node">
        <b>② 划分实体</b><span>谁有独立身份、状态和生命周期</span>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node">
        <b>③ 确定关系</b><span>一条、多条、多对多与是否必选</span>
      </div>
    </div>
    <div class="db-flow" style="margin-top: 18px">
      <div class="db-flow-node">
        <b>④ 分配字段</b><span>字段由谁决定，是当前值还是历史快照</span>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node">
        <b>⑤ 定义约束</b><span>主键、唯一、外键、非空、合法范围</span>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node">
        <b>⑥ 验证运行</b><span>并发、失败、查询、增长与数据保留</span>
      </div>
    </div>
    <div
      data-node="design-input-output"
      class="db-grid-2"
      style="margin-top: 25px"
    >
      <div class="db-note">
        <strong>输入不是页面控件：</strong
        >页面只是当前交互。真正输入是用户故事、状态变化、业务不变量、查询方式和容量。
      </div>
      <div class="db-note">
        <strong>输出不只是一张表：</strong
        >完整设计应包含表关系、字段字典、约束、状态机、事务边界、索引与保留策略。
      </div>
    </div>
    <div class="db-footer">
      <span>后续章节会把这六步完整走一遍</span><span>01</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这不是“目标页”，而是整套方法的地图。提醒听众，表结构只是结果，前面还有业务事实和关系判断，后面还有并发和容量验证。之后看到任何字段或拆表争议，都可以定位到这六步中的某一步。
</notes>
