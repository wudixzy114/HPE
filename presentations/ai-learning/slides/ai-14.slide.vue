<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">三 · 模板③</div>
    <h2 data-node="title">
      穿透式提问：向上、向下、横向，把一个技术问题拉满三个维度
    </h2>

    <div data-node="drill" class="ac-drill">
      <section data-node="question-ladder" class="ac-question-ladder">
        <div class="ac-question-ladder__axis" aria-hidden="true" />
        <Step :at="1" class="ac-question-level level-up">
          <div class="ac-question-level__marker">↑</div>
          <div class="ac-question-level__copy">
            <small>抽象一层</small>
            <b>向上 · 追问设计哲学</b>
            <span>为什么这样设计？它的 Zen 与价值取舍是什么？</span>
          </div>
        </Step>
        <Step :at="2" class="ac-question-level level-down">
          <div class="ac-question-level__marker">↓</div>
          <div class="ac-question-level__copy">
            <small>深入一层</small>
            <b>向下 · 拆到底层实现</b>
            <span>内存对齐、指令周期与缓存损失在哪里？</span>
          </div>
        </Step>
        <Step :at="3" class="ac-question-level level-cross">
          <div class="ac-question-level__marker">↔</div>
          <div class="ac-question-level__copy">
            <small>换一条路</small>
            <b>横向 · 比较替代方案</b>
            <span>还有哪些解法？trade-off 与适用边界是什么？</span>
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
          <strong>提问的深度，决定认知的边界。</strong
          >&nbsp;普通提问停在“代码能跑就行”（L2）； 把三个维度拉满，AI
          就成了由你指挥的“顶级系统架构师研讨会”。
        </div>
      </section>
    </div>
    <div class="ac-footer">
      <span>三 · 穿透式提问</span><span>15 / 28</span>
    </div>
  </Slide>
</template>

<notes lang="md">
三层提问阶梯依次出现：先向上追问设计哲学，再向下拆解底层实现，最后横向比较替代方案。三个层级始终占据固定位置，动画只改变显隐，不改变布局。
</notes>
