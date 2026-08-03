<template>
  <Slide class="slide slide-31-density">
    <div class="top">
      <div class="kicker">五、Hook 与扩展</div>
      <div class="chapter">37 / 49</div>
    </div>
    <h2 data-node="title">Hook 到底拿来干嘛？六个真实场景</h2>
    <p data-node="subtitle" class="subtitle">
      机制讲完了，落到"我团队会怎么用"。每个都是<b
        >痛点 → 挂哪个事件 → 命令干啥 → 换来什么</b
      >——不是抽象能力，是能抄的配置。
    </p>
    <div data-node="grid-1" class="grid two" style="margin-top: 12px">
      <div>
        <table data-node="matrix-1" class="matrix">
          <tr>
            <th>业务痛点</th>
            <th>事件 · matcher</th>
            <th>换来什么</th>
          </tr>
          <tr>
            <td>改完代码风格乱、评审全在挑格式</td>
            <td><code>PostToolUse</code><br /><code>Edit|Write</code></td>
            <td>改完自动 lint / format，人不用管</td>
          </tr>
          <tr>
            <td>改了逻辑忘跑测试，坏了才发现</td>
            <td><code>PostToolUse</code><br />（TDD Skill 自动挂）</td>
            <td>改完即测，失败回喂给模型自己修</td>
          </tr>
          <tr>
            <td>合规要"谁在什么时候动了啥"</td>
            <td><code>PostToolUse</code><br /><code>*</code></td>
            <td>每次工具调用记一行，连成审计链</td>
          </tr>
          <tr>
            <td>跑久了不看屏幕，错过要确认的点</td>
            <td><code>Notification</code><br /><code>Stop</code></td>
            <td>要确认 / 收工时推桌面或 Slack</td>
          </tr>
          <tr>
            <td>没过 CI 就想收工交差</td>
            <td><code>Stop</code><br />（阻断）</td>
            <td>CI 没过就<b>不让停</b>，逼它继续</td>
          </tr>
          <tr>
            <td>怕读到 <code>.env</code>、误删文件</td>
            <td>
              <code>PreToolUse</code><br /><code>Read</code>/<code>Bash</code>
            </td>
            <td>命中就 deny / ask，加一道闸</td>
          </tr>
        </table>
        <div class="hint">
          比你以为的多：材料里有 <b>27 个</b>生命周期事件、<b>6 种</b
          >执行器（command / prompt / agent / http / callback / function）——http
          那种能直接打 Slack、CI。
        </div>
      </div>
      <div>
        <div data-node="code-1" class="code-cap">
          审计留痕：每次工具调用追加一行
        </div>
        <div data-node="code-2" class="code">
          <span class="k">"PostToolUse"</span>: [{
          <span class="k">"matcher"</span>: <span class="s">"*"</span>,
          <span class="k">"hooks"</span>: [{ <span class="k">"type"</span>:
          <span class="s">"command"</span>, <span class="k">"command"</span>:
          <span class="s"
            >"echo \"$(date) $TOOL\" &gt;&gt; ~/.claude/audit.log"</span
          >
          }] }]
        </div>
        <div data-node="code-3" class="code-cap" style="margin-top: 14px">
          交作业前必须过 CI：不过就别停
        </div>
        <div data-node="code-4" class="code">
          <span class="k">"Stop"</span>: [{ <span class="k">"hooks"</span>: [{
          <span class="k">"type"</span>: <span class="s">"command"</span>,
          <span class="c">// 测试没过就 exit 2，Claude Code 不让收工</span>
          <span class="k">"command"</span>:
          <span class="s">"npm test || exit 2"</span> }] }]
        </div>
        <div class="band orange-band" style="margin-top: 12px">
          <b>诚实边界：</b>守密钥、拦 <code>rm</code> 用 Hook
          是<b>加一道闸</b>——材料里密钥防护主力是独立的
          <code>secretScanner</code> 层、危险命令是命令 AST
          分析。真要硬约束，还得靠权限系统的 <code>deny</code>。
        </div>
      </div>
    </div>
    <div class="foot">
      <span
        >Hook 的价值在"每次都必须发生"的治理动作：格式化 / 测试 / 审计 / 通知 /
        卡口</span
      ><span>37</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这页是全 Hook 章最要落地的一页：别只讲机制，给六个真能抄的业务场景，每个都是'什么痛点 → 挂哪个事件+matcher → 命令干啥 → 换来什么'。逆向材料里明确点到的：改完自动 lint（材料 §9.1 行19671，command 执行器 spawn 跑 lint/测试脚本）；TDD——一个 Skill 会注册 PostToolUse Hook，每次改完代码自动跑测试，会话级、随 Skill 建了又销（行21328）；审计留痕——记录所有执行过的命令供事后审查，每个决策带 decisionReason 连成完整审计链（行1981/33340/9482）；收工/待确认通知——Notification 事件做桌面通知、外部推送，HTTP 执行器 execHttpHook 能接 Slack/CI（行33576/18278）；交作业前必须过 CI——stop_hook_blocking，Stop Hook 返回阻止继续（比如 CI 没过）就不让收工（行6125）；守密钥/拦危险命令——机制上 PreToolUse 能 deny，但材料把密钥防护归给独立的 secretScanner 层、危险命令归给命令 AST 分析，Hook 是加一道而不是唯一防线。顺带点两个'比你以为的多'：27 个生命周期事件、6 种执行器（command/prompt/agent/http/callback/function）。右边给两段真能抄的配置。数字取自逆向材料，运行细节以本机为准。
</notes>
