<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">三 · 模板④⑤</div>
    <h2 data-node="title">让 AI 当老师：一边检验迁移，一边精准补齐卡点</h2>

    <div data-node="teacher-modes" class="ac-teacher-stage">
      <Step :at="1">
        <section class="ac-teacher-mode ac-glass">
          <h3>模板④ · 出题考官</h3>
          <p>
            自己以为懂了 ≠ 真的懂了。让 AI 出题，是把“感觉学会了”变成“验证学会了”。
            “伪装很深”是这个模板的灵魂——直接考定义没有意义，要考藏在真实情境里的识别能力。
          </p>
          <div class="ac-prompt">
            我已经掌握“囚徒困境”。请给我出 3 个现实中<span class="mark"
              >伪装很深</span
            >的案例（职场、生活、国际政治各一个），考我能否看穿并给出破解策略。答完后批改。
          </div>
        </section>
      </Step>
      <div class="ac-versus">教 / 考</div>
      <Step :at="2">
        <section class="ac-teacher-mode ac-glass">
          <h3>模板⑤ · 卡点补课</h3>
          <p>
            教育学上这叫“精准构建最近发展区”：卡点在哪，补给站就建在哪。
            传统教育的悲哀是“一刀切”——高一缺一个知识点，可能整个大学四年都在怕数学；
            AI 时代可以零摩擦地补：随时暂停、降维、举例、拆前置，直到心智模型对齐。
          </p>
          <div class="ac-prompt">
            我在学 X 时卡在 Y 上。给我一份
            <span class="cue">15 分钟能读完</span>的 Y 最小教程，<span
              class="mark"
              >只讲理解 X 必需的部分</span
            >。
          </div>
        </section>
      </Step>
    </div>
    <div class="ac-takeaway" style="margin-top: 18px">
      不要适应教材，让知识来适应你的认知结构。
    </div>
    <div class="ac-footer">
      <span>三 · 出题与补课</span><span>16 / 28</span>
    </div>
  </Slide>
</template>

<notes lang="md">
左边负责验证迁移，右边负责修复前置缺口。两个模式组成动态教学闭环。
</notes>
