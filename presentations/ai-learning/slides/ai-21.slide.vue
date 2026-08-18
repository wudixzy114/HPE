<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">四 · 坑二</div>
    <h2 data-node="title">
      中庸病：把优缺点列全很安全，但现实需要朝一个方向推动
    </h2>

    <div class="ac-middle-fairness">
      <b>先给“不是……而是……”说句公道话：</b>
      <span
        >它用否定面划界、肯定面锚定，是中文里界定事物效率很高的句式。问题不在句式，而在背后的姿态——不表态。</span
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
            <b>现实决策需要承担方向</b>
            <p>
              信息不全、时间有限时，必须朝一个方向推动，并承担选择带来的后果。
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
      推荐 + 置信度 + 推翻条件：把 AI 从陈述事实逼到做出可执行判断。
    </div>
    <div class="ac-footer"><span>四 · 对抗中庸</span><span>22 / 28</span></div>
  </Slide>
</template>

<notes lang="md">
先澄清句式本身没有错，再用技术选型原话展示“不表态”的问题。表盘象征判断与承担风险，最后保留完整的强迫表态三件套。
</notes>
