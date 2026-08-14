<template>
  <Slide class="db-slide">
    <div class="db-kicker">完整案例 · 用户故事 3/3</div>
    <h2 data-node="title">查询、权限、审计、删除和数据增长同样属于需求</h2>
    <div data-node="story-query" class="db-grid-2" style="margin-top: 22px">
      <div class="db-story">
        <p>
          <span class="db-badge">25</span>
          列表按工作空间、项目、模板、提交人、状态和创建时间筛选。
        </p>
        <p>
          <span class="db-badge">26</span>
          默认按创建时间倒序；同一时间的记录仍要稳定分页。
        </p>
        <p>
          <span class="db-badge">27</span>
          详情展示任务提交配置、全部输入、每次运行和每次状态变化。
        </p>
        <p>
          <span class="db-badge">28</span>
          创建人可查看自己的任务；项目管理员可查看项目内全部任务。
        </p>
        <p>
          <span class="db-badge">29</span>
          任务中可能包含敏感连接信息，列表和日志不可返回明文。
        </p>
        <p>
          <span class="db-badge">30</span>
          所有取消、重试和参数变更需要记录操作者、时间和原因。
        </p>
      </div>
      <div class="db-story">
        <p>
          <span class="db-badge blue">31</span>
          用户可以归档任务，但运行历史按平台保留策略继续保存。
        </p>
        <p>
          <span class="db-badge blue">32</span> 运行事件在线保留 180
          天，之后归档；任务主记录保留 3 年。
        </p>
        <p>
          <span class="db-badge blue">33</span> 单工作空间预计每年 500
          万任务，运行次数约为任务数的 1.3 倍。
        </p>
        <p>
          <span class="db-badge blue">34</span> 峰值提交 80 次/秒，列表读取 600
          次/秒，外部回调 300 次/秒。
        </p>
        <p>
          <span class="db-badge blue">35</span>
          大批量导出必须异步生成文件，不能长时间占用在线请求。
        </p>
        <p>
          <span class="db-badge blue">36</span>
          提交成功后必须立即可见；统计报表允许分钟级延迟。
        </p>
      </div>
    </div>
    <div class="db-band teal">
      <strong>建模不只回答“存什么”：</strong
      >权限决定拆分和脱敏，查询决定索引，保留期决定分区与归档，一致性要求决定读写路径。
    </div>
    <div class="db-footer">
      <span>容量和保留策略必须在设计时出现</span><span>14</span>
    </div>
  </Slide>
</template>

<notes lang="md">
第三段把经常被漏掉的非功能需求放回业务故事。没有查询条件就无法设计索引；没有保留期就无法判断事件表是否需要分区归档；没有“提交后立即可见”就无法判断能不能从有延迟的只读副本查询。
</notes>
