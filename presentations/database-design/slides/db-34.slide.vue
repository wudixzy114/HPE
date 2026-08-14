<template>
  <Slide class="db-slide">
    <div class="db-kicker">性能 · 控制每次操作的规模</div>
    <h2 data-node="title">
      数据库稳定运行，需要为列表、导出、批处理和历史数据设置边界
    </h2>
    <table
      data-node="performance-controls"
      class="db-table dense"
      style="margin-top: 23px"
    >
      <thead>
        <tr>
          <th>场景</th>
          <th>容易出现的问题</th>
          <th>推荐做法</th>
          <th>产品需要定义</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>任务列表</strong></td>
          <td>一次返回全部记录，或翻到很深的页码</td>
          <td>强制分页；每页有上限；大数据量使用游标翻页</td>
          <td>默认页数、最大每页数量、是否支持跳页</td>
        </tr>
        <tr>
          <td><strong>批量导出</strong></td>
          <td>在线请求查询数百万行并长时间占用连接</td>
          <td>提交异步导出任务，完成后生成文件下载</td>
          <td>最大导出量、完成时间、文件保留期</td>
        </tr>
        <tr>
          <td><strong>定时处理</strong></td>
          <td>定时任务每次扫描整张表</td>
          <td>使用查询条件和索引，小批量持续处理</td>
          <td>批次大小、处理周期、允许并发数</td>
        </tr>
        <tr>
          <td><strong>失败重试</strong></td>
          <td>失败后大量请求立即再次访问数据库</td>
          <td>限制重试次数，并逐步增加等待时间</td>
          <td>重试次数、等待时间、最终失败提示</td>
        </tr>
        <tr>
          <td><strong>事件与日志</strong></td>
          <td>数据持续增长，在线表越来越大</td>
          <td>明确在线保留期，过期后归档或删除</td>
          <td>保留多久、能否恢复、谁可查询历史</td>
        </tr>
      </tbody>
    </table>
    <div data-node="capacity-basics" class="db-grid-3" style="margin-top: 22px">
      <div class="db-card teal">
        <div class="db-label">数据量</div>
        <p>现在、1 年后、3 年后大约有多少任务和运行记录。</p>
      </div>
      <div class="db-card blue">
        <div class="db-label">访问量</div>
        <p>平时和高峰每秒大约有多少提交、查询和回调。</p>
      </div>
      <div class="db-card orange">
        <div class="db-label">保留期</div>
        <p>任务、运行、事件、日志分别在线保存多久。</p>
      </div>
    </div>
    <div class="db-band">
      <strong>优化顺序：</strong
      >先控制查询范围和每次处理数量，再设计索引和归档；数据规模确实超过单库能力时，再评估更复杂的架构。
    </div>
    <div class="db-footer">
      <span>“数据量大”需要换成具体数字</span><span>34</span>
    </div>
  </Slide>
</template>

<notes lang="md">
性能部分只保留产品能够直接影响的边界：分页、导出、批次、重试和保留期。产品在 PRD 中给出数量和上限，研发才能据此设计索引和容量。
</notes>
