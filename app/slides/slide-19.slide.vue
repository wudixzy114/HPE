<template>
  <Slide class="slide application-slide">
    <div class="top">
      <div class="kicker">三、上下文与记忆</div>
      <div class="chapter">19 / 49</div>
    </div>
    <h2 data-node="title">应用：上下文快满了，我该怎么手动管？</h2>
    <p data-node="subtitle" class="subtitle">
      讲完窗口构成、注入、工具输出、压缩原理，落到实操：诊断占用、手动压缩、写进记忆——以及
      /compact 背后到底调的哪一类压缩。
    </p>
    <div data-node="grid-1" class="grid three" style="margin-top: 34px">
      <div class="card">
        <div class="label">01 · 先诊断再动手</div>
        <p>
          <b>/context</b
          ><br />看窗口被谁占了、还剩多少；橙色工具结果那块最容易膨胀，先盯它。
        </p>
      </div>
      <div class="card">
        <div class="label">02 · 手动压 + 带关注点</div>
        <p>
          <b>/compact [关注点]</b
          ><br />它触发的是"全量压缩"那一类（调一次模型做摘要 +
          边界），比等自动压更可控；<code>/clear</code> 清历史保 CLAUDE.md。
        </p>
      </div>
      <div class="card">
        <div class="label">03 · 关键结论写进记忆</div>
        <p>
          <b>说「记进 CLAUDE.md」/ /memory</b
          ><br />长任务里重要约束别只说一次，直接让它写进 CLAUDE.md（或
          <code>/memory</code> 挑作用域），跨会话还在。
        </p>
      </div>
    </div>
    <div class="band purple-band" style="margin-top: 30px">
      <b>本节落地：</b><code>/compact</code> 背后调的是压缩页里"全量压缩
      compact"那一类（一次模型调用）；微压缩是运行时自动做的，你手动碰不到。
    </div>
    <div class="foot">
      <span>应用页 · 上下文与记忆 · 呼应压缩页两类做法</span><span>19</span>
    </div>
  </Slide>
</template>

<notes lang="md">
应用页（骨架）。应用：上下文快满了，我该怎么手动管？ 先固定排布与小节落点，后续补入团队真实案例、命令与截图。
</notes>
