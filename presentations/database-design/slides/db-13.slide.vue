<script setup lang="ts">
import DatabaseCaseStory from "./DatabaseCaseStory.vue";
</script>

<template>
  <Slide class="db-slide">
    <div class="db-kicker">ER 建模的标准路径</div>
    <h2 data-node="title">
      先抽取业务事实，再依次确定实体、动作、关系、属性与约束
    </h2>
    <div data-node="model-method" class="db-case-evolution">
      <DatabaseCaseStory />
      <div class="db-case-work">
        <h3>概念模型 → 逻辑模型</h3>
        <div class="db-rule-list" style="margin-top: 15px">
          <div class="db-rule">
            <span class="db-source-ref">01</span
            ><span
              ><b>实体与粒度</b><br />每张表的一行到底代表什么业务事实？</span
            >
          </div>
          <div class="db-rule">
            <span class="db-source-ref">02</span
            ><span
              ><b>动作与状态</b
              ><br />哪些动作创建、改变或追加事实；何时保留历史？</span
            >
          </div>
          <div class="db-rule">
            <span class="db-source-ref">03</span
            ><span
              ><b>关系与基数</b
              ><br />两端各有几个，是否可缺省，外键放在哪里？</span
            >
          </div>
          <div class="db-rule">
            <span class="db-source-ref">04</span
            ><span
              ><b>属性与依赖</b
              ><br />字段只描述所属那一行事实；重复事实拆成子实体。</span
            >
          </div>
          <div class="db-rule">
            <span class="db-source-ref">05</span
            ><span
              ><b>约束与访问验证</b
              ><br />用键、事务和真实读写路径证明模型可执行。</span
            >
          </div>
        </div>
        <div class="db-band teal" style="margin-top: 14px">
          <strong>交付顺序：</strong>概念 ER（实体、关系）→
          逻辑表设计（字段、键）→ 物理实现（约束、索引）。
        </div>
      </div>
    </div>
    <div class="db-footer">
      <span>顺序可以回溯，但不要先画表再补业务理由</span><span>13</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这是一条通用顺序：先理解事实，再将其转换成可验证的关系模型。
</notes>
