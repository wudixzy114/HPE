<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">二 · 学习的过程</div>
    <h2 data-node="title">五步，一个循环：每转一圈，都沿金字塔往上爬一格</h2>

    <div data-node="cycle" class="ac-cycle">
      <div class="ac-cycle-track" />
      <div class="ac-cycle-center">
        <b>学习闭环</b><span>不是直线<br />不是原地重复</span>
      </div>
      <Step :at="1">
        <div class="ac-cycle-node n1">
          <b>① 采样输入</b><em>为学日益</em><span>把书读厚 · 做加法</span>
        </div>
      </Step>
      <Step :at="2">
        <div class="ac-cycle-node n2">
          <b>② 压缩建模</b><em>为道日损</em><span>把书读薄 · 做减法</span>
        </div>
      </Step>
      <Step :at="3">
        <div class="ac-cycle-node n3">
          <b>③ 迁移连接</b><em>举一反三</em><span>寻找同构 · 越用越活</span>
        </div>
      </Step>
      <Step :at="4">
        <div class="ac-cycle-node n4">
          <b>④ 实践检验</b><em>学而时习之</em><span>撞真实的墙 · 拿反馈</span>
        </div>
      </Step>
      <Step :at="5">
        <div class="ac-cycle-node n5">
          <b>⑤ 复盘迭代</b><em>吾日三省</em><span>跳出自己 · 修正系统</span>
        </div>
      </Step>
      <span class="ac-cycle-arrow a1">→</span
      ><span class="ac-cycle-arrow a2">→</span>
      <span class="ac-cycle-arrow a3">→</span
      ><span class="ac-cycle-arrow a4">→</span
      ><span class="ac-cycle-arrow a5">→</span>
    </div>
    <div class="ac-takeaway">
      ⑤ 的产出喂回 ①：下一圈采样更准、压缩更狠、迁移更快。
    </div>
    <div class="ac-footer"><span>二 · 五步闭环</span><span>05 / 28</span></div>
  </Slide>
</template>

<notes lang="md">
五步按顺序揭示。最后指出这是螺旋上升，不是原地绕圈。
</notes>
