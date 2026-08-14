<script setup lang="ts">
import DatabaseCaseStory from "./DatabaseCaseStory.vue";
</script>

<template>
  <Slide class="db-slide">
    <div class="db-kicker">ER 建模第 5 步 · 写出键与完整性约束</div>
    <h2 data-node="title">主键定位行，外键连接行，唯一约束表达“不允许重复”</h2>
    <div data-node="integrity" class="db-case-evolution">
      <DatabaseCaseStory />
      <div class="db-case-work">
        <h3>把业务规则分配给正确的保护层</h3>
        <table class="db-table compact" style="margin-top: 15px">
          <thead>
            <tr>
              <th>规则</th>
              <th>实现</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>每张表都有稳定身份</td>
              <td>PRIMARY KEY(id)</td>
            </tr>
            <tr>
              <td>子记录必须属于父记录</td>
              <td>NOT NULL + FOREIGN KEY(task_id / template_id)</td>
            </tr>
            <tr>
              <td>同项目的请求键不可重复</td>
              <td>UNIQUE(project_id, request_key)</td>
            </tr>
            <tr>
              <td>输入序号 / 尝试序号不可重复</td>
              <td>UNIQUE(task_id, input_no / attempt_no)</td>
            </tr>
            <tr>
              <td>运行状态只能取合法值</td>
              <td>CHECK 或受控字典</td>
            </tr>
          </tbody>
        </table>
        <div class="db-rule-list" style="margin-top: 15px">
          <div class="db-rule">
            <span class="db-source-ref">事务</span
            ><span
              ><b>已发布模板、至少一个输入、首次运行</b
              ><br />提交时一起校验并写入，不能只靠普通外键。</span
            >
          </div>
          <div class="db-rule">
            <span class="db-source-ref">同步</span
            ><span
              ><b>current_status 与最新运行一致</b
              ><br />状态切换时在同一事务更新历史记录和当前快照。</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="db-footer">
      <span>专业模型会明确：哪些规则由数据库兜底，哪些必须由事务保证</span
      ><span>18</span>
    </div>
  </Slide>
</template>

<notes lang="md">
不同规则由不同层保障：单行和引用规则交给数据库，跨行不变量交给事务与应用协作。
</notes>
