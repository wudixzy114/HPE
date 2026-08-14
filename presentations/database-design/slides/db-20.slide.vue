<template>
  <Slide class="db-slide">
    <div class="db-kicker">建模步骤 6 · 字段与约束落地</div>
    <h2 data-node="title">
      先为核心表定义“身份、归属、事实、状态、并发、时间”
    </h2>
    <table
      data-node="task-field-design"
      class="db-table compact"
      style="margin-top: 20px"
    >
      <thead>
        <tr>
          <th>字段</th>
          <th>类型建议</th>
          <th>是否必填</th>
          <th>约束 / 含义</th>
          <th>为什么这样设计</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>id</code></td>
          <td>BIGINT</td>
          <td>是</td>
          <td>主键</td>
          <td>内部关联紧凑稳定</td>
        </tr>
        <tr>
          <td><code>public_id</code></td>
          <td>原生 UUID</td>
          <td>是</td>
          <td>UNIQUE</td>
          <td>API/URL 使用，不暴露连续 ID</td>
        </tr>
        <tr>
          <td><code>workspace_id</code></td>
          <td>BIGINT</td>
          <td>是</td>
          <td>外键 / 租户边界</td>
          <td>进入权限、查询和组合唯一约束</td>
        </tr>
        <tr>
          <td><code>project_id</code></td>
          <td>BIGINT</td>
          <td>是</td>
          <td>外键</td>
          <td>还要保证项目属于同一工作空间</td>
        </tr>
        <tr>
          <td><code>template_version_id</code></td>
          <td>BIGINT</td>
          <td>是</td>
          <td>外键</td>
          <td>历史配置可按提交版本解释</td>
        </tr>
        <tr>
          <td><code>name</code></td>
          <td>VARCHAR(128)</td>
          <td>是</td>
          <td>去首尾空格；是否唯一由业务定</td>
          <td>普通展示名称，不承担关联</td>
        </tr>
        <tr>
          <td><code>priority</code></td>
          <td>SMALLINT</td>
          <td>是</td>
          <td>DEFAULT 50；CHECK 0～100</td>
          <td>范围小且参与排序</td>
        </tr>
        <tr>
          <td><code>config</code></td>
          <td>JSONB / JSON</td>
          <td>是</td>
          <td>按模板版本 Schema 校验</td>
          <td>保存类型特有提交快照</td>
        </tr>
        <tr>
          <td><code>current_status</code></td>
          <td>VARCHAR(20)</td>
          <td>是</td>
          <td>CHECK 合法状态</td>
          <td>列表高频过滤，稳定机器代码</td>
        </tr>
        <tr>
          <td><code>idempotency_key</code></td>
          <td>VARCHAR(128)</td>
          <td>是</td>
          <td>工作空间+提交人+键 UNIQUE</td>
          <td>并发和网络重试下防止重复创建</td>
        </tr>
        <tr>
          <td><code>version</code></td>
          <td>INTEGER</td>
          <td>是</td>
          <td>DEFAULT 0</td>
          <td>并发更新时检测覆盖</td>
        </tr>
      </tbody>
    </table>
    <div data-node="cross-tenant-rule" class="db-band red">
      <strong>仅每张表都有 workspace_id 仍不够：</strong>必须校验
      task.workspace_id 与 project.workspace_id 一致，避免跨工作空间错误关联。
    </div>
    <div class="db-footer">
      <span>字段设计必须同时写类型、空值、默认值、范围、唯一与修改规则</span
      ><span>20</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这一页展示如何把前面判断落实到字段字典。不是要求产品写最终 DDL，但这些业务语义必须明确。特别强调组合唯一约束和跨租户关联，单独保存 workspace_id 不会自动保证隔离。
</notes>
