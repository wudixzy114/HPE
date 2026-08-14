<template>
  <Slide class="db-slide">
    <div class="db-kicker">并发 · 工具怎么选</div>
    <h2 data-node="title">
      唯一约束、条件更新、乐观锁、悲观锁解决的是不同问题
    </h2>
    <table
      data-node="concurrency-tools"
      class="db-table dense"
      style="margin-top: 22px"
    >
      <thead>
        <tr>
          <th>工具</th>
          <th>核心做法</th>
          <th>适合</th>
          <th>代价 / 注意点</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>UNIQUE</strong></td>
          <td>让数据库裁决“是否已经存在”</td>
          <td>幂等键、业务编号、任务内尝试序号</td>
          <td>应用必须处理冲突；唯一范围要包含租户</td>
        </tr>
        <tr>
          <td><strong>原子条件 UPDATE</strong></td>
          <td><code>UPDATE ... WHERE remaining &gt;= amount</code></td>
          <td>扣配额、库存、状态迁移</td>
          <td>必须检查受影响行数；复杂跨行规则仍不够</td>
        </tr>
        <tr>
          <td><strong>乐观锁</strong></td>
          <td>读 version；更新时 WHERE version=旧值</td>
          <td>表单编辑、低冲突状态更新</td>
          <td>冲突时重新读取、合并或提示用户，不能静默无限重试</td>
        </tr>
        <tr>
          <td><strong>悲观锁</strong></td>
          <td><code>SELECT ... FOR UPDATE</code> 后串行修改</td>
          <td>冲突高、临界区短、必须严格串行</td>
          <td>降低并发；顺序不一致会死锁；不能锁着调用外部服务</td>
        </tr>
        <tr>
          <td><strong>更高隔离级别</strong></td>
          <td>让数据库检测更复杂的读写冲突</td>
          <td>跨行规则、写偏差等难以单行约束的场景</td>
          <td>吞吐下降且可能要求事务重试；不同数据库实现不同</td>
        </tr>
      </tbody>
    </table>
    <div data-node="sql-examples" class="db-grid-2" style="margin-top: 17px">
      <div class="db-code">
        <span class="good">-- 乐观锁</span><br />UPDATE task_run<br />SET
        status='RUNNING', version=version+1<br />WHERE id=:id<br />
        AND status='QUEUED'<br />
        AND version=:expected;
      </div>
      <div class="db-code">
        <span class="good">-- 原子扣减</span><br />UPDATE quota<br />SET
        remaining=remaining-:amount<br />WHERE id=:id<br />
        AND remaining &gt;= :amount;
      </div>
    </div>
    <div class="db-band">
      <strong>所有方案都要检查结果：</strong>受影响行数为 0
      不是“系统错误”，而是状态已经变化、版本冲突或配额不足。
    </div>
    <div class="db-footer">
      <span>从具体不变量选择工具，而不是全局盲目加锁</span><span>30</span>
    </div>
  </Slide>
</template>

<notes lang="md">
强调五种工具的适用边界。乐观锁并不阻止别人更新，而是发现自己基于旧版本更新；悲观锁会阻塞别人，适合高冲突且临界区短的场景。隔离级别名称相同，在不同数据库中的行为也可能不同，应由研发按目标数据库确认。
</notes>
