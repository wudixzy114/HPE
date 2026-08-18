<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">四 · 坑三</div>
    <h2 data-node="title">
      谄媚与幻觉：语言只能提出假说，编译器和现实负责审判
    </h2>

    <div data-node="hypothesis-flow" class="ac-hypothesis-flow">
      <Step :at="1">
        <section class="ac-hypothesis-node ac-glass">
          <div>
            <b>谄媚 + 幻觉</b>
            <p>
              RLHF 把模型训练得“友好、有帮助”，导致它永远倾向于赞同你，缺乏真正的学术冒犯性；
              它是“基于概率的语言编织者”，不是“物理定律的裁判员”。
            </p>
            <small
              >例：它说“字节少所以占用空间少”，只是语料里的高频关联——它并不知道内存对齐（Alignment）和填充（Padding）机制。</small
            >
          </div>
        </section>
      </Step>
      <div class="ac-hypothesis-arrow">→</div>
      <Step :at="2">
        <section class="ac-hypothesis-node ac-glass">
          <div>
            <b>反方 + 验证</b>
            <p>
              关键结论先要求“给出反对我观点最强的 3
              个理由”；代码必须亲自跑测试与 Benchmark；
              事实结论用私教模式锚定可信资料并交叉验证。
            </p>
          </div>
        </section>
      </Step>
      <div class="ac-hypothesis-arrow">→</div>
      <Step :at="3">
        <section class="ac-hypothesis-node ac-glass">
          <div>
            <b>可用结论</b>
            <p>
              没有经过编译器和现实碰撞过的答案，永远只是草案；碰撞过，才能升级为行动依据。
            </p>
          </div>
        </section>
      </Step>
    </div>

    <div
      class="ac-takeaway"
      style="margin-top: 30px; border-left-color: var(--ac-yellow)"
    >
      <strong>AI 负责提出假说，物理世界负责审判。</strong
      >&nbsp;与坑二同根：RLHF 把模型训得“永远不出错”，而承担错误风险，恰恰是判断的价值所在。
    </div>
    <div class="ac-footer">
      <span>四 · 谄媚与幻觉</span><span>23 / 28</span>
    </div>
  </Slide>
</template>

<notes lang="md">
用一条管线串起问题与验证，同时补回 RLHF 谄媚、内存对齐幻觉的具体案例，以及三种对应验证方式。
</notes>
