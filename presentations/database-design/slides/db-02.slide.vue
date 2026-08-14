<template>
  <Slide class="db-slide">
    <div class="db-kicker">字段类型 · 为什么存在</div>
    <h2 data-node="title">
      数据类型同时决定：能存什么、怎样比较、怎样计算、怎样索引
    </h2>
    <div data-node="type-effects" class="db-grid-4" style="margin-top: 29px">
      <div class="db-card teal">
        <div class="db-label">合法性</div>
        <h3>能否阻止脏数据</h3>
        <p style="margin-top: 9px">
          <code>INT</code> 无法写入 “十”；日期类型会拒绝 2 月 30
          日；字符串则可能照单全收。
        </p>
      </div>
      <div class="db-card blue">
        <div class="db-label">比较与排序</div>
        <h3>按数值还是按字符</h3>
        <p style="margin-top: 9px">
          字符串排序中 <code>"100" &lt; "20"</code>，因为比较的是第一个字符。
        </p>
      </div>
      <div class="db-card orange">
        <div class="db-label">计算语义</div>
        <h3>精确还是近似</h3>
        <p style="margin-top: 9px">
          金额要求十进制精确；科学测量允许浮点近似；编码根本不参与算术。
        </p>
      </div>
      <div class="db-card yellow">
        <div class="db-label">存储与索引</div>
        <h3>每行和每个索引多大</h3>
        <p style="margin-top: 9px">
          定长整数通常比数字字符串紧凑；字段越宽，索引能缓存的条目越少。
        </p>
      </div>
    </div>
    <div
      data-node="all-string-example"
      class="db-split"
      style="margin-top: 23px"
    >
      <div class="db-code">
        <span class="bad">全部 String</span><br />age = "十八"<br />amount =
        "12.9元"<br />created_at = "昨天"<br />priority = "high" / "高" / "3"
      </div>
      <div class="db-rule-list">
        <div class="db-rule">
          <span class="db-badge red">1</span
          ><span
            ><b>写入容易，使用困难：</b
            >每个查询、接口和统计都要重新解析与校验。</span
          >
        </div>
        <div class="db-rule">
          <span class="db-badge red">2</span
          ><span
            ><b>规则无法统一：</b
            >旧接口、脚本和新服务可能各自接受不同格式。</span
          >
        </div>
        <div class="db-rule">
          <span class="db-badge red">3</span
          ><span
            ><b>错误推迟到线上：</b
            >直到排序、求和、范围查询或数据分析时才爆发。</span
          >
        </div>
      </div>
    </div>
    <div class="db-band">
      <strong>类型选择顺序：</strong
      >先确认业务语义，再确认范围、精度、比较方式、约束和未来增长。
    </div>
    <div class="db-footer">
      <span>类型不是存储格式细节，而是业务规则</span><span>02</span>
    </div>
  </Slide>
</template>

<notes lang="md">
明确回答“能不能全部用 String”：技术上能存，业务上代价很高。数据库失去第一层校验，排序和计算语义错误，所有消费者都要重复解析。类型越准确，错误越早被拒绝，规则越容易统一。
</notes>
