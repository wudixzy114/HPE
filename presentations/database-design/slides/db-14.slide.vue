<script setup lang="ts">
import DatabaseCaseStory from "./DatabaseCaseStory.vue";
</script>

<template>
  <Slide class="db-slide">
    <div class="db-kicker">ER 建模第 2 步 · 判断实体、关联、属性和值对象</div>
    <h2 data-node="title">业务概念经过身份、生命周期、数量和引用四项检查</h2>
    <div data-node="case-evolution" class="db-case-evolution">
      <DatabaseCaseStory />
      <div class="db-case-work">
        <h3>概念 → ER 元素决策矩阵</h3>
        <table class="db-table compact">
          <thead>
            <tr>
              <th>业务概念</th>
              <th>判断依据</th>
              <th>ER 元素</th>
              <th>关系表 / 字段</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>workspace / project / app_user / data_source</td>
              <td>已有稳定身份，被任务中心引用</td>
              <td>引用实体 Referenced Entity</td>
              <td>保存其 ID 或外键</td>
            </tr>
            <tr>
              <td>project_member</td>
              <td>由 project + user 唯一确定，拥有 role</td>
              <td>关联实体 Associative Entity</td>
              <td>project_member 表</td>
            </tr>
            <tr>
              <td>task_template</td>
              <td>稳定身份，可独立启停和发布</td>
              <td>实体 Entity</td>
              <td>task_template 表</td>
            </tr>
            <tr>
              <td>template_version</td>
              <td>一个模板多条，发布后需保留</td>
              <td>弱实体 / 子实体</td>
              <td>template_version 表</td>
            </tr>
            <tr>
              <td>task</td>
              <td>一次提交，有公开 ID 和独立生命周期</td>
              <td>事务实体 Transaction Entity</td>
              <td>task 表</td>
            </tr>
            <tr>
              <td>task_input / task_run / artifact</td>
              <td>一个父对象下出现多条，各自有属性</td>
              <td>子实体 Child Entity</td>
              <td>各自子表</td>
            </tr>
            <tr>
              <td>task_run_event</td>
              <td>已经发生且需要按时间追加保存</td>
              <td>事件实体 Event Entity</td>
              <td>事件表</td>
            </tr>
            <tr>
              <td>priority / status / external_job_id / time</td>
              <td>没有独立身份，依附一个实体</td>
              <td>属性 Attribute</td>
              <td>所属表中的列</td>
            </tr>
            <tr>
              <td>resource_spec / template_config</td>
              <td>整体描述一次提交，无独立生命周期</td>
              <td>值对象 Value Object</td>
              <td>config JSON 或结构化列</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="db-footer">
      <span>四项检查：身份、生命周期、数量、引用</span><span>14</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这页给出完整且稳定的概念分类。不是所有名词都成为表：状态和优先级是属性，资源规格与模板参数是值对象，客户端与外部执行系统是参与者，已有主数据是引用实体。
</notes>
