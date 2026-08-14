<script setup lang="ts">
import DatabaseCaseStory from "./DatabaseCaseStory.vue";
</script>

<template>
  <Slide class="db-slide">
    <div class="db-kicker">业务行为建模 · Command / Event / Query</div>
    <h2 data-node="title">
      动作要按业务语义分类：命令改变状态，事件记录事实，查询只读取
    </h2>
    <div data-node="case-evolution" class="db-case-evolution">
      <DatabaseCaseStory />
      <div class="db-case-work">
        <h3>故事中的业务行为全集</h3>
        <table class="db-table compact">
          <thead>
            <tr>
              <th>原文行为</th>
              <th>专业分类</th>
              <th>是否产生持久化变化</th>
              <th>来源</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>进入工作空间、选择项目、选择模板</td>
              <td>导航 / 查询 Query</td>
              <td>否；读取已有数据</td>
              <td>S1、S2</td>
            </tr>
            <tr>
              <td>发布模板版本</td>
              <td>命令 Command</td>
              <td>创建 template_version</td>
              <td>S2</td>
            </tr>
            <tr>
              <td>提交任务</td>
              <td>命令 Command</td>
              <td>创建 task、task_input 和第 1 次 task_run</td>
              <td>S3、S4、S5</td>
            </tr>
            <tr>
              <td>网络重试同一请求</td>
              <td>重复命令 / 幂等请求</td>
              <td>不新增 task，返回原结果</td>
              <td>S4</td>
            </tr>
            <tr>
              <td>按原配置重试</td>
              <td>命令 Command</td>
              <td>为原 task 创建新 task_run</td>
              <td>S5</td>
            </tr>
            <tr>
              <td>修改输入或参数后重新提交</td>
              <td>命令 Command</td>
              <td>创建新 task 及其输入和首次运行</td>
              <td>S5</td>
            </tr>
            <tr>
              <td>运行进入排队、运行、成功、失败或取消</td>
              <td>领域事件 Domain Event</td>
              <td>更新 task_run.status；S6 要求时追加 run_event</td>
              <td>S5、S6</td>
            </tr>
            <tr>
              <td>产生结果文件</td>
              <td>领域事件 Domain Event</td>
              <td>创建 task_artifact</td>
              <td>S7</td>
            </tr>
            <tr>
              <td>列表筛选、查看详情</td>
              <td>查询 Query</td>
              <td>否；决定索引和读模型</td>
              <td>S8</td>
            </tr>
          </tbody>
        </table>
        <div class="db-grid-3" style="margin-top: 13px">
          <div class="db-note">
            <strong>Command</strong><br />表达“希望系统做什么”
          </div>
          <div class="db-note">
            <strong>Domain Event</strong><br />表达“业务上已经发生什么”
          </div>
          <div class="db-note">
            <strong>Query</strong><br />读取信息，不改变业务状态
          </div>
        </div>
      </div>
    </div>
    <div class="db-footer">
      <span>动作不能只提取动词，需要结合对象、条件和结果形成完整业务行为</span
      ><span>14A</span>
    </div>
  </Slide>
</template>

<notes lang="md">
动作不能机械地圈单个动词。专业做法是整理成完整业务行为，并区分 Command、Domain Event 和 Query。这个分类会直接决定事务边界、事件表、幂等规则与查询索引。
</notes>
