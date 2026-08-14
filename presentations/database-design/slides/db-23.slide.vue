<template>
  <Slide class="db-slide">
    <div class="db-kicker">设计范式 · 第二范式</div>
    <h2 data-node="title">
      第二范式：关系表中的字段，必须依赖完整关系，而不是只依赖一半
    </h2>
    <div
      data-node="second-normal-form"
      class="db-grid-2"
      style="margin-top: 24px"
    >
      <div class="db-card red">
        <div class="db-label">反例 · 项目成员关系</div>
        <div class="db-code">
          <span class="bad">project_member</span>(<br />
          project_id,<br />
          user_id,<br />
          project_name,<br />
          user_email,<br />
          role_code,<br />
          joined_at<br />)<br /><br />PRIMARY KEY(project_id, user_id)
        </div>
        <table class="db-table compact" style="margin-top: 13px">
          <tbody>
            <tr>
              <td>project_name</td>
              <td>只由 project_id 决定</td>
            </tr>
            <tr>
              <td>user_email</td>
              <td>只由 user_id 决定</td>
            </tr>
            <tr>
              <td>role_code</td>
              <td>由 project_id + user_id 共同决定</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="db-card teal">
        <div class="db-label">正确拆分</div>
        <div class="db-code">
          <span class="good">project</span>(id, name, ...)<br /><br /><span
            class="good"
            >app_user</span
          >(id, email, ...)<br /><br /><span class="good">project_member</span
          >(<br />
          project_id,<br />
          user_id,<br />
          role_code,<br />
          joined_at<br />)
        </div>
        <p style="margin-top: 14px">
          成员角色和加入时间描述的是“这个用户在这个项目中的关系”，因此依赖完整组合键；项目名称与邮箱回到各自权威表。
        </p>
      </div>
    </div>
    <div
      data-node="snapshot-exception"
      class="db-grid-2"
      style="margin-top: 12px"
    >
      <div class="db-note">
        <strong>错误重复：</strong>为了少一次 JOIN，把当前 project_name
        复制到每条成员关系；项目改名时必须更新所有成员。
      </div>
      <div class="db-note">
        <strong>合理快照：</strong>若字段明确叫
        project_name_snapshot，表达“加入当时的项目名称”，它的业务含义已经属于这次关系记录。
      </div>
    </div>
    <div class="db-band" style="margin-top: 12px">
      <strong>判断方法：</strong
      >对于组合键表，逐个问非键字段：只给键的一部分，能否确定这个值？如果能，它通常放错了。
    </div>
    <div class="db-footer">
      <span>第二范式主要检查关系表和组合唯一键</span><span>23</span>
    </div>
  </Slide>
</template>

<notes lang="md">
用项目成员表讲清“依赖完整关系”。项目名称只由项目决定，邮箱只由用户决定，角色才由用户与项目共同决定。快照是例外，但必须更名并重新定义语义，不能把当前值和快照混为一谈。
</notes>
