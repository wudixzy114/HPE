<template>
  <Slide class="slide">
    <div class="top">
      <div class="kicker">五、Hook 与扩展</div>
      <div class="chapter">34 / 49</div>
    </div>
    <h2 data-node="title">Hook：那些"能用却没人知道"的生命周期点</h2>
    <p data-node="subtitle" class="subtitle">
      Hook
      就是在流程的固定节点上，插一段你自己的命令——确定性执行，不靠模型判断，改完热重载不用重启。很多人不知道有这东西可用。
    </p>
    <div data-node="grid-1" class="grid two" style="margin-top: 14px">
      <div>
        <div data-node="code-1" class="code-cap">常用的生命周期事件</div>
        <table data-node="matrix-1" class="matrix">
          <tr>
            <th>事件</th>
            <th>什么时候触发</th>
          </tr>
          <tr>
            <td><code>PreToolUse</code></td>
            <td>工具执行前 · 可返回 allow / deny / ask</td>
          </tr>
          <tr>
            <td><code>PostToolUse</code></td>
            <td>工具执行后 · 常用来跑格式化 / 测试</td>
          </tr>
          <tr>
            <td><code>UserPromptSubmit</code></td>
            <td>你回车提交后、模型看到前</td>
          </tr>
          <tr>
            <td><code>Stop</code> / <code>SubagentStop</code></td>
            <td>主任务 / 子任务收工时</td>
          </tr>
          <tr>
            <td><code>PreCompact</code> / <code>SessionStart</code></td>
            <td>压缩前 / 会话开始时</td>
          </tr>
        </table>
      </div>
      <div>
        <div data-node="code-2" class="code-cap">
          配置在 settings.json —— 改完文件自动跑 prettier
        </div>
        <div data-node="code-3" class="code">
          <span class="k">"hooks"</span>: {
          <span class="k">"PostToolUse"</span>: [{
          <span class="k">"matcher"</span>: <span class="s">"Edit|Write"</span>,
          <span class="k">"hooks"</span>: [{ <span class="k">"type"</span>:
          <span class="s">"command"</span>, <span class="k">"command"</span>:
          <span class="s">"prettier --write $CLAUDE_FILE_PATHS"</span> }] }] }
        </div>
        <div class="band orange-band" style="margin-top: 14px">
          <b>另外两个高频场景：</b><br />· <code>PreToolUse</code> 匹配
          <code>Read</code> → 命中 <code>.env</code> 就
          <b>deny</b>，守住密钥<br />· <code>PreToolUse</code> 匹配
          <code>Bash</code> → 命中 <code>rm</code> 就
          <b>ask</b>，危险命令二次确认
        </div>
      </div>
    </div>
    <div class="foot">
      <span
        >Hook 是"到点必执行"的确定性规则，适合做治理；别拿它当模型的替代品</span
      ><span>34</span>
    </div>
  </Slide>
</template>

<notes lang="md">
回答哪些生命周期点我能用，却根本不知道。Hook 就是在这些节点上插一段自己的命令，确定性执行，不靠模型判断，而且改完热重载不用重启。左边列常用事件，右边给一个真能抄的配置：改完文件自动跑 prettier。再给两个高频场景：挡住读 .env、rm 命令要二次确认。强调 PreToolUse 能返回 allow/deny/ask，但盖不过硬 deny。
</notes>
