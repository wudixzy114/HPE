<template>
  <div class="db-case-story">
    <div class="db-case-story-title">固定用户故事 · S1～S4</div>
    <div class="story-legend">
      <span class="story-entity">实体 / 外部引用</span>
      <span class="story-action">动作</span>
      <span class="story-attribute">属性</span>
      <span class="story-rule">约束 / 数量规则</span>
    </div>
    <p>
      <span class="db-source">S1</span>用户在已有的<span class="story-entity"
        >项目</span
      >中， <span class="story-action">选择</span>一个<span class="story-rule"
        >已发布</span
      >的
      <span class="story-entity">任务模板</span
      >。用户和项目由其他模块维护，任务模块只保存
      <span class="story-attribute">user_id</span> 和
      <span class="story-attribute">project_id</span>。
    </p>
    <p>
      <span class="db-source">S2</span>用户填写<span class="story-attribute"
        >任务名称</span
      >、 <span class="story-attribute">优先级</span>和<span class="story-rule"
        >一个或多个</span
      >
      <span class="story-entity">输入</span>，然后<span class="story-action"
        >提交任务</span
      >。 每个输入包含<span class="story-attribute"
        >数据源 ID、输入顺序和用途</span
      >。系统创建一条 <span class="story-entity">任务</span>，记录<span
        class="story-attribute"
        >模板 ID、提交人、项目、提交时间和请求键</span
      >；
      <span class="story-rule">同一个请求键重复提交时，只能创建一个任务</span>。
    </p>
    <p>
      <span class="db-source">S3</span>任务创建后，系统立即<span
        class="story-action"
        >创建第 1 次运行</span
      >。 <span class="story-entity">运行</span>会经历<span
        class="story-attribute"
        >排队、运行、成功或失败</span
      >。 失败后可以<span class="story-action">重试</span>；<span
        class="story-rule"
        >一个任务可以有多次运行，每次重试新增一条运行记录</span
      >， 记录<span class="story-attribute"
        >尝试序号、状态、开始时间、结束时间和错误信息</span
      >。
    </p>
    <p>
      <span class="db-source">S4</span>任务列表可以按<span
        class="story-attribute"
        >项目、当前状态和创建时间</span
      >
      <span class="story-action">筛选</span>，并按创建时间倒序分页；详情页<span
        class="story-action"
        >查看</span
      >
      任务信息、全部输入和历次运行。
    </p>
  </div>
</template>
