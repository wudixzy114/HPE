<template>
  <Slide class="db-slide">
    <div class="db-kicker">设计范式 · 第三范式</div>
    <h2 data-node="title">第三范式：非主键字段不要再决定另一个非主键字段</h2>
    <div
      data-node="third-normal-form"
      class="db-grid-2"
      style="margin-top: 24px"
    >
      <div class="db-card red">
        <div class="db-label">反例 · 任务表混入项目事实</div>
        <div class="db-code">
          <span class="bad">task</span>(<br />
          id,<br />
          project_id,<br />
          project_name,<br />
          workspace_id,<br />
          workspace_name,<br />
          task_name,<br />
          ...<br />)
        </div>
        <div class="db-flow" style="margin-top: 16px">
          <div class="db-flow-node"><b>task.id</b></div>
          <div class="db-flow-arrow">→</div>
          <div class="db-flow-node"><b>project_id</b></div>
          <div class="db-flow-arrow">→</div>
          <div class="db-flow-node"><b>project_name</b></div>
        </div>
        <p style="margin-top: 12px">
          project_name 实际由 project_id
          决定，不是任务自己的事实；workspace_name 同理。
        </p>
      </div>
      <div class="db-card teal">
        <div class="db-label">正确拆分</div>
        <div class="db-code">
          <span class="good">workspace</span>(id, name)<br /><br /><span
            class="good"
            >project</span
          >(id, workspace_id, name)<br /><br /><span class="good">task</span
          >(id, project_id, task_name, ...)
        </div>
        <ul>
          <li>项目改名只更新一行。</li>
          <li>项目可以在没有任务时先创建。</li>
          <li>删除最后一个任务不会误删项目信息。</li>
          <li>任务表宽度和重复数据减少。</li>
        </ul>
      </div>
    </div>
    <div
      data-node="third-normal-form-signals"
      class="db-grid-3"
      style="margin-top: 18px"
    >
      <div class="db-note">
        <strong>识别信号 1：</strong>同一个名称、地区、负责人在大量记录中重复。
      </div>
      <div class="db-note">
        <strong>识别信号 2：</strong>更新某个字段时，需要 WHERE
        另一个非主键字段批量更新。
      </div>
      <div class="db-note">
        <strong>识别信号 3：</strong>某个信息必须等另一类记录出现后才能插入。
      </div>
    </div>
    <div class="db-footer">
      <span>目标不是表越多，而是每个事实有唯一权威位置</span><span>24</span>
    </div>
  </Slide>
</template>

<notes lang="md">
第三范式避免传递依赖。任务通过 project_id 找到项目名称，项目再通过 workspace_id 找到工作空间。若把这些名称复制进每条任务，改名、插入和删除都会产生异常。查询需要 JOIN 是正常代价，必要时再做受控缓存。
</notes>
