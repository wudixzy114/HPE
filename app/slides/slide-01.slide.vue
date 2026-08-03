<template>
  <Slide class="slide">
    <div class="top">
      <div class="kicker">一、架构总览</div>
      <div class="chapter">01 / 49</div>
    </div>
    <h2 data-node="title">整体分五层：模型只出主意，runtime 才真把事办了</h2>
    <p data-node="subtitle" class="subtitle">
      别把 Claude Code 想成一个更大的
      Prompt。模型只生成「下一步说啥、调哪个工具」；把它变成动作、喂回结果、管好状态和权限的，是外面这<b>五层</b>——你从哪个入口进来走的都是它。
    </p>
    <div data-node="larch-1" class="larch">
      <div class="lrow l5">
        <div class="ltag"><b>L5 入口分发</b><span>cli.tsx</span></div>
        <div class="lbody">
          <b>10+ 运行模式，统一入口</b
          ><span
            >命令行 REPL / IDE 插件 / SDK / 网页 Bridge / 无头
            <code>-p</code> ——先在这里分流，后面共用同一套核心</span
          >
        </div>
      </div>
      <div class="lrow l4">
        <div class="ltag"><b>L4 交互渲染</b><span>React + Ink</span></div>
        <div class="lbody">
          <b>把过程一个字一个字画到终端</b
          ><span>流式输出、diff、你的输入 / 中断 / 历史，都在这层</span>
        </div>
      </div>
      <div class="lrow l3">
        <div class="ltag"><b>L3 编排</b><span>QueryEngine</span></div>
        <div class="lbody">
          <b>那个 <code>while(true)</code> 循环（约 46KB「God Object」）</b
          ><span
            >用 AsyncGenerator 一轮轮吐：搭上下文 → 问一次模型 → 跑工具 →
            接着来或结束（第二章展开）</span
          >
        </div>
      </div>
      <div class="lrow l2">
        <div class="ltag">
          <b>L2 能力</b><span>tools · commands · skills</span>
        </div>
        <div class="lbody">
          <b>40+ 内置工具、50+ 斜杠命令、Skill</b
          ><span
            >读写文件、跑 Shell、搜索、派子任务——每样都要先过校验和权限</span
          >
        </div>
      </div>
      <div class="lrow l1">
        <div class="ltag">
          <b>L1 基础设施</b><span>全局状态 · API · MCP</span>
        </div>
        <div class="lbody">
          <b>全局状态、API 客户端、MCP 通信、持久化</b
          ><span>会话状态跨很多轮一直存着，撑起上面四层</span>
        </div>
      </div>
    </div>
    <div class="band" style="margin-top: 16px">
      <b>它为什么能稳？</b
      >把<b>全局状态</b>和业务逻辑分得干干净净——状态只被读写、不反过来依赖上层逻辑。就因为分得干净，中途压缩、失败重试、开子任务才不会把整盘搞乱。
    </div>
    <div class="foot">
      <span
        >不用记模块名，记住谁负责什么；后面每一章都回到这张图定位（分层与数字取自逆向材料，随版本变）</span
      ><span>01</span>
    </div>
  </Slide>
</template>

<notes lang="md">
开场先给整体地图，回答审核最想问的：这套东西到底分几层、每层干嘛。核心一句先抛出：模型只会生成下一步说啥、调哪个工具，真把事办了、管好状态权限的是外面这五层 runtime。逆向材料里是明确的五层（1.4 节）：Layer5 入口分发 cli.tsx，支持 10+ 运行模式；Layer4 交互渲染，React+Ink 把过程画到终端；Layer3 编排层就是那个 while(true) 循环，源码里叫 QueryEngine，约 46KB 的 God Object，用 AsyncGenerator 一轮轮吐；Layer2 能力层 tools.ts/commands.ts/skills；Layer1 基础设施，API 客户端、全局状态 state.ts（60+ 字段）、MCP 通信、持久化。最该记住的工程约束：state.ts 必须是依赖图的叶子节点，被 200+ 文件导入，用 ESLint 规则 bootstrap-isolation 强制——这就是为什么它能稳。这张图后面每一章都回来定位。数字均为逆向材料所述，随版本变。
</notes>
