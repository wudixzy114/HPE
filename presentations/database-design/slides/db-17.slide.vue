<script setup lang="ts">
import DatabaseCaseStory from "./DatabaseCaseStory.vue";
</script>

<template>
  <Slide class="db-slide">
    <div class="db-kicker">ER 建模第 5 步 · 一对多关系（1:N）</div>
    <h2 data-node="title">S2 推导出模板与模板版本：稳定身份和发布内容分开</h2>
    <div data-node="case-evolution" class="db-case-evolution">
      <DatabaseCaseStory />
      <div class="db-case-work">
        <h3>
          <span class="db-source-ref">S2</span> 模板与版本是一对多关系（1:N）
        </h3>
        <div class="db-flow" style="margin-top: 18px">
          <div class="db-flow-node">
            <b>task_template</b><span>稳定编码、名称和启停状态</span>
          </div>
          <div class="db-flow-arrow">1:N</div>
          <div class="db-flow-node">
            <b>template_version</b><span>每次发布的表单与配置规则</span>
          </div>
        </div>
        <div class="db-grid-2" style="margin-top: 20px">
          <div class="db-entity">
            <h3>task_template</h3>
            <div class="db-field"><span>id</span><em>主键</em></div>
            <div class="db-field">
              <span>workspace_id</span><em>S2 工作空间内</em>
            </div>
            <div class="db-field"><span>code</span><em>S2 唯一编码</em></div>
            <div class="db-field"><span>name</span><em>S2 名称</em></div>
            <div class="db-field"><span>state</span><em>S2 已发布可选</em></div>
          </div>
          <div class="db-entity teal">
            <h3>template_version</h3>
            <div class="db-field"><span>id</span><em>主键</em></div>
            <div class="db-field"><span>template_id</span><em>外键</em></div>
            <div class="db-field">
              <span>version_no</span><em>S2 版本号</em>
            </div>
            <div class="db-field">
              <span>form_schema</span><em>S2 表单结构</em>
            </div>
            <div class="db-field">
              <span>config_schema</span><em>S2 校验规则</em>
            </div>
            <div class="db-field">
              <span>published_at</span><em>S2 发布时间</em>
            </div>
          </div>
        </div>
        <table class="db-table compact" style="margin-top: 17px">
          <thead>
            <tr>
              <th>规则</th>
              <th>数据库落点</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>模板编码在工作空间内唯一</td>
              <td>UNIQUE(workspace_id, code)</td>
            </tr>
            <tr>
              <td>同一模板版本号不重复</td>
              <td>UNIQUE(template_id, version_no)</td>
            </tr>
            <tr>
              <td>历史任务引用提交版本</td>
              <td>task.template_version_id 外键</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="db-footer">
      <span>模板改名不影响版本内容；发布新表单时新增 version 行</span
      ><span>17</span>
    </div>
  </Slide>
</template>

<notes lang="md">
所有字段都能回到 S2。template 保存稳定身份，template_version 保存一次发布内容。任务未来通过 template_version_id 引用提交时版本，因此模板升级不会改变历史任务的解释方式。
</notes>
