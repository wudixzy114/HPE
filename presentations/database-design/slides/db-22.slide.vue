<template>
  <Slide class="db-slide">
    <div class="db-kicker">
      数据库规范化 · 第二范式（2NF / Second Normal Form）
    </div>
    <h2 data-node="title">项目成员表只保存“用户在这个项目中的信息”</h2>
    <div
      data-node="second-normal-form"
      class="db-grid-2"
      style="margin-top: 28px"
    >
      <div class="db-card red">
        <div class="db-label">混在一起</div>
        <div class="db-code">
          <span class="bad">project_member</span>(<br />
          project_id,<br />
          user_id,<br />
          project_name,<br />
          user_email,<br />
          role_code,<br />
          joined_at<br />)
        </div>
        <table class="db-table compact" style="margin-top: 13px">
          <tbody>
            <tr>
              <td>project_name</td>
              <td>只由项目决定</td>
            </tr>
            <tr>
              <td>user_email</td>
              <td>只由用户决定</td>
            </tr>
            <tr>
              <td>role_code</td>
              <td>由项目 + 用户共同决定</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="db-card teal">
        <div class="db-label">各归其位</div>
        <div class="db-code">
          <span class="good">project</span>(id, name)<br /><br /><span
            class="good"
            >app_user</span
          >(id, email)<br /><br /><span class="good">project_member</span
          >(<br />
          project_id,<br />
          user_id,<br />
          role_code,<br />
          joined_at<br />)
        </div>
        <p style="margin-top: 14px">
          角色和加入时间描述“某个用户在某个项目中的关系”；项目名称与用户邮箱分别回到各自表中。
        </p>
      </div>
    </div>
    <div class="db-band">
      <strong>检查方法：</strong
      >关系表使用组合键时，逐个检查其他字段。只给组合键的一部分就能确定的字段，通常应该放回对应主表。
    </div>
    <div class="db-footer">
      <span>2NF 主要检查多对多关系表</span><span>22</span>
    </div>
  </Slide>
</template>

<notes lang="md">
用用户与项目的关系说明第二范式。role_code 由用户和项目共同决定，适合放在 project_member；project_name 只由项目决定，应该回到 project 表。
</notes>
