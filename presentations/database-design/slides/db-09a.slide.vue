<template>
  <Slide class="db-slide">
    <div class="db-kicker">ID 设计 2/3 · UUID 到底是什么</div>
    <h2 data-node="title">
      UUID 是 128 位标识值；文本形式只是它的一种表示方式
    </h2>

    <div
      data-node="uuid-representation"
      class="db-grid-3"
      style="margin-top: 27px"
    >
      <div class="db-card teal">
        <div class="db-label">逻辑值</div>
        <h3>128 bit / 16 字节</h3>
        <p style="margin-top: 10px">
          UUID 标准定义的是 128 位值。常见显示形式为
          <code>550e8400-e29b-41d4-a716-446655440000</code
          >，其中连字符只是文本格式。
        </p>
      </div>
      <div class="db-card blue">
        <div class="db-label">MySQL 存储</div>
        <h3>BINARY(16) 或 CHAR(36)</h3>
        <p style="margin-top: 10px">
          MySQL 没有独立 UUID 列类型。<code>BINARY(16)</code> 更紧凑；<code
            >CHAR(36)</code
          >
          更直观但占用更大。可使用 UUID_TO_BIN / BIN_TO_UUID 转换。
        </p>
      </div>
      <div class="db-card orange">
        <div class="db-label">其他数据库</div>
        <h3>可能有原生 UUID 类型</h3>
        <p style="margin-top: 10px">
          例如 PostgreSQL 提供原生 <code>uuid</code> 类型。选型时应区分 UUID
          的逻辑类型与具体数据库的物理列类型。
        </p>
      </div>
    </div>

    <table
      data-node="uuid-storage-comparison"
      class="db-table dense"
      style="margin-top: 22px"
    >
      <thead>
        <tr>
          <th>MySQL 列设计</th>
          <th>大致键宽</th>
          <th>优点</th>
          <th>代价</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>BINARY(16)</code></td>
          <td>16 字节</td>
          <td>紧凑、比较与索引空间更好</td>
          <td>人工查看需转换，应用要统一字节顺序</td>
        </tr>
        <tr>
          <td><code>CHAR(36) ASCII</code></td>
          <td>36 字节</td>
          <td>日志与 SQL 中直接可读</td>
          <td>主表和索引更宽；必须限制字符集与格式</td>
        </tr>
        <tr>
          <td><code>VARCHAR(36)</code></td>
          <td>内容 + 长度信息</td>
          <td>可以保存文本</td>
          <td>UUID 长度本来固定，VARCHAR 通常没有额外价值</td>
        </tr>
      </tbody>
    </table>

    <div class="db-grid-2" style="margin-top: 19px">
      <div class="db-note">
        <strong>UUID v4：</strong>随机生成，分布式方便；作为 B+Tree
        主键时写入位置分散。
      </div>
      <div class="db-note">
        <strong>UUID v7：</strong
        >包含时间有序部分，保留分布式生成能力并改善索引局部性。
      </div>
    </div>

    <div class="db-footer">
      <span>UUID 本质是 128 位值，不应简单理解成“一个普通字符串”</span
      ><span>09A</span>
    </div>
  </Slide>
</template>

<notes lang="md">
UUID 的逻辑类型是 128 位标识。MySQL 需要选择 BINARY(16) 或文本列来保存；文本形式并不意味着 UUID 天然属于字符串类型。普通项目应统一生成、序列化和字节顺序规则。
</notes>
