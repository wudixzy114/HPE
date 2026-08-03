<template>
  <Slide class="slide">
    <div class="top">
      <div class="kicker">五、Hook 与扩展</div>
      <div class="chapter">42 / 49</div>
    </div>
    <h2 data-node="title">那到底怎么自定义我的 Claude Code？</h2>
    <p data-node="subtitle" class="subtitle">
      机制讲完了，收个口：<b>先看你遇到的是哪类问题，再对应加哪种机制</b>——别为了接而接。这张表基本覆盖日常。
    </p>
    <div
      data-node="grid-1"
      class="grid two"
      style="margin-top: 14px; align-items: start; gap: 24px"
    >
      <div>
        <table data-node="matrix-1" class="matrix">
          <tr>
            <th>你遇到的问题</th>
            <th>该加什么</th>
          </tr>
          <tr>
            <td>它老忘项目规矩 / 你重复解释同一套流程</td>
            <td>写进 <b>CLAUDE.md</b>，或打成 <b>Skill</b></td>
          </tr>
          <tr>
            <td>要连外部系统（数据库 / 工单 / 知识库）</td>
            <td>接 <b>MCP</b></td>
          </tr>
          <tr>
            <td>有件事<b>必须每次都发生</b>（格式化 / lint / 守密钥）</td>
            <td>挂 <b>Hook</b></td>
          </tr>
          <tr>
            <td>它乱跑，或老拿危险命令问得你烦</td>
            <td>配<b>权限规则</b> allow/ask/deny + 切模式</td>
          </tr>
          <tr>
            <td>长任务聊着聊着丢了早期结论</td>
            <td>
              <b>写进 CLAUDE.md</b>（说人话 / <code>/memory</code>） + 主动
              <code>/compact</code> 带关注点
            </td>
          </tr>
        </table>
        <div class="band purple-band" style="margin-top: 14px">
          <b>每加一个都有成本</b
          >（认证、权限、上下文噪音）。顺序：<b>先接高频、少歧义、可审计的</b>；发布、生产变更这类影响大的，最后再接。
        </div>
      </div>
      <div>
        <div data-node="code-1" class="code-cap">
          同一个能力，什么时候升级作用域？
        </div>
        <div data-node="ladder-1" class="scope-ladder">
          <div class="scl">
            <span class="scl-n">只我自己</span>
            <div>
              <b><code>~/.claude/</code> 或 <code>*.local</code></b
              ><span>个人偏好、实验中的 Skill，不进 git</span>
            </div>
          </div>
          <div class="scl">
            <span class="scl-n">整个团队</span>
            <div>
              <b>提交进 <code>.claude/</code> 走 git</b
              ><span
                >规范、共享
                Skill/agent、<code>.mcp.json</code>，队友拉下来即用</span
              >
            </div>
          </div>
          <div class="scl">
            <span class="scl-n">跨项目复用</span>
            <div>
              <b>打成 Plugin 走 marketplace</b
              ><span>一套 Skill+Hook+MCP 打包，多个仓库统一安装</span>
            </div>
          </div>
        </div>
        <div class="hint" style="margin-top: 10px">
          判断很简单：<b>只你用→本地；团队用→进 git；到处用→打包</b
          >。下一页专门讲个人 / 团队 / 公司这三层配置怎么分工。
        </div>
      </div>
    </div>
    <div class="foot">
      <span>不是"能加什么"，是"你缺什么就补什么"——按问题选机制</span
      ><span>42</span>
    </div>
  </Slide>
</template>

<notes lang="md">
重写页（原第31/33 被批胡扯）。这页是全场扩展章的总收口：了解了这么多机制，到底该怎么自定义我的 Claude Code？核心一句——先看你遇到的是哪类问题，再对应加哪种机制，别为了接而接。逐行讲这张对照表：①它老忘项目规矩/重复解释同一套流程→写进 CLAUDE.md 或打成 Skill；②要连外部系统(数据库/工单/知识库)→接 MCP；③有件事必须每次都发生(格式化/lint/守密钥)→挂 Hook；④它乱跑或老拿危险命令问你烦→配权限规则 allow/ask/deny + 切模式；⑤长任务聊着聊着丢了早期结论→写进 CLAUDE.md（说人话让它写 / /memory 挑作用域） + 主动 /compact 带关注点。右边给一个"什么时候升级作用域"的判断：只你自己用就放 ~/.claude 或 .local；团队都要用就提交进 .claude/ 走 git；跨项目复用就打成 Plugin。收尾强调：每加一个都有认证/权限/上下文噪音成本，先接高频、少歧义、可审计的。
</notes>
