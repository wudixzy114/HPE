<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">四 · 坑一</div>
    <h2 data-node="title">认知过载与压缩失真：最值钱的“离群点”被平滑掉了</h2>

    <div data-node="lossy" class="ac-lossy-stage">
      <Step :at="1">
        <section class="ac-lossy-input ac-glass">
          <h3>输入 · 一万字</h3>
          <p>主干、细节、例外、特殊场景和反直觉洞见混在一起。</p>
          <div class="ac-outliers">
            <span>共识</span><span>框架</span><span class="hot">微妙细节</span
            ><span>结论</span><span class="hot">反直觉洞见</span
            ><span>案例</span>
          </div>
        </section>
      </Step>
      <div class="ac-lossy-filter" />
      <Step :at="2">
        <section class="ac-lossy-output ac-glass">
          <h3>输出 · 一千字</h3>
          <p>逻辑自洽、四平八稳，却只剩“最大公约数式”的正确废话。</p>
          <div class="ac-prompt" style="margin-top: 22px">
            先给主干，再单独加一节<span class="mark">“留白清单”</span
            >：列出省略因素、例外、特殊场景和简化之处。
          </div>
        </section>
      </Step>
    </div>
    <Step :at="3">
      <div
        class="ac-takeaway"
        style="margin-top: 16px; border-left-color: var(--ac-red)"
      >
        AI 给得越完整、越干脆，越要追问：<strong>被省略掉的是什么？</strong>
      </div>
    </Step>
    <div class="ac-footer"><span>四 · 压缩失真</span><span>21 / 28</span></div>
  </Slide>
</template>

<notes lang="md">
让观众看到离群点如何在漏斗中消失。对策不是不要压缩，而是显式保留留白清单。
</notes>
