<template>
  <Slide class="slide slide-31-density">
    <div class="top">
      <div class="kicker">二、循环与配置</div>
      <div class="chapter">06 / 49</div>
    </div>
    <h2 data-node="title">贴源码：那个"一轮一轮"的循环长什么样</h2>
    <p data-node="subtitle" class="subtitle">
      上一页点着看了循环怎么走，这页看它的真身。业界做状态机有
      XState、LangGraph、asyncio TaskGroup 一堆精巧方案——Claude Code
      选了最朴素的 <code>while(true)</code>。
    </p>
    <div data-node="grid-1" class="grid two" style="margin-top: 12px">
      <div>
        <div data-node="code-1" class="code-cap">
          源码 <code>query.ts</code> 核心循环（材料 §3.3，简化）
        </div>
        <div data-node="code-2" class="code">
          <span class="k">async function</span>* queryLoop(state, config, deps)
          { <span class="k">while</span> (<span class="s">true</span>) {
          <span class="c">// 1. 需要就先压上下文（记忆章那套自动压缩）</span>
          state = <span class="k">await</span> maybeCompact(state, config)

          <span class="c">// 2. 问一次模型</span>
          <span class="k">const</span> response =
          <span class="k">await</span> deps.callModel(state.messages, config)

          <span class="c"
            >// 3. 处理流式响应 + 执行工具（yield* 透传事件）</span
          >
          <span class="k">const</span> result = <span class="k">yield</span>*
          processResponse(response, state)

          <span class="c"
            >// 4. 出错：能恢复就 continue 重试，否则 return 终止</span
          >
          <span class="k">if</span> (result.error) {
          <span class="k">const</span> recovery = attemptRecovery(result.error,
          state) <span class="k">if</span> (recovery) { state = {...state,
          ...recovery}; <span class="k">continue</span> }
          <span class="k">return</span> { reason:
          <span class="s">'error'</span>, error: result.error } }

          <span class="c">// 5. 还有工具没跑完 → 带着结果进下一轮</span>
          <span class="k">if</span> (result.needsFollowUp) { state = {...state,
          turnCount: state.turnCount + 1}
          <span class="k">continue</span>
          }
          <span class="c">// ...都没有 → 循环自然结束</span>
          } }
        </div>
      </div>
      <div>
        <div class="band" style="margin-bottom: 12px">
          <b>就一个 <code>while(true)</code>：</b
          ><code>continue</code> 继续下一轮、<code>return</code>
          终止。没有状态枚举、没有转换表、没有事件调度——想知道"为什么走到这"，看
          state 里的字段就行。
        </div>
        <div data-node="code-3" class="code-cap">两个不起眼但关键的写法</div>
        <div class="band orange-band" style="margin-top: 8px">
          <b>① <code>async function*</code>（生成器），不是返回 Promise。</b
          >所以调用方能
          <code>for await</code> 逐步消费——这就是你看到的<b>流式输出</b>；每个子
          Agent 也能各持一个独立 Generator。<br /><br /><b
            >② <code>yield* processResponse</code>：</b
          >把内部
          <code>yield</code>
          的每个事件<b>透传</b>给外层消费者，边跑工具边往外吐。
        </div>
        <div class="hint" style="margin-top: 12px">
          <b>为什么敢这么朴素？</b>材料的观点：核心组件 LLM
          本身就不确定，外面再套一个精巧的确定性状态机是自欺——<code
            >while(true)</code
          >
          最坦诚，读代码的人一眼就知道"这循环会一直转，直到明确停"。
        </div>
      </div>
    </div>
    <div class="foot">
      <span
        >最核心的调度就是一个 while(true)：continue 继续、return 终止；async
        function* 带来流式与子 Agent
        独立消费（源码取自逆向材料，随版本变）</span
      ><span>06</span>
    </div>
  </Slide>
</template>

<notes lang="md">
贴源码页。上一页那个可点的 demo 演示了循环一轮一轮走，这页直接看它的真身：query.ts 的 queryLoop。业界做状态机有 XState 可视化状态图、LangGraph 有向图、asyncio TaskGroup，Claude Code 选了最朴素的——async function* + while(true)。逐行读循环体：① maybeCompact 先看要不要压上下文（记忆章讲过的自动压缩就在这触发）；② callModel 问一次模型；③ yield* processResponse 处理流式响应并执行工具——注意是 yield*，把里面 yield 的每个事件透传给外层 for await 的消费者，这就是流式；④ 出错走 attemptRecovery，能恢复就改 state 然后 continue 回循环顶重试，不能恢复就 return 终止；⑤ 还有工具调用没跑完（needsFollowUp）就 turnCount+1、continue 带着结果进下一轮。整个循环靠 continue 继续、return 终止，没有状态枚举、没有转换表、没有事件调度。为什么敢这么朴素？材料的观点：核心组件 LLM 本身就不确定，外面套一个复杂精巧的确定性状态机是自欺，while(true) 最坦诚。另外它是 async function*（生成器）不是返回 Promise——所以调用方能 for await 逐步消费，也让每个子 Agent 持有自己独立的 Generator。代码照抄材料 3.3，简化示意，随版本变。
</notes>
