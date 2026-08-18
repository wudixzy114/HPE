<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">四 · 坑二</div>
    <h2 data-node="title">中庸病——正确，但无用：“各有优劣”永远不会错，所以也永远没用</h2>

    <div class="ac-middle-fairness">
      <b>先给“不是……而是……”句式说句公道话：</b>
      <span
        >从否定面划界、再从肯定面锚定，它是中文里界定事物效率最高的句式，模型高频使用正因信息密度高。真正的问题不在句式，而在姿态——太中庸，不表态。</span
      >
    </div>

    <div
      data-node="decision"
      class="ac-decision-stage ac-decision-stage--reviewed"
    >
      <Step :at="1">
        <section class="ac-choice ac-glass">
          <div>
            <b>你问：A 和 B 到底选哪个？</b>
            <p>“A 有优点也有缺点，B 亦然，需要根据实际情况综合权衡。”</p>
            <em>每句话都是事实，但没有一句能推动决策。</em>
          </div>
        </section>
      </Step>
      <div class="ac-gauge">
        <div class="ac-gauge-label">必须<br />表态</div>
      </div>
      <Step :at="2">
        <section class="ac-choice ac-glass">
          <div>
            <b>现实决策：朝一个方向推动，并承担后果</b>
            <p>
              现实世界的决策，从来不是把优缺点列全，而是在信息不全、时间有限时选定方向、承担后果。
            </p>
            <em>“各有优劣”永远不会错，所以也永远没有用。</em>
          </div>
        </section>
      </Step>
    </div>

    <Step :at="3">
      <div class="ac-prompt" style="margin-top: 18px">
        不要给两边的利弊清单。假设这个项目由你负责、必须二选一：<span
          class="mark"
          >你选哪个？</span
        >给出理由、<span class="cue">置信度</span>，以及出现什么信号时应该<span
          class="cue"
          >推翻决定</span
        >。
      </div>
    </Step>
    <div class="ac-takeaway" style="margin-top: 10px">
      <strong>强迫表态三件套：推荐 + 置信度 + 推翻条件</strong>——把 AI 从“陈述正确的事实”，逼到“做出可执行的判断”。
    </div>
    <div class="ac-footer"><span>四 · 对抗中庸</span><span>22 / 28</span></div>
  </Slide>
</template>

<notes lang="md">
先澄清句式本身没有错，再用技术选型原话展示“不表态”的问题。表盘象征判断与承担风险，最后保留完整的强迫表态三件套。
</notes>
