<template>
  <Slide class="db-slide">
    <div class="db-kicker">ID 设计 3/3 · UUID 能否做主键</div>
    <h2 data-node="title">
      UUID 可以做主键；是否适合取决于索引结构、写入方式和系统边界
    </h2>

    <div
      data-node="uuid-primary-key"
      class="db-grid-2"
      style="margin-top: 26px"
    >
      <div class="db-card red">
        <div class="db-label">MySQL / InnoDB 的主要代价</div>
        <h3>主键既是聚簇索引，也是二级索引的行定位信息</h3>
        <ul>
          <li>
            <strong>键更宽：</strong>16 字节 UUID 大于 8 字节 BIGINT；CHAR(36)
            更宽。
          </li>
          <li>
            <strong>二级索引变大：</strong>InnoDB 二级索引条目会携带主键值。
          </li>
          <li>
            <strong>随机写入：</strong>UUID v4 插入分散到 B+Tree
            不同页面，增加页分裂和缓存压力。
          </li>
          <li><strong>关联成本：</strong>所有子表外键也要使用同样宽度。</li>
        </ul>
      </div>
      <div class="db-card teal">
        <div class="db-label">UUID 主键适合的情况</div>
        <h3>分布式生成价值高于局部性能代价</h3>
        <ul>
          <li>多个节点必须在不访问中心数据库时创建主键。</li>
          <li>离线数据需要先生成 ID，之后再合并。</li>
          <li>跨库迁移、合并或事件系统要求全局标识。</li>
          <li>使用 UUID v7 等时间有序方案，并采用紧凑二进制存储。</li>
        </ul>
      </div>
    </div>

    <table
      data-node="pk-choice"
      class="db-table dense"
      style="margin-top: 21px"
    >
      <thead>
        <tr>
          <th>系统情况</th>
          <th>推荐主键</th>
          <th>公开 ID</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>普通单库业务，大量表关联</td>
          <td><code>id BIGINT AUTO_INCREMENT PRIMARY KEY</code></td>
          <td><code>public_id BINARY(16) UNIQUE</code></td>
        </tr>
        <tr>
          <td>已有统一 64 位分布式 ID 服务</td>
          <td>Snowflake 类 BIGINT 主键</td>
          <td>可直接公开或另设 UUID，按安全与协议决定</td>
        </tr>
        <tr>
          <td>必须无中心生成且跨库合并</td>
          <td>UUID v7 / 有序 UUID 主键</td>
          <td>同一 UUID</td>
        </tr>
        <tr>
          <td>随机 UUID v4 + 高写入 InnoDB</td>
          <td>可用，但需压测并接受页分裂、索引膨胀等代价</td>
          <td>UUID v4</td>
        </tr>
      </tbody>
    </table>

    <div class="db-band">
      <strong>结论：</strong>“UUID 不能做主键”不准确。更准确的说法是：随机、宽
      UUID 在 InnoDB 聚簇主键上通常比递增 BIGINT 成本高；普通业务默认采用 BIGINT
      主键 + UUID 公开唯一键。
    </div>
    <div class="db-footer">
      <span>安全性仍依赖鉴权；UUID 难枚举不等于有访问权限</span><span>09B</span>
    </div>
  </Slide>
</template>

<notes lang="md">
明确纠正 UUID 不能做主键的说法。UUID 完全可以作为主键，数据库也能保证唯一；问题在于 InnoDB 聚簇索引、二级索引携带主键以及随机写入。默认建议是工程取舍，而非语法限制。
</notes>
