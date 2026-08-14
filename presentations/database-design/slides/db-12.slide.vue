<template>
  <Slide class="db-slide">
    <div class="db-kicker">完整案例 · 一段自然语言需求</div>
    <h2 data-node="title">用户在中台提交任务，系统负责执行、重试和保留记录</h2>
    <div data-node="user-story" class="db-story-large" style="margin-top: 26px">
      用户进入一个<span class="db-highlight blue">工作空间</span
      >，选择其中的<span class="db-highlight blue">项目</span
      >。项目成员可以从<span class="db-highlight">模板</span
      >中心选择一个已经发布的模板，填写<span class="db-highlight yellow"
        >任务名称、优先级、一个或多个输入、资源规格和模板特有参数</span
      >，然后提交任务。模板以后可能升级，但历史任务需要继续使用提交时的<span
        class="db-highlight"
        >模板版本</span
      >和配置。<br /><br />
      提交成功后，系统创建一次<span class="db-highlight orange">运行</span
      >并交给外部系统执行。运行会经历排队、运行、成功、失败或取消；失败后可以按原配置重试，因此一个任务可能有多次运行。每次运行都要保存开始结束时间、外部任务编号、错误信息、状态变化和产生的文件。用户重复点击提交时，只能创建一个任务。<br /><br />
      任务列表需要按项目、提交人、模板、状态和创建时间筛选；详情页要展示提交配置、全部输入和历次运行。任务与运行长期保存，数量会持续增长。
    </div>
    <div class="db-band">
      <strong>阅读方法：</strong
      >蓝色表示归属，绿色表示独立对象，黄色表示候选字段，橙色表示会重复发生的过程。
    </div>
    <div class="db-footer">
      <span>先理解事物如何流转，再开始画表</span><span>12</span>
    </div>
  </Slide>
</template>

<notes lang="md">
先完整讲完故事，让大家建立整体画面。用户从工作空间进入项目，选择模板并填写任务；提交后产生运行；失败后重试会产生新的运行。高亮只帮助观察，不要求听众当场记住所有字段。
</notes>
