<template>
  <Slide class="db-slide">
    <div class="db-kicker">性能 · 过载保护</div>
    <h2 data-node="title">
      数据库被打爆通常不是一条慢 SQL，而是无边界访问与故障放大
    </h2>
    <table
      data-node="performance-controls"
      class="db-table dense"
      style="margin-top: 21px"
    >
      <thead>
        <tr>
          <th>风险</th>
          <th>错误做法</th>
          <th>保护方式</th>
          <th>PRD / 方案要给出的数字</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>深分页</strong></td>
          <td><code>OFFSET 1000000</code></td>
          <td>使用 created_at + id 的游标分页</td>
          <td>每页上限、是否允许跳页</td>
        </tr>
        <tr>
          <td><strong>大导出</strong></td>
          <td>在线接口一次查数百万行</td>
          <td>异步任务分批读取，生成文件后下载</td>
          <td>最大行数、完成时限、文件保留期</td>
        </tr>
        <tr>
          <td><strong>定时扫描</strong></td>
          <td>每分钟全表查待处理记录</td>
          <td>索引条件 + 小批次 + 游标 / 跳过锁定行</td>
          <td>批次大小、并发数、扫描周期</td>
        </tr>
        <tr>
          <td><strong>连接耗尽</strong></td>
          <td>实例越多，每个实例连接池也越大</td>
          <td>按数据库容量分配总连接预算和获取超时</td>
          <td>总连接上限、单服务份额、超时</td>
        </tr>
        <tr>
          <td><strong>重试风暴</strong></td>
          <td>失败后立即无限重试</td>
          <td>次数上限 + 指数退避 + 随机抖动 + 熔断</td>
          <td>最大重试次数、间隔、降级策略</td>
        </tr>
        <tr>
          <td><strong>历史膨胀</strong></td>
          <td>事件和日志永久留在在线主表</td>
          <td>按时间分区、归档、冷热分层和删除</td>
          <td>在线保留期、归档期、恢复需求</td>
        </tr>
      </tbody>
    </table>
    <div
      data-node="capacity-formula"
      class="db-grid-3"
      style="margin-top: 17px"
    >
      <div class="db-card teal">
        <div class="db-label">容量输入</div>
        <p>
          初始 / 1 年 / 3 年行数，平均与峰值读写 QPS，单行平均大小，保留期限。
        </p>
      </div>
      <div class="db-card blue">
        <div class="db-label">服务目标</div>
        <p>列表 P95/P99 响应时间，提交吞吐，允许的复制延迟与统计延迟。</p>
      </div>
      <div class="db-card orange">
        <div class="db-label">增长来源</div>
        <p>用户流量、外部回调、批处理、定时任务分别估算，不能只给总量。</p>
      </div>
    </div>
    <div class="db-band">
      <strong>优化顺序：</strong>查询形态 → 索引 → 分页与批次 → 连接与限流 →
      归档；确认仍不足后再评估缓存、读副本、分区和分库分表。
    </div>
    <div class="db-footer">
      <span>“支持海量”不能指导设计，必须换成可验证数字</span><span>34</span>
    </div>
  </Slide>
</template>

<notes lang="md">
性能事故常由多个正常请求叠加，或故障时重试放大。连接池也需要总预算：十个实例各开 100 个连接，数据库面对的是 1000 个连接。分库分表不是第一步，先把查询、分页、批处理、连接和保留期做清楚。
</notes>
