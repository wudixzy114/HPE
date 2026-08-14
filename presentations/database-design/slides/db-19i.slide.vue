<template>
  <Slide class="db-slide">
    <div class="db-kicker">最终成果 · 简化案例逻辑 ER 模型</div>
    <h2 data-node="title">
      四个有清晰粒度的实体、三条关系，以及可执行的完整性规则
    </h2>

    <div data-node="overview-er" class="db-mermaid-panel overview">
      <img
        class="db-mermaid-img"
        src="../assets/er/overview.svg"
        alt="简化中台任务案例最终 ER 图"
      />
    </div>

    <div
      data-node="overview-reading"
      class="db-grid-3"
      style="margin-top: 12px"
    >
      <div class="db-note">
        <strong>实体粒度：</strong
        >模板定义、一次提交、一条输入、一次执行尝试，四类事实不混存。
      </div>
      <div class="db-note">
        <strong>关系：</strong>模板 → 任务、任务 → 输入、任务 →
        运行；外键一律放在子表。
      </div>
      <div class="db-note">
        <strong>规则：</strong
        >复合唯一键防重；输入和首次运行与任务在同一事务创建；重试只新增运行。
      </div>
    </div>

    <div class="db-footer">
      <span
        >外部引用：task.user_id、task.project_id、task_input.source_id
        指向已有模块；复合 UK 见约束页；PK=主键，FK=外键；乌鸦脚表示“多”</span
      ><span>19I</span>
    </div>
  </Slide>
</template>

<notes lang="md">
最终模型表达了实体粒度、动作产生的历史、关系基数和约束策略。用户、项目和数据源是边界外引用；复合唯一键和跨行规则在约束页明确说明。
</notes>
