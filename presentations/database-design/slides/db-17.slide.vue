<script setup lang="ts">
import DatabaseCaseStory from "./DatabaseCaseStory.vue";
</script>

<template>
  <Slide class="db-slide">
    <div class="db-kicker">ER 建模第 4 步 · 按粒度分配属性</div>
    <h2 data-node="title">
      字段归属取决于“它描述哪一条事实”，不是页面上和谁摆在一起
    </h2>
    <div data-node="attribute-grain" class="db-case-evolution">
      <DatabaseCaseStory />
      <div class="db-case-work">
        <h3>属性只依赖所属实体的主键</h3>
        <div class="db-grid-2" style="margin-top: 15px">
          <div class="db-entity">
            <h3>task_template</h3>
            <div class="db-field"><span>name</span><em>模板名称</em></div>
            <div class="db-field"><span>state</span><em>可选状态</em></div>
          </div>
          <div class="db-entity orange">
            <h3>task</h3>
            <div class="db-field">
              <span>template_id / user_id / project_id</span
              ><em>一次提交的归属</em>
            </div>
            <div class="db-field">
              <span>name / priority / created_at</span><em>提交事实</em>
            </div>
            <div class="db-field">
              <span>current_status</span><em>列表用当前快照</em>
            </div>
          </div>
        </div>
        <div class="db-grid-2" style="margin-top: 15px">
          <div class="db-entity">
            <h3>task_input</h3>
            <div class="db-field">
              <span>source_id / input_no / input_role</span
              ><em>一条输入事实</em>
            </div>
          </div>
          <div class="db-entity teal">
            <h3>task_run</h3>
            <div class="db-field">
              <span>attempt_no / status</span><em>一次尝试</em>
            </div>
            <div class="db-field">
              <span>started_at / finished_at / error_message</span
              ><em>本次结果</em>
            </div>
          </div>
        </div>
        <div class="db-band teal" style="margin-top: 15px">
          <strong>关键分离：</strong>task_run 保存历次尝试；task.current_status
          是面向列表的当前摘要，不替代历史。
        </div>
      </div>
    </div>
    <div class="db-footer">
      <span>字段依赖哪条业务事实，就落在哪个实体；多值与历史事实拆行保存</span
      ><span>17</span>
    </div>
  </Slide>
</template>

<notes lang="md">
属性分配以实体粒度为依据；重复或历史性质的字段不能塞回父表或 JSON。
</notes>
