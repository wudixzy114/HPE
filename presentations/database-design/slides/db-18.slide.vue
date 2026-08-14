<script setup lang="ts">
import DatabaseCaseStory from "./DatabaseCaseStory.vue";
</script>

<template>
  <Slide class="db-slide">
    <div class="db-kicker">ER 建模第 6 步 · 分配属性（Attribute）</div>
    <h2 data-node="title">S3、S4 推导出 task 和 task_input</h2>
    <div data-node="case-evolution" class="db-case-evolution">
      <DatabaseCaseStory />
      <div class="db-case-work">
        <h3>
          <span class="db-source-ref">S3–S4</span>
          一次提交是一条任务，多条输入分别保存
        </h3>
        <div class="db-grid-2" style="margin-top: 17px">
          <div class="db-entity orange">
            <h3>task</h3>
            <div class="db-field"><span>id</span><em>内部主键</em></div>
            <div class="db-field">
              <span>public_id</span><em>S3 公开 ID</em>
            </div>
            <div class="db-field">
              <span>workspace_id</span><em>S3 工作空间</em>
            </div>
            <div class="db-field"><span>project_id</span><em>S3 项目</em></div>
            <div class="db-field">
              <span>template_version_id</span><em>S3 模板版本</em>
            </div>
            <div class="db-field"><span>name / priority</span><em>S3</em></div>
            <div class="db-field"><span>config</span><em>S3 参数快照</em></div>
            <div class="db-field">
              <span>submitter_id / created_at</span><em>S3</em>
            </div>
            <div class="db-field">
              <span>current_status</span><em>S8 列表状态</em>
            </div>
            <div class="db-field">
              <span>idempotency_key</span><em>S4 请求键</em>
            </div>
          </div>
          <div class="db-entity">
            <h3>task_input</h3>
            <div class="db-field"><span>id</span><em>主键</em></div>
            <div class="db-field"><span>task_id</span><em>外键</em></div>
            <div class="db-field">
              <span>input_no</span><em>S3 输入顺序</em>
            </div>
            <div class="db-field"><span>source_id</span><em>S3 数据源</em></div>
            <div class="db-field">
              <span>input_role</span><em>S3 输入用途</em>
            </div>
          </div>
        </div>
        <div class="db-grid-2" style="margin-top: 14px">
          <div class="db-note">
            <strong>S4：</strong>idempotency_key
            用于识别同一次提交，唯一约束在后续步骤统一补充。
          </div>
          <div class="db-note">
            <strong>S3 的 1:N：</strong>一个任务有一个或多个输入；input_no
            表示顺序，task_input 通过 task_id 属于任务。
          </div>
        </div>
      </div>
    </div>
    <div class="db-footer">
      <span>source_id 的具体外键目标由平台数据源设计决定</span><span>18</span>
    </div>
  </Slide>
</template>

<notes lang="md">
task 字段逐项引用 S3 和 S4。资源规格和模板参数统一进入 config，因为故事没有要求按其中字段高频查询。task_input 的 input_no、source_id、input_role 都直接来自“数据源、顺序和用途”。
</notes>
