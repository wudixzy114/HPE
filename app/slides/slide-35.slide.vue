<template>
  <Slide class="slide">
    <div class="top">
      <div class="kicker">五、Hook 与扩展</div>
      <div class="chapter">35 / 49</div>
    </div>
    <h2 data-node="title">Hook 到底是干什么的？为什么要用它？</h2>
    <div data-node="grid-1" class="grid two" style="margin-top: 14px">
      <div>
        <table data-node="matrix-1" class="matrix">
          <tr>
            <th>你会问的</th>
            <th>一句话回答</th>
          </tr>
          <tr>
            <td><b>是干什么的？</b></td>
            <td>在流程固定节点插一段<b>你自己的命令</b>，到点必跑</td>
          </tr>
          <tr>
            <td><b>为什么要用？</b></td>
            <td>
              模型可能<b>忘记或选择不做</b>；Hook
              是<b>确定性</b>触发，不靠它判断
            </td>
          </tr>
          <tr>
            <td><b>什么时候需要？</b></td>
            <td>需要"<b>每次都必须发生</b>"的事：见下方场景</td>
          </tr>
        </table>
        <div data-node="code-1" class="code-cap" style="margin-top: 14px">
          能实现的四个特点
        </div>
        <div class="band">
          <b>① 确定性执行</b>（到点必跑）　<b>② 生命周期拦截</b>（PreToolUse 可
          allow/deny/ask）<br /><b>③ 能往上下文注入内容</b>（如把 git
          状态喂给模型）　<b>④ 改完热重载</b>，不用重启
        </div>
        <div class="hint">
          <b>典型场景：</b>提交前 lint · 改完自动格式化 · 守住
          <code>.env</code> 密钥 · <code>rm</code> 二次确认 · 审计留痕。
        </div>
      </div>
      <div>
        <div data-node="code-2" class="code-cap">
          重点：Hook 本身有权限限制吗？受 Claude Code 管吗？
        </div>
        <div class="band red-band">
          <b>不受限——这是最容易踩的坑。</b><br />Hook
          以<b>你账户的完整权限</b>直接跑，<b>没有二次确认弹窗</b>，Claude Code
          <b>不沙箱、不替你拦</b>。写进去的命令你自己<b>负全责</b>——一条
          <code>rm -rf</code> 一样会执行。
        </div>
        <div class="band orange-band" style="margin-top: 12px">
          <b>它和权限系统的关系：</b><br /><code>PreToolUse</code>
          跑在<b>权限检查之前</b>，能返回 allow/deny/ask 影响决策——但
          <code>allow</code> 只是<b>免掉弹窗</b>，<b
            >盖不过静态 <code>deny</code></b
          >（尤其组织 managed 的 deny 永远赢）。
        </div>
        <div class="hint">
          <b>结论：</b>要做<b>硬约束</b>用权限系统（deny 规则）；Hook
          适合做<b>确定性动作与治理</b>，别拿它当安全边界。
        </div>
      </div>
    </div>
    <div class="foot">
      <span>Hook = 你亲手写、到点必跑的命令；能力很大，安全责任也全在你</span
      ><span>35</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这页集中回答几个关于 Hook 的常见疑问，别念表，挑重点讲。一，Hook 是干什么的：在流程固定节点上插一段你自己的命令，确定性执行——到点必跑，不靠模型判断。二，为什么要用：模型可能忘记或选择不做某件事，但 Hook 是运行时强制触发的，适合做治理和硬约束。三，能实现什么特点：确定性执行、生命周期拦截、PreToolUse 能返回 allow/deny/ask、能往上下文注入内容、改完热重载。四，什么时候需要：需要每次都必须发生的事——提交前 lint、改完自动格式化、守住密钥、危险命令拦截、审计留痕。右边是全场最要强调的权限边界：Hook 不被沙箱限制，以你账户的完整权限直接跑,没有二次确认弹窗,Claude Code 不替你拦——你自己负全责。PreToolUse 虽然跑在权限检查之前、能影响决策,但 allow 只是免掉弹窗,盖不过静态 deny,尤其组织 managed 的 deny 永远赢。硬约束要用权限系统,不是 Hook。
</notes>
