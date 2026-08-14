<script setup lang="ts">
import DatabaseCaseStory from "./DatabaseCaseStory.vue";
</script>

<template>
  <Slide class="db-slide">
    <div class="db-kicker">ER 建模第 6 步 · 用读写路径验证模型</div>
    <h2 data-node="title">
      最后用真实命令和查询验证：能写对、能查快、能解释历史
    </h2>
    <div data-node="access-validation" class="db-case-evolution">
      <DatabaseCaseStory />
      <div class="db-case-work">
        <h3>模型通过业务操作验收</h3>
        <div class="db-rule-list" style="margin-top: 16px">
          <div class="db-rule">
            <span class="db-source-ref">写入</span
            ><span
              ><b>提交：</b>校验模板已发布，事务内写 task、输入和第 1
              次运行；请求键重复则不新建。</span
            >
          </div>
          <div class="db-rule">
            <span class="db-source-ref">追加</span
            ><span
              ><b>重试：</b>新增 task_run，唯一键保护
              attempt_no；历史运行和错误信息全部保留。</span
            >
          </div>
          <div class="db-rule">
            <span class="db-source-ref">查询</span
            ><span
              ><b>列表：</b>按 project_id、current_status、created_at
              分页；详情按 task_id 读取输入与运行。</span
            >
          </div>
        </div>
        <div class="db-grid-2" style="margin-top: 16px">
          <div class="db-note">
            <strong>候选索引：</strong
            ><code>(project_id, current_status, created_at DESC, id DESC)</code>
          </div>
          <div class="db-note">
            <strong>子表索引：</strong>所有外键列可支撑详情读取和关联校验。
          </div>
        </div>
        <div class="db-band teal" style="margin-top: 15px">
          <strong>验收问题：</strong
          >能否防重？重试会否覆盖历史？列表能否按条件分页？每个问题都能回到模型找到答案。
        </div>
      </div>
    </div>
    <div class="db-footer">
      <span>索引来自真实查询；事务边界来自一次业务操作必须同时成立的规则</span
      ><span>19</span>
    </div>
  </Slide>
</template>

<notes lang="md">
模型完成前必须以真实写入与查询验收；发现问题时回到前面的实体、关系或约束步骤调整。
</notes>
