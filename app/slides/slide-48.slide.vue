<template>
  <Slide class="slide">
    <div class="top">
      <div class="kicker">附：多 Agent</div>
      <div class="chapter">48 / 49</div>
    </div>
    <h2 data-node="title">多 Agent：什么时候真该拆，怎么定义自己的子 Agent</h2>
    <div data-node="grid-1" class="grid two" style="margin-top: 14px">
      <div>
        <div data-node="code-1" class="code-cap">
          拆之前先过三关（答不上就串行）
        </div>
        <div class="gate">
          <div class="q">
            <b>1. 子任务真独立吗？</b><br />老得共享状态、互相等，串行反而稳。
          </div>
          <div class="q">
            <b>2. 输出有约定吗？</b><br />回来该是结构化的结论 / 证据 /
            待办，不是一段散文——因为主线只收那一段 <code>result</code>。
          </div>
          <div class="q">
            <b>3. 挂了能局部恢复吗？</b
            ><br />一个子任务倒了，别把整盘历史和工具状态一起拖垮。
          </div>
        </div>
        <div class="hint">
          Fork
          缺的正是"显式编排"——没有"先研究完再实现"的分阶段，也没有汇总步骤；要这些就上
          Coordinator。
        </div>
      </div>
      <div>
        <div data-node="code-2" class="code-cap">
          定义一个自己的子 Agent：<code>.claude/agents/xxx.md</code>
        </div>
        <div data-node="code-3" class="code">
          <span class="c"># .claude/agents/reviewer.md</span>
          <span class="k">---</span>
          <span class="k">name</span>: <span class="s">code-reviewer</span>
          <span class="k">description</span>:
          <span class="s">审查改动，找 bug 和风险</span>
          <span class="k">tools</span>:
          <span class="s">[Read, Grep, Bash]</span>
          <span class="k">model</span>: <span class="s">sonnet</span>
          <span class="k">---</span>
          <span class="c"># 下面正文就是这个子 Agent 的 System Prompt</span>
          你是资深评审，只看 diff，按约定格式输出结论。
        </div>
        <div class="hint">
          frontmatter 四件套
          <code>name / description / tools / model</code
          >，正文即它的系统提示。放 <code>.claude/agents/</code> 提交 git
          全团队复用；放 <code>~/.claude/agents/</code> 只给自己。
        </div>
        <div class="band orange-band" style="margin-top: 10px">
          <b>一句话选型：</b>带着同样背景各干各的 →
          <b>Fork</b>；阶段分明、要拼装要隔离 →
          <b>Coordinator</b>；想要个反复调的"专职角色" → 写成
          <code>.claude/agents</code>。
        </div>
      </div>
    </div>
    <div class="foot">
      <span>Agent 更多≠更聪明；先过三关，专职角色写成 .claude/agents 复用</span
      ><span>48</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这页两件事：一，什么时候真该拆——三关，答不上就串行。子任务真独立吗（老得共享状态互相等就串行）、输出有没有约定（回来只收一段 result，得是结构化结论不是散文）、挂了能不能局部恢复。补一句：Fork 缺的正是显式编排，没有先研究完再实现的分阶段、也没有汇总步骤，要这些就上 Coordinator。二，怎么定义自己的子 Agent：.claude/agents/xxx.md，frontmatter 四件套 name/description/tools/model，正文就是这个子 Agent 的 System Prompt；放项目 .claude/agents 提交 git 全团队复用，放 ~/.claude/agents 只给自己。选型直觉：带同样背景各干各的用 Fork；阶段分明要拼装、要隔离用 Coordinator；想要个反复调的专职角色写成 .claude/agents。都取自逆向材料第 6 章。
</notes>
