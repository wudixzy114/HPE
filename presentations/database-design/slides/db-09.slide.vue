<template>
  <Slide class="db-slide">
    <div class="db-kicker">ID 字段类型与性能</div>
    <h2 data-node="title">
      不同 ID 要用不同字段：键宽、可读性和写入局部性都会影响性能
    </h2>
    <table
      data-node="id-type-table"
      class="db-table dense"
      style="margin-top: 24px"
    >
      <thead>
        <tr>
          <th>字段类型</th>
          <th>适合保存的 ID</th>
          <th>索引与写入影响</th>
          <th>推荐场景</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>BIGINT UNSIGNED</strong></td>
          <td>本地主键、外键</td>
          <td>8 字节；聚簇与二级索引最窄；递增写入局部性最好</td>
          <td>普通业务表的默认内部 ID</td>
        </tr>
        <tr>
          <td><strong>BINARY(16)</strong></td>
          <td>UUID（尤其时间有序 UUID）</td>
          <td>16 字节；比 BIGINT 宽；随机 UUID 会增加页分裂</td>
          <td>需要分布式生成或公开 ID，且能统一编码转换</td>
        </tr>
        <tr>
          <td><strong>CHAR(36) ASCII</strong></td>
          <td>可直接阅读的 UUID 文本</td>
          <td>36 字节；索引和二级索引更宽，比较与缓存效率更低</td>
          <td>低频管理数据、排障便利优先的公开 ID</td>
        </tr>
        <tr>
          <td><strong>VARCHAR(64/128)</strong></td>
          <td>业务编号、外部系统编号</td>
          <td>长度可变；索引大小随内容增长；不适合做高频聚簇主键</td>
          <td>task_no、system + external_id 等映射字段</td>
        </tr>
      </tbody>
    </table>
    <div class="db-grid-2" style="margin-top: 17px">
      <div class="db-note">
        <strong>InnoDB 要点：</strong
        >主键会被带入二级索引；主键越宽，所有二级索引和子表外键越大。
      </div>
      <div class="db-note">
        <strong>常见组合：</strong><code>id BIGINT</code> 做本地关联；另加
        <code>public_id</code> 或外部映射字段服务接口。
      </div>
    </div>
    <div class="db-band teal" style="margin-top: 16px">
      <strong>一句选择：</strong>内部高频关系优先 BIGINT；必须用 UUID
      时优先紧凑、时间有序的二进制表示；业务与外部编号使用 VARCHAR + UNIQUE。
    </div>
    <div class="db-footer">
      <span>ID 类型不是审美问题，而是索引空间、写入模式和系统边界的取舍</span
      ><span>09</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这页只讲 ID 应选择什么字段。BIGINT 是默认内部主键；需要全局或公开标识时再选择 UUID 的二进制或文本表示；业务和外部编号通常使用 VARCHAR，并建立合适的唯一约束。
</notes>
