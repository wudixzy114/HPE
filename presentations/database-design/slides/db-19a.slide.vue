<script setup lang="ts">
import DatabaseCaseStory from "./DatabaseCaseStory.vue";
</script>

<template>
  <Slide class="db-slide">
    <div class="db-kicker">案例演进 8 · 建立状态历史</div>
    <h2 data-node="title">S6 推导出 task_run_event：一条状态变化保存一行</h2>
    <div data-node="case-evolution" class="db-case-evolution">
      <DatabaseCaseStory />
      <div class="db-case-work">
        <h3>
          <span class="db-source-ref">S6</span> 详情页要解释一次运行如何变化
        </h3>
        <div class="db-entity teal" style="margin-top: 16px">
          <h3>task_run_event</h3>
          <div class="db-field"><span>id</span><em>主键</em></div>
          <div class="db-field"><span>run_id</span><em>属于哪次运行</em></div>
          <div class="db-field"><span>from_status</span><em>S6 原状态</em></div>
          <div class="db-field"><span>to_status</span><em>S6 新状态</em></div>
          <div class="db-field">
            <span>occurred_at</span><em>S6 变化时间</em>
          </div>
          <div class="db-field"><span>reason</span><em>S6 原因</em></div>
        </div>
        <table class="db-table compact" style="margin-top: 18px">
          <thead>
            <tr>
              <th>run_id</th>
              <th>occurred_at</th>
              <th>from_status</th>
              <th>to_status</th>
              <th>reason</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>9001</td>
              <td>10:00</td>
              <td>PENDING</td>
              <td>QUEUED</td>
              <td>提交成功</td>
            </tr>
            <tr>
              <td>9001</td>
              <td>10:03</td>
              <td>QUEUED</td>
              <td>RUNNING</td>
              <td>开始执行</td>
            </tr>
            <tr>
              <td>9001</td>
              <td>10:18</td>
              <td>RUNNING</td>
              <td>FAILED</td>
              <td>输入读取失败</td>
            </tr>
          </tbody>
        </table>
        <div class="db-grid-2" style="margin-top: 16px">
          <div class="db-note">
            <strong>task_run.status</strong
            ><br />保存当前状态，列表与详情直接读取。
          </div>
          <div class="db-note">
            <strong>task_run_event</strong
            ><br />保存变化过程，回答何时、从哪变到哪、为什么。
          </div>
        </div>
        <div class="db-band teal" style="margin-top: 14px">
          <strong>关系：</strong>task_run 1 → N task_run_event；event.run_id
          是外键。
        </div>
      </div>
    </div>
    <div class="db-footer">
      <span>S6 明确要求状态时间线，因此事件表有直接需求来源</span
      ><span>19A</span>
    </div>
  </Slide>
</template>

<notes lang="md">
区分当前状态与状态历史。当前状态是一列，状态变化是多行事件。S6 明确要求详情展示每次变化时间、前后状态和原因，因此 run_event 的四个业务字段都有直接来源。
</notes>
