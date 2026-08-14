<script setup lang="ts">
import DatabaseCaseStory from "./DatabaseCaseStory.vue";
</script>

<template>
  <Slide class="db-slide">
    <div class="db-kicker">ER 建模第 2 步 · 识别动作与状态</div>
    <h2 data-node="title">
      动作不自动变成表；重复发生且需要追溯的事实，才追加为独立记录
    </h2>
    <div data-node="actions-state" class="db-case-evolution">
      <DatabaseCaseStory />
      <div class="db-case-work">
        <h3>动作决定“新增、更新还是追加历史”</h3>
        <div class="db-rule-list" style="margin-top: 16px">
          <div class="db-rule">
            <span class="db-source-ref">S2</span
            ><span
              ><b>提交任务</b><br />同一事务创建 task、首批 task_input 和第 1 条
              task_run。</span
            >
          </div>
          <div class="db-rule">
            <span class="db-source-ref">S3</span
            ><span
              ><b>重试</b><br />新增 task_run(attempt_no +
              1)，绝不覆盖失败运行。</span
            >
          </div>
          <div class="db-rule">
            <span class="db-source-ref">S3</span
            ><span
              ><b>运行状态变化</b><br />更新本次
              task_run.status；需要完整事件审计时再增加 task_run_event。</span
            >
          </div>
          <div class="db-rule">
            <span class="db-source-ref">S4</span
            ><span
              ><b>任务当前状态</b><br />task.current_status
              是列表读取用的当前快照，与运行状态在同一事务同步。</span
            >
          </div>
        </div>
        <div class="db-band teal" style="margin-top: 16px">
          <strong>专业判断：</strong
          >“提交、重试”是命令；“一次运行”是可重复且需保留的业务事实，所以建成
          task_run。
        </div>
      </div>
    </div>
    <div class="db-footer">
      <span>把当前状态与历次运行分开，既能查快，也不会丢失重试历史</span
      ><span>15</span>
    </div>
  </Slide>
</template>

<notes lang="md">
动作是写入规则，不是天然实体；需要保留每次发生的事实时才追加子记录。
</notes>
