<template>
  <Slide class="db-slide">
    <div class="db-kicker">JSON · 灵活配置</div>
    <h2 data-node="title">稳定、常查的字段放普通列；随模板变化的参数放 JSON</h2>
    <div data-node="json-layout" class="db-grid-2" style="margin-top: 29px">
      <div class="db-card teal">
        <div class="db-label">普通数据库列</div>
        <h3>所有任务都共有，并且经常查询</h3>
        <div class="db-pills" style="margin-top: 17px">
          <span class="db-pill teal">workspace_id</span
          ><span class="db-pill teal">project_id</span
          ><span class="db-pill teal">submitter_id</span
          ><span class="db-pill teal">status</span
          ><span class="db-pill teal">priority</span
          ><span class="db-pill teal">created_at</span>
        </div>
        <ul>
          <li>类型和空值规则清楚。</li>
          <li>可以添加外键、唯一和范围约束。</li>
          <li>适合筛选、排序和统计。</li>
        </ul>
      </div>
      <div class="db-card blue">
        <div class="db-label">JSON 配置</div>
        <h3>不同模板各自拥有的参数</h3>
        <div class="db-code" style="margin-top: 17px">
          {<br />
          <span class="good">"source_type"</span>: "TABLE",<br />
          <span class="good">"timeout_minutes"</span>: 30,<br />
          <span class="good">"quality_rules"</span>: ["NOT_NULL"]<br />}
        </div>
        <ul>
          <li>结构会随任务类型或模板版本变化。</li>
          <li>通常整份读取后交给执行系统。</li>
          <li>必须记录 schema_version 并在提交时校验。</li>
        </ul>
      </div>
    </div>
    <div data-node="json-decisions" class="db-grid-3" style="margin-top: 22px">
      <div class="db-note"><strong>需要外键：</strong>使用普通列。</div>
      <div class="db-note">
        <strong>经常筛选统计：</strong>使用普通列或专门结构。
      </div>
      <div class="db-note">
        <strong>模板特有且变化快：</strong>适合进入 JSON。
      </div>
    </div>
    <div class="db-band red">
      <strong>避免整张表只剩一个 JSON：</strong
      >工作空间、项目、状态、提交人等核心信息需要清晰的列和约束。
    </div>
    <div class="db-footer">
      <span>JSON 仍然有结构，只是结构由模板版本管理</span><span>10</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这页只保留普通列与 JSON 的核心边界。动态配置指不同模板拥有不同参数，或者参数随版本演进。JSON 需要 Schema 和版本；核心归属、状态与高频查询字段继续使用普通列。
</notes>
