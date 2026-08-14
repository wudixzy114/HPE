<template>
  <Slide class="db-slide">
    <div class="db-kicker">ID 设计示例 · 本地与外部标识落表</div>
    <h2 data-node="title">
      同一个任务同时拥有内部主键、公开 UUID、业务编号和外部执行 ID
    </h2>

    <div
      data-node="id-schema-example"
      class="db-grid-2"
      style="margin-top: 27px"
    >
      <div class="db-card teal">
        <div class="db-label">本地任务表</div>
        <div class="db-code" style="margin-top: 12px">
          <span class="good">task</span>(<br />
          id BIGINT PRIMARY KEY,<br />
          public_id BINARY(16) UNIQUE,<br />
          task_no VARCHAR(64) UNIQUE,<br />
          project_id BIGINT FOREIGN KEY,<br />
          name VARCHAR(128)<br />)
        </div>
        <table class="db-table compact" style="margin-top: 15px">
          <tbody>
            <tr>
              <td><code>id</code></td>
              <td>只在数据库内部关联</td>
            </tr>
            <tr>
              <td><code>public_id</code></td>
              <td>用于 URL、API 和消息</td>
            </tr>
            <tr>
              <td><code>task_no</code></td>
              <td>用于页面展示与人工搜索</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="db-card blue">
        <div class="db-label">本地运行表 + 外部映射</div>
        <div class="db-code" style="margin-top: 12px">
          <span class="good">task_run</span>(<br />
          id BIGINT PRIMARY KEY,<br />
          task_id BIGINT FOREIGN KEY,<br />
          executor_type VARCHAR(32),<br />
          external_job_id VARCHAR(128),<br />
          UNIQUE(executor_type, external_job_id)<br />)
        </div>
        <table class="db-table compact" style="margin-top: 15px">
          <tbody>
            <tr>
              <td><code>task_run.id</code></td>
              <td>本地运行记录主键</td>
            </tr>
            <tr>
              <td><code>task_id</code></td>
              <td>指向本地 task.id</td>
            </tr>
            <tr>
              <td><code>external_job_id</code></td>
              <td>外部执行系统返回的编号</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div data-node="id-flow-example" class="db-flow" style="margin-top: 24px">
      <div class="db-flow-node">
        <b>页面 URL</b><span>/tasks/{public_id}</span>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node">
        <b>查询 task</b><span>public_id UNIQUE → id</span>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node">
        <b>查询运行</b><span>task_run.task_id = task.id</span>
      </div>
      <div class="db-flow-arrow">←</div>
      <div class="db-flow-node">
        <b>外部回调</b><span>executor_type + external_job_id</span>
      </div>
    </div>

    <div class="db-band">
      <strong>关键原则：</strong>外部系统 ID 带命名空间保存，避免两个系统都返回
      “12345” 时发生冲突；外部 ID 不承担本地表的主键职责。
    </div>
    <div class="db-footer">
      <span>本地 ID 管本地关系，外部 ID 管跨系统映射</span><span>09C</span>
    </div>
  </Slide>
</template>

<notes lang="md">
用具体表结构解释四种 ID 如何同时存在。页面使用 public_id 找到本地 task.id；本地子表全部使用 task.id 关联；外部回调通过执行器类型和 external_job_id 找到本地运行记录。
</notes>
