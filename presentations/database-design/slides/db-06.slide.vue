<template>
  <Slide class="db-slide">
    <div class="db-kicker">字段类型 · 精确数值</div>
    <h2 data-node="title">
      金额用 DECIMAL，不是因为习惯，而是二进制浮点无法精确表示多数十进制小数
    </h2>
    <div data-node="money-layout" class="db-grid-2" style="margin-top: 25px">
      <div class="db-card red">
        <div class="db-label">FLOAT / DOUBLE · 近似数</div>
        <div class="db-code">
          <span class="bad">0.1 + 0.2 ≠ 精确的 0.3</span
          ><br /><br />适合：测量值、监控指标、科学计算<br />不适合：金额、税额、需要精确相等的比例
        </div>
        <p style="margin-top: 14px">
          二进制浮点通常只能保存最接近的值。单次误差很小，但聚合、舍入、对账时会累积并暴露。
        </p>
      </div>
      <div class="db-card teal">
        <div class="db-label">两种精确方案</div>
        <div class="db-code">
          <span class="good">方案 A</span><br />amount NUMERIC(18, 2)<br /><br /><span
            class="good"
            >方案 B</span
          ><br />amount_minor BIGINT -- 分<br />currency_code CHAR(3)
        </div>
        <p style="margin-top: 14px">
          高精度计费可能需要更多小数位；多币种不能假设所有货币都固定两位小数。
        </p>
      </div>
    </div>
    <table
      data-node="money-prd"
      class="db-table dense"
      style="margin-top: 20px"
    >
      <thead>
        <tr>
          <th>PRD 必须定义</th>
          <th>不定义会怎样</th>
          <th>示例</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>单位与币种</td>
          <td>12 是元、分还是美元无法判断</td>
          <td><code>amount_minor=1250, currency=CNY</code></td>
        </tr>
        <tr>
          <td>最大范围与小数位</td>
          <td>字段溢出，或单价精度被过早截断</td>
          <td>资源计费单价可能需要 6 位小数</td>
        </tr>
        <tr>
          <td>舍入时机与规则</td>
          <td>逐项舍入和汇总后舍入结果不同</td>
          <td>银行家舍入 / 四舍五入需统一</td>
        </tr>
      </tbody>
    </table>
    <div class="db-footer">
      <span>准确类型之外，还必须定义业务计算口径</span><span>06</span>
    </div>
  </Slide>
</template>

<notes lang="md">
解释浮点不是“有 bug”，而是设计目标不同：它用有限二进制位近似实数。科学计算允许误差，财务对账不允许。金额字段还不能只写 DECIMAL，需要产品明确币种、单位、精度、上限和舍入规则。
</notes>
