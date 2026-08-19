<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">三 · 工具分工</div>
    <h2 data-node="title">学习节奏不同：概念推导走流式，集中复习走批处理</h2>

    <div data-node="lanes" class="ac-lanes">
      <Step :at="1">
        <section class="ac-lane stream ac-glass">
          <h3>对话式 · 流式学习</h3>
          <div class="mode">概念型学习 / 苏格拉底式提问</div>
          <div class="ac-lane-flow">
            <span>追问</span><span>推导</span><span>反驳</span
            ><span>再建模</span>
          </div>
          <p>
            用 Gemini
            这类世界知识强、长上下文的模型；用苏格拉底式提问，让它一步步引导你自己推导出结论，
            而不是直接给答案。
          </p>
        </section>
      </Step>
      <Step :at="2">
        <section class="ac-lane batch ac-glass">
          <h3>文档式 · 批处理</h3>
          <div class="mode">集中复习 / 新领域速览</div>
          <div class="ac-lane-flow">
            <span>架构图</span><span>接口</span><span>边缘案例</span
            ><span>横向对比</span>
          </div>
          <p>
            让 GPT 一次性生成几千行
            Markdown：架构图、接口定义、边缘案例、横向对比，一口气读完。
            单文件像一道“信息防火墙”，挡住搜索时代的 20
            个网页、广告和推荐流，直接进入深度工作。
          </p>
        </section>
      </Step>
    </div>
    <div class="ac-takeaway" style="margin-top: 20px">
      每个人信息吞吐的节奏不同，<strong>没有最好的工具，只有和你节奏匹配的分工</strong>——需要自己摸索。
    </div>
    <div class="ac-footer">
      <span>三 · 流式与批处理</span><span>13 / 28</span>
    </div>
  </Slide>
</template>

<notes lang="md">
两条轨道并行解释，重点是节奏匹配，而不是具体产品名称。
</notes>
