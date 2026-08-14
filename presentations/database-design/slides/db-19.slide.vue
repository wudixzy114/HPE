<template>
  <Slide class="db-slide">
    <div class="db-kicker">建模步骤 5 · 当前值与历史值</div>
    <h2 data-node="title">
      当前状态用于在线查询，事件历史用于解释“怎么变成现在这样”
    </h2>
    <div
      data-node="current-history-layout"
      class="db-grid-2"
      style="margin-top: 24px"
    >
      <div class="db-card teal">
        <div class="db-label">当前快照 · task / task_run</div>
        <div class="db-entity teal" style="margin-top: 13px">
          <h3>task_run</h3>
          <div class="db-field"><span>status</span><em>FAILED</em></div>
          <div class="db-field">
            <span>error_code</span><em>RESOURCE_LIMIT</em>
          </div>
          <div class="db-field"><span>started_at</span><em>10:02</em></div>
          <div class="db-field"><span>finished_at</span><em>10:18</em></div>
          <div class="db-field"><span>version</span><em>7</em></div>
        </div>
        <p style="margin-top: 12px">
          优点：列表和详情直接读取当前结果；状态条件更新也有明确落点。
        </p>
      </div>
      <div class="db-card blue">
        <div class="db-label">追加历史 · task_run_event</div>
        <table class="db-table compact" style="margin-top: 13px">
          <thead>
            <tr>
              <th>时间</th>
              <th>from → to</th>
              <th>来源</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>10:00</td>
              <td>PENDING → QUEUED</td>
              <td>submit</td>
            </tr>
            <tr>
              <td>10:02</td>
              <td>QUEUED → RUNNING</td>
              <td>callback-18</td>
            </tr>
            <tr>
              <td>10:18</td>
              <td>RUNNING → FAILED</td>
              <td>callback-29</td>
            </tr>
          </tbody>
        </table>
        <p style="margin-top: 12px">
          用于去重、审计、排障、状态停留时长、失败路径和乱序事件分析。
        </p>
      </div>
    </div>
    <div data-node="history-rules" class="db-grid-3" style="margin-top: 19px">
      <div class="db-note">
        <strong>事件不可随意修改：</strong
        >修正错误应追加纠正事件，而不是抹掉证据。
      </div>
      <div class="db-note">
        <strong>定义权威来源：</strong
        >若当前状态与历史不一致，是重放事件修复快照，还是以快照为准？
      </div>
      <div class="db-note">
        <strong>不是所有字段都留历史：</strong
        >只为审计、排障、恢复或分析需要的变化保存。
      </div>
    </div>
    <div class="db-band">
      <strong>常见组合：</strong>主表保存
      current_status；事件表追加每次变化。既保证在线性能，也保留解释能力。
    </div>
    <div class="db-footer">
      <span>只存当前值，系统就失去了过程证据</span><span>19</span>
    </div>
  </Slide>
</template>

<notes lang="md">
解释为什么不是只选一种。纯事件计算当前状态可能让在线查询成本高；只存当前状态又无法排障和审计。因此当前快照与事件历史组合最常见。还要定义二者不一致时的修复策略。
</notes>
