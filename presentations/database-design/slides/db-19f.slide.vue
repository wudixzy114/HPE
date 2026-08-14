<script setup lang="ts">
import DatabaseCaseStory from "./DatabaseCaseStory.vue";
</script>

<template>
  <Slide class="db-slide">
    <div class="db-kicker">案例演进 13 · 把规则转换成约束</div>
    <h2 data-node="title">需求中的“唯一、必须、只能”分别落到数据库约束</h2>
    <div data-node="case-evolution" class="db-case-evolution">
      <DatabaseCaseStory />
      <div class="db-case-work">
        <h3>规则 → 约束映射</h3>
        <table class="db-table compact">
          <thead>
            <tr>
              <th>故事规则</th>
              <th>数据库设计</th>
              <th>来源</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>模板在工作空间内编码唯一</td>
              <td>UNIQUE(workspace_id, code)</td>
              <td>S2</td>
            </tr>
            <tr>
              <td>同一模板每个版本号唯一</td>
              <td>UNIQUE(template_id, version_no)</td>
              <td>S2</td>
            </tr>
            <tr>
              <td>任务必须引用提交版本</td>
              <td>template_version_id NOT NULL + FOREIGN KEY</td>
              <td>S2、S3</td>
            </tr>
            <tr>
              <td>重复请求只创建一个任务</td>
              <td>UNIQUE(workspace_id, idempotency_key)</td>
              <td>S4</td>
            </tr>
            <tr>
              <td>同一任务输入顺序不重复</td>
              <td>UNIQUE(task_id, input_no)</td>
              <td>S3</td>
            </tr>
            <tr>
              <td>同一任务尝试序号不重复</td>
              <td>UNIQUE(task_id, attempt_no)</td>
              <td>S5</td>
            </tr>
            <tr>
              <td>运行必须属于任务</td>
              <td>task_id NOT NULL + FOREIGN KEY</td>
              <td>S5</td>
            </tr>
            <tr>
              <td>状态只能取六种代码</td>
              <td>CHECK(status IN (...))</td>
              <td>S5</td>
            </tr>
            <tr>
              <td>文件大小不能为负</td>
              <td>CHECK(size_bytes &gt;= 0)</td>
              <td>S7 的“文件大小”</td>
            </tr>
          </tbody>
        </table>
        <div class="db-grid-2" style="margin-top: 14px">
          <div class="db-note">
            <strong>NOT NULL：</strong>用于故事中必须存在的归属和身份。
          </div>
          <div class="db-note">
            <strong>UNIQUE：</strong>必须写清唯一范围，通常要包含 workspace_id
            或父表 ID。
          </div>
        </div>
        <div class="db-band red" style="margin-top: 14px">
          <strong>仍由应用负责：</strong>项目成员是否有提交权限、状态能否从 A
          变到 B、外部执行是否成功。
        </div>
      </div>
    </div>
    <div class="db-footer">
      <span>数据库约束负责基本不变量，业务流程由应用系统完成</span
      ><span>19F</span>
    </div>
  </Slide>
</template>

<notes lang="md">
将原文中的唯一、必须、只能逐项转成约束。权限和状态迁移属于复杂业务规则，不能只依靠普通字段约束，需要应用系统参与。
</notes>
