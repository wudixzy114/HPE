<template>
  <Slide class="db-slide">
    <div class="db-kicker">Mermaid ER Diagram · 运行、事件与文件</div>
    <h2 data-node="title">
      运行图：task 产生多次 task_run，每次运行再产生事件和文件
    </h2>

    <div data-node="run-er" class="db-mermaid-panel">
      <img
        class="db-mermaid-img"
        src="../assets/er/run.svg"
        alt="任务、运行、状态事件与结果文件的 ER 关系图"
      />
    </div>

    <div data-node="run-er-legend" class="db-er-legend">
      <div class="db-note">
        <strong>task → task_run</strong><br />一个任务可运行多次；FK 在
        task_run.task_id。
      </div>
      <div class="db-note">
        <strong>task_run → event</strong><br />一次运行有多条状态变化；FK 在
        event.run_id。
      </div>
      <div class="db-note">
        <strong>task_run → artifact</strong><br />一次运行可产生多个文件；FK 在
        artifact.run_id。
      </div>
      <div class="db-note">
        <strong>attempt_no</strong><br />与 task_id 组成唯一规则，区分第 1、2、3
        次运行。
      </div>
    </div>

    <div class="db-footer">
      <span>这张图只保留执行链路，因此实体与字段更容易阅读</span
      ><span>ER-C</span>
    </div>
  </Slide>
</template>

<notes lang="md">
执行链路单独拆成一页。task 是一次提交，task_run 是一次执行尝试；状态事件和结果文件都属于某一次运行。关系线旁的名称和实体框中的 FK 可以互相核对。
</notes>
