<template>
  <Slide class="db-slide">
    <div class="db-kicker">事务 · 原子性边界</div>
    <h2 data-node="title">事务只保证一个数据库边界内：全部成功，或全部回滚</h2>
    <div data-node="transaction-flow" class="db-flow" style="margin-top: 26px">
      <div class="db-flow-node">
        <b>创建 task</b><span>提交事实与配置快照</span>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node">
        <b>创建 inputs</b><span>全部输入逐行保存</span>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node">
        <b>创建 run #1</b><span>首次执行尝试</span>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node">
        <b>写 outbox</b><span>记录待投递事件</span>
      </div>
    </div>
    <div data-node="acid-table" class="db-grid-4" style="margin-top: 22px">
      <div class="db-card teal">
        <div class="db-label">Atomicity · 原子性</div>
        <p>
          第 3 步失败，前两步也回滚，避免出现没有输入或没有首次运行的半条任务。
        </p>
      </div>
      <div class="db-card blue">
        <div class="db-label">Consistency · 一致性</div>
        <p>
          事务结束后仍满足主键、外键、唯一、非空和检查约束；复杂业务规则仍需正确代码。
        </p>
      </div>
      <div class="db-card orange">
        <div class="db-label">Isolation · 隔离性</div>
        <p>
          并发事务按隔离级别相互可见；它不会自动阻止所有业务竞争，需要条件更新或锁。
        </p>
      </div>
      <div class="db-card yellow">
        <div class="db-label">Durability · 持久性</div>
        <p>提交成功后，在数据库承诺的故障模型和持久化配置下能够恢复。</p>
      </div>
    </div>
    <div
      data-node="transaction-boundary"
      class="db-grid-2"
      style="margin-top: 18px"
    >
      <div class="db-note">
        <strong>事务内不要做：</strong
        >长时间调用外部接口、等待用户输入、上传大文件。否则连接与锁长期占用。
      </div>
      <div class="db-note">
        <strong>事务外仍要解决：</strong
        >消息是否发出、外部系统是否收到、缓存是否更新、失败如何重试和补偿。
      </div>
    </div>
    <div class="db-footer">
      <span>事务边界应短小，只覆盖必须一起成立的数据库事实</span><span>28</span>
    </div>
  </Slide>
</template>

<notes lang="md">
ACID 不需要背定义，直接对应提交任务流程。数据库事务能保证 task、input、run 和 outbox 一起提交，但不能把外部调度调用也天然包进去。事务中等待外部网络会持锁和占连接，降低并发并增加死锁概率。
</notes>
