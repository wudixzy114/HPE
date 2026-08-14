<script setup lang="ts">
import DatabaseCaseStory from "./DatabaseCaseStory.vue";
</script>

<template>
  <Slide class="db-slide">
    <div class="db-kicker">ER 建模第 1 步 · 识别实体与粒度</div>
    <h2 data-node="title">
      有独立身份、生命周期或可重复出现的业务事实，才成为实体
    </h2>
    <div data-node="entity-grain" class="db-case-evolution">
      <DatabaseCaseStory />
      <div class="db-case-work">
        <h3>先判断“是否独立存在”</h3>
        <div class="db-grid-3" style="margin-top: 15px">
          <div class="db-note">
            <strong>身份：</strong>能否单独被引用和定位？
          </div>
          <div class="db-note">
            <strong>生命周期：</strong>会否被创建、变化、结束？
          </div>
          <div class="db-note">
            <strong>重复：</strong>一个父事实下会否有多条？
          </div>
        </div>
        <table class="db-table compact" style="margin-top: 16px">
          <thead>
            <tr>
              <th>业务概念</th>
              <th>行粒度</th>
              <th>结果</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>任务模板</td>
              <td>一条可选择的模板定义</td>
              <td>task_template</td>
            </tr>
            <tr>
              <td>任务</td>
              <td>一次任务提交</td>
              <td>task</td>
            </tr>
            <tr>
              <td>输入 / 运行</td>
              <td>一条输入 / 一次执行尝试</td>
              <td>task_input / task_run</td>
            </tr>
            <tr>
              <td>用户 / 项目 / 数据源</td>
              <td>由其他模块主数据管理</td>
              <td>外部 ID 引用</td>
            </tr>
            <tr>
              <td>提交 / 重试 / 名称</td>
              <td>动作或描述，不独立存在</td>
              <td>命令或属性</td>
            </tr>
          </tbody>
        </table>
        <div class="db-band teal" style="margin-top: 14px">
          <strong>结论：</strong
          >四张核心表不是因为名词刚好有四个，而是它们的粒度、生命周期和重复性不同。
        </div>
      </div>
    </div>
    <div class="db-footer">
      <span>先定义每行代表的业务事实，后续字段与约束才有归属</span
      ><span>14</span>
    </div>
  </Slide>
</template>

<notes lang="md">
实体不是名词清单；每个实体必须有清楚的行粒度和独立存在理由。
</notes>
