<template>
  <Slide class="slide">
    <div class="top">
      <div class="kicker">五、Hook 与扩展</div>
      <div class="chapter">36 / 49</div>
    </div>
    <h2 data-node="title">怎么给我的 Claude Code 加 Hook？三步</h2>
    <p data-node="subtitle" class="subtitle">
      直接回答"具体怎么操作"：<b>选作用域 → 写结构 → 存盘即生效</b
      >。全程就是编辑一个 <code>settings.json</code>。
    </p>
    <div data-node="grid-1" class="grid two" style="margin-top: 12px">
      <div>
        <div data-node="code-1" class="code-cap">
          <b>第 1 步</b>　选作用域，打开对应的 settings.json
        </div>
        <div data-node="code-2" class="code">
          <span class="c"># 只给自己用（所有项目）</span>
          ~/.claude/settings.json
          <span class="c"># 给团队共享（提交 git，进版本库）</span>
          .claude/settings.json
          <span class="c"># 只本机本项目（不提交，覆盖上面）</span>
          .claude/settings.local.json
        </div>
        <div class="hint">
          优先级高到低：<b>managed（组织）</b> → local → project →
          user；权限规则是<b>合并</b>不是整个覆盖。
        </div>
        <div data-node="code-3" class="code-cap" style="margin-top: 14px">
          <b>第 2 步</b>　按结构写：事件 → matcher → command
        </div>
        <div data-node="code-4" class="code">
          <span class="k">"hooks"</span>: { <span class="k">"PreToolUse"</span>:
          [{ <span class="k">"matcher"</span>: <span class="s">"Bash"</span>,
          <span class="k">"hooks"</span>: [{ <span class="k">"type"</span>:
          <span class="s">"command"</span>, <span class="k">"command"</span>:
          <span class="s">"my-guard.sh"</span> }] }] }
        </div>
        <div class="hint">
          <code>my-guard.sh</code> 从 stdin 读到 <code>tool_input</code>；命中
          <code>rm</code> 就 <b>exit 2</b> 阻断（stderr 会回给模型），否则
          <b>exit 0</b> 放行。
        </div>
      </div>
      <div>
        <div data-node="code-5" class="code-cap">
          <b>第 3 步</b>　保存即生效（热重载，不用重启）
        </div>
        <div class="band">
          <b>存盘就生效。</b
          >下一次触发该事件时，你的命令就会跑起来——改错了改回来也是当场生效。
        </div>
        <div data-node="code-6" class="code-cap" style="margin-top: 14px">
          想看已经注册了哪些 Hook？
        </div>
        <div data-node="code-7" class="code">
          <span class="cmd">/hooks</span> <span class="c"># 会话里直接输</span>
        </div>
        <div class="band orange-band" style="margin-top: 10px">
          <b>注意：<code>/hooks</code> 是只读浏览器。</b
          >只能<b>查看</b>已注册的事件与命令，<b>不能在里面加</b>——要加还是回去编辑
          settings.json（或直接让 Claude 帮你写进去）。
        </div>
        <div data-node="code-8" class="code-cap" style="margin-top: 14px">
          退出码语义（决定放行还是阻断）
        </div>
        <table data-node="matrix-1" class="matrix">
          <tr>
            <th>exit code</th>
            <th>含义</th>
          </tr>
          <tr>
            <td><code>0</code></td>
            <td>成功放行；stdout 可回填上下文</td>
          </tr>
          <tr>
            <td><code>2</code></td>
            <td><b>阻断</b>，stderr 内容回给模型</td>
          </tr>
          <tr>
            <td>其它非 0</td>
            <td>非阻断（只记录，不拦）</td>
          </tr>
        </table>
        <div class="hint red">
          <b>再强调一次：</b>Hook
          以你的完整权限跑、无确认——别把没验证过的命令写进去。
        </div>
      </div>
    </div>
    <div class="foot">
      <span>加 Hook = 编辑 settings.json 的三步；/hooks 只能看，加靠改文件</span
      ><span>36</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这页直接回答：我想给自己的 Claude Code 加 Hook，具体怎么操作。三步。第一步选作用域、打开对应的 settings.json：只给自己用写 ~/.claude、给团队共享写项目 .claude 并提交 git、只本机本项目写 .local。顺带提优先级：managed 最高，然后 local、project、user，权限相关是合并不是覆盖。第二步按 hooks → 事件名 → matcher → command 的结构写，给一个能直接抄的 PreToolUse 例子：匹配 Bash、命中 rm 就 ask 二次确认。第三步保存即生效,热重载不用重启;想看已经注册了哪些 Hook 就输 /hooks——注意它是只读浏览器,只能看不能在里面加,加还是得编辑文件或让 Claude 帮你写。最后提醒 exit code 语义:0 成功、2 阻断并把 stderr 回给模型,以及别在 Hook 里跑没验证过的命令。
</notes>
