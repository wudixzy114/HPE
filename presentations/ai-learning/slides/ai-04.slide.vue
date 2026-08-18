<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">二 · 学习的过程</div>
    <h2 data-node="title">五步不是五个散点，而是一轮不断升级的学习闭环</h2>

    <div data-node="cycle" class="ac-cycle ac-cycle--stable">
      <div class="ac-cycle-track" />
      <div class="ac-cycle-center">
        <b>学习闭环</b><span>每转一圈<br />沿金字塔上升一格</span>
      </div>
      <Step :at="1" class="ac-cycle-slot n1">
        <div class="ac-cycle-node">
          <b>① 采样输入</b><em>为学日益</em><span>把书读厚</span>
        </div>
      </Step>
      <Step :at="2" class="ac-cycle-slot n2">
        <div class="ac-cycle-node">
          <b>② 压缩建模</b><em>为道日损</em><span>把书读薄</span>
        </div>
      </Step>
      <Step :at="3" class="ac-cycle-slot n3">
        <div class="ac-cycle-node">
          <b>③ 迁移连接</b><em>举一反三</em><span>越用越活</span>
        </div>
      </Step>
      <Step :at="4" class="ac-cycle-slot n4">
        <div class="ac-cycle-node">
          <b>④ 实践检验</b><em>学而时习之</em><span>撞真实的墙</span>
        </div>
      </Step>
      <Step :at="5" class="ac-cycle-slot n5">
        <div class="ac-cycle-node">
          <b>⑤ 复盘迭代</b><em>吾日三省</em><span>跳出自己</span>
        </div>
      </Step>
      <span class="ac-cycle-arrow a1">→</span
      ><span class="ac-cycle-arrow a2">→</span>
      <span class="ac-cycle-arrow a3">→</span
      ><span class="ac-cycle-arrow a4">→</span
      ><span class="ac-cycle-arrow a5">→</span>
    </div>

    <div data-node="step-explanation" class="ac-cycle-explanations">
      <p class="base">
        深度、广度、读厚读薄、举一反三与实践，在这里被串成同一个过程。
      </p>
      <p class="s1">
        <b>① 采样输入：</b
        >大量接触案例、不同场景和极端情况；没有足够样本，后面的规律提炼就是无源之水。
      </p>
      <p class="s2">
        <b>② 压缩建模：</b
        >把细节蒸发，蒸馏出极简因果回路；检验标准不是能复述，而是能回答从未背过的问题。
      </p>
      <p class="s3">
        <b>③ 迁移连接：</b
        >把模型放到没见过的领域，寻找底层结构相同的“同构”关系。
      </p>
      <p class="s4">
        <b>④ 实践检验：</b
        >把纸面模型放回现实运行，暴露被压缩掉的变量，获得无法从语言中得到的反馈。
      </p>
      <p class="s5">
        <b>⑤ 复盘迭代：</b
        >跳出自己审视学习过程，再把修正结果喂回下一轮采样；循环因此不是原地重复。
      </p>
    </div>
    <div class="ac-footer"><span>二 · 五步闭环</span><span>05 / 28</span></div>
  </Slide>
</template>

<notes lang="md">
每个节点占据固定绝对位置，隐藏与显示都不会改变布局。底部说明随当前 step 切换，逐步解释五个步骤的完整含义。
</notes>
