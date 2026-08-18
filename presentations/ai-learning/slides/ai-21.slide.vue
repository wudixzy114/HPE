<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">四 · 坑二</div>
    <h2 data-node="title">
      中庸病：把优缺点列全很安全，但现实需要朝一个方向推动
    </h2>

    <div data-node="decision" class="ac-decision-stage">
      <Step :at="1">
        <section class="ac-choice ac-glass">
          <div>
            <b>A 方案</b>
            <p>有优点，也有缺点。适合某些情况，不适合另一些情况。</p>
          </div>
        </section>
      </Step>
      <div class="ac-gauge">
        <div class="ac-gauge-label">必须<br />表态</div>
      </div>
      <Step :at="2">
        <section class="ac-choice ac-glass">
          <div>
            <b>B 方案</b>
            <p>同样各有优劣，需要根据实际情况综合权衡。</p>
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
    <div class="ac-takeaway" style="margin-top: 14px">
      推荐 + 置信度 + 推翻条件：把 AI 从陈述事实逼到做出可执行判断。
    </div>
    <div class="ac-footer"><span>四 · 对抗中庸</span><span>22 / 28</span></div>
  </Slide>
</template>

<notes lang="md">
先让观众感受两边都正确但无法行动。表盘象征判断与承担风险。
</notes>
