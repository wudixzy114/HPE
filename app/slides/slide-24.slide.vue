<template>
  <Slide class="slide slide-19-density">
    <div class="top">
      <div class="kicker">四、工具与权限</div>
      <div class="chapter">24 / 49</div>
    </div>
    <h2 data-node="title">四种模式（其实六种），各免问什么</h2>
    <p data-node="subtitle" class="subtitle">
      Shift+Tab 默认只在前三种间循环；auto 要账号达标才出现，dontAsk
      只能用参数进，bypass 要显式开。免问的范围差别很大。
    </p>
    <table data-node="matrix-1" class="matrix modes-matrix">
      <tr>
        <th>模式</th>
        <th>不用问就能做</th>
        <th>关键约束</th>
      </tr>
      <tr>
        <td>default<br /><span class="mnote">(Manual)</span></td>
        <td>只读</td>
        <td>每个工具<b>首次</b>用都要问</td>
      </tr>
      <tr>
        <td>acceptEdits</td>
        <td>
          只读 + 文件编辑 + 常见 fs 命令<br /><code
            >mkdir touch rm mv cp sed</code
          >
        </td>
        <td>范围外路径、受保护路径、<b>其它 Bash 命令仍问</b></td>
      </tr>
      <tr>
        <td>plan</td>
        <td>只读</td>
        <td>探索期<b>不改源码</b>；命令仍问</td>
      </tr>
      <tr>
        <td>auto</td>
        <td>几乎全部</td>
        <td>后台分类器审；<b>3 连 / 20 累计</b>被拦则降级回弹窗</td>
      </tr>
      <tr>
        <td>dontAsk</td>
        <td>只跑<b>预授权</b>（allow 规则 + 只读内建）</td>
        <td>本该问的一律<b>拒</b>，含 <code>AskUserQuestion</code></td>
      </tr>
      <tr>
        <td>bypassPermissions</td>
        <td>几乎全部</td>
        <td>见下方红框——<b>不等于无人值守</b></td>
      </tr>
    </table>
    <div
      data-node="grid-1"
      class="grid two"
      style="margin-top: 18px; gap: 16px"
    >
      <div class="band red-band">
        <b>bypass 仍会拦这 5 类：</b>① 显式 <code>ask</code> 规则；② 组织设成
        ask 的 connector 工具；③ 标了 <code>requiresUserInteraction</code> 的
        MCP 工具；④ <code>rm -rf /</code>、<code>rm -rf ~</code> 熔断（含
        <code>$(...)</code> 包裹）；⑤ 写 <code>.git</code>/<code>.claude</code>
        等<b>受保护路径</b>——安全检查排在 bypass 判断之前，连 bypass
        也强制先问（防"改权限根基文件自我提权"）。
      </div>
      <div class="band orange-band">
        <b>acceptEdits 的边界：</b>它只自动放<b>编辑类 + 那几个 fs 命令</b
        >，且限工作目录内。其它 Bash 命令、范围外路径、写
        <code>.git</code>/<code>.claude</code>
        这类受保护路径，<b>照样问你</b>。别当成"自动跑一切"。
      </div>
    </div>
    <div class="foot">
      <span>Shift+Tab 切档 · bypass ≠ 无人值守 · acceptEdits ≠ 自动跑一切</span
      ><span>24</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这页专门回答：四种（其实六种）模式到底各免问什么，尤其 bypass 是不是真的什么都不用管。先把六种一次摆清楚——CLI 里 Shift+Tab 默认只在 Manual、acceptEdits、Plan 三种间循环，auto 要账号达标才出现，dontAsk 只能用参数进，bypass 要显式开。逐行讲免问什么：Manual 只免只读；acceptEdits 多免文件编辑和常见文件系统命令 mkdir/touch/rm/mv/cp/sed，但仅限工作目录内；Plan 只读、且不改源码；auto 几乎全放但后台有分类器审、还有 3 连 20 累计的熔断降级；dontAsk 只跑预授权的、其余一律拒，连 AskUserQuestion 都拒；bypass 几乎全放。然后是全场这页最想强调的两个反直觉点，放在下面两条框里。第一，bypass 不等于无人值守——它仍会拦五类：显式 ask 规则、组织把 connector 设成 ask 的、MCP 标了需要交互的、rm -rf / 和 ~ 这种熔断（v2.1.208 起连 $() 包起来的也拦），以及写 .git/.claude 这类受保护路径——受保护路径的安全检查排在 bypass 判断之前，所以连 bypass 也拦、强制先问，防的是改掉权限根基文件来自我提权。第二，acceptEdits 不是自动跑一切，它只自动放编辑类和那几个文件系统命令，其它 Bash 命令、范围外路径、受保护路径照样问你。
</notes>
