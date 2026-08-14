<script setup lang="ts">
import DatabaseCaseStory from "./DatabaseCaseStory.vue";
</script>

<template>
  <Slide class="db-slide">
    <div class="db-kicker">案例演进 11 · 核对执行字段</div>
    <h2 data-node="title">运行、状态历史与结果文件字段分别来自 S5、S6、S7</h2>
    <div data-node="case-evolution" class="db-case-evolution">
      <DatabaseCaseStory />
      <div class="db-case-work">
        <h3>执行过程字段来源核对</h3>
        <table class="db-table compact">
          <thead>
            <tr>
              <th>表.字段</th>
              <th>含义</th>
              <th>来源</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>task_run.attempt_no</td>
              <td>同一任务的第几次运行</td>
              <td>S5</td>
            </tr>
            <tr>
              <td>task_run.status</td>
              <td>本次运行当前状态</td>
              <td>S5</td>
            </tr>
            <tr>
              <td>task_run.external_job_id</td>
              <td>外部执行系统的任务编号</td>
              <td>S5</td>
            </tr>
            <tr>
              <td>task_run.started_at</td>
              <td>本次运行开始时间</td>
              <td>S5</td>
            </tr>
            <tr>
              <td>task_run.finished_at</td>
              <td>本次运行结束时间</td>
              <td>S5</td>
            </tr>
            <tr>
              <td>task_run.error_code</td>
              <td>结构化错误分类</td>
              <td>S5“错误信息”拆分</td>
            </tr>
            <tr>
              <td>task_run.error_message</td>
              <td>可读错误详情</td>
              <td>S5</td>
            </tr>
            <tr>
              <td>run_event.from_status</td>
              <td>变化前状态</td>
              <td>S6</td>
            </tr>
            <tr>
              <td>run_event.to_status</td>
              <td>变化后状态</td>
              <td>S6</td>
            </tr>
            <tr>
              <td>run_event.occurred_at</td>
              <td>变化时间</td>
              <td>S6</td>
            </tr>
            <tr>
              <td>run_event.reason</td>
              <td>变化原因</td>
              <td>S6</td>
            </tr>
            <tr>
              <td>artifact.type/object_key/size/created_at</td>
              <td>结果文件元数据</td>
              <td>S7</td>
            </tr>
          </tbody>
        </table>
        <div class="db-grid-2" style="margin-top: 13px">
          <div class="db-note">
            <strong>error_code 的处理：</strong
            >故事只说错误信息；若系统已有错误分类体系，可拆为 code +
            message。没有分类体系时只保留 message。
          </div>
          <div class="db-note">
            <strong>NULL 规则：</strong>运行尚未开始时 started_at
            为空；尚未结束时 finished_at 为空；成功时错误字段为空。
          </div>
        </div>
      </div>
    </div>
    <div class="db-footer">
      <span>字段拆分需要业务词典支持，不能仅凭数据库习惯</span><span>19D</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这页说明严格对应也允许一项需求拆成多个字段，但必须有业务依据。错误信息能否拆成 error_code 和 error_message 取决于平台是否存在错误分类体系，因此把它明确标成条件选择。
</notes>
