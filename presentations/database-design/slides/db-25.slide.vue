<template>
  <Slide class="db-slide">
    <div class="db-kicker">数据库约束 · 把关键规则落下来</div>
    <h2 data-node="title">
      五种常用约束，分别保护身份、关系、唯一、必填和范围
    </h2>
    <table
      data-node="constraint-table"
      class="db-table dense"
      style="margin-top: 24px"
    >
      <thead>
        <tr>
          <th>约束</th>
          <th>它保证什么</th>
          <th>中台案例</th>
          <th>缺少后的问题</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>PRIMARY KEY</strong></td>
          <td>每条记录有唯一身份</td>
          <td>task.id、task_run.id</td>
          <td>其他表无法稳定引用记录</td>
        </tr>
        <tr>
          <td><strong>FOREIGN KEY</strong></td>
          <td>被引用的记录真实存在</td>
          <td>task_run.task_id → task.id</td>
          <td>出现找不到任务的孤儿运行</td>
        </tr>
        <tr>
          <td><strong>UNIQUE</strong></td>
          <td>某个业务组合不重复</td>
          <td>(task_id, attempt_no)</td>
          <td>同一任务可能出现两个“第 2 次运行”</td>
        </tr>
        <tr>
          <td><strong>NOT NULL</strong></td>
          <td>必填事实不能缺失</td>
          <td>project_id、submitter_id</td>
          <td>产生没有归属或提交人的任务</td>
        </tr>
        <tr>
          <td><strong>CHECK</strong></td>
          <td>值必须落在合法范围</td>
          <td>priority 0～100；状态属于合法集合</td>
          <td>非法优先级和未知状态进入数据库</td>
        </tr>
      </tbody>
    </table>
    <div
      data-node="constraint-examples"
      class="db-grid-2"
      style="margin-top: 22px"
    >
      <div class="db-code">
        <span class="good">UNIQUE</span> (workspace_id, code)<br /><br />模板编码在工作空间内唯一
      </div>
      <div class="db-code">
        <span class="good">CHECK</span> (priority BETWEEN 0 AND 100)<br /><br />优先级只能取合法范围
      </div>
    </div>
    <div class="db-band red">
      <strong>代码校验仍然要做：</strong
      >数据库约束负责最终兜底，可以阻止并发请求、脚本或新接口写入明显错误的数据。
    </div>
    <div class="db-footer">
      <span>多租户唯一性通常需要带 workspace_id</span><span>25</span>
    </div>
  </Slide>
</template>

<notes lang="md">
只保留产品需要理解的五种约束。重点解释 UNIQUE：两个请求同时先查后写时，数据库唯一约束仍能阻止重复。复杂状态流程仍由应用处理，数据库负责基本合法性。
</notes>
