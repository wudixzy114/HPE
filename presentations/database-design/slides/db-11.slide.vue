<template>
  <Slide class="db-slide">
    <div class="db-kicker">高频公共字段</div>
    <h2 data-node="title">公共字段不是复制模板：每一个都要有明确职责</h2>
    <table
      data-node="common-field-table"
      class="db-table dense"
      style="margin-top: 23px"
    >
      <thead>
        <tr>
          <th>字段</th>
          <th>职责</th>
          <th>设计注意点</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>id</code> / <code>public_id</code></td>
          <td>内部身份 / 外部身份</td>
          <td>全系统类型尽量统一；生成后不可变、不复用</td>
        </tr>
        <tr>
          <td><code>workspace_id</code></td>
          <td>租户归属边界</td>
          <td>通常进入查询、唯一约束和权限校验；只加字段并不自动实现隔离</td>
        </tr>
        <tr>
          <td><code>created_at/by</code></td>
          <td>创建时刻与主体</td>
          <td>主体可能是用户、系统或服务账号；时间由服务端或数据库生成</td>
        </tr>
        <tr>
          <td><code>updated_at/by</code></td>
          <td>最后一次修改</td>
          <td>只记录最后一次，不能替代完整审计历史；明确自动维护机制</td>
        </tr>
        <tr>
          <td><code>version</code></td>
          <td>乐观锁版本</td>
          <td>受保护更新时原子加一，并在 WHERE 中校验旧版本</td>
        </tr>
        <tr>
          <td><code>deleted_at</code></td>
          <td>逻辑删除时刻</td>
          <td>只有确实需要恢复或保留时添加；同时设计唯一、查询与清理规则</td>
        </tr>
        <tr>
          <td><code>remark</code></td>
          <td>有明确用途的备注</td>
          <td>定义谁填写、用途、长度和敏感性；不要变成万能垃圾字段</td>
        </tr>
      </tbody>
    </table>
    <div data-node="naming-rules" class="db-grid-2" style="margin-top: 18px">
      <div class="db-note">
        <strong>命名表达语义：</strong><code>timeout_seconds</code>、<code
          >size_bytes</code
        >
        写明单位；<code>submitted_at</code>、<code>started_at</code> 写明动作。
      </div>
      <div class="db-note">
        <strong>不要每表机械复制：</strong>追加型事件通常不需要
        updated_at；纯关系表不一定需要 deleted_at；审计要求高时仅有 updated_by
        不够。
      </div>
    </div>
    <div class="db-band">
      <strong>数据字典至少记录：</strong
      >业务定义、类型、可空、单位、范围、来源、负责人、敏感等级和修改规则。
    </div>
    <div class="db-footer">
      <span>公共字段越高频，越需要统一语义</span><span>11</span>
    </div>
  </Slide>
</template>

<notes lang="md">
强调公共字段也不是脚手架无脑生成。事件表追加后通常不修改，updated_at 没有意义；逻辑删除会增加所有查询和唯一约束复杂度。命名中写单位可以避免 timeout=30 到底是秒还是分钟。
</notes>
