<template>
  <Slide class="db-slide">
    <div class="db-kicker">Mermaid ER Diagram · 最终全景</div>
    <h2 data-node="title">最终全景只显示实体与关系，用乌鸦脚直接表达一对多</h2>

    <div data-node="overview-er" class="db-mermaid-panel overview">
      <img
        class="db-mermaid-img"
        src="../assets/er/overview.svg"
        alt="中台任务案例最终 ER 关系全景图"
      />
    </div>

    <div
      data-node="overview-reading"
      class="db-grid-3"
      style="margin-top: 12px"
    >
      <div class="db-note">
        <strong>阅读方向：</strong
        >关系名称写在线上；两端符号说明各自允许的数量。
      </div>
      <div class="db-note">
        <strong>查看字段：</strong>前两页详细图在实体框中列出 PK、FK
        和业务字段。
      </div>
      <div class="db-note">
        <strong>主链路：</strong>模板版本 → 任务 → 运行 → 状态事件 / 结果文件。
      </div>
    </div>

    <div class="db-footer">
      <span>这张图用于看全局；字段与外键请结合前两张详细 ER 图</span
      ><span>19I</span>
    </div>
  </Slide>
</template>

<notes lang="md">
全景页只展示实体和关系，避免字段让图过密。Mermaid 使用标准乌鸦脚基数，不使用含义模糊的普通箭头。前两页分别提供组织模板侧和任务执行侧的字段详情。
</notes>
