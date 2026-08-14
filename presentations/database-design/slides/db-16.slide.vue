<script setup lang="ts">
import DatabaseCaseStory from "./DatabaseCaseStory.vue";
</script>

<template>
  <Slide class="db-slide">
    <div class="db-kicker">ER 建模第 3 步 · 确定关系、基数和可选性</div>
    <h2 data-node="title">
      每条关系都要回答：两端各有几个、是否可缺省、外键放在哪里
    </h2>
    <div data-node="relationships" class="db-case-evolution">
      <DatabaseCaseStory />
      <div class="db-case-work">
        <h3>关系矩阵</h3>
        <table class="db-table compact" style="margin-top: 16px">
          <thead>
            <tr>
              <th>关系</th>
              <th>基数与可选性</th>
              <th>外键</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>template → task</td>
              <td>模板 0..N；每个任务恰好 1 个模板</td>
              <td>task.template_id NOT NULL</td>
            </tr>
            <tr>
              <td>task → input</td>
              <td>任务业务上 1..N；每个输入恰好属于 1 个任务</td>
              <td>task_input.task_id NOT NULL</td>
            </tr>
            <tr>
              <td>task → run</td>
              <td>任务业务上 1..N；每次运行恰好属于 1 个任务</td>
              <td>task_run.task_id NOT NULL</td>
            </tr>
            <tr>
              <td>用户 / 项目 / 数据源</td>
              <td>模型边界外，不在此图展开</td>
              <td>保存外部 ID</td>
            </tr>
          </tbody>
        </table>
        <div class="db-grid-2" style="margin-top: 16px">
          <div class="db-note">
            <strong>乌鸦脚：</strong>表达结构上的一对多；子表外键表达“属于谁”。
          </div>
          <div class="db-note">
            <strong>最小数量：</strong>“至少一个输入 /
            运行”跨多行，需由事务和应用规则保证。
          </div>
        </div>
      </div>
    </div>
    <div class="db-footer">
      <span>基数说明业务语义；NOT NULL + FK 实现“子记录必须有父记录”</span
      ><span>16</span>
    </div>
  </Slide>
</template>

<notes lang="md">
关系不只是一根线；必须明确基数、可选性、外键和最小数量如何执行。
</notes>
