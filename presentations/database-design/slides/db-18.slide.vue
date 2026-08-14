<template>
  <Slide class="db-slide">
    <div class="db-kicker">建模步骤 4 · 字段归属</div>
    <h2 data-node="title">字段放在哪张表，取决于“谁能唯一决定它”</h2>
    <table
      data-node="field-dependency-table"
      class="db-table dense"
      style="margin-top: 23px"
    >
      <thead>
        <tr>
          <th>字段</th>
          <th>给定什么才能唯一确定</th>
          <th>放置位置</th>
          <th>错误放置的后果</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>task.name / priority</strong></td>
          <td>给定任务 ID</td>
          <td><code>task</code></td>
          <td>放运行表会在每次重试中重复，修改时容易不一致</td>
        </tr>
        <tr>
          <td><strong>attempt_no / started_at</strong></td>
          <td>给定某次运行 ID</td>
          <td><code>task_run</code></td>
          <td>放任务表只能保存最后一次，之前记录被覆盖</td>
        </tr>
        <tr>
          <td><strong>member.role_code</strong></td>
          <td>给定项目 ID + 用户 ID</td>
          <td><code>project_member</code></td>
          <td>放用户表无法表达用户在不同项目角色不同</td>
        </tr>
        <tr>
          <td><strong>template.name</strong></td>
          <td>给定模板 ID</td>
          <td><code>template</code></td>
          <td>复制到所有任务后，模板改名会制造多个当前名称</td>
        </tr>
        <tr>
          <td><strong>template_name_snapshot</strong></td>
          <td>给定一次任务提交</td>
          <td><code>task</code> 快照</td>
          <td>若只查模板当前名称，历史页面会随模板改名而变化</td>
        </tr>
        <tr>
          <td><strong>event.payload</strong></td>
          <td>给定事件 ID</td>
          <td><code>task_run_event</code></td>
          <td>覆盖在运行表中会失去回调原文与审计证据</td>
        </tr>
      </tbody>
    </table>
    <div
      data-node="field-eight-questions"
      class="db-grid-4"
      style="margin-top: 18px"
    >
      <div class="db-note"><strong>依赖：</strong>哪个 ID 能唯一决定它？</div>
      <div class="db-note"><strong>数量：</strong>对父对象是一条还是多条？</div>
      <div class="db-note">
        <strong>历史：</strong>来源变化后旧值是否应保持？
      </div>
      <div class="db-note">
        <strong>生命周期：</strong>跟谁一起创建、更新、删除？
      </div>
      <div class="db-note"><strong>权限：</strong>是否需要不同授权或脱敏？</div>
      <div class="db-note"><strong>查询：</strong>是否独立高频过滤和统计？</div>
      <div class="db-note"><strong>稀疏：</strong>是否只有极少记录有值？</div>
      <div class="db-note"><strong>派生：</strong>能否低成本且无歧义计算？</div>
    </div>
    <div class="db-footer">
      <span>“查询方便”不能优先于事实归属，性能问题可再受控优化</span
      ><span>18</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这页用“函数依赖”的思想但不强迫听众记术语。只问：给定哪一个键才能唯一决定这个值。运行开始时间由运行决定；成员角色由用户和项目的组合决定。快照字段看似重复，但其业务含义已经变成“提交当时的值”。
</notes>
