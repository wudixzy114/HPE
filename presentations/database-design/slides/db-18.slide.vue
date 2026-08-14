<template>
  <Slide class="db-slide">
    <div class="db-kicker">建模第 6 步 · 补充运行细节</div>
    <h2 data-node="title">任务保存提交内容，运行保存每次执行结果</h2>
    <div data-node="task-run-fields" class="db-grid-2" style="margin-top: 27px">
      <div class="db-card teal">
        <div class="db-label">task · 一次提交</div>
        <div class="db-entity teal" style="margin-top: 12px">
          <h3>task</h3>
          <div class="db-field"><span>project_id</span><em>项目</em></div>
          <div class="db-field">
            <span>template_version_id</span><em>模板版本</em>
          </div>
          <div class="db-field">
            <span>name / priority</span><em>通用字段</em>
          </div>
          <div class="db-field"><span>config</span><em>提交快照</em></div>
          <div class="db-field"><span>submitter_id</span><em>提交人</em></div>
          <div class="db-field">
            <span>current_status</span><em>当前汇总状态</em>
          </div>
        </div>
      </div>
      <div class="db-card orange">
        <div class="db-label">task_run · 一次执行</div>
        <div class="db-entity orange" style="margin-top: 12px">
          <h3>task_run</h3>
          <div class="db-field">
            <span>task_id / attempt_no</span><em>属于哪次尝试</em>
          </div>
          <div class="db-field"><span>status</span><em>本次状态</em></div>
          <div class="db-field">
            <span>external_job_id</span><em>外部编号</em>
          </div>
          <div class="db-field">
            <span>started_at / finished_at</span><em>时间</em>
          </div>
          <div class="db-field">
            <span>error_code / message</span><em>错误</em>
          </div>
          <div class="db-field"><span>version</span><em>防止覆盖</em></div>
        </div>
      </div>
    </div>
    <div data-node="retry-example" class="db-flow" style="margin-top: 24px">
      <div class="db-flow-node">
        <b>任务 T-1024</b><span>用户只提交一次</span>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node" style="border-color: #dfa8a8">
        <b class="db-red-text">运行 1：失败</b><span>保存错误与时间</span>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node" style="border-color: #79bdb4">
        <b class="db-teal-text">运行 2：成功</b
        ><span>新增一行，不覆盖运行 1</span>
      </div>
    </div>
    <div class="db-band">
      <strong>需要详细过程时：</strong>增加 run_event
      逐条记录状态变化；需要多个结果文件时，增加 artifact 保存对象存储 key
      和文件元数据。
    </div>
    <div class="db-footer">
      <span>相同配置重试新增运行；修改配置后重新提交通常新增任务</span
      ><span>18</span>
    </div>
  </Slide>
</template>

<notes lang="md">
用两个运行实例解释任务和运行的区别。第二次成功不能覆盖第一次失败，否则排障、审计和成功率统计都会失真。事件表和文件表在确有需求时再增加。
</notes>
