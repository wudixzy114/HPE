<template>
  <Slide class="slide">
    <div class="top">
      <div class="kicker">一、架构总览</div>
      <div class="chapter">03 / 49</div>
    </div>
    <h2 data-node="title">这么大一坨，凭什么启动不慢、终端不卡？</h2>
    <p data-node="subtitle" class="subtitle">
      数十万行
      TypeScript，却要求秒开、流式输出不花屏。两条工程主线：<b>启动只加载你这次真要用的</b>，<b>渲染只重画变了的</b>。
    </p>
    <div
      data-node="grid-1"
      class="grid two"
      style="margin-top: 10px; align-items: start; gap: 26px"
    >
      <div>
        <div data-node="code-1" class="code-cap">
          启动：分层启动路由器（用到才加载）
        </div>
        <div data-node="ladder-1" class="ladder">
          <div class="lstep">
            <span class="lv">L0</span>
            <div>
              <b>环境预处理</b>
              <p>0 模块</p>
            </div>
            <span class="cost">~1ms</span>
          </div>
          <div class="lstep">
            <span class="lv">L1</span>
            <div>
              <b>零依赖快速路径</b>
              <p><code>claude --version</code> 直接读 package.json</p>
            </div>
            <span class="cost">~5ms</span>
          </div>
          <div class="lstep">
            <span class="lv">L2</span>
            <div>
              <b>功能分流</b>
              <p>MCP / Bridge / Daemon 按需<b>动态导入</b></p>
            </div>
            <span class="cost">~20-50ms</span>
          </div>
          <div class="lstep">
            <span class="lv">L3</span>
            <div>
              <b>完整 CLI</b>
              <p>才动态导入 <code>main.tsx</code></p>
            </div>
            <span class="cost">~100-200ms</span>
          </div>
        </div>
        <div class="band orange-band" style="margin-top: 12px">
          <b>再加两招：</b>构建时
          <code>feature()</code>
          把开关内联成布尔常量，<b>没启用的代码直接从产物里消除</b>；L3 把 MDM
          读取、Keychain 预取的 I/O 和模块导入的 CPU 活儿<b>并行重叠</b>。
        </div>
      </div>
      <div>
        <div data-node="code-2" class="code-cap">
          渲染：基于 Ink 的 React-to-Terminal 六阶段
        </div>
        <div data-node="code-3" class="code">
          React Reconciler <span class="c">(React 19)</span> ↓ DOM 抽象层 ↓ Yoga
          Flexbox 布局 ↓ Screen Buffer
          <span class="c">(TypedArray 位打包)</span> ↓ Diff 引擎 ↓ ANSI 输出
        </div>
        <div data-node="code-4" class="code-cap" style="margin-top: 14px">
          保质量的三招
        </div>
        <div class="cmds">
          <div class="cmdrow">
            <code>双缓冲</code><span>front / back 两帧，<b>只输出差异</b></span>
          </div>
          <div class="cmdrow">
            <code>Blit</code
            ><span
              >没变的节点直接内存拷贝，典型会话
              <b>&gt;90% 屏幕零成本复制</b></span
            >
          </div>
          <div class="cmdrow">
            <code>throttle</code><span>帧合并到约 16ms · <b>~60fps</b></span>
          </div>
        </div>
      </div>
    </div>
    <div class="foot">
      <span
        >启动快=只加载你要用的；渲染稳=只重画变了的（机制与数字取自逆向材料，随版本变）</span
      ><span>03</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这页回答两个很实的工程问题：这么大一坨（数十万行 TS），启动为什么不慢？终端里那些流式输出、diff 为什么不卡不花屏？上半启动：材料 2.2 节叫分层启动路由器，核心思想是把'加载开销正比于所有模式的代码总量'改成'正比于你这次真正用到的模式'。四级：L0 环境预处理约 1ms、0 模块；L1 零依赖快速路径，claude --version 直接读 package.json 约 5ms、0 模块；L2 功能分流，MCP/Bridge/Daemon 这些按需动态导入，约 20-50ms、1-3 模块；L3 完整 CLI 约 100-200ms，才动态导入 main.tsx。再加两招：构建时 Feature Flag，用 Bun 的 feature() 把开关内联成布尔常量，没启用的代码直接从产物里消除；L3 并行化启动，把 MDM 读取、Keychain 预取这些 I/O 和模块导入的 CPU 活儿重叠起来。下半渲染：基于 Ink 的 React-to-Terminal 六阶段管线（React Reconciler → DOM 抽象 → Yoga Flexbox 布局 → Screen Buffer 用 TypedArray 位打包 → Diff 引擎 → ANSI 输出）。保质量靠三招：双缓冲 frontFrame/backFrame 只输出差异；Blit 优化，没变的节点直接 TypedArray 内存拷贝，典型会话 90% 以上屏幕是零成本复制；帧合并 throttle 到约 16ms、~60fps。落脚：启动快 = 只加载你要用的；渲染稳 = 只重画变了的。数字取自逆向材料，随版本变。
</notes>
