<template>
  <Slide class="slide">
    <div class="top">
      <div class="kicker">五、Hook 与扩展</div>
      <div class="chapter">41 / 49</div>
    </div>
    <h2 data-node="title">自己打一个 Plugin：把一整套打包分发</h2>
    <p data-node="subtitle" class="subtitle">
      Plugin 不是第五种能力，是个<b>打包壳</b>——把前面的 Skill / Hook / MCP /
      子代理装进<b>一个目录</b>，配一个清单，就能跨项目分发、一条命令安装。
    </p>
    <div
      data-node="grid-1"
      class="grid two"
      style="margin-top: 14px; align-items: start; gap: 24px"
    >
      <div>
        <div data-node="code-1" class="code-cap">一个 Plugin 目录长这样</div>
        <div data-node="code-2" class="code">
          my-plugin/ ├─ .claude-plugin/ │ └─ <span class="s">plugin.json</span>
          <span class="c"># 清单：name/version/描述</span> ├─ commands/
          <span class="c"># 斜杠命令（Skill）</span> ├─ agents/
          <span class="c"># 子代理定义</span> ├─ hooks/
          <span class="c"># 生命周期 Hook</span> ├─ skills/
          <span class="c"># 打包的 Skill</span> └─ .mcp.json
          <span class="c"># 要接的 MCP 服务器</span>
        </div>
        <div class="band orange-band" style="margin-top: 14px">
          <b>按约定目录放东西</b>就行——装上后 Claude Code 自动把这些命令 /
          子代理 / Hook / MCP 挂进去。你之前单独写的那些，原样搬进来即可。
        </div>
      </div>
      <div>
        <div data-node="code-3" class="code-cap">分发两步：加市场 → 装</div>
        <div data-node="code-4" class="code">
          <span class="c"># 1. 把一个 git 仓库当作 marketplace 加进来</span>
          <span class="cmd">/plugin marketplace add</span> owner/repo

          <span class="c"># 2. 从这个市场安装某个 plugin</span>
          <span class="cmd">/plugin install</span> my-plugin@repo

          <span class="c"># 浏览 / 管理已装</span>
          <span class="cmd">/plugin</span>
        </div>
        <div class="hint" style="margin-top: 10px">
          用途：团队想把<b>一整套规范 + 工具 + 子代理一次性发给所有仓库</b
          >，就打成 Plugin，省得每个仓库各配一遍。
        </div>
        <div class="band purple-band" style="margin-top: 12px">
          <b>一句话分层：</b
          >单条规矩→CLAUDE.md；一个流程→Skill；一套东西要复用→<b>Plugin</b>。
        </div>
      </div>
    </div>
    <div class="foot">
      <span
        >Plugin = Skill+Hook+MCP+子代理的可分发打包（带 plugin.json 清单，走
        marketplace 安装；版本随官方 plugins 文档变）</span
      ><span>41</span>
    </div>
  </Slide>
</template>

<notes lang="md">
新增页（用户点名要补：怎么打自己的 Plugin，全场之前只提名字没讲怎么做）。核心一句：Plugin 不是第五种能力，是个打包壳——把前面讲的 Skill / Hook / MCP / 子代理装进一个目录，配一个 plugin.json 清单，就能跨项目分发、一条命令安装。左边讲目录长相：根有 .claude-plugin/plugin.json（清单，写 name/version/description），旁边按约定放 commands/ agents/ hooks/ skills/ 和 .mcp.json，Claude Code 装上后自动把这些挂进去。右边讲分发两步：先把一个 git 仓库当 marketplace 加进来（/plugin marketplace add owner/repo），再 /plugin install 名字@marketplace 安装。强调用途：团队想把一整套规范+工具+子代理一次性发给所有仓库，就打成 Plugin，避免每个仓库各配一遍。版本会变，以官方 plugins 文档为准。
</notes>
