<template>
  <Slide class="slide application-slide">
    <div class="top">
      <div class="kicker">五、Hook 与扩展</div>
      <div class="chapter">45 / 49</div>
    </div>
    <h2 data-node="title">应用：怎么给自己的 Claude Code 接上团队的东西？</h2>
    <p data-node="subtitle" class="subtitle">
      讲完五种扩展、Hook
      三步、Skill、MCP，落到实操：从个人到团队，按什么顺序接、接完怎么共享。
    </p>
    <div data-node="grid-1" class="grid three" style="margin-top: 34px">
      <div class="card">
        <div class="label">01 · 先接高频低歧义</div>
        <p>
          <b>Skill / 只读 MCP</b><br />重复 checklist 打成
          Skill；代码索引、知识库用 MCP，一条 <code>claude mcp add</code>。
        </p>
      </div>
      <div class="card">
        <div class="label">02 · 治理用 Hook</div>
        <p>
          <b>PostToolUse / PreToolUse</b><br />改完自动格式化、提交前
          lint、危险命令二次确认；记住 Hook 以你全权限跑、无沙箱。
        </p>
      </div>
      <div class="card">
        <div class="label">03 · 共享给团队</div>
        <p>
          <b>提交 git / 打 Plugin</b><br /><code>.claude/skills</code
          >、<code>.claude/agents</code>、<code>.mcp.json</code>
          提交仓库；跨项目复用打成 Plugin 走 marketplace。
        </p>
      </div>
    </div>
    <div class="band purple-band" style="margin-top: 30px">
      <b>本节落地：</b
      >接得多不是本事——每接一个都有认证、权限、上下文噪音成本；先接高频、少歧义、可审计的。
    </div>
    <div class="foot">
      <span>应用页 · Hook 与扩展 · 后续补团队实际接入清单</span><span>45</span>
    </div>
  </Slide>
</template>

<notes lang="md">
应用页（骨架）。应用：怎么给自己的 Claude Code 接上团队的东西？ 先固定排布与小节落点，后续补入团队真实案例、命令与截图。
</notes>
