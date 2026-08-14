<template>
  <Slide class="db-slide">
    <div class="db-kicker">ID 设计 · 一页讲清</div>
    <h2 data-node="title">
      ID 的选择取决于生成范围、索引代价、公开方式与业务稳定性
    </h2>
    <table
      data-node="id-complete-table"
      class="db-table compact"
      style="margin-top: 21px"
    >
      <thead>
        <tr>
          <th>方案</th>
          <th>底层表示</th>
          <th>为什么使用</th>
          <th>主要代价</th>
          <th>推荐场景</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>自增 BIGINT</strong></td>
          <td>8 字节整数，通常趋势递增</td>
          <td>索引紧凑、写入局部性好、关联高效</td>
          <td>跨库生成困难；对外暴露可推测数量</td>
          <td>普通单库内部主键</td>
        </tr>
        <tr>
          <td><strong>UUID v4</strong></td>
          <td>128 bit / 16 字节随机值；文本常显示 36 字符</td>
          <td>各节点无需协调即可生成，碰撞概率极低</td>
          <td>比 BIGINT 大；随机写使 B-tree 页更分散</td>
          <td>公开 ID、离线生成、分布式实体</td>
        </tr>
        <tr>
          <td><strong>UUID v7</strong></td>
          <td>128 bit，包含毫秒时间信息与随机位</td>
          <td>保留分布式生成能力，同时大体按时间有序</td>
          <td>仍为 16 字节；依赖统一可靠实现</td>
          <td>新系统公开 ID、分布式高写入</td>
        </tr>
        <tr>
          <td><strong>Snowflake 类</strong></td>
          <td>常见 64 bit：时间戳 + 节点号 + 序列号</td>
          <td>分布式、趋势递增、比 UUID 紧凑</td>
          <td>时钟回拨、节点号冲突、ID 服务治理</td>
          <td>公司已有成熟统一 ID 服务</td>
        </tr>
        <tr>
          <td><strong>业务编号</strong></td>
          <td>VARCHAR，如 TASK-20260813-001</td>
          <td>可读、可搜索、方便客服沟通</td>
          <td>规则会变；生成连续号可能造成锁竞争</td>
          <td>作为 UNIQUE 业务键，不作默认主键</td>
        </tr>
      </tbody>
    </table>
    <div data-node="id-details" class="db-grid-3" style="margin-top: 17px">
      <div class="db-note">
        <strong>UUID 能否用 String 存？</strong><br />能，但不优先。原生 UUID 或
        BINARY(16) 只需 16 字节并能校验格式；VARCHAR(36)
        需要更多空间，索引也更大。
      </div>
      <div class="db-note">
        <strong>为什么外部 API 常用 UUID？</strong
        ><br />跨系统生成方便、不暴露连续数量、URL 不易枚举；但仍必须鉴权，UUID
        不是安全令牌。
      </div>
      <div class="db-note">
        <strong>为什么 API 又把 BIGINT 传成 String？</strong><br />JavaScript
        Number 不能精确表示全部 64 位整数。数据库仍是 BIGINT，只是 JSON
        传输适配。
      </div>
    </div>
    <div class="db-band teal">
      <strong>推荐组合：</strong><code>id BIGINT</code> 做内部关联；<code
        >public_id UUID</code
      >
      做外部标识；<code>task_no VARCHAR</code> 做业务展示。
    </div>
    <div class="db-footer">
      <span>普通业务不自创算法；分布式场景使用公司统一方案</span><span>09</span>
    </div>
  </Slide>
</template>

<notes lang="md">
把之前两页 ID 合并成一页，但信息完整。解释 UUID 是 128 位值，不是本质上的字符串；36 字符只是常见文本表现。雪花算法适合有成熟基础设施的分布式系统，不应由每个业务项目自行实现。业务编号与主键分离，避免规则变化扩散到所有外键。
</notes>
