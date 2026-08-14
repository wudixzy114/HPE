<template>
  <Slide class="db-slide">
    <div class="db-kicker">案例结果 · 最终结构</div>
    <h2 data-node="title">六步完成后，业务故事变成一张可以检查的数据结构图</h2>
    <div
      data-node="final-model"
      style="
        display: grid;
        grid-template-columns: 0.9fr 34px 1fr 34px 1.1fr 34px 1.2fr;
        gap: 9px;
        align-items: center;
        margin-top: 27px;
      "
    >
      <div class="db-stack">
        <div class="db-entity"><h3>workspace</h3></div>
        <div class="db-entity"><h3>project</h3></div>
        <div class="db-entity teal">
          <h3>project_member</h3>
          <div class="db-field"><span>user_id / role</span></div>
        </div>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-stack">
        <div class="db-entity">
          <h3>task_template</h3>
          <div class="db-field"><span>code / name / state</span></div>
        </div>
        <div class="db-entity teal">
          <h3>template_version</h3>
          <div class="db-field"><span>version_no</span></div>
          <div class="db-field"><span>form_schema</span></div>
        </div>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-stack">
        <div class="db-entity orange">
          <h3>task</h3>
          <div class="db-field"><span>project / version</span></div>
          <div class="db-field"><span>name / config</span></div>
        </div>
        <div class="db-entity">
          <h3>task_input</h3>
          <div class="db-field"><span>task_id / input_no</span></div>
        </div>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-stack">
        <div class="db-entity orange">
          <h3>task_run</h3>
          <div class="db-field"><span>attempt_no / status</span></div>
          <div class="db-field"><span>time / error / external_id</span></div>
        </div>
        <div class="db-grid-2" style="gap: 8px">
          <div class="db-entity">
            <h3 style="font-size: 17px">run_event</h3>
            <div class="db-field"><span>按需</span></div>
          </div>
          <div class="db-entity">
            <h3 style="font-size: 17px">artifact</h3>
            <div class="db-field"><span>按需</span></div>
          </div>
        </div>
      </div>
    </div>
    <div data-node="model-check" class="db-grid-3" style="margin-top: 28px">
      <div class="db-card teal">
        <div class="db-label">每张表有一句定义</div>
        <p>
          task 是一次提交；task_run 是一次执行；template_version
          是一次模板发布。
        </p>
      </div>
      <div class="db-card blue">
        <div class="db-label">每段关系有明确数量</div>
        <p>模板有多个版本，任务有多个输入和多次运行。</p>
      </div>
      <div class="db-card orange">
        <div class="db-label">每条规则有落点</div>
        <p>外键保证归属，唯一约束防重复，状态字段支持筛选。</p>
      </div>
    </div>
    <div class="db-band teal">
      <strong>最终检查：</strong
      >同一个事实有一个主要存放位置；需要多条的数据使用子表；历史记录不会被后续更新覆盖。
    </div>
    <div class="db-footer">
      <span>接下来用 1NF～3NF 检查结构是否存在常见问题</span><span>19</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这是案例收束页。图中只保留关键表和关系，不追求展示所有字段。听众应能说出每张表的一句话职责，并能从关系看出为什么需要拆表。
</notes>
