<template>
  <Slide class="slide" data-locked="true">
    <div class="top">
      <div class="kicker">三、上下文与记忆</div>
      <div class="chapter">11 / 49</div>
    </div>
    <h2 data-node="title">一轮上下文，是按什么顺序组装起来的？</h2>
    <p data-node="subtitle" class="subtitle">
      大部分内容是你看不见的「隐式注入」：启动前缀 +
      运行时按需。你真正手输的，只有中间那一小段。
    </p>
    <div data-node="inject-flow-1" class="inject-flow" style="margin-top: 16px">
      <div class="inject-card boot">
        <div class="inject-step">01 · 启动前缀（隐式，看不见）</div>
        <h3>Claude Code 按顺序拼接</h3>
        <ol class="inject-ol">
          <li>系统提示词 + 内置工具 schema + 环境 / git 信息</li>
          <li>
            CLAUDE.md 沿目录树<b>从根到工作目录逐层拼</b>：企业策略 →
            <code>~/.claude</code> → 项目根 → 当前目录；同级里
            <code>CLAUDE.local.md</code> 排在 <code>CLAUDE.md</code> 之后
          </li>
          <li>auto memory（<code>MEMORY.md</code> 前 200 行 / 25KB）</li>
          <li>
            无 <code>paths</code> 的 <code>.claude/rules/</code>、Skill
            名称+描述、MCP 工具名
          </li>
        </ol>
        <p>
          <b>这些全部拼接，谁也不覆盖谁</b
          >；越靠工作目录的排越后、最后读到。CLAUDE.md 是<b
            >系统提示词之后的一条 user 消息</b
          >——终端里你看不到它。
        </p>
      </div>
      <div class="inject-arrow" aria-hidden="true">→</div>
      <div class="inject-card conversation">
        <div class="inject-step">02 · 人发起一轮（显式，唯一看得见）</div>
        <h3>你手输的这一段</h3>
        <ul>
          <li>当前任务、补充要求、确认或纠正</li>
          <li>粘贴的文本、附件</li>
          <li>在 IDE 里显式选中的代码</li>
        </ul>
        <p>整轮上下文里，这一段才是人直接提供、你自己看得见的内容。</p>
      </div>
      <div class="inject-arrow" aria-hidden="true">→</div>
      <div class="inject-card runtime">
        <div class="inject-step">03 · 运行时按需（隐式，看不见）</div>
        <h3>命中 / 调用才补进来</h3>
        <ol class="inject-ol">
          <li>子目录 <code>CLAUDE.md</code>：读到该目录下的文件才加载</li>
          <li>
            带 <code>paths</code> 的
            <code>.claude/rules/</code> 规则：命中匹配文件才触发（写法见第 07
            页）
          </li>
          <li>Skill 正文：被调用时才载入（渐进式披露）</li>
          <li>MCP 完整 schema：tool search 按需拉取</li>
          <li>system-reminder、工具执行结果、模型回复</li>
        </ol>
        <p>它们在你输入前都不在场，进来后就成了要管理的会话内容。</p>
      </div>
    </div>
    <div class="band purple-band inject-note">
      <b>一句话记住：</b>01 和 03
      两段隐式内容，终端里几乎都看不到，却占了上下文一大半；人真正手输的只有中间
      02 那一小段。想省上下文，先盯住隐式这两段。
    </div>
    <div class="foot">
      <span
        >CLAUDE.md 走「拼接」不走「覆盖」；子目录规则、Skill 正文、完整工具
        schema 尽量留在运行时按需阶段</span
      ><span>11</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这页回答一轮上下文到底怎么拼出来的，重点讲你看不见的隐式注入。分两段隐式 + 一段显式。第一段启动前缀：系统提示词和内置工具 schema 先进，然后 CLAUDE.md 按目录树从根到工作目录逐层拼接——企业策略、~/.claude、项目根、当前目录，同级里 CLAUDE.local.md 排在 CLAUDE.md 之后。关键一句：这些文件全部拼接进去，谁也不覆盖谁，越靠近工作目录的排越后、最后读到；而且 CLAUDE.md 是作为系统提示词之后的一条 user 消息注入的，你在终端里根本看不到。子目录 CLAUDE.md、带 paths 的规则、Skill 正文、MCP 完整 schema 都留到运行时按需加载。中间那段人显式发起的一笔带过。收尾强调：隐式注入占了一大半，人真正手输的只有中间一段。
</notes>
