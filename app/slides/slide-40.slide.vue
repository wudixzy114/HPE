<template>
  <Slide class="slide">
    <div class="top">
      <div class="kicker">五、Hook 与扩展</div>
      <div class="chapter">40 / 49</div>
    </div>
    <h2 data-node="title">自己写一个 MCP：让它多出一个专属工具</h2>
    <p data-node="subtitle" class="subtitle">
      上一页是<b>接别人的</b> MCP，这页是<b>自己写一个</b>。MCP
      服务器就是<b>一个独立进程</b>，声明「我有哪几个工具」，Claude Code
      通过统一协议调它。
    </p>
    <div
      data-node="grid-1"
      class="grid two"
      style="margin-top: 14px; align-items: start; gap: 24px"
    >
      <div>
        <div data-node="code-1" class="code-cap">最小三步</div>
        <div data-node="ladder-1" class="scope-ladder">
          <div class="scl">
            <span class="scl-n">① 起 server</span>
            <div>
              <b>一个进程实例</b><span>用官方 SDK 建一个 MCP server</span>
            </div>
          </div>
          <div class="scl">
            <span class="scl-n">② 注册工具</span>
            <div>
              <b>名字 + 输入 schema + 处理函数</b
              ><span>schema 描述参数，函数真正干活、return 结果</span>
            </div>
          </div>
          <div class="scl">
            <span class="scl-n">③ 选传输</span>
            <div>
              <b>stdio 本地 / http 远程</b
              ><span>本地脚本走 stdio，远程服务走 http</span>
            </div>
          </div>
        </div>
        <div class="band orange-band" style="margin-top: 14px">
          <b>关键点：</b>工具的 <code>name</code> 和
          <code>description</code>
          会进模型上下文——模型<b>靠它判断啥时候调、传什么参</b>。所以描述要写清楚，别糊弄。写好后用上一页的
          <code>claude mcp add</code> 指向它即可。
        </div>
      </div>
      <div>
        <div data-node="code-2" class="code-cap">
          官方 TypeScript SDK · 最小骨架
        </div>
        <div data-node="code-3" class="code">
          <span class="c">// npm i @modelcontextprotocol/sdk zod</span>
          <span class="k">import</span> { McpServer }
          <span class="k">from</span>
          <span class="s">"@modelcontextprotocol/sdk/server/mcp.js"</span>;
          <span class="k">import</span> { StdioServerTransport }
          <span class="k">from</span>
          <span class="s">"@modelcontextprotocol/sdk/server/stdio.js"</span>;
          <span class="k">import</span> { z } <span class="k">from</span>
          <span class="s">"zod"</span>;

          <span class="k">const</span> server =
          <span class="k">new</span> McpServer({ name:
          <span class="s">"my-tools"</span>, version:
          <span class="s">"1.0.0"</span> });

          <span class="c">// 注册一个工具：名字 + 参数 schema + 处理函数</span>
          server.registerTool(<span class="s">"weather"</span>, { description:
          <span class="s">"查某城市天气"</span>, inputSchema: { city: z.string()
          }, }, <span class="k">async</span> ({ city }) => ({ content: [{ type:
          <span class="s">"text"</span>, text:
          <span class="k">await</span> getWeather(city) }], }));

          <span class="c">// 本地脚本：走 stdio</span>
          <span class="k">await</span> server.connect(<span class="k">new</span>
          StdioServerTransport());
        </div>
        <div class="hint">
          语言不限，官方还有 Python SDK。<code
            >claude mcp add --transport stdio my-tools -- node server.js</code
          >
          就接上了。
        </div>
      </div>
    </div>
    <div class="foot">
      <span
        >MCP 服务器 = 声明「我有哪些工具」的独立进程；schema/description
        是给模型看的（版本随官方 modelcontextprotocol 文档变）</span
      ><span>40</span>
    </div>
  </Slide>
</template>

<notes lang="md">
新增页（用户点名要补：怎么写自己的 MCP 工具，前一页 40 只讲了怎么接别人的）。核心一句：MCP 服务器 = 一个独立进程，它声明「我有哪几个工具」，Claude Code 通过统一协议调它。最小三步：①起一个 server；②注册工具，每个工具 = 名字 + 输入 schema（用 zod/JSON Schema，描述参数）+ 一个处理函数（真正干活、return 结果文本）；③选传输——本地脚本用 stdio，远程服务用 http。写好后就用上一页的 claude mcp add 指向它。右边给一段官方 TypeScript SDK 的最小可跑骨架：McpServer + registerTool + StdioServerTransport。讲稿要强调：输入 schema 不只是校验，description 会进模型上下文，模型靠它判断啥时候调、传什么参，所以名字和描述要写清楚。语言不限，官方有 TS 和 Python SDK。版本会变，以官方 modelcontextprotocol 文档为准。
</notes>
