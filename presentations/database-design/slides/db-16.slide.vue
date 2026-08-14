<template>
  <Slide class="db-slide">
    <div class="db-kicker">建模第 4 步 · 填核心字段</div>
    <h2 data-node="title">先为每张表填写身份、归属和最主要的业务字段</h2>
    <div data-node="field-fill" class="db-grid-3" style="margin-top: 26px">
      <div class="db-entity">
        <h3>task_template</h3>
        <div class="db-field"><span>id</span><em>BIGINT · 主键</em></div>
        <div class="db-field"><span>workspace_id</span><em>归属</em></div>
        <div class="db-field"><span>code</span><em>租户内唯一</em></div>
        <div class="db-field"><span>name</span><em>VARCHAR</em></div>
        <div class="db-field"><span>state</span><em>启用状态</em></div>
      </div>
      <div class="db-entity teal">
        <h3>template_version</h3>
        <div class="db-field"><span>id</span><em>BIGINT · 主键</em></div>
        <div class="db-field"><span>template_id</span><em>外键</em></div>
        <div class="db-field"><span>version_no</span><em>版本号</em></div>
        <div class="db-field"><span>form_schema</span><em>JSON</em></div>
        <div class="db-field"><span>published_at</span><em>发布时间</em></div>
      </div>
      <div class="db-entity orange">
        <h3>task</h3>
        <div class="db-field">
          <span>id / public_id</span><em>内部 / 外部 ID</em>
        </div>
        <div class="db-field"><span>project_id</span><em>项目归属</em></div>
        <div class="db-field">
          <span>template_version_id</span><em>提交版本</em>
        </div>
        <div class="db-field">
          <span>name / priority</span><em>通用字段</em>
        </div>
        <div class="db-field"><span>config</span><em>配置快照</em></div>
      </div>
    </div>
    <table
      data-node="field-thinking"
      class="db-table dense"
      style="margin-top: 24px"
    >
      <thead>
        <tr>
          <th>填写顺序</th>
          <th>要回答的问题</th>
          <th>案例中的结果</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1. 身份</td>
          <td>这条记录怎样被稳定引用？是否需要公开 ID？</td>
          <td>内部 BIGINT；task 另有 public UUID</td>
        </tr>
        <tr>
          <td>2. 归属</td>
          <td>属于哪个工作空间、项目或父对象？</td>
          <td>workspace_id、project_id、template_id</td>
        </tr>
        <tr>
          <td>3. 业务字段</td>
          <td>什么值描述这条记录本身？</td>
          <td>code、name、priority、version_no</td>
        </tr>
        <tr>
          <td>4. 规则</td>
          <td>必填、唯一、范围和修改规则是什么？</td>
          <td>模板编码租户内唯一；版本发布后稳定</td>
        </tr>
      </tbody>
    </table>
    <div class="db-band">
      <strong>字段归属：</strong>给定哪条记录的
      ID，才能唯一确定这个值，字段通常就放在那张表。
    </div>
    <div class="db-footer">
      <span>先填稳定字段，动态配置在结构明确后再加入</span><span>16</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这一页演示填字段的顺序：身份、归属、业务属性、规则。task 同时使用内部 BIGINT 和公开 UUID。模板版本保存表单 Schema，任务保存提交时配置快照。
</notes>
