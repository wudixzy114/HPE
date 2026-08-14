<template>
  <Slide class="db-slide">
    <div class="db-kicker">索引设计（Index Design）</div>
    <h2 data-node="title">
      索引必须从真实查询反推：等值条件、范围、排序与数据分布
    </h2>
    <div
      data-node="query-to-index"
      class="db-grid-2"
      style="margin-top: 22px; grid-template-columns: 0.9fr 1.35fr"
    >
      <div class="db-card blue">
        <div class="db-label">真实列表查询</div>
        <div class="db-code">
          SELECT id, name, status, created_at<br />FROM task<br />WHERE
          workspace_id = :wid<br />
          AND current_status = :status<br />
          AND deleted_at IS NULL<br />
          AND (created_at, id) &lt; (:t, :id)<br />ORDER BY created_at DESC, id
          DESC<br />LIMIT 50;
        </div>
        <p style="margin-top: 12px">
          查询口径：租户等值 + 状态等值 + 未删除 + 游标范围 + 固定排序。
        </p>
      </div>
      <div>
        <div class="db-code">
          <span class="good">候选组合索引</span><br />CREATE INDEX
          idx_task_list<br />ON task (<br />
          workspace_id,<br />
          current_status,<br />
          created_at DESC,<br />
          id DESC<br />)<br />WHERE deleted_at IS NULL;
        </div>
        <div class="db-rule-list" style="margin-top: 13px">
          <div class="db-rule">
            <span class="db-badge">1</span
            ><span><b>等值过滤通常在前：</b>先缩小工作空间和状态范围。</span>
          </div>
          <div class="db-rule">
            <span class="db-badge blue">2</span
            ><span
              ><b>范围与排序随后：</b>created_at、id
              同时支持稳定游标和倒序读取。</span
            >
          </div>
          <div class="db-rule">
            <span class="db-badge orange">3</span
            ><span
              ><b>部分索引是数据库特性：</b>PostgreSQL
              可对未删除行建部分索引；其他数据库方案不同。</span
            >
          </div>
        </div>
      </div>
    </div>
    <table
      data-node="index-mistakes"
      class="db-table compact"
      style="margin-top: 17px"
    >
      <thead>
        <tr>
          <th>误区</th>
          <th>为什么可能无效或有害</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>每个字段各建单列索引</td>
          <td>不一定能支持组合过滤与排序；每次写入都要维护更多索引</td>
        </tr>
        <tr>
          <td>只给低选择性布尔字段建索引</td>
          <td>命中行比例很高，数据库可能仍选择全表扫描</td>
        </tr>
        <tr>
          <td>在索引列上做函数或隐式类型转换</td>
          <td>普通索引可能无法直接使用；例如字符串 ID 与整数比较</td>
        </tr>
        <tr>
          <td>只看有没有索引，不看执行计划</td>
          <td>统计信息、数据分布、返回行数都会影响优化器选择</td>
        </tr>
      </tbody>
    </table>
    <div class="db-footer">
      <span>用 EXPLAIN 验证候选索引；EXPLAIN ANALYZE 会实际执行，需谨慎</span
      ><span>33</span>
    </div>
  </Slide>
</template>

<notes lang="md">
用一条完整查询说明索引顺序，而不是背“最左匹配”。索引设计还要看状态分布，例如 99% 都是 SUCCEEDED 时单独状态索引价值低。最终必须看目标数据库执行计划和真实数据分布。
</notes>
