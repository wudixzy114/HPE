<template>
  <Slide class="slide application-slide">
    <div class="top">
      <div class="kicker">二、循环与配置</div>
      <div class="chapter">09 / 49</div>
    </div>
    <h2 data-node="title">应用：把规矩写进配置文件（给你可抄的样例）</h2>
    <p data-node="subtitle" class="subtitle">
      讲完循环、配置、条件规则，落到手上：一份能直接抄的
      <code>.claude/settings.json</code>，加几条当场能敲的命令。
    </p>
    <div
      data-node="grid-1"
      class="grid two"
      style="margin-top: 12px; align-items: start; gap: 26px"
    >
      <div>
        <div data-node="code-1" class="code-cap">
          <code>.claude/settings.json</code>（团队共享，进 git）
        </div>
        <div data-node="code-2" class="code">
          <span class="k">{</span> <span class="k">"model"</span>:
          <span class="s">"claude-opus-4-5"</span>,
          <span class="c">// 改完要重启</span>
          <span class="k">"permissions"</span>: {
          <span class="c">// 改完热更新</span> <span class="k">"allow"</span>:
          [<span class="s">"Bash(npm test *)"</span>],
          <span class="k">"ask"</span>: [<span class="s"
            >"Bash(git push *)"</span
          >], <span class="k">"deny"</span>: [<span class="s"
            >"Read(./.env)"</span
          >] }, <span class="k">"hooks"</span>: {
          <span class="c">// 改完热重载</span>
          <span class="k">"PostToolUse"</span>: [{
          <span class="k">"matcher"</span>: <span class="s">"Edit|Write"</span>,
          <span class="k">"hooks"</span>: [{ <span class="k">"type"</span>:
          <span class="s">"command"</span>, <span class="k">"command"</span>:
          <span class="s">"prettier --write $CLAUDE_FILE_PATHS"</span> }] }] }
          <span class="k">}</span>
        </div>
        <div class="hint">
          个人临时覆盖写 <code>.claude/settings.local.json</code>（不进
          git）；企业硬底线走 managed，谁都盖不掉。
        </div>
      </div>
      <div>
        <div data-node="code-3" class="code-cap">当场能敲的命令</div>
        <div class="cmds">
          <div class="cmdrow">
            <code>Shift+Tab</code
            ><span>循环切换权限模式（Manual / acceptEdits / plan）</span>
          </div>
          <div class="cmdrow">
            <code>/config</code
            ><span>核对当前生效值——不确定哪层盖了哪层，先看它</span>
          </div>
          <div class="cmdrow">
            <code>/permissions</code><span>看每条权限规则来自哪个文件</span>
          </div>
          <div class="cmdrow">
            <code>/memory</code
            ><span>浏览 / 编辑各层 CLAUDE.md，自己挑写哪个作用域</span>
          </div>
          <div class="cmdrow">
            <code>claude --permission-mode plan</code
            ><span>本次启动就进 plan（只读探索）</span>
          </div>
        </div>
        <div class="band purple-band" style="margin-top: 14px">
          <b>本节落地：</b>配置<b>分层写</b>（managed / 项目 /
          个人），按<b>生效方式</b>记住哪些热更新、哪些要重启（<code>model</code>、<code
            >outputStyle</code
          >
          要新会话）。
        </div>
      </div>
    </div>
    <div class="foot">
      <span
        >应用页 · 循环与配置 · 样例字段随版本会变，以 /config 实际显示为准</span
      ><span>09</span>
    </div>
  </Slide>
</template>

<notes lang="md">
应用页——按审核要求，给真配置样例和真命令，不再只给文字卡。左边一份可直接抄的 .claude/settings.json：model、permissions、hooks 三块最常用，注意 model 改完要重启、权限和 hook 热更新。右边给能当场敲的命令：Shift+Tab 切模式、/config 核对生效值、/memory 浏览编辑各层 CLAUDE.md 并挑作用域、--permission-mode 启动参数。落脚：配置分层写、按生效方式记住哪些要重启。这些样例字段随版本会变，以 /config 实际显示为准。
</notes>
