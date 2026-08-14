<script setup lang="ts">
import DatabaseCaseStory from "./DatabaseCaseStory.vue";
</script>

<template>
  <Slide class="db-slide">
    <div class="db-kicker">ER 建模第 1 步 · 确定建模边界与业务概念全集</div>
    <h2 data-node="title">先确定“任务中心负责什么”，再盘点完整业务概念</h2>
    <div data-node="case-evolution" class="db-case-evolution">
      <DatabaseCaseStory />
      <div class="db-case-work">
        <h3>任务中心 Bounded Context · 概念清单</h3>
        <table class="db-table compact">
          <thead>
            <tr>
              <th>分类</th>
              <th>完整概念</th>
              <th>来源</th>
              <th>当前建模决策</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>引用的主数据</strong></td>
              <td>
                工作空间 workspace、项目 project、用户 app_user、数据源
                data_source
              </td>
              <td>S1、S3</td>
              <td>任务中心保存这些对象的 ID；主数据详情由相应模块维护</td>
            </tr>
            <tr>
              <td><strong>关联概念</strong></td>
              <td>项目成员关系 project_member、成员角色 role_code</td>
              <td>S1</td>
              <td>关联实体；连接 project 与 app_user</td>
            </tr>
            <tr>
              <td><strong>模板概念</strong></td>
              <td>任务模板 task_template、模板版本 template_version</td>
              <td>S2</td>
              <td>任务中心实体；模板拥有多个版本</td>
            </tr>
            <tr>
              <td><strong>提交概念</strong></td>
              <td>
                任务 task、任务输入 task_input、请求键
                request_key、资源规格、模板参数
              </td>
              <td>S3、S4</td>
              <td>task / task_input 为实体；请求键和配置为属性或值对象</td>
            </tr>
            <tr>
              <td><strong>执行概念</strong></td>
              <td>任务运行 task_run、运行状态、外部任务编号、错误信息</td>
              <td>S5</td>
              <td>task_run 为实体；状态、编号、时间和错误为属性</td>
            </tr>
            <tr>
              <td><strong>过程与结果</strong></td>
              <td>状态变化 task_run_event、结果文件 task_artifact</td>
              <td>S6、S7</td>
              <td>事件实体与结果实体</td>
            </tr>
            <tr>
              <td><strong>外部系统</strong></td>
              <td>客户端、外部执行系统</td>
              <td>S4、S5</td>
              <td>参与者 / 外部系统，不直接映射为本地业务表</td>
            </tr>
          </tbody>
        </table>
        <div class="db-grid-2" style="margin-top: 14px">
          <div class="db-note">
            <strong>Bounded Context：</strong
            >领域驱动设计中的“限界上下文”，用于说明哪个模块拥有某类数据和规则。
          </div>
          <div class="db-note">
            <strong>概念规范化：</strong
            >将“模板”“已发布模板”“模板版本”整理成稳定业务概念，避免按原句逐词建表。
          </div>
        </div>
        <div class="db-band teal" style="margin-top: 13px">
          <strong>本页输出：</strong
          >一份去重、同义词归一、标明所有权的业务概念词典。
        </div>
      </div>
    </div>
    <div class="db-footer">
      <span>ER 建模从业务概念与边界开始，不是机械圈名词</span><span>13</span>
    </div>
  </Slide>
</template>

<notes lang="md">
专业建模先确定任务中心的边界，再建立完整概念词典。原文中的词需要去重、统一名称并区分所有权。workspace、project、user、data_source 是任务中心引用的主数据；模板、任务、运行、事件与文件属于本案例重点建模对象。
</notes>
