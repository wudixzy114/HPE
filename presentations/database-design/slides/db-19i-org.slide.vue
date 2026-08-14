<template>
  <Slide class="db-slide">
    <div class="db-kicker">Mermaid ER Diagram · 组织、成员与模板</div>
    <h2 data-node="title">
      先看组织侧：每条关系两端都标明 1 与 N，子表框中直接标出 FK
    </h2>

    <div data-node="organization-er" class="db-mermaid-panel">
      <img
        class="db-mermaid-img"
        src="../assets/er/organization.svg"
        alt="组织、项目成员、模板与模板版本的 ER 关系图"
      />
    </div>

    <div data-node="organization-er-legend" class="db-er-legend">
      <div class="db-note">
        <strong>workspace → project</strong><br />一个工作空间包含多个项目；FK
        在 project.workspace_id。
      </div>
      <div class="db-note">
        <strong>project ↔ app_user</strong><br />通过 project_member
        表达多对多成员关系。
      </div>
      <div class="db-note">
        <strong>workspace → template</strong
        ><br />一个工作空间拥有多个任务模板。
      </div>
      <div class="db-note">
        <strong>template → version</strong><br />一个模板发布多个不可变版本。
      </div>
    </div>

    <div class="db-footer">
      <span>Mermaid 标准乌鸦脚：圆圈表示可选，竖线表示 1，三叉表示多</span
      ><span>ER-A</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这是 Mermaid 生成的标准 ER 图。先看关系两端的基数，再看实体框中的 PK、FK、UK。project_member 同时引用 project 和 app_user，用来实现用户与项目的多对多关系。
</notes>
