<template>
  <Slide class="db-slide">
    <div class="db-kicker">MySQL 类型全景</div>
    <h2 data-node="title">常见业务字段可以先归入六大类，再选择具体类型</h2>
    <div data-node="mysql-type-map" class="db-grid-3" style="margin-top: 25px">
      <div class="db-card teal">
        <div class="db-label">整数</div>
        <h3>整数值</h3>
        <div class="db-pills" style="margin-top: 12px">
          <span class="db-pill teal">TINYINT</span
          ><span class="db-pill teal">SMALLINT</span
          ><span class="db-pill teal">INT</span
          ><span class="db-pill teal">BIGINT</span>
        </div>
        <p style="margin-top: 13px">
          数量、次数、序号、内部 ID。主要区别是可表示范围和存储空间。
        </p>
      </div>
      <div class="db-card blue">
        <div class="db-label">精确 / 近似小数</div>
        <h3>带小数的数值</h3>
        <div class="db-pills" style="margin-top: 12px">
          <span class="db-pill blue">DECIMAL</span
          ><span class="db-pill blue">FLOAT</span
          ><span class="db-pill blue">DOUBLE</span>
        </div>
        <p style="margin-top: 13px">
          DECIMAL 用于需要十进制精确的值；FLOAT/DOUBLE
          用于允许误差的测量与统计。
        </p>
      </div>
      <div class="db-card orange">
        <div class="db-label">字符串</div>
        <h3>文本和编码</h3>
        <div class="db-pills" style="margin-top: 12px">
          <span class="db-pill orange">CHAR</span
          ><span class="db-pill orange">VARCHAR</span
          ><span class="db-pill orange">TEXT</span>
        </div>
        <p style="margin-top: 13px">
          名称、业务编号、手机号、描述、错误信息。长度和排序规则需要明确。
        </p>
      </div>
      <div class="db-card yellow">
        <div class="db-label">日期时间</div>
        <h3>日期与时刻</h3>
        <div class="db-pills" style="margin-top: 12px">
          <span class="db-pill">DATE</span><span class="db-pill">DATETIME</span
          ><span class="db-pill">TIMESTAMP</span>
        </div>
        <p style="margin-top: 13px">
          业务日期、创建时间、开始结束时间。重点是格式、时区和是否允许为空。
        </p>
      </div>
      <div class="db-card red">
        <div class="db-label">真假与状态</div>
        <h3>布尔值和有限集合</h3>
        <div class="db-pills" style="margin-top: 12px">
          <span class="db-pill red">BOOLEAN</span
          ><span class="db-pill red">状态代码</span>
        </div>
        <p style="margin-top: 13px">
          BOOLEAN 表示明确的是/否；排队、运行、成功等流程使用状态代码。
        </p>
      </div>
      <div class="db-card">
        <div class="db-label">结构化扩展</div>
        <h3>灵活配置</h3>
        <div class="db-pills" style="margin-top: 12px">
          <span class="db-pill blue">JSON</span
          ><span class="db-pill">BLOB</span>
        </div>
        <p style="margin-top: 13px">
          JSON 保存版本化配置；大文件通常放对象存储，数据库保存地址和元数据。
        </p>
      </div>
    </div>
    <div class="db-band teal">
      <strong>第一步只做分类：</strong
      >数值、文本、时间、真假、状态或结构化配置。分类明确后，再讨论 INT 还是
      BIGINT、VARCHAR 应该多长。
    </div>
    <div class="db-footer">
      <span>示例以 MySQL 为主，具体范围与行为以实际版本为准</span
      ><span>02</span>
    </div>
  </Slide>
</template>

<notes lang="md">
先给类型地图，避免一上来就抠 INT 和 BIGINT。让听众先会把业务字段归类：ID 是整数或 UUID，手机号属于文本，开始时间属于时间，任务流程属于状态。后面只深化最常用、最容易选错的类型。
</notes>
