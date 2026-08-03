<template>
  <Slide class="slide">
    <div class="top">
      <div class="kicker">一、架构总览</div>
      <div class="chapter">02 / 49</div>
    </div>
    <h2 data-node="title">五个入口怎么汇到一套核心？谁是核心、谁是插件？</h2>
    <p data-node="subtitle" class="subtitle">
      上半：不管你从哪个入口进，最后都汇到<b>同一个 QueryEngine</b
      >——靠的是「入口适配器矩阵」。下半：接进来的东西<b>按信任级别分轨</b>，别把它们当成一回事。
    </p>
    <div
      data-node="grid-1"
      class="grid two"
      style="margin-top: 12px; align-items: start; gap: 26px"
    >
      <div>
        <div data-node="code-1" class="code-cap">
          入口适配器矩阵：核心引擎对入口「无感知」
        </div>
        <table data-node="matrix-1" class="matrix" style="margin-top: 6px">
          <tr>
            <th>入口</th>
            <th>传输</th>
            <th>权限 / 状态适配</th>
          </tr>
          <tr>
            <td><b>REPL</b></td>
            <td>stdin/stdout</td>
            <td>用户确认对话 · 完整 React 状态树</td>
          </tr>
          <tr>
            <td><b>MCP</b></td>
            <td>stdio</td>
            <td>空权限上下文 · 无状态 LRU</td>
          </tr>
          <tr>
            <td><b>SDK</b></td>
            <td>spawn + 结构化 IO</td>
            <td>SDK 控制协议 · 外部控制</td>
          </tr>
          <tr>
            <td><b>Bridge</b></td>
            <td>WebSocket / SSE</td>
            <td>远程权限桥接 · 远程同步</td>
          </tr>
        </table>
        <div class="band" style="margin-top: 12px">
          <b>只在三个维度适配：</b
          >传输、权限、状态。核心的工具注册表和执行引擎<b>一份、共用</b>——所以行为在各入口一致。
        </div>
      </div>
      <div>
        <div data-node="code-2" class="code-cap">
          核心 vs 插件：信任越低、隔离越强
        </div>
        <div data-node="trust-1" class="trust">
          <div class="trow t-core">
            <h4>内置工具 / 命令<span>tools.ts 中心化注册</span></h4>
            <p>
              40+ 工具、50+ 命令，<b>编译进主进程</b>。不用自动发现——工具
              description 是 Prompt 的一部分，要精确控制。<span
                class="tbadge b-in"
                >核心 · 完全信任</span
              >
            </p>
          </div>
          <div class="trow t-plugin">
            <h4>Plugin<span>模块级隔离</span></h4>
            <p>
              主进程内跑 + 策略过滤。<span class="tbadge b-out">中信任</span>
            </p>
          </div>
          <div class="trow t-mcp">
            <h4>MCP<span>进程级隔离</span></h4>
            <p>
              外部系统，<b>运行时动态注册</b>到同一张工具表。<span
                class="tbadge b-out"
                >低信任</span
              >
            </p>
          </div>
          <div class="trow t-skill">
            <h4>Skill<span>纯 Prompt</span></h4>
            <p>
              <b>不执行代码</b>，只是 System Prompt 的一段。<span
                class="tbadge b-in"
                >高信任</span
              >
            </p>
          </div>
          <div class="trow t-hook">
            <h4>Hook<span>事件总线 · 27 节点</span></h4>
            <p>
              用 <code>\0</code> 复合键做命名空间隔离。<span
                class="tbadge b-out"
                >你的命令 · 全权限</span
              >
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="foot">
      <span
        >工具 / 命令编译进核心；MCP / Plugin / Skill / 外部 Hook
        是运行时动态接入（分层与数字取自逆向材料，随版本变）</span
      ><span>02</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这页回答两个架构问题，都是'各部分怎么拼在一起'。上半：入口怎么统一路由。逆向材料 2.6 节叫入口适配器矩阵——REPL/MCP/SDK/Bridge 五种入口共享同一套工具注册表和执行引擎，核心引擎对入口类型无感知，只在传输层、权限、状态三个维度用适配器注入不同策略：REPL 走 stdin/stdout、用户确认对话、完整 React 状态树；MCP 走 stdio、空权限上下文 getEmptyToolPermissionContext、无状态 LRU；SDK 走 spawn+structuredIO、SDK 控制协议、外部控制状态；Bridge 走 WebSocket/SSE、远程权限桥接、远程同步。一句话：不管从哪进，最后都汇到同一个 QueryEngine。下半：核心 vs 插件，按信任级别分轨（材料行1586/21250）。别把所有扩展想成一回事。核心（完全信任）：40+ 内置工具和命令，编译进主进程、中心化注册在 tools.ts——注意不是自动发现，因为工具 description 本身是 Prompt 的一部分，必须精确控制。往下信任递减、隔离递增：Plugin 中信任、主进程+策略过滤；MCP 低信任、进程级隔离、运行时动态注册到同一张表；Skill 高信任但纯 Prompt、根本不执行代码、只是 System Prompt 的一段；Hook 是事件总线，27 个生命周期节点，用 \\0 复合键做命名空间隔离。结论：工具/命令编译进核心，MCP/Plugin/Skill/外部 Hook 是运行时动态接入。数字取自逆向材料，随版本变。
</notes>
