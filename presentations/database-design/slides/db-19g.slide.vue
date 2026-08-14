<script setup lang="ts">
import DatabaseCaseStory from "./DatabaseCaseStory.vue";
</script>

<template>
  <Slide class="db-slide">
    <div class="db-kicker">案例演进 14 · 从查询反推索引</div>
    <h2 data-node="title">S8 的筛选和排序决定 task 表的候选索引</h2>
    <div data-node="case-evolution" class="db-case-evolution">
      <DatabaseCaseStory />
      <div class="db-case-work">
        <h3>
          <span class="db-source-ref">S8</span>
          列表按条件筛选，并按创建时间倒序分页
        </h3>
        <div class="db-code" style="margin-top: 14px">
          SELECT id, public_id, name, current_status,<br />
          created_at<br />FROM task<br />WHERE workspace_id = :workspace_id<br />
          AND project_id = :project_id<br />
          AND current_status = :status<br />
          AND created_at &lt; :last_created_at<br />ORDER BY created_at DESC, id
          DESC<br />LIMIT 50;
        </div>
        <table class="db-table compact" style="margin-top: 15px">
          <thead>
            <tr>
              <th>故事中的查询要求</th>
              <th>字段</th>
              <th>设计影响</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>按项目筛选</td>
              <td>workspace_id、project_id</td>
              <td>索引前部的等值条件</td>
            </tr>
            <tr>
              <td>按当前状态筛选</td>
              <td>current_status</td>
              <td>进入组合索引候选</td>
            </tr>
            <tr>
              <td>按创建时间倒序</td>
              <td>created_at、id</td>
              <td>支持排序和稳定游标</td>
            </tr>
            <tr>
              <td>按模板、提交人筛选</td>
              <td>template_version_id、submitter_id</td>
              <td>根据频率另建索引或调整查询</td>
            </tr>
          </tbody>
        </table>
        <div class="db-code" style="margin-top: 15px">
          <span class="good">候选索引</span><br />INDEX(workspace_id,
          project_id,<br />
          current_status, created_at DESC, id DESC)
        </div>
        <div class="db-note" style="margin-top: 10px">
          <strong>候选索引需要验证：</strong
          >研发根据真实查询频率、数据分布和执行计划确定最终方案。
        </div>
      </div>
    </div>
    <div class="db-footer">
      <span>索引字段来自 S8 的查询方式</span><span>19G</span>
    </div>
  </Slide>
</template>

<notes lang="md">
索引同样要回到故事。S8 明确了项目、状态、创建时间和分页，因此这些字段进入候选组合索引。模板和提交人的索引是否单独建立，需要真实查询频率与数据分布。
</notes>
