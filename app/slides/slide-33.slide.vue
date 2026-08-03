<template>
  <Slide class="slide slide-31-density">
    <div class="top">
      <div class="kicker">五、Hook 与扩展</div>
      <div class="chapter">33 / 49</div>
    </div>
    <h2 data-node="title">
      为什么是四种扩展，不合成一种？看"上下文成本"这条轴
    </h2>
    <p data-node="subtitle" class="subtitle">
      上一页分清了五种扩展点。这页回答一个更深的问题：干嘛不合并成一两种？——因为它们<b>吃上下文窗口的量级完全不同</b>，一种机制没法同时又是"零成本的生命周期钩子"又是"塞满
      schema 的工具服务器"。
    </p>
    <div data-node="grid-1" class="grid two" style="margin-top: 12px">
      <div>
        <table data-node="matrix-1" class="matrix">
          <tr>
            <th>机制</th>
            <th>独有能力</th>
            <th>上下文成本</th>
            <th>插入点（源码）</th>
          </tr>
          <tr>
            <td><b>MCP</b></td>
            <td>接外部服务（多传输）</td>
            <td class="cost-hi">高<br /><span>工具 schema 常驻</span></td>
            <td><code>model()</code>：工具池</td>
          </tr>
          <tr>
            <td><b>Plugin</b></td>
            <td>多组件打包 + 分发</td>
            <td class="cost-mid">中<br /><span>随内容变</span></td>
            <td>三个点都可能</td>
          </tr>
          <tr>
            <td><b>Skill</b></td>
            <td>领域指令 + 元工具</td>
            <td class="cost-lo">低<br /><span>只有 description 常驻</span></td>
            <td><code>assemble()</code>：注入上下文</td>
          </tr>
          <tr>
            <td><b>Hook</b></td>
            <td>生命周期拦截 + 自动化</td>
            <td class="cost-zero">零<br /><span>默认不占，可选注入</span></td>
            <td><code>execute()</code>：工具前后</td>
          </tr>
        </table>
        <div class="hint" style="margin-top: 10px">
          工具池组装
          <code>assembleToolPool()</code>（<code>tools.ts</code>）把内建工具 +
          MCP 工具合并进模型可见列表——这就是 MCP 的 schema "常驻"的地方。
        </div>
      </div>
      <div>
        <div class="band" style="margin-bottom: 12px">
          <b>一句话：不是功能重叠，是各占一档成本位。</b
          >把它们排在同一条"上下文成本"轴上就一目了然——从零成本的 Hook，到只带
          description 的 Skill，到 schema 常驻的 MCP，覆盖了扩展作者的不同需求。
        </div>
        <div data-node="code-1" class="code-cap">
          三个插入点，对应三个执行时机
        </div>
        <div data-node="code-2" class="code">
          <span class="k">model()</span>
          <span class="c">// 组装工具池：MCP/工具 在这进模型视野</span>
          <span class="k">assemble()</span>
          <span class="c">// 拼上下文：Skill 的指令在这注入</span>
          <span class="k">execute()</span>
          <span class="c">// 跑工具前后：Hook 在这拦截/改写/标注</span>
        </div>
        <div class="band orange-band" style="margin-top: 12px">
          <b>子 Agent 为什么不在这四种里？</b
          >因为它<b>新开一个隔离的上下文窗口</b>去干活，而不是往<b>当前</b>窗口里加东西——这四种都是"给当前会话加料"，子
          Agent 是"另起一摊"。所以它单独归到多 Agent 那章。
        </div>
      </div>
    </div>
    <div class="foot">
      <span
        >四机制按上下文成本从零到高排开，各有唯一插入点；子 Agent
        是另开窗口不在此列（机制/插入点取自源码，随版本变）</span
      ><span>33</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这页回答上一页没答的一个问题：为什么是四种扩展机制，不合并成一两种？答案在'上下文成本'这条轴上——四种机制消耗上下文窗口的量级完全不同，一种机制没法从'零成本的生命周期 Hook'一路覆盖到'塞满 schema 的工具服务器'。逐个看：MCP 提供外部服务集成（多传输），代价是工具 schema 常驻上下文，成本最高，插入点在 model() 组装工具池那步（assembleToolPool 合并内建 + MCP 工具）；Plugin 是打包分发层，把另外三样任意组合成可分发包，成本随内容变，三个插入点都可能用到；Skill 提供领域指令 + 元工具调用，成本最低——只有 frontmatter 的 description 常驻，正文按需加载，插入点在 assemble() 往上下文注入那步；Hook 是生命周期拦截 + 事件驱动自动化，默认零上下文占用，插入点在 execute() 工具执行前后（pre/post tool）。一句话结论：不是功能重叠，是每种机制在'上下文成本'这条轴上占不同的位，各自服务不同的接入需求。子 Agent 不在这四种里，因为它是新开一个隔离上下文窗口，而不是往当前窗口里加东西。文件名、插入点函数名照抄源码，随版本变。
</notes>
