<template>
  <Slide class="db-slide">
    <div class="db-kicker">ID 设计 1/3 · 先分清职责</div>
    <h2 data-node="title">ID 是“标识职责”，不等于某一种数据库类型</h2>

    <table
      data-node="id-role-table"
      class="db-table dense"
      style="margin-top: 25px"
    >
      <thead>
        <tr>
          <th>ID / 键的角色</th>
          <th>解决的问题</th>
          <th>案例</th>
          <th>常用类型</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>内部主键<br />Primary Key</strong>
          </td>
          <td>数据库内部唯一识别一行，并被其他表的外键引用</td>
          <td><code>task.id</code>、<code>task_run.id</code></td>
          <td>普通业务优先 BIGINT；也可以使用 UUID/BINARY</td>
        </tr>
        <tr>
          <td>
            <strong>外键<br />Foreign Key</strong>
          </td>
          <td>保存另一张表的内部主键，建立关系</td>
          <td><code>task_run.task_id</code></td>
          <td>必须与被引用主键类型一致</td>
        </tr>
        <tr>
          <td>
            <strong>公开 ID<br />Public / API ID</strong>
          </td>
          <td>出现在 URL、接口与跨系统消息中，隐藏内部连续编号</td>
          <td><code>task.public_id</code></td>
          <td>UUID，MySQL 常用 BINARY(16) 或 CHAR(36)</td>
        </tr>
        <tr>
          <td>
            <strong>业务编号<br />Business Key</strong>
          </td>
          <td>给用户阅读、搜索与沟通，承载业务格式</td>
          <td><code>TASK-20260814-001</code></td>
          <td>VARCHAR + 业务范围内 UNIQUE</td>
        </tr>
        <tr>
          <td>
            <strong>外部系统 ID<br />External Reference</strong>
          </td>
          <td>记录另一个系统中的对象编号，用于回调和对账</td>
          <td><code>scheduler_type + external_job_id</code></td>
          <td>遵循外部协议，通常 VARCHAR；加系统命名空间</td>
        </tr>
      </tbody>
    </table>

    <div data-node="id-summary" class="db-grid-3" style="margin-top: 21px">
      <div class="db-note">
        <strong>数据库内部：</strong>主键 id + 外键 xxx_id，负责本地表关系。
      </div>
      <div class="db-note">
        <strong>面向用户和接口：</strong>public_id 与 task_no，负责公开和展示。
      </div>
      <div class="db-note">
        <strong>来自其他系统：</strong>external_system + external_id，负责映射。
      </div>
    </div>

    <div class="db-band teal" style="margin-top: 18px">
      <strong>普通中台推荐：</strong>本地表关联使用 BIGINT
      内部主键；外部接口使用
      UUID；业务页面可另设可读编号；外部系统编号只作为映射字段。
    </div>
    <div class="db-footer">
      <span>数据库中还有唯一键、候选键和自然键，并非所有“唯一值”都叫主键</span
      ><span>09</span>
    </div>
  </Slide>
</template>

<notes lang="md">
先把五种标识职责拆开。数据库内部关系使用主键与外键；公开 ID、业务编号和外部系统 ID 都可以唯一，但承担的职责不同。一个业务对象可以同时拥有多种 ID。
</notes>
