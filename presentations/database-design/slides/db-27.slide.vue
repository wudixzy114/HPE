<template>
  <Slide class="db-slide">
    <div class="db-kicker">约束、删除与租户边界</div>
    <h2 data-node="title">表拆对之后，还要用约束把“永远必须成立”写进数据库</h2>
    <table
      data-node="constraint-detail-table"
      class="db-table compact"
      style="margin-top: 20px"
    >
      <thead>
        <tr>
          <th>约束</th>
          <th>案例中的落点</th>
          <th>防止什么</th>
          <th>不能单独解决什么</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>PRIMARY KEY</strong></td>
          <td>task.id、run.id</td>
          <td>每行身份重复或为空</td>
          <td>业务上重复提交</td>
        </tr>
        <tr>
          <td><strong>UNIQUE</strong></td>
          <td>(workspace_id, template.code)；(task_id, attempt_no)</td>
          <td>租户内编码重复、重试序号重复</td>
          <td>复杂状态迁移</td>
        </tr>
        <tr>
          <td><strong>FOREIGN KEY</strong></td>
          <td>run.task_id → task.id</td>
          <td>孤儿运行、引用不存在对象</td>
          <td>跨库关系或无环依赖</td>
        </tr>
        <tr>
          <td><strong>NOT NULL</strong></td>
          <td>submitter_id、template_version_id</td>
          <td>必填事实缺失</td>
          <td>值本身是否业务正确</td>
        </tr>
        <tr>
          <td><strong>CHECK</strong></td>
          <td>priority 0～100；finished_at ≥ started_at</td>
          <td>单行内明显非法值</td>
          <td>跨行配额和复杂流程</td>
        </tr>
      </tbody>
    </table>
    <div
      data-node="delete-multitenant"
      class="db-grid-2"
      style="margin-top: 18px"
    >
      <div class="db-card orange">
        <div class="db-label">删除策略</div>
        <ul>
          <li><strong>RESTRICT：</strong>核心父记录仍被引用时禁止删除。</li>
          <li>
            <strong>CASCADE：</strong>只用于明确组成关系，误删会向下扩散。
          </li>
          <li>
            <strong>SET NULL：</strong
            >保留子记录但解除关系，必须允许空且业务可解释。
          </li>
          <li>
            <strong>逻辑删除：</strong
            >同时设计查询条件、唯一性、恢复、清理与合规删除。
          </li>
        </ul>
      </div>
      <div class="db-card red">
        <div class="db-label">租户边界</div>
        <ul>
          <li>
            <code>UNIQUE(code)</code> 常常错误，应是
            <code>UNIQUE(workspace_id, code)</code>。
          </li>
          <li>task 与 project 都有 workspace_id，仍可能被写成跨租户关系。</li>
          <li>可使用组合外键或应用事务校验保证归属一致。</li>
          <li>所有读取也必须把租户条件放进查询与鉴权。</li>
        </ul>
      </div>
    </div>
    <div class="db-band red">
      <strong>原则：</strong
      >关键且稳定的不变量必须由数据库兜底；只写在前端校验或 PRD
      文案里，会被并发、脚本和新接口绕过。
    </div>
    <div class="db-footer">
      <span>外键列是否自动建索引取决于数据库，需要按查询另行设计</span
      ><span>27</span>
    </div>
  </Slide>
</template>

<notes lang="md">
约束是最后一道防线，不是全部业务逻辑。UNIQUE 解决并发重复，CHECK 适合单行范围，跨行配额仍需事务。删除策略不要无脑 CASCADE；逻辑删除也不是默认模板，因为它会影响唯一约束、查询和数据清理。
</notes>
