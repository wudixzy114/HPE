<template>
  <Slide class="db-slide">
    <div class="db-kicker">Mermaid ER Diagram · 任务提交与输入</div>
    <h2 data-node="title">任务提交图：项目、模板版本和提交人共同指向 task</h2>

    <div data-node="execution-er" class="db-mermaid-panel">
      <img
        class="db-mermaid-img"
        src="../assets/er/execution.svg"
        alt="项目、模板版本、提交人、任务与任务输入的 ER 关系图"
      />
    </div>

    <div data-node="execution-er-legend" class="db-er-legend">
      <div class="db-note">
        <strong>project / version → task</strong
        ><br />每个任务属于项目，并引用提交时模板版本。
      </div>
      <div class="db-note">
        <strong>task → task_input</strong><br />一个任务包含多个输入；FK 在
        task_input.task_id。
      </div>
      <div class="db-note">
        <strong>user / data_source</strong><br />提交人关联 task；数据源关联
        task_input，外键分别是 submitter_id 与 source_id。
      </div>
      <div class="db-note">
        <strong>task 是提交中心</strong
        ><br />保存项目、模板版本、提交人、配置和当前状态。
      </div>
    </div>

    <div class="db-footer">
      <span>实体框内 PK=主键，FK=外键，UK=唯一键</span><span>ER-B</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这页只讲任务提交。project、template_version 和 app_user 都是一对多指向 task；task 再一对多指向 task_input。每个外键都列在 task 或 task_input 的实体框中。
</notes>
