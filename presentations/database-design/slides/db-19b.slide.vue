<script setup lang="ts">
import DatabaseCaseStory from "./DatabaseCaseStory.vue";
</script>

<template>
  <Slide class="db-slide">
    <div class="db-kicker">案例演进 9 · 建立结果文件</div>
    <h2 data-node="title">
      S7 推导出 task_artifact：一个运行可以产生多个结果文件
    </h2>
    <div data-node="case-evolution" class="db-case-evolution">
      <DatabaseCaseStory />
      <div class="db-case-work">
        <h3>
          <span class="db-source-ref">S7</span>
          文件存储在对象存储，数据库保存可查询元数据
        </h3>
        <div class="db-entity" style="margin-top: 16px">
          <h3>task_artifact</h3>
          <div class="db-field"><span>id</span><em>主键</em></div>
          <div class="db-field"><span>run_id</span><em>属于哪次运行</em></div>
          <div class="db-field">
            <span>artifact_type</span><em>S7 文件类型</em>
          </div>
          <div class="db-field">
            <span>object_key</span><em>S7 对象存储地址</em>
          </div>
          <div class="db-field">
            <span>size_bytes</span><em>S7 文件大小</em>
          </div>
          <div class="db-field">
            <span>created_at</span><em>S7 创建时间</em>
          </div>
        </div>
        <div class="db-flow" style="margin-top: 18px">
          <div class="db-flow-node">
            <b>task_run 9002</b><span>一次成功运行</span>
          </div>
          <div class="db-flow-arrow">1:N</div>
          <div class="db-flow-node">
            <b>REPORT</b><span>reports/9002/summary.pdf</span>
          </div>
          <div class="db-flow-arrow">+</div>
          <div class="db-flow-node">
            <b>DATA</b><span>outputs/9002/result.csv</span>
          </div>
        </div>
        <div class="db-grid-2" style="margin-top: 17px">
          <div class="db-note">
            <strong>为什么不放 task_run 一行：</strong
            >一次运行可产生多个文件，数量不固定。
          </div>
          <div class="db-note">
            <strong>为什么不存大文件：</strong
            >对象存储更适合大文件传输与生命周期管理。
          </div>
        </div>
        <div class="db-band teal" style="margin-top: 14px">
          <strong>关系：</strong>task_run 1 → N task_artifact；artifact.run_id
          是外键。
        </div>
      </div>
    </div>
    <div class="db-footer">
      <span>文件名、哈希等字段只有需求出现时再增加</span><span>19B</span>
    </div>
  </Slide>
</template>

<notes lang="md">
S7 明确给出文件类型、地址、大小和创建时间，因此只使用这些字段。文件名和哈希在当前故事中没有出现，暂不添加，保持字段来源严格。
</notes>
