<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">三 · 模板③</div>
    <h2 data-node="title">
      穿透式提问：向上、向下、横向，把一个技术问题拉满三个维度
    </h2>

    <div data-node="drill" class="ac-drill">
      <section class="ac-drill-core">
        <Step :at="1">
          <div class="ac-drill-ring up">
            <b>向上 · 设计哲学</b><span>为什么这样设计？Zen 是什么？</span>
          </div>
        </Step>
        <Step :at="2">
          <div class="ac-drill-ring down">
            <b>向下 · 底层实现</b><span>内存对齐、指令周期、缓存损失</span>
          </div>
        </Step>
        <Step :at="3">
          <div class="ac-drill-ring cross">
            <b>横向 · 替代方案</b><span>trade-off 与异构算法</span>
          </div>
        </Step>
      </section>
      <section>
        <div class="ac-prompt">
          这段 Python 代码能跑。但请回答三层： ①
          <span class="mark">向上问设计哲学</span>：这门语言为什么这样设计？它的
          Zen 是什么？和 C++ 的设计哲学冲突在哪？ ②
          <span class="cue">向下问底层实现</span
          >：这个数据结构在底层内存中如何对齐？翻译成汇编后，指令周期开销在哪？有没有缓存命中的损失？
          ③
          <span class="mark">横向问替代方案</span>：这是不是最优解？时间和空间的
          trade-off 在哪？有没有异构算法？
        </div>
        <div class="ac-takeaway" style="margin-top: 18px">
          <strong>提问的深度，决定认知的边界。</strong>&nbsp;普通提问停在“代码能跑就行”（L2）；
          把三个维度拉满，AI 就成了由你指挥的“顶级系统架构师研讨会”。
        </div>
      </section>
    </div>
    <div class="ac-footer">
      <span>三 · 穿透式提问</span><span>15 / 28</span>
    </div>
  </Slide>
</template>

<notes lang="md">
三个同心层依次出现。中心越小，问题越接近可执行选择；外圈负责扩展认知边界。
</notes>
