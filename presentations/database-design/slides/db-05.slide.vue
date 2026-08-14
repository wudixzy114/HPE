<template>
  <Slide class="db-slide">
    <div class="db-kicker">字段类型 · 全部 String 的代价</div>
    <h2 data-node="title">全部用 String：开发入口变简单，所有后续环节变复杂</h2>
    <table
      data-node="string-consequence-table"
      class="db-table dense"
      style="margin-top: 24px"
    >
      <thead>
        <tr>
          <th>业务数据</th>
          <th>String 中可能出现</th>
          <th>实际故障</th>
          <th>准确类型如何避免</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>数量</strong></td>
          <td>"2"、"02"、"2个"、"二"</td>
          <td>求和前要清洗；字符串排序 100 排在 20 前面</td>
          <td>INT 统一表示并支持范围检查</td>
        </tr>
        <tr>
          <td><strong>金额</strong></td>
          <td>"12.50"、"￥12.5"、"12,50"</td>
          <td>币种与格式混乱，聚合和对账失败</td>
          <td>DECIMAL + currency_code</td>
        </tr>
        <tr>
          <td><strong>日期</strong></td>
          <td>"2026/8/1"、"昨天"、"08-01"</td>
          <td>无法可靠比较、跨时区解释和日期运算</td>
          <td>DATE / TIMESTAMP + 明确时区语义</td>
        </tr>
        <tr>
          <td><strong>布尔值</strong></td>
          <td>"true"、"1"、"yes"、"开启"</td>
          <td>不同服务对真假的解释不一致</td>
          <td>BOOLEAN，并明确 NULL 是否允许</td>
        </tr>
        <tr>
          <td><strong>外键 ID</strong></td>
          <td>"0012"、"12 "、任意不存在值</td>
          <td>类型转换导致索引失效；无法可靠外键约束</td>
          <td>与被引用主键使用相同类型</td>
        </tr>
      </tbody>
    </table>
    <div data-node="string-cost-chain" class="db-flow" style="margin-top: 22px">
      <div class="db-flow-node">
        <b>写入不校验</b><span>脏格式进入数据库</span>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node">
        <b>查询时转换</b><span>SQL 复杂、索引难使用</span>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node">
        <b>各系统自行解释</b><span>口径不一致</span>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node">
        <b>历史数据清洗</b><span>成本最高且难恢复原意</span>
      </div>
    </div>
    <div class="db-band red">
      <strong>本质：</strong>String
      把“定义数据”的成本推给每一个读取者，并把错误从写入时推迟到线上使用时。
    </div>
    <div class="db-footer">
      <span>灵活不是没有规则，而是规则可演进</span><span>05</span>
    </div>
  </Slide>
</template>

<notes lang="md">
逐行用业务故障解释，而不是只说性能差。全部 String 最大的问题是语义丢失：原始值进入后无法判断“￥12.5”究竟是展示文本还是金额。类型转换还可能让索引无法直接使用，长期代价是全链路清洗。
</notes>
