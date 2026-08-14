<script setup lang="ts">
import DatabaseCaseStory from "./DatabaseCaseStory.vue";
</script>

<template>
  <Slide class="db-slide">
    <div class="db-kicker">ER 建模第 3 步 · 建立实体清单</div>
    <h2 data-node="title">根据候选实体，先建立九张表的空壳</h2>
    <div data-node="case-evolution" class="db-case-evolution">
      <DatabaseCaseStory />
      <div class="db-case-work">
        <h3>逻辑实体：先写职责，再映射成关系表</h3>
        <div class="db-grid-3" style="gap: 10px">
          <div class="db-card blue" style="padding: 13px">
            <b>workspace</b>
            <p class="db-small">工作空间</p>
          </div>
          <div class="db-card blue" style="padding: 13px">
            <b>project</b>
            <p class="db-small">工作空间内的项目</p>
          </div>
          <div class="db-card teal" style="padding: 13px">
            <b>project_member</b>
            <p class="db-small">用户在项目中的成员关系</p>
          </div>
          <div class="db-card blue" style="padding: 13px">
            <b>task_template</b>
            <p class="db-small">模板的稳定身份</p>
          </div>
          <div class="db-card teal" style="padding: 13px">
            <b>template_version</b>
            <p class="db-small">一次模板发布</p>
          </div>
          <div class="db-card orange" style="padding: 13px">
            <b>task</b>
            <p class="db-small">用户的一次任务提交</p>
          </div>
          <div class="db-card yellow" style="padding: 13px">
            <b>task_input</b>
            <p class="db-small">任务的一条输入</p>
          </div>
          <div class="db-card red" style="padding: 13px">
            <b>task_run</b>
            <p class="db-small">任务的一次执行尝试</p>
          </div>
          <div class="db-card" style="padding: 13px">
            <b>run_event / artifact</b>
            <p class="db-small">状态变化 / 结果文件</p>
          </div>
        </div>
        <table class="db-table compact" style="margin-top: 15px">
          <thead>
            <tr>
              <th>为什么拆开</th>
              <th>故事依据</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>模板与版本</td>
              <td>S2：一个模板多次发布，历史任务引用原版本</td>
            </tr>
            <tr>
              <td>任务与输入</td>
              <td>S3：一个任务有一个或多个输入</td>
            </tr>
            <tr>
              <td>任务与运行</td>
              <td>S5：失败重试会产生新的运行</td>
            </tr>
            <tr>
              <td>运行与事件/文件</td>
              <td>S6、S7：一次运行有多条状态变化和多个文件</td>
            </tr>
          </tbody>
        </table>
        <div class="db-band" style="margin-top: 13px">
          <strong>本步只确定职责：</strong>后续逐组建立关系并填写字段。
        </div>
      </div>
    </div>
    <div class="db-footer">
      <span>先确保每张表都能用一句话说明</span><span>15</span>
    </div>
  </Slide>
</template>

<notes lang="md">
先建立空表清单，让听众看到整个模型的组成。表名不是凭空出现，每一次拆分都引用 S2、S3、S5、S6、S7 的数量或历史要求。
</notes>
