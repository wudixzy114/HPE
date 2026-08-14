<template>
  <Slide class="db-slide">
    <div class="db-kicker">设计原则 · 范式总览</div>
    <h2 data-node="title">范式帮助我们把同一事实放在合适的位置，并减少重复</h2>
    <div
      data-node="normal-form-overview"
      class="db-grid-3"
      style="margin-top: 34px"
    >
      <div class="db-card teal">
        <div class="db-number">1NF</div>
        <h3 style="margin-top: 15px">多条数据分成多行</h3>
        <p style="margin-top: 10px">
          避免 input_1、input_2、input_3，也避免把多个 ID 拼成一个字符串。
        </p>
        <div class="db-pills" style="margin-top: 16px">
          <span class="db-pill teal">解决重复列</span
          ><span class="db-pill teal">支持任意数量</span>
        </div>
      </div>
      <div class="db-card blue">
        <div class="db-number" style="color: var(--db-blue)">2NF</div>
        <h3 style="margin-top: 15px">关系字段依赖完整关系</h3>
        <p style="margin-top: 10px">
          项目成员的角色由“项目 + 用户”共同决定；项目名称只属于项目。
        </p>
        <div class="db-pills" style="margin-top: 16px">
          <span class="db-pill blue">检查关系表</span
          ><span class="db-pill blue">减少重复</span>
        </div>
      </div>
      <div class="db-card orange">
        <div class="db-number" style="color: var(--db-orange)">3NF</div>
        <h3 style="margin-top: 15px">主数据放回自己的表</h3>
        <p style="margin-top: 10px">
          任务保存 project_id，项目名称保存在 project 中，改名只更新一处。
        </p>
        <div class="db-pills" style="margin-top: 16px">
          <span class="db-pill orange">唯一来源</span
          ><span class="db-pill orange">控制修改范围</span>
        </div>
      </div>
    </div>
    <div
      data-node="normalization-purpose"
      class="db-grid-2"
      style="margin-top: 27px"
    >
      <div class="db-note">
        <strong>主要目标：</strong
        >一个事实只维护一份；一个对象可以独立创建、修改和删除；新增数量时无需不断加列。
      </div>
      <div class="db-note">
        <strong>使用方法：</strong>先完成业务建模，再按 1NF、2NF、3NF
        逐层检查。大多数产品场景掌握这三层已经足够。
      </div>
    </div>
    <div class="db-footer">
      <span>先理解每一层解决的具体问题，再记名称</span><span>20</span>
    </div>
  </Slide>
</template>

<notes lang="md">
先用一页给出三层全景。每层只记一个动作：多条拆成多行；关系字段依赖完整关系；主数据回到自己的表。随后三页分别用案例展开。
</notes>
