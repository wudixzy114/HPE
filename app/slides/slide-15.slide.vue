<template>
  <Slide class="slide">
    <div class="top">
      <div class="kicker">三、上下文与记忆</div>
      <div class="chapter">15 / 49</div>
    </div>
    <h2 data-node="title">聊太长会变差吗？会。那我能怎么管？</h2>
    <p data-node="subtitle" class="subtitle">
      上下文接近有效窗口就会自动压缩，压缩就有可能丢细节。别全交给它自动，手上这几条命令要会用。
    </p>
    <div data-node="grid-1" class="grid two" style="margin-top: 16px">
      <div>
        <div class="band orange-band" style="margin-bottom: 12px">
          <b>会不会影响质量？会。</b
          >官方明确讲：很长的对话里，早期给的指令可能"被丢掉"。所以关键约束别只在开头说一次。
        </div>
        <div data-node="code-1" class="code-cap">
          一段真实的自动压缩日志（本地实测）
        </div>
        <div data-node="code-2" class="code">
          <span class="c"># 接近有效窗口，触发自动压缩</span> autocompact: ...
          <span class="k">effectiveWindow</span>=180000
          <span class="c"># 先本地清掉旧工具输出，不够再发一次摘要请求</span>
          [API REQUEST] /messages <span class="k">source</span>=compact Reactive
          compact: <span class="s">summarization returned API error</span>
          <span class="c"># ↑ 这次摘要请求失败了 → 会话继续涨</span>
          <span class="c"># → 下一次输入就报 Prompt is too long</span>
        </div>
        <div class="hint">
          <b>有效窗口 = 配置值与模型最大窗口的较小值。</b
          >不是你把窗口调大就一定生效。
        </div>
      </div>
      <div>
        <div data-node="code-3" class="code-cap">四条你随时能用的命令</div>
        <div class="cmds">
          <div class="cmdrow">
            <code>/context</code
            ><span>看窗口被谁占了、还剩多少，先诊断再动手</span>
          </div>
          <div class="cmdrow">
            <code>/compact [关注点]</code
            ><span>手动压一次，还能指定重点保留哪块，比等它自动压更可控</span>
          </div>
          <div class="cmdrow">
            <code>/clear</code
            ><span>清空当前对话历史，但保留 CLAUDE.md 里的项目记忆</span>
          </div>
          <div class="cmdrow">
            <code>/memory</code
            ><span>浏览 / 编辑各层 CLAUDE.md，自己挑写进哪个文件</span>
          </div>
        </div>
        <div data-node="code-4" class="code-cap" style="margin-top: 12px">
          怎么让它「记住」一条规矩
        </div>
        <div data-node="code-5" class="code">
          <span class="c"># 方式一：随口说一句，它写进自动记忆</span>
          <span class="cmd">这个仓库测试用 pnpm test，不是 npm，记一下</span>
          <span class="c"># 想进 CLAUDE.md 就明说：</span>
          <span class="cmd">把这条加到 CLAUDE.md</span>
          <span class="c"
            ># 方式二：/memory 打开各层 CLAUDE.md 自己挑作用域：</span
          >
          <span class="c"
            ># ./CLAUDE.md（团队共享） / ~/.claude（个人全局） /
            .local（只你）</span
          >
        </div>
        <div class="band purple-band" style="margin-top: 12px">
          <b>落地建议：</b>长任务别指望它自动记住关键结论。重要的<b
            >直接说「记进 CLAUDE.md」</b
          >，或用 <code>/memory</code> 挑作用域写；快到上限时优先手动
          <code>/compact</code> 并带上关注点。
        </div>
      </div>
    </div>
    <div class="foot">
      <span>你手动介入的那几下，往往比它自动压得更准</span><span>15</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这页回答两个使用者最关心的问题：聊太长会不会变差？我能怎么手动管？先说结论：会——官方明说很长的对话里早期指令可能被丢。触发点：接近有效窗口时自动压缩。用真实日志讲：effectiveWindow=180000 这条线、Reactive compact、summarization returned API error——那次压缩请求失败了，会话就继续涨，直到下一次输入报 Prompt too long。所以别全交给它自动。给四条能当场用的命令。落地建议：重要结论直接说「记进 CLAUDE.md」（或用 /memory 挑作用域），长任务里主动 /compact 带关注点，比等它自动压更准。
</notes>
