<script setup lang="ts">
import DatabaseCaseStory from "./DatabaseCaseStory.vue";
</script>

<template>
  <Slide class="db-slide">
    <div class="db-kicker">案例演进 7 · 建立运行</div>
    <h2 data-node="title">S5 推导出 task_run：每次执行尝试新增一行</h2>
    <div data-node="case-evolution" class="db-case-evolution">
      <DatabaseCaseStory />
      <div class="db-case-work">
        <h3>
          <span class="db-source-ref">S5</span>
          同一任务可运行多次，每次结果独立保存
        </h3>
        <div class="db-entity orange" style="margin-top: 16px">
          <h3>task_run</h3>
          <div class="db-field"><span>id</span><em>主键</em></div>
          <div class="db-field"><span>task_id</span><em>属于哪个任务</em></div>
          <div class="db-field">
            <span>attempt_no</span><em>S5 尝试序号</em>
          </div>
          <div class="db-field"><span>status</span><em>S5 当前状态</em></div>
          <div class="db-field">
            <span>external_job_id</span><em>S5 外部编号</em>
          </div>
          <div class="db-field">
            <span>started_at</span><em>S5 开始时间</em>
          </div>
          <div class="db-field">
            <span>finished_at</span><em>S5 结束时间</em>
          </div>
          <div class="db-field">
            <span>error_code / error_message</span><em>S5 错误信息</em>
          </div>
        </div>
        <div class="db-flow" style="margin-top: 17px">
          <div class="db-flow-node">
            <b>任务 T-1024</b><span>task 一行</span>
          </div>
          <div class="db-flow-arrow">→</div>
          <div class="db-flow-node" style="border-color: #dfa8a8">
            <b>运行 1：失败</b><span>attempt_no=1</span>
          </div>
          <div class="db-flow-arrow">→</div>
          <div class="db-flow-node" style="border-color: #79bdb4">
            <b>运行 2：成功</b><span>attempt_no=2</span>
          </div>
        </div>
        <div class="db-grid-2" style="margin-top: 14px">
          <div class="db-note">
            <strong>关系：</strong>task 1 → N task_run；task_run 保存 task_id。
          </div>
          <div class="db-note">
            <strong>字段边界：</strong>S5 没有要求队列名称，因此此版不添加
            queue_name。
          </div>
        </div>
      </div>
    </div>
    <div class="db-footer">
      <span>字段只取自故事；新需求出现后再扩展</span><span>19</span>
    </div>
  </Slide>
</template>

<notes lang="md">
运行字段全部来自 S5。这里明确展示“没有需求就不加字段”：故事没有提到队列名称，所以模型中暂不出现 queue_name。相同配置重试新增 task_run，不覆盖上一次失败记录。
</notes>
