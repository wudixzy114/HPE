<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">四 · 坑一</div>
    <h2 data-node="title">认知过载与压缩失真：最值钱的洞见，被当作“离群点”平滑掉了</h2>

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
          <p>
            “最大公约数式”的有损压缩：把最反直觉、最微妙的细节平滑掉，
            吐出一堆逻辑自洽但空洞的“正确的废话”。输入越多，输出越不成比例——
            到最后，它给你的是它自己的理解，还会造成认知过载。
          </p>
        </section>
      </Step>
    </div>
    <Step :at="3">
      <div class="ac-dialectic-band">
        <b>对策：要求“主干 + 留白”，而不是二选一</b>
        <span>
          初学只抓主要矛盾、暂时放下次要，可以快速上手；但认识深入后，次要会上升为主要——
          主干和留白，二者都不可失。
        </span>
      </div>
    </Step>
    <Step :at="4">
      <div class="ac-prompt ac-lossy-prompt">
        先给我主干：共识性的框架和结论，让我快速上手。然后单独加一节<span
          class="mark"
          >“留白清单”</span
        >：
        列出你省略了哪些次要因素、存在哪些例外和特殊场景、哪些地方做了简化——不需要展开讲，但必须标注出来。
      </div>
      <div
        class="ac-takeaway"
        style="margin-top: 10px; border-left-color: var(--ac-red)"
      >
        当 AI 给你正面的东西时，你必须思考它没有给你的东西——<strong
          >它给得越干脆、越完整，越要追问：被省略掉的，是什么？</strong
        >
      </div>
    </Step>
    <div class="ac-footer"><span>四 · 压缩失真</span><span>21 / 28</span></div>
  </Slide>
</template>

<notes lang="md">
让观众看到离群点如何在漏斗中消失。补回主次矛盾的辩证解释，并保留完整的“主干 + 留白清单”提示词。
</notes>
