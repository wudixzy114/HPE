<template>
  <Slide class="db-slide">
    <div class="db-kicker">字段类型 · NULL 与默认值</div>
    <h2 data-node="title">
      NULL、空字符串、0、false 代表四种不同业务事实，不能统一成“空”
    </h2>
    <table
      data-node="null-table"
      class="db-table dense"
      style="margin-top: 24px"
    >
      <thead>
        <tr>
          <th>值</th>
          <th>业务含义</th>
          <th>任务平台例子</th>
          <th>用错后的代价</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>NULL</strong></td>
          <td>未知、尚未发生、或不适用</td>
          <td><code>started_at=NULL</code>：任务尚未开始</td>
          <td>统计时需要三值逻辑；<code>= NULL</code> 也不会按预期匹配</td>
        </tr>
        <tr>
          <td><strong>空字符串 ""</strong></td>
          <td>一个已知但长度为 0 的文本</td>
          <td>用户明确把备注清空</td>
          <td>与“没提交备注”混在一起，无法判断用户动作</td>
        </tr>
        <tr>
          <td><strong>0</strong></td>
          <td>真实数值零</td>
          <td><code>retry_count=0</code>：一次都没重试</td>
          <td>若拿 0 代替未知，平均值和分布统计被污染</td>
        </tr>
        <tr>
          <td><strong>false</strong></td>
          <td>明确知道答案是否定</td>
          <td><code>is_public=false</code>：明确不公开</td>
          <td>若拿 false 代替“未确认”，流程可能错误跳过审核</td>
        </tr>
      </tbody>
    </table>
    <div data-node="null-examples" class="db-grid-3" style="margin-top: 20px">
      <div class="db-card teal">
        <div class="db-label">正确</div>
        <p><code>finished_at=NULL</code> 表示运行未结束；结束后写真实时间。</p>
      </div>
      <div class="db-card orange">
        <div class="db-label">危险魔法值</div>
        <p>
          使用 <code>1970-01-01</code> 表示未开始，会被统计成一次真实历史时间。
        </p>
      </div>
      <div class="db-card red">
        <div class="db-label">业务风险</div>
        <p>把“审批结果未知”默认成 false，可能把待审核误当作已拒绝。</p>
      </div>
    </div>
    <div class="db-band">
      <strong>设计规则：</strong>能明确必填就使用 NOT NULL；允许 NULL 时，PRD
      必须写清它究竟表示未知、未发生还是不适用。
    </div>
    <div class="db-footer">
      <span>空值设计会直接影响流程判断与统计口径</span><span>07</span>
    </div>
  </Slide>
</template>

<notes lang="md">
重点回答“能不能全部用一个空值”：不能，因为业务后果不同。例如 0 个 GPU 是明确不需要 GPU，而 NULL 可能表示资源规格尚未选择。将两者混淆会影响校验、统计和调度。SQL 对 NULL 使用三值逻辑，也需要 IS NULL 判断。
</notes>
