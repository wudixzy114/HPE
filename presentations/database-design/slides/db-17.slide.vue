<template>
  <Slide class="db-slide">
    <div class="db-kicker">建模步骤 3 · 确定关系与数量</div>
    <h2 data-node="title">
      关系不只说“有关联”，还要说明最少几个、最多几个、关系本身有什么属性
    </h2>
    <div
      data-node="relationship-map"
      style="
        display: grid;
        grid-template-columns: 1fr 46px 1fr 46px 1fr;
        gap: 10px;
        align-items: center;
        margin-top: 27px;
      "
    >
      <div class="db-stack">
        <div class="db-entity">
          <h3>workspace</h3>
          <div class="db-field"><span>一个工作空间</span><em>1</em></div>
        </div>
        <div class="db-entity teal">
          <h3>project</h3>
          <div class="db-field"><span>属于工作空间</span><em>N</em></div>
        </div>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-stack">
        <div class="db-entity">
          <h3>template</h3>
          <div class="db-field"><span>拥有版本</span><em>1:N</em></div>
        </div>
        <div class="db-entity teal">
          <h3>template_version</h3>
          <div class="db-field"><span>被任务引用</span><em>1:N</em></div>
        </div>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-stack">
        <div class="db-entity orange">
          <h3>task</h3>
          <div class="db-field"><span>输入</span><em>1:N</em></div>
          <div class="db-field"><span>运行</span><em>1:N</em></div>
        </div>
        <div class="db-grid-2" style="gap: 10px">
          <div class="db-entity"><h3>task_input</h3></div>
          <div class="db-entity"><h3>task_run</h3></div>
        </div>
      </div>
    </div>
    <div data-node="many-to-many" class="db-grid-2" style="margin-top: 22px">
      <div class="db-card blue">
        <div class="db-label">多对多不能直接相连</div>
        <h3>用户 ↔ 项目 → project_member</h3>
        <p style="margin-top: 9px">
          关联表至少包含
          project_id、user_id；角色、加入时间、邀请人、有效期属于这段关系，而不属于用户或项目单独一方。
        </p>
      </div>
      <div class="db-card orange">
        <div class="db-label">可选性也要明确</div>
        <h3>0..N 与 1..N 不一样</h3>
        <p style="margin-top: 9px">
          任务创建时是否必须至少一个输入？运行能否在任务创建后异步产生？答案会决定事务边界、非空和校验位置。
        </p>
      </div>
    </div>
    <div class="db-band red">
      <strong>错误表达：</strong><code>input_ids='12,18,31'</code>
      无法加外键、无法保存每个输入的顺序与用途，也难以高效查询。
    </div>
    <div class="db-footer">
      <span>外键通常放在“多个”的一侧</span><span>17</span>
    </div>
  </Slide>
</template>

<notes lang="md">
关系设计要回答数量和可选性。多对多关系必须通过关系表落地，因为关系本身常有角色和时间等属性。逗号拼接 ID 看似少一张表，实际丢失外键、关系属性、查询和扩展能力。
</notes>
