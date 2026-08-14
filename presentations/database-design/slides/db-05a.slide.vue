<template>
  <Slide class="db-slide">
    <div class="db-kicker">数据类型 · 选错后的系统代价</div>
    <h2 data-node="title">
      类型选错不仅会产生脏数据，还会持续消耗存储、内存和查询性能
    </h2>

    <div
      data-node="wrong-type-costs"
      class="db-grid-3"
      style="margin-top: 27px"
    >
      <div class="db-card red">
        <div class="db-label">1 · 行与索引更宽</div>
        <h3>占用磁盘空间变大</h3>
        <p style="margin-top: 10px">
          数字 123 使用 INT 通常为 4 字节；保存为 VARCHAR
          还需要字符字节、长度信息和字符集处理。字段越宽，主表与每个相关索引都会变大。
        </p>
      </div>
      <div class="db-card orange">
        <div class="db-label">2 · 缓存效率下降</div>
        <h3>同一块内存装的数据更少</h3>
        <p style="margin-top: 10px">
          数据库缓冲池按页缓存数据和索引。行与索引变宽后，每页容纳的记录更少，缓存命中率下降，读取磁盘的次数增加。
        </p>
      </div>
      <div class="db-card yellow">
        <div class="db-label">3 · 索引树更大</div>
        <h3>查找和范围扫描成本上升</h3>
        <p style="margin-top: 10px">
          索引键越宽，每个 B+Tree
          页能保存的键越少，可能需要更多页和更深的树；比较长字符串也比比较整数更昂贵。
        </p>
      </div>
      <div class="db-card blue">
        <div class="db-label">4 · 类型转换</div>
        <h3>索引可能无法直接使用</h3>
        <p style="margin-top: 10px">
          外键一边是 BIGINT、另一边是
          VARCHAR，查询时需要隐式或显式转换。转换方向不合适时，数据库可能扫描大量记录。
        </p>
      </div>
      <div class="db-card teal">
        <div class="db-label">5 · 写放大与碎片</div>
        <h3>更新和插入维护更多页面</h3>
        <p style="margin-top: 10px">
          随机、宽主键会增加 B+Tree
          页分裂；可变长字段变大时可能造成行迁移或页内空洞。更准确的说法是数据页与索引页碎片，而非笼统的“内存碎片”。
        </p>
      </div>
      <div class="db-card">
        <div class="db-label">6 · 迁移与清洗</div>
        <h3>问题拖到历史数据阶段最昂贵</h3>
        <p style="margin-top: 10px">
          把 “30分钟”“30m”“半小时”
          从字符串改成整数时，系统已经无法可靠恢复原意。改类型还可能需要重建表、索引和所有下游接口。
        </p>
      </div>
    </div>

    <div
      data-node="wrong-type-examples"
      class="db-band red"
      style="margin-top: 22px"
    >
      <strong>三个高频检查：</strong>数量不要用
      VARCHAR；主键与外键类型必须一致；随机、宽 ID
      作为所有表主键前必须评估聚簇索引与二级索引代价。
    </div>

    <div class="db-footer">
      <span>准确类型同时改善正确性、空间、缓存和索引效率</span><span>05A</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这一页把类型错误的技术代价拆成六类。重点说明“内存碎片”不是最准确表述，常见问题是数据页、索引页碎片以及缓冲池利用率下降。类型越准确，行越紧凑，比较与索引越直接。
</notes>
