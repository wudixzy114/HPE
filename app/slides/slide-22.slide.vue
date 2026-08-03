<template>
  <Slide class="slide slide-31-density">
    <div class="top">
      <div class="kicker">四、工具与权限</div>
      <div class="chapter">22 / 49</div>
    </div>
    <h2 data-node="title">贴源码：一轮多个工具调用，是怎么分发的</h2>
    <p data-node="subtitle" class="subtitle">
      模型一轮常常一次要好几个工具（同时 Grep
      三个文件很常见）。哪些能一起跑、哪些必须排队？<code
        >toolOrchestration.ts</code
      >
      的分区算法说了算——按每个工具的<b>并发安全标记</b>切批次。
    </p>
    <div data-node="grid-1" class="grid two" style="margin-top: 12px">
      <div>
        <div data-node="code-1" class="code-cap">
          分区算法（材料 §4.6.3，原例照抄）
        </div>
        <div data-node="code-2" class="code">
          <span class="c">// 按 isConcurrencySafe 把工具列表切成交替批次</span>
          输入: [Grep, Grep, Edit, Glob, Glob] 分区: [[Grep, Grep], [Edit],
          [Glob, Glob]] 执行: <span class="s">并行</span>(Grep×2) →
          <span class="k">串行</span>(Edit) →
          <span class="s">并行</span>(Glob×2)

          <span class="c">// 规则：连续的"安全"工具合并成一个并发批</span>
          <span class="c">// 碰到"不安全"(会写文件)的 → 单独串行</span>
        </div>
        <div data-node="code-3" class="code" style="margin-top: 10px">
          <span class="c">// 并发批的执行</span>
          <span class="k">await</span> Promise.all(batch.map(runTool))
          <span class="c">// 上限 10 并发</span>
          <span class="c">// 上下文修改：先攒着，不立即应用</span>
          applyContextEdits(collected, <span class="s">原始顺序</span>)
          <span class="c">// 批完后统一按序</span>
        </div>
        <div class="hint" style="margin-top: 10px">
          <b>串行批</b>反过来：逐个
          <code>runToolUse</code>，上下文修改<b>立即应用</b>。
        </div>
      </div>
      <div>
        <div class="band" style="margin-bottom: 12px">
          <b>"任务分发"不是笼统地并行</b
          >，是按<b>并发安全性</b>切出「并行—串行—并行」交替的批次，批次之间按顺序走。只读的搜索类能挤进同一个并发批，会写文件的自己占一格串行。
        </div>
        <div data-node="code-4" class="code-cap">
          为什么并发批要"延迟收集、按序应用"？
        </div>
        <div class="band orange-band" style="margin-top: 8px">
          <b>并发时谁先谁后不定。</b
          >几个工具可能都要改对话上下文，若各自跑完就立刻改，结果取决于调度顺序
          →
          竞态。策略是<b>先并发跑完，各自的修改先攒着</b>，批次完成后<b>按它们在原始数组里的顺序</b>统一应用——结果确定，和串行一致。
        </div>
        <div class="hint" style="margin-top: 12px">
          上限 10 是给并发批封顶，别一次开几十个把机器/API
          打爆。切批依据只有一个布尔标记
          <code>isConcurrencySafe</code>——下一页看它默认是什么、为什么。
        </div>
      </div>
    </div>
    <div class="foot">
      <span
        >按并发安全性切交替批次；并发批 Promise.all 上限
        10，上下文修改延迟收集按序应用（源码取自逆向材料，随版本变）</span
      ><span>22</span>
    </div>
  </Slide>
</template>

<notes lang="md">
贴源码页。模型一轮经常一次吐好几个工具调用（比如同时 Grep 三个文件），这些怎么分发？toolOrchestration.ts 的分区算法就是答案，直接看它怎么切。核心一句：按每个工具的 isConcurrencySafe 标记，把工具列表切成'并行/串行交替'的批次——连续的安全工具合并成一个并发批（Promise.all，上限 10），碰到不安全的（会写文件的）就单独成一个串行批。举材料原例：输入 [Grep, Grep, Edit, Glob, Glob]，切成 [[Grep,Grep],[Edit],[Glob,Glob]]，执行就是 并行 Grep×2 → 串行 Edit → 并行 Glob×2。为什么要延迟收集上下文修改？并发批里几个工具可能都要改对话上下文，但并发执行谁先谁后不定，所以策略是先并发跑完、各自的上下文修改先攒着，批次完成后按工具在原始数组里的顺序统一应用——消除并发竞态。这就是'任务分发'的真身：不是笼统地并行，而是按并发安全性切出交替批次。算法、上限 10、原例都取自材料 4.6.3 / 9.9.2，随版本变。
</notes>
