<template>
  <Slide class="db-slide">
    <div class="db-kicker">
      数据库规范化 · 第一范式（1NF / First Normal Form）
    </div>
    <h2 data-node="title">一个任务有多个输入时，用 task_input 保存多行</h2>
    <div
      data-node="first-normal-form-definition"
      class="db-note"
      style="margin-top: 10px; padding: 9px 13px"
    >
      <strong>范式原话（简）：</strong
      >每个属性的取值域只包含原子值；每个属性在一行中只有一个值。
    </div>
    <div
      data-node="first-normal-form"
      class="db-grid-2"
      style="margin-top: 14px"
    >
      <div class="db-card red">
        <div class="db-label">问题结构</div>
        <div class="db-code">
          <span class="bad">task</span>(<br />
          id,<br />
          input_1,<br />
          input_2,<br />
          input_3<br />)<br /><br />或 input_ids = "12,18,31"
        </div>
        <ul>
          <li>最多只能保存固定数量。</li>
          <li>无法给每个输入增加外键。</li>
          <li>无法保存每个输入的顺序和用途。</li>
          <li>查询某个输入被哪些任务使用很困难。</li>
        </ul>
      </div>
      <div class="db-card teal">
        <div class="db-label">推荐结构</div>
        <div class="db-code">
          <span class="good">task</span>(id, name, ...)<br /><br /><span
            class="good"
            >task_input</span
          >(<br />
          id,<br />
          task_id,<br />
          input_no,<br />
          dataset_id,<br />
          input_role<br />)
        </div>
        <ul>
          <li>输入数量可以自然增长。</li>
          <li>dataset_id 可以添加外键。</li>
          <li>task_id + input_no 可以保证顺序唯一。</li>
          <li>每个输入可以继续增加自己的字段。</li>
        </ul>
      </div>
    </div>
    <div class="db-band">
      <strong>识别信号：</strong>字段名出现
      _1、_2、_3，或一个字段里用逗号保存多个值，通常需要改成子表多行。
    </div>
    <div class="db-footer">
      <span>1NF 主要解决重复列和多值字段</span><span>21</span>
    </div>
  </Slide>
</template>

<notes lang="md">
第一范式只讲一个直观规则：会重复出现的值改成多行。任务输入是最清晰的例子。这样数量可以扩展，关系可以约束，每条输入也能拥有自己的属性。
</notes>
