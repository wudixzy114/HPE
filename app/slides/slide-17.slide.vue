<template>
  <Slide class="slide">
    <div class="top">
      <div class="kicker">三、上下文与记忆</div>
      <div class="chapter">17 / 49</div>
    </div>
    <h2 data-node="title">会话记忆：它怎么自己记笔记，能写多少</h2>
    <p data-node="subtitle" class="subtitle">
      上一页那条
      <code>summary.md</code
      >，是它在后台自动帮你记的。什么时候记、谁来记、能写多大——这三件事都有讲究。
    </p>
    <div
      data-node="grid-1"
      class="grid two"
      style="margin-top: 14px; align-items: start; gap: 26px"
    >
      <div>
        <div data-node="code-1" class="code-cap">
          自动抽取：双阈值触发 + fork 子代理去写
        </div>
        <div data-node="memflow-1" class="memflow">
          <div class="mstep">
            <i>1</i>
            <div>
              <b>攒够了才动</b
              ><span
                >首次到 <code>~10000 tokens</code> 才开抽；之后每
                <code>+5000 tokens</code> 且
                <code>≥3 次工具调用</code> 再更新一次</span
              >
            </div>
          </div>
          <div class="mstep">
            <i>2</i>
            <div>
              <b>不占主线程</b
              ><span>fork 一个后台子代理去抽，主对话继续往下跑</span>
            </div>
          </div>
          <div class="mstep">
            <i>3</i>
            <div>
              <b>最小权限锁死</b
              ><span
                >这个子代理<b>只能改 <code>summary.md</code> 这一个文件</b
                >，别的一律动不了</span
              >
            </div>
          </div>
          <div class="mstep">
            <i>4</i>
            <div>
              <b>压缩时会等它</b
              ><span
                >触发压缩前，主线程等这次抽取完成，<b>最多等 15 秒</b></span
              >
            </div>
          </div>
        </div>
        <div class="hint" style="margin-top: 10px">
          <b>为什么 fork 出去写？</b
          >抽摘要要调一次模型、耗时间，放后台不卡你；只给它一个文件的写权限，是怕它顺手改坏别的。
        </div>
      </div>
      <div>
        <div data-node="code-2" class="code-cap">
          能写多少？这里藏着一条信任边界
        </div>
        <table data-node="matrix-1" class="matrix">
          <tr>
            <th>哪种记忆</th>
            <th>大小限制</th>
            <th>为什么</th>
          </tr>
          <tr>
            <td>你手写的 <b>CLAUDE.md</b></td>
            <td><b>不设限</b></td>
            <td>你写的默认可信，愿写多少写多少</td>
          </tr>
          <tr>
            <td>机器攒的 <b>AutoMem/TeamMem</b></td>
            <td><code>≤ 40000 字</code></td>
            <td>机器生成不完全可信，得防它把窗口撑爆</td>
          </tr>
          <tr>
            <td>会话记忆 <b>summary.md</b></td>
            <td>约 9 段<br /><code>6000–10000 tokens</code> 量级</td>
            <td>够接上下文即可，不求全</td>
          </tr>
        </table>
        <div class="band orange-band" style="margin-top: 14px">
          <b>一句话记住这条取舍：</b
          >同样是记忆，<b>你亲手写的不限量、机器自动攒的卡上限</b>——限制卡在「谁写的、可不可信」这条线上。
        </div>
      </div>
    </div>
    <div class="foot">
      <span
        >阈值 10000 / 5000+3、上限 40000 字、超时 15s
        均取自逆向材料，讲的是量级与设计取舍，随版本变</span
      ><span>17</span>
    </div>
  </Slide>
</template>

<notes lang="md">
第二张记忆页，回答审核的两个细问：它怎么自己记笔记？能写多少、什么时候载入？左边讲会话记忆的自动生成机制——双阈值触发：首次到 10000 tokens 才开抽取，之后每涨 5000 tokens 且有 ≥3 次工具调用再更新一次（或某轮没调工具、到了自然断点也触发）。触发后不是主线程停下来写，而是 fork 一个后台子代理去抽，且用最小权限锁死——它只能编辑那一个 summary.md 文件，别的都动不了。压缩时主线程会等这个抽取，最多等 15 秒。右边讲容量与信任边界这个反直觉点：自动记忆 AutoMem/TeamMem 有 40000 字硬上限，但你亲手写的 CLAUDE.md 不设限——因为机器生成的内容不完全可信，要防它把窗口撑爆；你手写的默认信任。再给会话记忆的量级：约 9 段、总量级 6000–10000 tokens。数字随版本变，讲的是量级和设计取舍，不是精确值。
</notes>
