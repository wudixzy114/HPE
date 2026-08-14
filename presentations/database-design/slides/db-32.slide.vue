<template>
  <Slide class="db-slide">
    <div class="db-kicker">能力边界</div>
    <h2 data-node="title">
      数据库提供底座，但业务系统仍要完成鉴权、补偿、恢复和治理
    </h2>
    <table
      data-node="capability-boundary"
      class="db-table dense"
      style="margin-top: 22px"
    >
      <thead>
        <tr>
          <th>数据库擅长提供</th>
          <th>前提与边界</th>
          <th>应用 / 基础设施仍要负责</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>类型、非空、唯一、检查、外键</td>
          <td>规则能被单行或关系约束表达</td>
          <td>复杂状态机、跨行规则、跨系统业务语义</td>
        </tr>
        <tr>
          <td>单数据库事务</td>
          <td>所有写入在同一个数据库边界内</td>
          <td>消息、缓存、对象存储和外部系统的一致性</td>
        </tr>
        <tr>
          <td>锁、版本与隔离级别</td>
          <td>正确选择事务范围并处理冲突</td>
          <td>幂等键、冲突提示、重试上限和状态规则</td>
        </tr>
        <tr>
          <td>索引和查询执行器</td>
          <td>查询形态合理，统计信息与索引匹配</td>
          <td>分页、限流、批处理、超时和容量规划</td>
        </tr>
        <tr>
          <td>持久化日志与崩溃恢复</td>
          <td>配置与硬件满足承诺</td>
          <td>备份、异地容灾、RPO/RTO 和恢复演练</td>
        </tr>
        <tr>
          <td>账号与数据库权限</td>
          <td>最小权限正确配置</td>
          <td>业务用户鉴权、租户隔离、字段脱敏和审计</td>
        </tr>
        <tr>
          <td>复制</td>
          <td>接受复制延迟和故障切换边界</td>
          <td>刚写后读的一致性策略；副本不能代替备份</td>
        </tr>
      </tbody>
    </table>
    <div data-node="boundary-myths" class="db-grid-4" style="margin-top: 18px">
      <div class="db-note"><strong>UUID</strong><br />不等于已鉴权</div>
      <div class="db-note"><strong>事务</strong><br />不等于跨系统一致</div>
      <div class="db-note"><strong>副本</strong><br />不等于可恢复备份</div>
      <div class="db-note"><strong>索引</strong><br />不等于任何查询都快</div>
    </div>
    <div class="db-band red">
      <strong>高可用不是“不出错”：</strong
      >必须提前定义允许丢多少数据、多久恢复、如何降级、如何对账，以及人工如何修复。
    </div>
    <div class="db-footer">
      <span>能力边界不明确，故障时就会出现责任空白</span><span>32</span>
    </div>
  </Slide>
</template>

<notes lang="md">
将数据库能力与外部责任逐行对应。持久性不等于企业已经完成备份；复制也会复制误删。可靠系统必须定义 RPO、RTO、恢复演练、对账和人工修复，而不是只依赖数据库产品名称。
</notes>
