<template>
  <Slide class="db-slide">
    <div class="db-kicker">案例结果 · 最终结构</div>
    <h2 data-node="title">
      最终不是“一张任务表”，而是一组各自表达单一事实的表
    </h2>
    <div
      data-node="final-model"
      style="
        display: grid;
        grid-template-columns: 0.72fr 32px 0.95fr 32px 1.05fr 32px 1.2fr;
        gap: 8px;
        align-items: center;
        margin-top: 22px;
      "
    >
      <div class="db-stack">
        <div class="db-entity"><h3>workspace</h3></div>
        <div class="db-entity"><h3>project</h3></div>
        <div class="db-entity teal">
          <h3>project_member</h3>
          <div class="db-field"><span>role / joined_at</span></div>
        </div>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-stack">
        <div class="db-entity">
          <h3>task_template</h3>
          <div class="db-field"><span>code / current state</span></div>
        </div>
        <div class="db-entity teal">
          <h3>template_version</h3>
          <div class="db-field"><span>form_schema</span></div>
          <div class="db-field"><span>config_schema</span></div>
        </div>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-stack">
        <div class="db-entity orange">
          <h3>task</h3>
          <div class="db-field"><span>提交事实 / config</span></div>
          <div class="db-field"><span>current_status</span></div>
        </div>
        <div class="db-entity">
          <h3>task_input</h3>
          <div class="db-field"><span>input_no / snapshot</span></div>
        </div>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-stack">
        <div class="db-entity orange">
          <h3>task_run</h3>
          <div class="db-field"><span>attempt_no / status</span></div>
          <div class="db-field"><span>external_job_id</span></div>
        </div>
        <div class="db-grid-2" style="gap: 8px">
          <div class="db-entity">
            <h3 style="font-size: 17px">run_event</h3>
            <div class="db-field"><span>追加历史</span></div>
          </div>
          <div class="db-entity">
            <h3 style="font-size: 17px">artifact</h3>
            <div class="db-field"><span>对象 key</span></div>
          </div>
        </div>
        <div class="db-entity teal">
          <h3>outbox_event</h3>
          <div class="db-field"><span>待投递事件</span></div>
        </div>
      </div>
    </div>
    <table
      data-node="table-responsibilities"
      class="db-table compact"
      style="margin-top: 18px"
    >
      <thead>
        <tr>
          <th>表</th>
          <th>只负责什么</th>
          <th>最关键约束</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>template_version</td>
          <td>一个不可变模板版本</td>
          <td>UNIQUE(template_id, version_no)</td>
        </tr>
        <tr>
          <td>task</td>
          <td>用户一次提交及其快照</td>
          <td>防重复键、租户归属、模板版本外键</td>
        </tr>
        <tr>
          <td>task_run</td>
          <td>一次实际执行尝试</td>
          <td>UNIQUE(task_id, attempt_no)；外部 ID 唯一</td>
        </tr>
        <tr>
          <td>run_event</td>
          <td>一次状态变化或外部回调</td>
          <td>外部事件去重，只追加</td>
        </tr>
      </tbody>
    </table>
    <div class="db-band teal">
      <strong>设计完成的判断标准：</strong
      >每张表能用一句话说明；同一事实有唯一权威位置；业务不变量能找到约束或事务落点。
    </div>
    <div class="db-footer">
      <span>接下来用范式检查这组结构是否存在重复与依赖问题</span><span>21</span>
    </div>
  </Slide>
</template>

<notes lang="md">
最终图是前面六步的结果，不是凭经验直接画出来。逐项回顾：版本表解决历史解释，输入表解决多值，运行表解决重试，事件表解决过程历史，outbox 解决数据库与外部系统之间的可靠投递。
</notes>
