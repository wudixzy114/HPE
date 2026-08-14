<template>
  <Slide class="db-slide">
    <div class="db-kicker">其他常用类型</div>
    <h2 data-node="title">小数、日期、真假和文件：掌握各自最重要的一条规则</h2>
    <div
      data-node="common-special-types"
      class="db-grid-2"
      style="margin-top: 27px"
    >
      <div class="db-card teal">
        <div class="db-label">DECIMAL / FLOAT / DOUBLE</div>
        <h3>需要精确的十进制值使用 DECIMAL</h3>
        <p style="margin-top: 10px">
          例如费用、比例、精确单价。FLOAT/DOUBLE
          保存近似值，适合监控指标和允许误差的测量数据。
        </p>
        <div class="db-code" style="margin-top: 14px">
          unit_price DECIMAL(18, 6)
        </div>
      </div>
      <div class="db-card blue">
        <div class="db-label">DATE / DATETIME / TIMESTAMP</div>
        <h3>日期和时刻使用专门的时间类型</h3>
        <p style="margin-top: 10px">
          数据库可以校验合法日期、正确排序和计算时长。PRD
          还需明确时区，以及“尚未开始”是否允许 NULL。
        </p>
        <div class="db-code" style="margin-top: 14px">
          started_at DATETIME NULL
        </div>
      </div>
      <div class="db-card orange">
        <div class="db-label">BOOLEAN</div>
        <h3>只用于两个明确答案</h3>
        <p style="margin-top: 10px">
          是否启用、是否公开可以使用布尔值。待审核、通过、拒绝包含三个状态，应使用状态字段。
        </p>
        <div class="db-code" style="margin-top: 14px">
          is_enabled BOOLEAN NOT NULL
        </div>
      </div>
      <div class="db-card yellow">
        <div class="db-label">BLOB / 文件</div>
        <h3>大文件通常放对象存储</h3>
        <p style="margin-top: 10px">
          数据库保存
          object_key、文件名、大小、类型、哈希和创建时间，避免核心表和备份被大文件拖慢。
        </p>
        <div class="db-code" style="margin-top: 14px">
          object_key VARCHAR(512)
        </div>
      </div>
    </div>
    <div class="db-band">
      <strong>本节重点：</strong
      >专门类型可以提前阻止非法值，并提供正确的比较和计算能力；产品需要补充单位、时区、可空与精度口径。
    </div>
    <div class="db-footer">
      <span>费用等精确数值按实际业务进一步评审</span><span>06</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这页保留四个通用结论：精确十进制用 DECIMAL，监控和测量可用浮点；日期使用时间类型；布尔值只表达两个明确答案；大文件通常放对象存储。
</notes>
