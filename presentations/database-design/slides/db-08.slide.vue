<template>
  <Slide class="db-slide status-slide">
    <div class="db-kicker">状态字段 · 从需求到表结构</div>
    <h2 data-node="title">
      状态怎样落库：VARCHAR 存当前值，规则限制取值和变化
    </h2>
    <div
      data-node="status-design"
      class="db-grid-2"
      style="margin-top: 13px; grid-template-columns: 0.95fr 1.25fr"
    >
      <div class="db-card teal">
        <div class="db-label">① 表中实际只有一个当前状态字段</div>
        <div class="db-code" style="margin-top: 12px">
          CREATE TABLE task_run (<br />
          id BIGINT PRIMARY KEY,<br />
          task_id BIGINT NOT NULL,<br />
          <span class="good">status VARCHAR(20) NOT NULL</span>,<br />
          CONSTRAINT chk_run_status<br />
          CHECK (status IN (<br />
          'PENDING', 'QUEUED', 'RUNNING',<br />
          'SUCCEEDED', 'FAILED',<br />
          'CANCELLED'<br />
          ))<br />);
        </div>
        <p style="margin-top: 13px">
          <code>status</code> 的物理类型就是普通
          <code>VARCHAR(20)</code>。区别来自 CHECK
          限制：它只能保存规定的六个代码。
        </p>
      </div>
      <div>
        <div class="db-card blue">
          <div class="db-label">② PRD 先画出允许的变化</div>
          <div class="db-flow" style="margin-top: 15px">
            <div class="db-flow-node"><b>PENDING</b><span>待提交</span></div>
            <div class="db-flow-arrow">→</div>
            <div class="db-flow-node"><b>QUEUED</b><span>排队中</span></div>
            <div class="db-flow-arrow">→</div>
            <div class="db-flow-node"><b>RUNNING</b><span>运行中</span></div>
            <div class="db-flow-arrow">→</div>
            <div class="db-flow-node"><b>SUCCEEDED</b><span>成功</span></div>
          </div>
          <div class="db-grid-2" style="margin-top: 13px">
            <div class="db-note">
              <strong>其他允许：</strong>QUEUED → CANCELLED；RUNNING → FAILED。
            </div>
            <div class="db-note">
              <strong>禁止：</strong>SUCCEEDED → RUNNING；终态不再倒退。
            </div>
          </div>
        </div>
        <div class="db-card orange" style="margin-top: 15px">
          <div class="db-label">③ 更新时同时检查旧状态</div>
          <div class="db-code" style="margin-top: 10px">
            UPDATE task_run<br />SET status = 'RUNNING'<br />WHERE id =
            :run_id<br />
            AND status = 'QUEUED';
          </div>
          <p style="margin-top: 10px">
            只有当前仍在排队的运行才能进入运行中。更新到 0
            行说明状态已经变化，需要重新读取。
          </p>
        </div>
      </div>
    </div>
    <div class="db-band">
      <strong>完整设计：</strong>VARCHAR 保存当前代码；CHECK
      限制合法值；更新条件限制合法变化。需要展示时间线时，再增加 task_run_event
      保存前后状态、时间和原因。
    </div>
    <div class="db-footer">
      <span>页面中文文案与数据库代码分离：RUNNING 可展示为“运行中”</span
      ><span>08</span>
    </div>
  </Slide>
</template>

<notes lang="md">
先直接回答状态怎样落库：task_run 中只有一列 status VARCHAR(20)。它与普通字符串使用相同物理类型，但 CHECK 把取值限制为有限代码，更新 SQL 再限制状态变化。需要时间线时增加事件表；只需当前状态时不必增加。
</notes>
