<template>
  <Slide class="db-slide">
    <div class="db-kicker">完整案例 · 用户故事 1/3</div>
    <h2 data-node="title">先给需求全文：中台如何创建任务与管理模板</h2>
    <div data-node="story-create" class="db-grid-2" style="margin-top: 22px">
      <div class="db-story">
        <p>
          <span class="db-badge">01</span>
          用户属于一个或多个工作空间，进入工作空间后选择项目。
        </p>
        <p>
          <span class="db-badge">02</span>
          项目由多个成员共同使用，成员在不同项目中的角色可能不同。
        </p>
        <p>
          <span class="db-badge">03</span>
          用户从模板中心选择一个已发布模板；草稿模板不可提交任务。
        </p>
        <p>
          <span class="db-badge">04</span>
          模板有稳定编码和名称，但表单结构会发布多个版本。
        </p>
        <p>
          <span class="db-badge">05</span>
          已发布模板版本不可原地修改；更新表单时发布新版本。
        </p>
        <p>
          <span class="db-badge">06</span>
          历史任务必须按提交时使用的模板版本解释。
        </p>
      </div>
      <div class="db-story">
        <p>
          <span class="db-badge blue">07</span>
          用户填写任务名称、优先级、输入数据、资源规格和模板特有参数。
        </p>
        <p>
          <span class="db-badge blue">08</span>
          一个任务可能有一个或多个输入，每个输入有顺序、用途和提交时来源快照。
        </p>
        <p>
          <span class="db-badge blue">09</span>
          不同任务类型的特有参数差异较大，但项目、提交人、状态等字段相同。
        </p>
        <p>
          <span class="db-badge blue">10</span>
          同一工作空间内任务名称允许重复，但模板编码必须唯一。
        </p>
        <p>
          <span class="db-badge blue">11</span>
          用户连续点击或网络重试，不能创建两个相同任务。
        </p>
        <p>
          <span class="db-badge blue">12</span> 提交成功后返回公开任务
          ID；内部连续 ID 不直接出现在 URL。
        </p>
      </div>
    </div>
    <div class="db-band">
      <strong>先不要建表：</strong
      >圈出名词、动作、数量词、不可变规则和“历史必须保持”的描述。
    </div>
    <div class="db-footer">
      <span>用户故事是建模输入，不是页面控件列表</span><span>12</span>
    </div>
  </Slide>
</template>

<notes lang="md">
完整读需求时先不讨论字段。名词是候选对象，动作暗示生命周期，数量词暗示一对多，“不可修改”“历史必须保持”暗示版本与快照。工作空间、项目成员关系和模板版本都已经埋在故事中。
</notes>
