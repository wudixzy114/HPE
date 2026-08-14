<template>
  <Slide class="db-slide">
    <div class="db-kicker">设计范式 · 第一范式</div>
    <h2 data-node="title">
      第一范式：不要把“可重复的一组值”塞进一个字段或固定数量的列
    </h2>
    <div
      data-node="first-normal-form"
      class="db-grid-2"
      style="margin-top: 24px"
    >
      <div class="db-card red">
        <div class="db-label">反例</div>
        <div class="db-code">
          <span class="bad">task</span>(<br />
          id,<br />
          input_table_1,<br />
          input_table_2,<br />
          input_table_3<br />)<br /><br /><span class="bad">或</span
          ><br />input_ids = "12,18,31"
        </div>
        <ul>
          <li>输入数量被限制为 3 个，扩容要改表。</li>
          <li>逗号字符串无法逐个加外键和类型约束。</li>
          <li>查询“引用数据 18 的任务”只能解析字符串。</li>
          <li>无法为每个输入保存用途、顺序和快照。</li>
        </ul>
      </div>
      <div class="db-card teal">
        <div class="db-label">正确拆分</div>
        <div class="db-code">
          <span class="good">task</span>(id, name, ...)<br /><br /><span
            class="good"
            >task_input</span
          >(<br />
          id,<br />
          task_id,<br />
          input_no,<br />
          dataset_id,<br />
          input_role,<br />
          source_snapshot<br />)
        </div>
        <ul>
          <li>输入数量自然扩展为 0..N。</li>
          <li>每个 dataset_id 可加外键。</li>
          <li><code>UNIQUE(task_id, input_no)</code> 保证序号。</li>
          <li>关系自己的属性有明确位置。</li>
        </ul>
      </div>
    </div>
    <div data-node="json-caveat" class="db-band">
      <strong>JSON 不等于自动违反第一范式：</strong
      >若它被当作一个版本化配置整体、无需承担关键关联和逐项强约束，可以合理使用；关键是不能借
      JSON 逃避需要独立管理的多值关系。
    </div>
    <div class="db-footer">
      <span>识别信号：字段名出现 _1/_2/_3，或值中出现分隔符</span
      ><span>22</span>
    </div>
  </Slide>
</template>

<notes lang="md">
第一范式用最实用的方式解释：重复组不要横向展开，也不要拼成一个字符串。核心不是背“原子性”，而是让每个需要独立约束、关联和查询的值拥有一行。JSON 的使用要看语义，不能机械认为所有 JSON 都违规。
</notes>
