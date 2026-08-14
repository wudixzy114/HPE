<script setup lang="ts">
import DatabaseCaseStory from "./DatabaseCaseStory.vue";
</script>

<template>
  <Slide class="db-slide">
    <div class="db-kicker">案例演进 12 · 建立主外键关系</div>
    <h2 data-node="title">数量词决定关系，外键放在“多”的一侧</h2>
    <div data-node="case-evolution" class="db-case-evolution">
      <DatabaseCaseStory />
      <div class="db-case-work">
        <h3>关系与故事依据</h3>
        <table class="db-table compact">
          <thead>
            <tr>
              <th>父表 1</th>
              <th>关系</th>
              <th>子表 N</th>
              <th>外键</th>
              <th>来源</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>workspace</td>
              <td>包含</td>
              <td>project</td>
              <td>project.workspace_id</td>
              <td>S1</td>
            </tr>
            <tr>
              <td>project</td>
              <td>拥有</td>
              <td>project_member</td>
              <td>member.project_id</td>
              <td>S1</td>
            </tr>
            <tr>
              <td>task_template</td>
              <td>发布</td>
              <td>template_version</td>
              <td>version.template_id</td>
              <td>S2</td>
            </tr>
            <tr>
              <td>template_version</td>
              <td>被引用</td>
              <td>task</td>
              <td>task.template_version_id</td>
              <td>S2、S3</td>
            </tr>
            <tr>
              <td>project</td>
              <td>包含</td>
              <td>task</td>
              <td>task.project_id</td>
              <td>S3</td>
            </tr>
            <tr>
              <td>task</td>
              <td>包含</td>
              <td>task_input</td>
              <td>input.task_id</td>
              <td>S3</td>
            </tr>
            <tr>
              <td>task</td>
              <td>执行为</td>
              <td>task_run</td>
              <td>run.task_id</td>
              <td>S5</td>
            </tr>
            <tr>
              <td>task_run</td>
              <td>产生</td>
              <td>run_event</td>
              <td>event.run_id</td>
              <td>S6</td>
            </tr>
            <tr>
              <td>task_run</td>
              <td>产生</td>
              <td>artifact</td>
              <td>artifact.run_id</td>
              <td>S7</td>
            </tr>
          </tbody>
        </table>
        <div class="db-flow" style="margin-top: 15px">
          <div class="db-flow-node"><b>task</b><span>父表 1</span></div>
          <div class="db-flow-arrow">1:N</div>
          <div class="db-flow-node">
            <b>task_run</b><span>子表 N，保存 task_id</span>
          </div>
        </div>
        <div class="db-band teal" style="margin-top: 14px">
          <strong>外键作用：</strong
          >阻止不存在任务的运行、找不到模板版本的任务等孤儿数据。
        </div>
      </div>
    </div>
    <div class="db-footer">
      <span>“一个或多个”“多次”“多个文件”直接产生一对多关系</span
      ><span>19E</span>
    </div>
  </Slide>
</template>

<notes lang="md">
关系不凭习惯决定，而是从故事中的数量词推导。外键放在多的一侧：每条运行只属于一个任务，因此 task_run 保存 task_id。
</notes>
