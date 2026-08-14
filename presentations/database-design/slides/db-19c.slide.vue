<script setup lang="ts">
import DatabaseCaseStory from "./DatabaseCaseStory.vue";
</script>

<template>
  <Slide class="db-slide">
    <div class="db-kicker">案例演进 10 · 核对字段来源</div>
    <h2 data-node="title">
      task 与 task_input 的每个业务字段都能回到 S3 或 S4
    </h2>
    <div data-node="case-evolution" class="db-case-evolution">
      <DatabaseCaseStory />
      <div class="db-case-work">
        <h3>字段来源核对表</h3>
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
              <td>task.public_id</td>
              <td>页面与接口使用的公开任务 ID</td>
              <td>S3</td>
            </tr>
            <tr>
              <td>task.workspace_id</td>
              <td>任务所属工作空间</td>
              <td>S3</td>
            </tr>
            <tr>
              <td>task.project_id</td>
              <td>任务所属项目</td>
              <td>S3</td>
            </tr>
            <tr>
              <td>task.template_version_id</td>
              <td>提交时模板版本</td>
              <td>S2、S3</td>
            </tr>
            <tr>
              <td>task.name</td>
              <td>用户填写的任务名称</td>
              <td>S3</td>
            </tr>
            <tr>
              <td>task.priority</td>
              <td>用户填写的优先级</td>
              <td>S3</td>
            </tr>
            <tr>
              <td>task.config</td>
              <td>资源规格和模板参数快照</td>
              <td>S3</td>
            </tr>
            <tr>
              <td>task.submitter_id</td>
              <td>提交人</td>
              <td>S3</td>
            </tr>
            <tr>
              <td>task.created_at</td>
              <td>提交时间 / 列表筛选时间</td>
              <td>S3、S8</td>
            </tr>
            <tr>
              <td>task.current_status</td>
              <td>任务列表展示和筛选的当前状态</td>
              <td>S8</td>
            </tr>
            <tr>
              <td>task.idempotency_key</td>
              <td>一次提交的请求键</td>
              <td>S4</td>
            </tr>
            <tr>
              <td>task_input.input_no</td>
              <td>输入顺序</td>
              <td>S3</td>
            </tr>
            <tr>
              <td>task_input.source_id</td>
              <td>所选数据源</td>
              <td>S3</td>
            </tr>
            <tr>
              <td>task_input.input_role</td>
              <td>输入用途</td>
              <td>S3</td>
            </tr>
          </tbody>
        </table>
        <div class="db-grid-2" style="margin-top: 10px">
          <div class="db-note">
            <strong>current_status：</strong>S8 要求列表按任务当前状态筛选，因此
            task 保存当前汇总状态；最新运行状态变化时同步更新。
          </div>
          <div class="db-note">
            <strong>未加入：</strong
            >描述、标签、队列名、删除标记。当前故事没有要求这些字段。
          </div>
        </div>
      </div>
    </div>
    <div class="db-footer">
      <span>主键和外键属于实现必需字段；业务字段必须有需求来源</span
      ><span>19C</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这是第一张严格字段来源表。内部主键和关系外键是数据库实现所需；其余业务字段逐项引用 S2、S3、S4、S8。明确列出当前没有加入的字段，避免模型随意膨胀。
</notes>
