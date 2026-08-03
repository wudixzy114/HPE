<template>
  <Slide class="slide slide-31-density">
    <div class="top">
      <div class="kicker">附：多 Agent</div>
      <div class="chapter">47 / 49</div>
    </div>
    <h2 data-node="title">贴源码：一个 Fork 是怎么"复制上下文"的</h2>
    <p data-node="subtitle" class="subtitle">
      上一页说 Fork 会"整段复制父历史 +
      前缀对齐省缓存"。这段就是干这事的函数——不长，三步看完就懂它凭什么省 90%。
    </p>
    <div data-node="grid-1" class="grid two" style="margin-top: 12px">
      <div>
        <div data-node="code-1" class="code-cap">
          源码 <code>src/tools/AgentTool/forkSubagent.ts</code>（材料
          §6.2，简化）
        </div>
        <div data-node="code-2" class="code">
          <span class="c">// 所有 fork 子 Agent 用同一句占位文本 ← 关键</span>
          <span class="k">const</span> FORK_PLACEHOLDER_RESULT =
          <span class="s">'Fork started — processing in background'</span>

          <span class="k">function</span> buildForkedMessages(directive,
          assistantMessage) {
          <span class="c">// ① 留下父 Agent 那条消息里所有 tool_use 块</span>
          <span class="k">const</span> toolUseBlocks =
          assistantMessage.message.content .filter(b =&gt; b.type ===
          <span class="s">'tool_use'</span>)

          <span class="c"
            >// ② 每个 tool_use 配一个"统一占位"的 tool_result</span
          >
          <span class="k">const</span> toolResultBlocks = toolUseBlocks.map(b
          =&gt; ({ type: <span class="s">'tool_result'</span>, tool_use_id:
          b.id, content: [{ type: <span class="s">'text'</span>, text:
          FORK_PLACEHOLDER_RESULT }], }))

          <span class="c">// ③ 父历史 + 占位结果 + 本 fork 专属指令</span>
          <span class="k">return</span> [ fullAssistantMessage,
          createUserMessage({ content: [ ...toolResultBlocks, { type:
          <span class="s">'text'</span>, text: buildChildMessage(directive) } ],
          }) ] }
        </div>
      </div>
      <div>
        <div class="band" style="margin-bottom: 12px">
          <b>为什么占位要"统一"？</b>父 Agent 同时起 3 个 fork
          时，三条消息的前缀只有<b>最后一句 directive</b> 不同：
        </div>
        <div data-node="code-3" class="code">
          <span class="c">Fork A:</span> [系统提示][对话历史][tool_result:"Fork
          started…"][<b>指令 A</b>]
          <span class="c">Fork B:</span> [系统提示][对话历史][tool_result:"Fork
          started…"][<b>指令 B</b>]
          <span class="c">Fork C:</span> [系统提示][对话历史][tool_result:"Fork
          started…"][<b>指令 C</b>]
        </div>
        <div class="hint" style="margin-top: 12px">
          <b>前缀一字不差 → prompt cache 前缀对齐命中</b>：三个 fork
          共享同一段缓存，只有尾巴各付各的。这就是上一页"最多省 ~90%
          输入成本"的来处。
        </div>
        <div class="band orange-band" style="margin-top: 12px">
          <b>读代码的点：</b>子 Agent
          起手看到的不是真实工具结果，而是一句"处理中"的占位——它本来就不该等父任务，只按自己那条
          directive 干活。
        </div>
      </div>
    </div>
    <div class="foot">
      <span
        >占位统一是为缓存前缀对齐；函数只做"复制历史 +
        附指令"两件事（源码取自逆向材料，随版本变）</span
      ><span>47</span>
    </div>
  </Slide>
</template>

<notes lang="md">
贴源码页。上一页讲了 Fork 怎么复制上下文，这页直接看那段源码，眼见为实。forkSubagent.ts 的 buildForkedMessages() 只做三件事：① 从父 Agent 最后那条 assistant 消息里，把所有 tool_use 块留下来；② 给每个 tool_use 造一个统一占位的 tool_result，内容全是同一句 'Fork started — processing in background'；③ 把父历史 + 占位结果 + 本 fork 专属的 directive 拼成子 Agent 的起始消息。为什么占位要统一？因为父 Agent 同时起 3 个 fork 时，三个子 Agent 的消息前缀除了最后那条 directive，前面一模一样——这样 prompt cache 前缀能对齐，三份 fork 共享同一段缓存，材料称最多省 90% 输入成本。这就是上一页那句'靠前缀对齐共享省掉大头'的代码级证据。占位符文本、函数结构都照抄材料 6.2 节，随版本变。
</notes>
