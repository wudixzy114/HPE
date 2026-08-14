<template>
  <Slide class="db-slide">
    <div class="db-kicker">字段类型 · 整数</div>
    <h2 data-node="title">INT 与 BIGINT：先看最大范围，再考虑空间和未来增长</h2>
    <table
      data-node="integer-table"
      class="db-table dense"
      style="margin-top: 25px"
    >
      <thead>
        <tr>
          <th>类型</th>
          <th>典型存储</th>
          <th>有符号范围（常见实现）</th>
          <th>适合</th>
          <th>不适合</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>SMALLINT</strong></td>
          <td>2 字节</td>
          <td>-32,768 ～ 32,767</td>
          <td>优先级、版本号、很小的计数</td>
          <td>可能持续增长的记录 ID</td>
        </tr>
        <tr>
          <td><strong>INTEGER / INT</strong></td>
          <td>4 字节</td>
          <td>约 -21 亿 ～ 21 亿</td>
          <td>普通数量、页码、有限范围计数</td>
          <td>长期高增长主键、事件流水</td>
        </tr>
        <tr>
          <td><strong>BIGINT</strong></td>
          <td>8 字节</td>
          <td>约 ±9.22×10¹⁸</td>
          <td>主键、累计字节数、大规模计数</td>
          <td>只有 0～100 的小状态值</td>
        </tr>
      </tbody>
    </table>
    <div
      data-node="integer-reasoning"
      class="db-grid-3"
      style="margin-top: 22px"
    >
      <div class="db-card teal">
        <div class="db-label">为什么主键常用 BIGINT</div>
        <p>
          主键一旦被几十张表引用，后期从 INT 扩到 BIGINT
          要改主表、外键、索引、接口和同步链路，迁移代价远大于初期多 4 字节。
        </p>
      </div>
      <div class="db-card blue">
        <div class="db-label">为什么不全用 BIGINT</div>
        <p>
          超大事实表中，字段与索引宽度会影响缓存和
          I/O。明确只在小范围内的优先级、状态序号可使用 SMALLINT。
        </p>
      </div>
      <div class="db-card orange">
        <div class="db-label">范围不能只看今天</div>
        <p>
          按峰值写入速度 × 保留年限 ×
          安全余量估算；还要考虑测试数据、失败重试、序列空洞与历史导入。
        </p>
      </div>
    </div>
    <div class="db-band">
      <strong>简单选择：</strong>普通内部主键优先
      BIGINT；明确只在小范围内的优先级、状态序号可用
      SMALLINT；普通业务数量按上限选择 INT 或 BIGINT。
    </div>
    <div class="db-footer">
      <span>默认主键 BIGINT；业务数量按可证明的范围选择</span><span>03</span>
    </div>
  </Slide>
</template>

<notes lang="md">
范围按照常见有符号实现展示。主键使用 BIGINT 的主要原因是后期扩容会影响主表、外键、索引和接口。普通计数可按明确上限选择 INT；MySQL 的 UNSIGNED 会改变正数范围，实际项目仍需按版本确认。
</notes>
