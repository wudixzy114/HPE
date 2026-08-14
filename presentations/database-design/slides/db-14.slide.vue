<template>
  <Slide class="db-slide">
    <div class="db-kicker">建模第 2 步 · 画出业务流转</div>
    <h2 data-node="title">
      先画主流程：用户选择模板，提交任务，系统产生一次或多次运行
    </h2>
    <div data-node="business-flow" class="db-flow" style="margin-top: 46px">
      <div class="db-flow-node">
        <b>工作空间 / 项目</b><span>确定任务归属与可见范围</span>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node">
        <b>模板版本</b><span>决定表单结构和配置规则</span>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node" style="border-color: #79bdb4">
        <b>任务</b><span>用户的一次提交与配置快照</span>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node" style="border-color: #e8b18f">
        <b>运行</b><span>系统的一次实际执行尝试</span>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node">
        <b>状态与文件</b><span>执行过程和产生的结果</span>
      </div>
    </div>
    <div data-node="flow-questions" class="db-grid-3" style="margin-top: 38px">
      <div class="db-card blue">
        <div class="db-label">模板升级</div>
        <h3>为什么需要版本？</h3>
        <p style="margin-top: 10px">
          历史任务要继续按照提交时的表单和配置规则解释。
        </p>
      </div>
      <div class="db-card teal">
        <div class="db-label">任务提交</div>
        <h3>什么是一条任务？</h3>
        <p style="margin-top: 10px">
          用户确认提交的一份业务记录，包括归属、输入和参数快照。
        </p>
      </div>
      <div class="db-card orange">
        <div class="db-label">失败重试</div>
        <h3>为什么需要运行？</h3>
        <p style="margin-top: 10px">
          同一任务可能执行多次，每次的状态、时间、错误和外部编号都不同。
        </p>
      </div>
    </div>
    <div class="db-band">
      <strong>核心区分：</strong
      >任务记录用户“提交了什么”；运行记录系统“实际执行了哪一次”。
    </div>
    <div class="db-footer">
      <span>先画业务流，再决定每个节点是否成为表</span><span>14</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这页只建立流程，避免马上进入密集字段。模板版本决定提交表单；任务记录用户意图；运行记录一次执行。重试时用户意图不变，因此新增运行；修改输入后重新提交则会产生新任务。
</notes>
