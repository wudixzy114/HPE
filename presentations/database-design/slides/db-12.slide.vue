<script setup lang="ts">
import DatabaseCaseStory from "./DatabaseCaseStory.vue";
</script>

<template>
  <Slide class="db-slide">
    <div class="db-kicker">完整案例 · 第 0 步：定义建模边界</div>
    <h2 data-node="title">ER 图先回答“本模块负责什么”，再讨论要建哪些表</h2>
    <div data-node="case-boundary" class="db-case-evolution">
      <DatabaseCaseStory />
      <div class="db-case-work">
        <h3>本案例的建模契约</h3>
        <div class="db-grid-2" style="margin-top: 16px">
          <div class="db-card teal">
            <div class="db-label">本模块拥有</div>
            <h3>模板、任务、输入、运行</h3>
            <p>只为这些事实设计实体、状态和历史。</p>
          </div>
          <div class="db-card blue">
            <div class="db-label">外部模块拥有</div>
            <h3>用户、项目、数据源</h3>
            <p>只保存稳定 ID，不复制对方主数据。</p>
          </div>
        </div>
        <div class="db-card orange" style="margin-top: 15px">
          <div class="db-label">本轮明确不设计</div>
          <p>权限、模板版本、运行事件、文件产物；需求出现时再扩展为新实体。</p>
        </div>
        <div class="db-band teal" style="margin-top: 16px">
          <strong>建模对象：</strong
          >稳定的业务事实，而不是页面、接口或每个出现过的名词。
        </div>
      </div>
    </div>
    <div class="db-footer">
      <span>边界先行，避免把别的模块和未来需求塞进当前 ER 图</span
      ><span>12</span>
    </div>
  </Slide>
</template>

<notes lang="md">
先锁定边界；ER 模型只覆盖当前模块拥有的业务事实。
</notes>
