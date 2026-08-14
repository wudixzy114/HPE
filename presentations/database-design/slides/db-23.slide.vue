<template>
  <Slide class="db-slide">
    <div class="db-kicker">
      数据库规范化 · 第三范式（3NF / Third Normal Form）
    </div>
    <h2 data-node="title">任务保存 project_id，项目名称只在 project 中维护</h2>
    <div
      data-node="third-normal-form"
      class="db-grid-2"
      style="margin-top: 28px"
    >
      <div class="db-card red">
        <div class="db-label">大量任务重复项目名称</div>
        <div class="db-code">
          <span class="bad">task</span>(<br />
          id,<br />
          project_id,<br />
          project_name,<br />
          workspace_name,<br />
          task_name<br />)
        </div>
        <p style="margin-top: 15px">
          项目改名时需要更新所有任务。漏掉部分记录后，同一个 project_id
          会显示多个名称。
        </p>
      </div>
      <div class="db-card teal">
        <div class="db-label">项目名称只有一个来源</div>
        <div class="db-code">
          <span class="good">workspace</span>(id, name)<br /><br /><span
            class="good"
            >project</span
          >(id, workspace_id, name)<br /><br /><span class="good">task</span
          >(id, project_id, task_name)
        </div>
        <p style="margin-top: 15px">
          项目改名只更新 project 一行。任务通过 project_id 查询项目名称。
        </p>
      </div>
    </div>
    <div data-node="third-benefits" class="db-grid-3" style="margin-top: 23px">
      <div class="db-note"><strong>修改简单：</strong>项目改名只更新一处。</div>
      <div class="db-note">
        <strong>独立存在：</strong>项目还没有任务时也能先创建。
      </div>
      <div class="db-note">
        <strong>删除安全：</strong>删除最后一条任务不会丢失项目信息。
      </div>
    </div>
    <div class="db-band teal">
      <strong>核心原则：</strong
      >项目名称属于项目，用户邮箱属于用户，模板名称属于模板。任务只保存这些对象的稳定
      ID。
    </div>
    <div class="db-footer">
      <span>3NF 主要减少主数据在业务明细中的重复</span><span>23</span>
    </div>
  </Slide>
</template>

<notes lang="md">
第三范式通过“项目改名”解释。任务只保存 project_id；项目名称在 project 中维护。这样修改范围小，项目也能独立创建和删除。
</notes>
