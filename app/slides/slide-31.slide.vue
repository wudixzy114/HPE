<template>
  <Slide class="slide application-slide">
    <div class="top">
      <div class="kicker">四、工具与权限</div>
      <div class="chapter">31 / 49</div>
    </div>
    <h2 data-node="title">应用：怎么把权限配到既不烦人又不失控？</h2>
    <p data-node="subtitle" class="subtitle">
      讲完分档、决策管线、模式、Bash
      拆解、删除与路径、跨场景复用，落到实操：写规则、切模式、查来源。
    </p>
    <div data-node="grid-1" class="grid three" style="margin-top: 34px">
      <div class="card">
        <div class="label">01 · 写对三类规则</div>
        <p>
          <b>allow / ask / deny</b><br />精确到命令前缀、目录、参数；<code
            >deny</code
          >
          恒赢。危险命令进 ask，密钥路径进 deny。
        </p>
      </div>
      <div class="card">
        <div class="label">02 · 用对模式</div>
        <p>
          <b>Shift+Tab 切档</b><br />探索用 plan、批量编辑用 acceptEdits；记住
          bypass ≠ 无人值守、acceptEdits ≠ 自动跑一切。
        </p>
      </div>
      <div class="card">
        <div class="label">03 · 查生效来源</div>
        <p>
          <b>/permissions</b
          ><br />不确定当前哪条生效、来自哪个文件，直接查；规则是合并不是覆盖。
        </p>
      </div>
    </div>
    <div class="band purple-band" style="margin-top: 30px">
      <b>本节落地：</b
      >权限体验要能解释、能最小授权、能撤回——否则用户迟早"全放开"，治理就白设计。
    </div>
    <div class="foot">
      <span>应用页 · 工具与权限 · 后续补团队 settings.json 样例</span
      ><span>31</span>
    </div>
  </Slide>
</template>

<notes lang="md">
应用页（骨架）。应用：怎么把权限配到既不烦人又不失控？ 先固定排布与小节落点，后续补入团队真实案例、命令与截图。
</notes>
