<script setup lang="ts">
import DatabaseCaseStory from "./DatabaseCaseStory.vue";
</script>

<template>
  <Slide class="db-slide">
    <div class="db-kicker">案例演进 16 · 来源审计 2/2</div>
    <h2 data-node="title">再核对任务、输入、运行、事件与文件</h2>
    <div data-node="case-evolution" class="db-case-evolution">
      <DatabaseCaseStory />
      <div class="db-case-work">
        <h3>任务执行链路来源矩阵</h3>
        <table class="db-table dense">
          <thead>
            <tr>
              <th>表</th>
              <th>一句职责</th>
              <th>字段来源</th>
              <th>关系来源</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>task</td>
              <td>用户一次提交</td>
              <td>
                公开
                ID、归属、name、priority、config、submitter、created_at：S3；key：S4；current_status：S8
              </td>
              <td>版本、项目、输入、运行：S3/S5</td>
            </tr>
            <tr>
              <td>task_input</td>
              <td>任务的一条输入</td>
              <td>input_no、source_id、input_role：S3</td>
              <td>属于任务：S3</td>
            </tr>
            <tr>
              <td>task_run</td>
              <td>一次执行尝试</td>
              <td>
                attempt_no、status、external_job_id、started_at、finished_at、error：S5
              </td>
              <td>属于任务：S5</td>
            </tr>
            <tr>
              <td>task_run_event</td>
              <td>一次状态变化</td>
              <td>from_status、to_status、occurred_at、reason：S6</td>
              <td>属于运行：S6</td>
            </tr>
            <tr>
              <td>task_artifact</td>
              <td>一个结果文件</td>
              <td>artifact_type、object_key、size_bytes、created_at：S7</td>
              <td>属于运行：S7</td>
            </tr>
          </tbody>
        </table>
        <div class="db-grid-2" style="margin-top: 18px">
          <div class="db-note">
            <strong>未加入：</strong
            >标签、描述、队列名、逻辑删除。故事没有给出这些需求。
          </div>
          <div class="db-note">
            <strong>条件字段：</strong>只有存在错误分类体系时，才将 error 拆成
            error_code 和 error_message。
          </div>
        </div>
      </div>
    </div>
    <div class="db-footer">
      <span>任何新增字段都应补充来源或技术必要性</span><span>19H2</span>
    </div>
  </Slide>
</template>

<notes lang="md">
第二页审计任务执行链路。current_status 明确来自 S8 的列表筛选；它是任务级汇总状态。队列、标签、描述等没有来源，继续排除。
</notes>
