<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">二 · 第③步</div>
    <h2 data-node="title">
      举一反三：三个看似无关的案例，底层都能找到同一套结构
    </h2>

    <div data-node="analogy-cases" class="ac-analogy-board">
      <div class="ac-analogy-head">
        <span>已知领域</span><span>结构联系</span><span>迁移领域</span>
      </div>

      <div class="ac-analogy-row row-a">
        <Step :at="1" class="ac-analogy-slot left">
          <section>
            <b>A · 病毒传播</b>
            <p>传染率、接触频次、易感人群，共同决定传播规模。</p>
          </section>
        </Step>
        <Step :at="3" class="ac-analogy-slot link">
          <div>传播动力学</div>
        </Step>
        <Step :at="2" class="ac-analogy-slot right">
          <section>
            <b>爆款内容裂变</b>
            <p>内容吸引力、曝光与分享频次、目标受众，共同决定扩散。</p>
          </section>
        </Step>
      </div>

      <div class="ac-analogy-row row-b">
        <Step :at="4" class="ac-analogy-slot left">
          <section>
            <b>B · 人体免疫系统</b>
            <p>识别异常 → 隔离危害 → 生成抗体 → 自我修复。</p>
          </section>
        </Step>
        <Step :at="6" class="ac-analogy-slot link">
          <div>异常治理闭环</div>
        </Step>
        <Step :at="5" class="ac-analogy-slot right">
          <section>
            <b>公司风控系统</b>
            <p>发现风险 → 阻断损失 → 沉淀规则 → 更新防线。</p>
          </section>
        </Step>
      </div>

      <div class="ac-analogy-row row-c">
        <Step :at="7" class="ac-analogy-slot left">
          <section>
            <b>C · 计算机缓存</b>
            <p>高频访问的数据放在离处理器最近的位置。</p>
          </section>
        </Step>
        <Step :at="9" class="ac-analogy-slot link">
          <div>用空间换访问成本</div>
        </Step>
        <Step :at="8" class="ac-analogy-slot right">
          <section>
            <b>工作记忆 / 便利店货架</b>
            <p>常用信息留在脑中，畅销商品摆在触手可及的位置。</p>
          </section>
        </Step>
      </div>
    </div>

    <Step :at="10">
      <div data-node="isomorphism" class="ac-isomorphism-reveal">
        <b>同构性</b
        ><span>表象不同，但变量之间的关系、反馈路径与约束结构相同</span>
      </div>
    </Step>
    <div class="ac-footer"><span>二 · 迁移连接</span><span>08 / 28</span></div>
  </Slide>
</template>

<notes lang="md">
每组严格按“左侧案例 → 右侧案例 → 中间联系”揭示；三组完成后才给出“同构性”的抽象定义。深度决定穿透力，广度决定创新可能性。
</notes>
