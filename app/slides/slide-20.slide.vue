<template>
  <Slide class="slide">
    <div class="top">
      <div class="kicker">四、工具与权限</div>
      <div class="chapter">20 / 49</div>
    </div>
    <h2 data-node="title">权限不是弹窗，是按风险分档放行</h2>
    <p data-node="subtitle" class="subtitle">
      问得太多，你烦了就点"全放开"；问得太少，你又不敢真让它自己跑。出路是把不同风险，放进不同速度的通道——<b
        >而这四档，正好对应你配置里的三类规则 + 一个模式</b
      >。
    </p>
    <div data-node="permission-1" class="permission">
      <div class="level allow">
        <div class="tag">低风险 / 规则明确</div>
        <h3>直接放</h3>
        <p>只读的搜索、在限定范围里的常规操作。</p>
        <div class="divider"></div>
        <p class="small">
          你怎么落到这档：写
          <code>allow</code> 规则，或弹窗点<b>「是，以后别问」</b>。
        </p>
      </div>
      <div class="level ask">
        <div class="tag">要改状态 / 先问一句</div>
        <h3>问你</h3>
        <p>写文件、跑命令、跨系统的操作。</p>
        <div class="divider"></div>
        <p class="small">
          你怎么落到这档：写
          <code>ask</code> 规则，或弹窗点<b>「是，只这一次」</b>。
        </p>
      </div>
      <div class="level deny">
        <div class="tag">不能接受 / 撞红线</div>
        <h3>拦住</h3>
        <p>敏感路径、危险命令、违反组织策略。</p>
        <div class="divider"></div>
        <p class="small">
          你怎么落到这档：写
          <code>deny</code> 规则，或弹窗点<b>「否，让它换个做法」</b>。
        </p>
      </div>
      <div class="level auto">
        <div class="tag">受控的自动档</div>
        <h3>放宽</h3>
        <p>在限定范围和策略下，少问几遍。</p>
        <div class="divider"></div>
        <p class="small">
          你怎么落到这档：<code>Shift+Tab</code> 切到
          <b>auto / acceptEdits</b> 模式（不是规则，是模式）。
        </p>
      </div>
    </div>
    <div class="band" style="margin-top: 26px">
      <b>它判断时看的不只是这条命令：</b
      >工具类型、参数、路径、在哪个目录、项目规则、组织策略、当前模式、还有你之前的选择，一起决定。<b>前三档你用规则配，第四档你用模式切</b>——下一页看它到底按什么顺序判。
    </div>
    <div class="foot">
      <span>"允许 npm test"和"允许任意 shell"，是完全两码事的授权</span
      ><span>20</span>
    </div>
  </Slide>
</template>

<notes lang="md">
第三专题。先摆矛盾：老弹窗问你，烦到你直接全放开；不问，又不敢信它。所以权限不是一个 yes/no 弹窗，是按风险分档的策略。强调决策看的不只是这条命令，还有工具类型、路径、目录、项目规则、组织策略一起。下一页会亲手点给大家看，再下一页专门回答换个对话还算不算数。
</notes>
