<template>
  <Slide class="db-slide">
    <div class="db-kicker">建模第 1 步 · 从故事中提取信息</div>
    <h2 data-node="title">
      先提取“东西、动作、数量和规则”，暂时不讨论字段类型
    </h2>
    <div data-node="extraction" class="db-grid-4" style="margin-top: 30px">
      <div class="db-card blue">
        <div class="db-label">名词：可能成为表</div>
        <div class="db-pills">
          <span class="db-pill blue">工作空间</span
          ><span class="db-pill blue">项目</span
          ><span class="db-pill blue">成员</span
          ><span class="db-pill blue">模板</span
          ><span class="db-pill blue">版本</span
          ><span class="db-pill blue">任务</span
          ><span class="db-pill blue">输入</span
          ><span class="db-pill blue">运行</span
          ><span class="db-pill blue">文件</span>
        </div>
      </div>
      <div class="db-card teal">
        <div class="db-label">动作：说明生命周期</div>
        <div class="db-pills">
          <span class="db-pill teal">发布模板</span
          ><span class="db-pill teal">提交任务</span
          ><span class="db-pill teal">开始运行</span
          ><span class="db-pill teal">取消</span
          ><span class="db-pill teal">失败</span
          ><span class="db-pill teal">重试</span>
        </div>
      </div>
      <div class="db-card orange">
        <div class="db-label">数量：说明关系</div>
        <div class="db-pills">
          <span class="db-pill orange">多个项目</span
          ><span class="db-pill orange">多个版本</span
          ><span class="db-pill orange">多个输入</span
          ><span class="db-pill orange">多次运行</span
          ><span class="db-pill orange">多个文件</span>
        </div>
      </div>
      <div class="db-card yellow">
        <div class="db-label">规则：说明约束</div>
        <div class="db-pills">
          <span class="db-pill">历史版本保留</span
          ><span class="db-pill">重复提交只建一次</span
          ><span class="db-pill">运行必须属于任务</span
          ><span class="db-pill">按状态筛选</span>
        </div>
      </div>
    </div>
    <div data-node="first-filter" class="db-grid-2" style="margin-top: 24px">
      <div class="db-note">
        <strong>先保留候选：</strong
        >名词只是线索。“优先级”适合作为任务字段；“提交”是动作；“重试”会产生新的运行。
      </div>
      <div class="db-note">
        <strong>下一步再筛选：</strong
        >拥有独立身份、会出现多条、会独立变化或需要历史记录的概念，更适合独立成表。
      </div>
    </div>
    <div class="db-band teal">
      <strong>本页输出：</strong>候选对象清单 + 业务流程 + 数量关系 +
      必须保持的规则。
    </div>
    <div class="db-footer">
      <span>从自然语言提取结构，是建模的起点</span><span>13</span>
    </div>
  </Slide>
</template>

<notes lang="md">
把上一页高亮内容归为四类。名词给出候选表，动作说明数据何时创建和变化，数量词帮助发现一对多，规则最终会转化为唯一、外键、非空或应用校验。
</notes>
