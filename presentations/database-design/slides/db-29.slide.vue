<template>
  <Slide class="db-slide">
    <div class="db-kicker">
      并发控制（Concurrency Control）· 产品需要理解的两个问题
    </div>
    <h2 data-node="title">两个人同时操作时，要防止重复创建和互相覆盖</h2>
    <div
      data-node="concurrency-basics"
      class="db-grid-2"
      style="margin-top: 30px"
    >
      <div class="db-card red">
        <div class="db-label">问题 1 · 重复创建</div>
        <h3>用户点击一次，网络重试了两次</h3>
        <div class="db-flow" style="margin-top: 18px">
          <div class="db-flow-node"><b>请求 A</b><span>查询：不存在</span></div>
          <div class="db-flow-arrow">+</div>
          <div class="db-flow-node">
            <b>请求 B</b><span>查询：也不存在</span>
          </div>
        </div>
        <p style="margin-top: 15px">
          两个请求随后都插入，产生两条任务。解决方式是每次提交携带防重复键，并由数据库
          UNIQUE 最终兜底。
        </p>
        <div class="db-code" style="margin-top: 14px">
          UNIQUE(workspace_id,<br />
          idempotency_key)
        </div>
      </div>
      <div class="db-card orange">
        <div class="db-label">问题 2 · 修改覆盖</div>
        <h3>两个人同时编辑同一条记录</h3>
        <div class="db-flow" style="margin-top: 18px">
          <div class="db-flow-node">
            <b>用户 A</b><span>读取版本 3，改优先级</span>
          </div>
          <div class="db-flow-arrow">+</div>
          <div class="db-flow-node">
            <b>用户 B</b><span>也读取版本 3，改名称</span>
          </div>
        </div>
        <p style="margin-top: 15px">
          后保存的人可能覆盖先保存的结果。常见做法是增加
          version；更新时发现版本变化，就提示重新加载或合并修改。
        </p>
        <div class="db-code" style="margin-top: 14px">
          UPDATE ... WHERE id=:id<br />AND version=:old_version
        </div>
      </div>
    </div>
    <div class="db-band">
      <strong>PRD 需要写清：</strong
      >重复提交返回原任务还是报错？多人修改冲突时覆盖、提示，还是禁止继续编辑？
    </div>
    <div class="db-footer">
      <span>产品负责定义冲突后的业务行为，研发负责实现并发控制</span
      ><span>29</span>
    </div>
  </Slide>
</template>

<notes lang="md">
并发只讲两个能直接感知的问题。重复创建通过防重复键和唯一约束解决；修改覆盖通过版本号发现冲突。产品需要决定冲突发生后的用户体验。
</notes>
