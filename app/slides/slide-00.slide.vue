<template>
  <Slide class="slide dark">
    <div style="margin-top: 80px">
      <h1 data-node="title">
        Claude Code 的五块拼图<br /><span style="color: #efba4b"
          >架构 · 循环 · 记忆 · 权限 · 扩展</span
        >
      </h1>
    </div>
    <div data-node="four-keys-1" class="four-keys" style="margin-top: 54px">
      <div class="key k1">
        <div class="num">1</div>
        <b>架构总览</b
        ><span
          >先给一张整体地图：模型只出主意，真把事办了的是外面那层
          runtime，分哪几层？</span
        >
      </div>
      <div class="key k2">
        <div class="num">2</div>
        <b>循环与配置</b
        ><span
          >都知道它是个循环。可这一圈里，它到底替我们干了哪些看不见的活？配置又在开场定了什么？</span
        >
      </div>
      <div class="key k3">
        <div class="num">3</div>
        <b>上下文与记忆</b
        ><span>凭什么能一直聊？窗口里到底装了啥？聊到很长，质量会不会掉？</span>
      </div>
      <div class="key k4">
        <div class="num">4</div>
        <b>工具与权限</b
        ><span>这轮授的权，换个对话、换个子代理、换个 Hook，还算数吗？</span>
      </div>
      <div class="key k5">
        <div class="num">5</div>
        <b>Hook 与扩展</b
        ><span
          >Skill 到底怎么写？官方有没有例子？Hook / MCP 怎么最快接进来？</span
        >
      </div>
    </div>
    <div class="foot"><span></span><span>← → 翻页 · N 讲稿 · F 全屏</span></div>
  </Slide>
</template>

<notes lang="md">
轻松开场。今天目标两条：一，把我天天用、却看不见的底层机制讲明白；二，讲完你能用得更好。所以不背功能列表，分五块来讲、围着几个我们心里其实没底的问题——先看整体架构分几层，再讲循环里到底替我们干了啥、它凭什么能一直聊、这轮授的权换个对话还算不算数、Skill 和 Hook/MCP 到底怎么最快接进来。每块最后都落到一页实操应用。
</notes>
