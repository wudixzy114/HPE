<template>
  <Slide class="slide">
    <div class="top">
      <div class="kicker">五、Hook 与扩展</div>
      <div class="chapter">32 / 49</div>
    </div>
    <h2 data-node="title">四种扩展点，一句话先分清</h2>
    <p data-node="subtitle" class="subtitle">
      "我想把自己的东西接进去"，第一步是选对扩展点。它们解决的是不同的问题。
    </p>
    <table data-node="exttable-1" class="exttable">
      <tr>
        <th>扩展</th>
        <th>一句话本质</th>
        <th>什么时候用它</th>
      </tr>
      <tr>
        <td>Skill</td>
        <td>打包的提示 / 流程 / 能力（一个目录 + SKILL.md）</td>
        <td>重复粘贴的 checklist、多步流程、领域知识</td>
      </tr>
      <tr>
        <td>MCP</td>
        <td>把外部系统接成工具（统一协议）</td>
        <td>连数据库 / API / SaaS，比如知识库、工单、CI</td>
      </tr>
      <tr>
        <td>Hook</td>
        <td>生命周期事件拦截（确定性执行，不靠模型判断）</td>
        <td>提交前 lint、工具调用前后强制校验</td>
      </tr>
      <tr>
        <td>子代理</td>
        <td>独立上下文的子任务代理（<code>.claude/agents/*.md</code>）</td>
        <td>隔离长任务、专职探索 / 审查，省主上下文</td>
      </tr>
    </table>
    <div class="band purple-band" style="margin-top: 22px">
      <b>别把"接得多"当成功：</b
      >每接一个，都带来认证、权限、可用性和上下文噪音的成本。接下来三页，分别手把手过一遍
      Hook、Skill、MCP。
    </div>
    <div class="foot">
      <span
        >官方已把自定义命令并进 Skill——同一个 /deploy，Skill
        多出支持文件、frontmatter 和自动触发</span
      ><span>32</span>
    </div>
  </Slide>
</template>

<notes lang="md">
第四专题。先把四种扩展点一句话区分清楚，别混成一个。Skill=打包的提示与流程；MCP=接外部系统成为工具；Hook=生命周期拦截；子代理=独立上下文的子任务。后面三页分别手把手讲 Hook、Skill、MCP 怎么写、怎么最快接。（自定义命令官方已并入 Skill，不再单列。）
</notes>
