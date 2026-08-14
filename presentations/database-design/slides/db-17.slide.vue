<template>
  <Slide class="db-slide">
    <div class="db-kicker">建模第 5 步 · 建立关系</div>
    <h2 data-node="title">把“一条对多条”画成父表与子表，外键放在多的一侧</h2>
    <div
      data-node="relationship-diagram"
      style="
        display: grid;
        grid-template-columns: 1fr 45px 1fr 45px 1.2fr;
        gap: 12px;
        align-items: center;
        margin-top: 32px;
      "
    >
      <div class="db-stack">
        <div class="db-entity">
          <h3>task_template</h3>
          <div class="db-field"><span>id</span></div>
        </div>
        <div class="db-entity teal">
          <h3>template_version</h3>
          <div class="db-field"><span>template_id</span><em>外键</em></div>
        </div>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-entity orange">
        <h3>task</h3>
        <div class="db-field">
          <span>template_version_id</span><em>外键</em>
        </div>
        <div class="db-field"><span>project_id</span><em>外键</em></div>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-grid-2">
        <div class="db-entity">
          <h3>task_input</h3>
          <div class="db-field"><span>task_id</span><em>外键</em></div>
          <div class="db-field"><span>input_no</span></div>
        </div>
        <div class="db-entity orange">
          <h3>task_run</h3>
          <div class="db-field"><span>task_id</span><em>外键</em></div>
          <div class="db-field"><span>attempt_no</span></div>
        </div>
      </div>
    </div>
    <div data-node="relation-rules" class="db-grid-3" style="margin-top: 30px">
      <div class="db-card teal">
        <div class="db-label">模板 1 → N 版本</div>
        <p>版本表保存 template_id；同一模板内 version_no 唯一。</p>
      </div>
      <div class="db-card blue">
        <div class="db-label">任务 1 → N 输入</div>
        <p>输入表保存 task_id；task_id + input_no 唯一，数量可以自然扩展。</p>
      </div>
      <div class="db-card orange">
        <div class="db-label">任务 1 → N 运行</div>
        <p>运行表保存 task_id；task_id + attempt_no 唯一，每次重试新增一行。</p>
      </div>
    </div>
    <div class="db-band red">
      <strong>避免这种设计：</strong
      ><code>input_id_1、input_id_2、input_id_3</code> 或
      <code>input_ids="12,18,31"</code
      >。它们限制数量，也无法为每个输入保存顺序和用途。
    </div>
    <div class="db-footer">
      <span>多对多关系再增加一张关系表，并把角色等关系属性放进去</span
      ><span>17</span>
    </div>
  </Slide>
</template>

<notes lang="md">
用图说明外键位置。模板版本、任务输入、任务运行都是典型一对多。多对多只需口头补充：用户与项目之间增加 project_member，角色和加入时间放在关系表。
</notes>
