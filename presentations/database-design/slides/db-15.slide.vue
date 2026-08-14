<template>
  <Slide class="db-slide">
    <div class="db-kicker">建模步骤 1 · 从文字中提取信息</div>
    <h2 data-node="title">先标记四类词：名词、动作、数量、规则</h2>
    <div data-node="extraction-grid" class="db-grid-4" style="margin-top: 25px">
      <div class="db-card blue">
        <div class="db-label">名词 · 候选实体</div>
        <div class="db-pills">
          <span class="db-pill blue">工作空间</span
          ><span class="db-pill blue">项目</span
          ><span class="db-pill blue">成员</span
          ><span class="db-pill blue">模板</span
          ><span class="db-pill blue">版本</span
          ><span class="db-pill blue">任务</span
          ><span class="db-pill blue">输入</span
          ><span class="db-pill blue">运行</span
          ><span class="db-pill blue">事件</span
          ><span class="db-pill blue">产物</span>
        </div>
      </div>
      <div class="db-card teal">
        <div class="db-label">动作 · 生命周期</div>
        <div class="db-pills">
          <span class="db-pill teal">发布</span
          ><span class="db-pill teal">提交</span
          ><span class="db-pill teal">排队</span
          ><span class="db-pill teal">运行</span
          ><span class="db-pill teal">取消</span
          ><span class="db-pill teal">失败</span
          ><span class="db-pill teal">重试</span
          ><span class="db-pill teal">归档</span>
        </div>
      </div>
      <div class="db-card orange">
        <div class="db-label">数量词 · 关系</div>
        <div class="db-pills">
          <span class="db-pill orange">多个成员</span
          ><span class="db-pill orange">多个版本</span
          ><span class="db-pill orange">多个输入</span
          ><span class="db-pill orange">多次运行</span
          ><span class="db-pill orange">多个产物</span>
        </div>
      </div>
      <div class="db-card red">
        <div class="db-label">规则 · 约束</div>
        <div class="db-pills">
          <span class="db-pill red">不可原地修改</span
          ><span class="db-pill red">不能重复提交</span
          ><span class="db-pill red">状态不能倒退</span
          ><span class="db-pill red">历史必须保留</span
          ><span class="db-pill red">租户不能串联</span>
        </div>
      </div>
    </div>
    <div
      data-node="candidate-filter"
      class="db-grid-2"
      style="margin-top: 22px"
    >
      <div class="db-note">
        <strong>候选实体不等于最终表：</strong
        >“优先级”“状态”“错误原因”是属性；“提交”“重试”可能是动作或事件，不一定各自建表。
      </div>
      <div class="db-note">
        <strong>页面元素不是业务对象：</strong
        >页签、按钮、弹窗、步骤条通常不直接成为表，除非它们背后代表需要保存的业务事实。
      </div>
    </div>
    <div class="db-band">
      <strong>第一步的产物：</strong>候选对象清单 + 业务动作清单 + 数量关系 +
      不可破坏规则。
    </div>
    <div class="db-footer">
      <span>先完整提取，再决定哪些要合并或拆分</span><span>15</span>
    </div>
  </Slide>
</template>

<notes lang="md">
演示如何从三页用户故事中提取结构。不是看到名词就建表，而是先建立候选清单。动作帮助判断状态和事件；数量词帮助判断子表；规则最终会落到数据库约束或事务逻辑。
</notes>
