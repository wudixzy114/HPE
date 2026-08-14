<script setup lang="ts">
import DatabaseCaseStory from "./DatabaseCaseStory.vue";
</script>

<template>
  <Slide class="db-slide">
    <div class="db-kicker">案例演进 15 · 来源审计 1/2</div>
    <h2 data-node="title">先核对归属、成员与模板相关表</h2>
    <div data-node="case-evolution" class="db-case-evolution">
      <DatabaseCaseStory />
      <div class="db-case-work">
        <h3>主数据与模板来源矩阵</h3>
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
              <td>workspace</td>
              <td>已有工作空间主数据</td>
              <td>本案例只引用 id</td>
              <td>包含项目：S1</td>
            </tr>
            <tr>
              <td>project</td>
              <td>已有项目主数据</td>
              <td>workspace_id：S1</td>
              <td>成员、任务：S1/S3</td>
            </tr>
            <tr>
              <td>project_member</td>
              <td>用户在项目中的角色</td>
              <td>user_id、role_code：S1</td>
              <td>属于项目：S1</td>
            </tr>
            <tr>
              <td>task_template</td>
              <td>模板稳定身份</td>
              <td>workspace_id、code、name、state：S2</td>
              <td>拥有版本：S2</td>
            </tr>
            <tr>
              <td>template_version</td>
              <td>一次模板发布</td>
              <td>version_no、form_schema、config_schema、published_at：S2</td>
              <td>属于模板：S2</td>
            </tr>
          </tbody>
        </table>
        <div class="db-rule-list" style="margin-top: 18px">
          <div class="db-rule">
            <span class="db-source-ref">S1</span
            ><span><b>归属：</b>工作空间、项目和成员关系来自第一句。</span>
          </div>
          <div class="db-rule">
            <span class="db-source-ref">S2</span
            ><span
              ><b>版本：</b
              >模板编码、名称、版本、结构、规则与发布时间全部来自第二句。</span
            >
          </div>
        </div>
        <div class="db-grid-2" style="margin-top: 18px">
          <div class="db-note">
            <strong>没有扩写 workspace/project：</strong
            >故事没有描述它们的名称、描述、创建人等主数据字段。
          </div>
          <div class="db-note">
            <strong>技术字段：</strong>每张实体表的
            id，以及连接父表的外键，用于把身份和关系落库。
          </div>
        </div>
        <div class="db-band teal" style="margin-top: 16px">
          <strong>审计结论：</strong>前五张表的职责、业务字段和关系均可回溯到 S1
          或 S2。
        </div>
      </div>
    </div>
    <div class="db-footer">
      <span>来源审计分两页完成，避免一页堆满十张表</span><span>19H</span>
    </div>
  </Slide>
</template>

<notes lang="md">
来源审计第一页只看归属和模板。workspace 与 project 被视为已有主数据，本案例仅设计关联字段，避免凭经验扩写它们自身的字段。
</notes>
