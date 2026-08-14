<template>
  <Slide class="db-slide">
    <div class="db-kicker">反范式 · 何时可以重复</div>
    <h2 data-node="title">
      反范式不是随便复制字段，而是为明确性能或历史需求建立受控副本
    </h2>
    <table
      data-node="denormalization-table"
      class="db-table dense"
      style="margin-top: 22px"
    >
      <thead>
        <tr>
          <th>冗余类型</th>
          <th>例子</th>
          <th>权威来源</th>
          <th>维护方式</th>
          <th>损坏后如何恢复</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>历史快照</strong></td>
          <td>任务保存提交时模板名称、配置</td>
          <td>提交当时的版本事实</td>
          <td>创建后不可随来源更新</td>
          <td>从提交事件或版本备份核对</td>
        </tr>
        <tr>
          <td><strong>当前状态缓存</strong></td>
          <td>task.current_status 缓存最近运行结果</td>
          <td>task_run / event</td>
          <td>同一事务或可靠事件更新</td>
          <td>扫描运行记录重建</td>
        </tr>
        <tr>
          <td><strong>汇总字段</strong></td>
          <td>项目任务数、成功数</td>
          <td>任务明细</td>
          <td>原子增量或异步聚合</td>
          <td>全量重算并对账</td>
        </tr>
        <tr>
          <td><strong>报表汇总表</strong></td>
          <td>按天统计提交量与耗时</td>
          <td>在线明细与事件</td>
          <td>批处理 / 流式计算</td>
          <td>按日期重新计算</td>
        </tr>
        <tr>
          <td><strong>搜索副本</strong></td>
          <td>搜索引擎中的任务文档</td>
          <td>关系数据库</td>
          <td>事件同步</td>
          <td>从数据库全量重建索引</td>
        </tr>
      </tbody>
    </table>
    <div data-node="denorm-gates" class="db-grid-4" style="margin-top: 18px">
      <div class="db-note">
        <strong>1. 先有证据</strong><br />执行计划或监控证明读取瓶颈，而不是感觉
        JOIN 慢。
      </div>
      <div class="db-note">
        <strong>2. 标记语义</strong><br />字段名说明 snapshot、current、cached
        或 aggregate。
      </div>
      <div class="db-note">
        <strong>3. 可发现错误</strong><br />有一致性校验、延迟监控和对账报警。
      </div>
      <div class="db-note">
        <strong>4. 可重建</strong
        ><br />副本损坏后能从权威数据恢复，而不是人工猜测。
      </div>
    </div>
    <div class="db-band">
      <strong>顺序：</strong
      >先规范化保证正确，再用有证据、可校验、可重建的冗余优化读取。
    </div>
    <div class="db-footer">
      <span>冗余数据必须有主人、有同步、有修复</span><span>26</span>
    </div>
  </Slide>
</template>

<notes lang="md">
反范式不等于违反原则，而是把一致性成本显式接受下来。每个冗余都必须回答权威来源、更新机制、错误检测与重建。历史快照与缓存的维护方式完全不同：快照故意不更新，缓存必须跟随来源更新。
</notes>
