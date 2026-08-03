<template>
  <Slide class="slide">
    <div class="top">
      <div class="kicker">五、Hook 与扩展</div>
      <div class="chapter">44 / 49</div>
    </div>
    <h2 data-node="title">团队的 git 规则，和我个人的配置怎么共存？</h2>
    <p data-node="subtitle" class="subtitle">
      答案两句：<b>多层是合并不是覆盖</b>；想加个人偏好又不弄脏团队提交的文件，就写进那两个
      <code>*.local</code> / <code>*.local.md</code>——它们天生 gitignore。
    </p>
    <div
      data-node="grid-1"
      class="grid two"
      style="margin-top: 12px; align-items: start; gap: 24px"
    >
      <div>
        <div data-node="code-1" class="code-cap">
          哪些进 git（团队共享）· 哪些留本地（个人）
        </div>
        <table data-node="matrix-1" class="matrix">
          <tr>
            <th>文件</th>
            <th>归属</th>
          </tr>
          <tr>
            <td><code>.claude/settings.json</code></td>
            <td><span class="yes">进 git</span> · 团队权限/hook 规范</td>
          </tr>
          <tr>
            <td><code>CLAUDE.md</code> · <code>.claude/rules/*.md</code></td>
            <td><span class="yes">进 git</span> · 团队指令</td>
          </tr>
          <tr>
            <td><code>.mcp.json</code></td>
            <td><span class="yes">进 git</span> · 团队共享的 MCP</td>
          </tr>
          <tr>
            <td><code>.claude/skills</code> · <code>agents</code></td>
            <td><span class="yes">进 git</span> · 团队能力</td>
          </tr>
          <tr>
            <td><code>.claude/settings.local.json</code></td>
            <td><span class="no">留本地</span> · 你的个人覆盖</td>
          </tr>
          <tr>
            <td><code>CLAUDE.local.md</code></td>
            <td><span class="no">留本地</span> · 你的个人指令</td>
          </tr>
          <tr>
            <td><code>~/.claude/*</code></td>
            <td><span class="no">留本地</span> · 跨项目的个人全局</td>
          </tr>
        </table>
        <div class="band orange-band" style="margin-top: 12px">
          <b>常见踩坑：</b>把个人偏好写进了提交进 git 的
          <code>CLAUDE.md</code>——队友全被你的习惯污染。个人的东西一律放
          <code>CLAUDE.local.md</code> / <code>*.local.json</code>。
        </div>
      </div>
      <div>
        <div data-node="code-2" class="code-cap">
          合并规则：叠加生效，deny 恒赢
        </div>
        <div class="band">
          <b
            >团队 <code>.claude/settings.json</code> + 你的
            <code>~/.claude</code> + <code>.local</code></b
          >
          三份<b>叠起来</b>算，不是谁盖谁。同类规则按层级定，但
          <b>deny 从任意一层都恒赢</b>——所以公司/团队 deny 的东西，你在
          <code>.local</code> 里 allow 也放不开。
        </div>
        <div data-node="code-3" class="code-cap" style="margin-top: 14px">
          陌生项目先过「信任门」
        </div>
        <div class="band red-band">
          <b
            >第一次打开带 <code>.claude/settings.json</code> /
            <code>.mcp.json</code> 的项目会弹信任确认。</b
          >项目里的环境变量等你<b>点了信任才应用</b>——因为恶意项目能用
          <code>settings.json</code> 设个 <code>HTTP_PROXY</code> 劫持你的 OAuth
          流量。没点信任前，只加载 CA 证书等安全项。
        </div>
        <div class="hint" style="margin-top: 10px">
          所以克隆别人的仓库、第一次进，别急着点信任——先扫一眼它的
          <code>.claude/</code> 里写了什么。
        </div>
      </div>
    </div>
    <div class="foot">
      <span
        >团队的进 git、个人的写 .local；deny
        恒赢守住底线；陌生项目先过信任门</span
      ><span>44</span>
    </div>
  </Slide>
</template>

<notes lang="md">
新增页，回答审核最后那个具体问题：自己的 git 配置和团队的 git 规则,通用还是分开?怎么共存?核心两句:一,多层配置是合并不是覆盖——团队的 .claude/settings.json 和你的 ~/.claude、CLAUDE.md 和你的 CLAUDE.local.md,是叠加生效,不是谁把谁整段盖掉;同类规则按层级定,但 deny 从任意层都恒赢。二,想加个人偏好又不弄脏团队提交的文件,就写进 gitignore 的那两个:.claude/settings.local.json 和 CLAUDE.local.md——这俩就是为'个人本机覆盖'设计的。左边一张'哪些进 git、哪些留本地'的清单,把 settings.json/settings.local.json、CLAUDE.md/CLAUDE.local.md、.mcp.json、skills/agents/rules 都归位。右边讲信任门:第一次打开一个带 .claude/settings.json 或 .mcp.json 的项目,会弹信任确认;项目里的 env 变量等到你点了信任才应用——因为恶意项目可能用 settings.json 设个 HTTP_PROXY 劫持你的流量。落脚:团队共享的进 git、个人的写 .local,deny 恒赢保证公司底线不被本地放开,陌生项目先过信任门。
</notes>
