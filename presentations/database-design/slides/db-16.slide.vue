<script setup lang="ts">
import DatabaseCaseStory from "./DatabaseCaseStory.vue";
</script>

<template>
  <Slide class="db-slide">
    <div class="db-kicker">ER 建模第 4 步 · 确定关系与基数</div>
    <h2 data-node="title">S1 推导出工作空间、项目和项目成员三张表</h2>
    <div data-node="case-evolution" class="db-case-evolution">
      <DatabaseCaseStory />
      <div class="db-case-work">
        <h3>
          <span class="db-source-ref">S1</span>
          关系（Relationship）与基数（Cardinality）
        </h3>
        <div class="db-flow" style="margin-top: 18px">
          <div class="db-flow-node">
            <b>workspace</b><span>一个工作空间</span>
          </div>
          <div class="db-flow-arrow">1:N</div>
          <div class="db-flow-node"><b>project</b><span>多个项目</span></div>
          <div class="db-flow-arrow">1:N</div>
          <div class="db-flow-node">
            <b>project_member</b><span>多个成员关系</span>
          </div>
        </div>
        <div class="db-grid-3" style="margin-top: 20px">
          <div class="db-entity">
            <h3>workspace</h3>
            <div class="db-field"><span>id</span><em>已有主数据 ID</em></div>
          </div>
          <div class="db-entity">
            <h3>project</h3>
            <div class="db-field"><span>id</span><em>已有主数据 ID</em></div>
            <div class="db-field"><span>workspace_id</span><em>外键</em></div>
          </div>
          <div class="db-entity teal">
            <h3>project_member</h3>
            <div class="db-field"><span>project_id</span><em>外键</em></div>
            <div class="db-field"><span>user_id</span><em>用户</em></div>
            <div class="db-field"><span>role_code</span><em>角色</em></div>
          </div>
        </div>
        <div class="db-grid-2" style="margin-top: 17px">
          <div class="db-note">
            <strong>为什么有 project_member：</strong
            >一个用户可加入多个项目，一个项目也有多个用户。
          </div>
          <div class="db-note">
            <strong>role_code 来源：</strong>S1 区分普通项目成员和项目管理员。
          </div>
        </div>
        <div class="db-band teal" style="margin-top: 14px">
          <strong>关系约束：</strong>project.workspace_id →
          workspace.id；project_member.project_id →
          project.id。本故事只设计关联所需字段，工作空间与项目的其他主数据由其自身需求定义。
        </div>
      </div>
    </div>
    <div class="db-footer">
      <span>用户表可来自已有账号系统，本案例只保存 user_id</span><span>16</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这一步只处理 S1。项目通过 workspace_id 归属工作空间；用户和项目是多对多关系，因此使用 project_member。角色来自“成员可提交、管理员可查看全部任务”的明确规则。
</notes>
