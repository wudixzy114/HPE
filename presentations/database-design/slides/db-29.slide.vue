<template>
  <Slide class="db-slide">
    <div class="db-kicker">并发 · 四类真实故障</div>
    <h2 data-node="title">
      单个请求看起来正确，并发执行后仍可能重复、覆盖、超额或状态倒退
    </h2>
    <table
      data-node="concurrency-anomalies"
      class="db-table dense"
      style="margin-top: 22px"
    >
      <thead>
        <tr>
          <th>问题</th>
          <th>两个请求分别做什么</th>
          <th>错误结果</th>
          <th>常用保护</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>重复创建</strong></td>
          <td>A、B 都先查询“幂等键不存在”，随后各自插入</td>
          <td>同一次点击产生两条任务</td>
          <td>数据库 UNIQUE + 捕获冲突返回原记录</td>
        </tr>
        <tr>
          <td><strong>丢失更新</strong></td>
          <td>A、B 都读 version=3，各自修改；B 最后覆盖 A</td>
          <td>先保存的修改无提示消失</td>
          <td>WHERE version=3，成功后 version+1</td>
        </tr>
        <tr>
          <td><strong>超额占用</strong></td>
          <td>A、B 都看到剩余配额为 1，都认为可提交</td>
          <td>实际占用 2，突破配额</td>
          <td>条件 UPDATE / 行锁 / 串行化</td>
        </tr>
        <tr>
          <td><strong>状态倒退</strong></td>
          <td>新回调先写 SUCCEEDED，旧回调后写 RUNNING</td>
          <td>已成功任务重新显示运行中</td>
          <td>状态条件、事件版本、时间与去重规则</td>
        </tr>
      </tbody>
    </table>
    <div
      data-node="lost-update-timeline"
      class="db-flow"
      style="margin-top: 20px"
    >
      <div class="db-flow-node">
        <b>A 读取</b><span>priority=50, version=3</span>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node">
        <b>B 读取</b><span>priority=50, version=3</span>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node"><b>A 保存 80</b><span>version 变 4</span></div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node" style="border-color: #dfa8a8">
        <b class="db-red-text">B 保存 30</b><span>若不校验版本，就覆盖 A</span>
      </div>
    </div>
    <div class="db-band red">
      <strong>关键认识：</strong
      >“先查再写”不是一个原子动作；业务不变量必须由数据库约束、条件更新或锁覆盖整个竞争窗口。
    </div>
    <div class="db-footer">
      <span>并发问题不是请求多才有，两个请求就足够</span><span>29</span>
    </div>
  </Slide>
</template>

<notes lang="md">
四类故障分别对应不同工具。重复创建用唯一约束；丢失更新用乐观锁；超额配额用原子条件扣减或锁；状态倒退用状态迁移和事件版本。不要笼统说“加事务”，因为普通事务并不自动解决所有竞争。
</notes>
