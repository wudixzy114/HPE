<template>
  <Slide class="slide">
    <div class="top">
      <div class="kicker">五、Hook 与扩展</div>
      <div class="chapter">39 / 49</div>
    </div>
    <h2 data-node="title">MCP：一条命令，把外部系统接成工具</h2>
    <p data-node="subtitle" class="subtitle">
      MCP 把知识库、工单、数据库这些外部系统，包成 Claude
      能统一调用的工具。接入就一条 <code>claude mcp add</code>。
    </p>
    <div data-node="grid-1" class="grid two" style="margin-top: 14px">
      <div>
        <div data-node="code-1" class="code-cap">三种传输类型</div>
        <div data-node="code-2" class="code">
          <span class="c"># HTTP —— 远程，最推荐，支持 OAuth</span>
          <span class="cmd">claude mcp add</span> --transport http notion \
          https://mcp.notion.com/mcp

          <span class="c"># stdio —— 本地进程，注意 -- 后才是启动命令</span>
          <span class="cmd">claude mcp add</span> --transport stdio airtable \
          --env KEY=xxx -- npx -y airtable-mcp

          <span class="c"># sse —— 已弃用，尽量改用 http</span>
        </div>
        <div class="hint">
          接完用 <code>/mcp</code> 看连接状态。工具<b>名</b>启动就在场，完整
          schema 用到才加载。
        </div>
      </div>
      <div>
        <div data-node="code-3" class="code-cap">
          作用域（<code>-s / --scope</code>）= 配置存在哪
        </div>
        <table data-node="matrix-1" class="matrix">
          <tr>
            <th>作用域</th>
            <th>范围 / 存放</th>
          </tr>
          <tr>
            <td>
              local<br /><span style="font-weight: 400; font-size: 14px"
                >(默认)</span
              >
            </td>
            <td>仅你、仅当前项目 · 存 <code>~/.claude.json</code></td>
          </tr>
          <tr>
            <td>project</td>
            <td>
              团队共享 · 写进项目根 <code>.mcp.json</code>，可提交
              git（队友首次需 trust 批准）
            </td>
          </tr>
          <tr>
            <td>user</td>
            <td>你的所有项目通用</td>
          </tr>
        </table>
        <div class="band orange-band" style="margin-top: 14px">
          <b>要给团队共享：</b>用 <code>--scope project</code>，把
          <code>.mcp.json</code> 提交进仓库，队友拉下来就能用。<br /><span
            class="small"
            ><code>.mcp.json</code> 里有 <code>url</code> 就必须写
            <code>type</code>（http / sse），否则报错。</span
          >
        </div>
      </div>
    </div>
    <div class="foot">
      <span
        >从个人到团队：.claude/skills、.claude/agents、.mcp.json 提交
        git；跨项目复用就打成 Plugin 走 marketplace</span
      ><span>39</span>
    </div>
  </Slide>
</template>

<notes lang="md">
回答怎么最快接一个 MCP。一条 claude mcp add 就行。三种传输：http（远程，最推荐，支持 OAuth）、sse（已弃用）、stdio（本地进程，注意 -- 后面才是启动命令）。作用域三种：local 默认只你自己只当前项目、project 写进 .mcp.json 可提交给团队、user 你所有项目通用。/mcp 看连接状态。补一句呼应记忆章：MCP 工具的完整 schema 是按需加载的，接得多主要压的是那 14% 工具定义那块。
</notes>
