<template>
  <Slide class="slide">
    <div class="top">
      <div class="kicker">四、工具与权限</div>
      <div class="chapter">29 / 49</div>
    </div>
    <h2 data-node="title">"删根目录"拦得住，那"删一个文件"呢？</h2>
    <p data-node="subtitle" class="subtitle">
      删除危不危险，系统看的是<b>目标是什么、在不在范围、什么模式</b>——不是命令长什么样。删除分三档，路径要过安全校验。
    </p>
    <div
      data-node="grid-1"
      class="grid two"
      style="margin-top: 12px; align-items: start"
    >
      <div>
        <div data-node="code-1" class="code-cap">删除的三档</div>
        <div class="delrow deny">
          <b>硬熔断</b>
          <div>
            <code>rm -rf /</code> · <code>rm -rf ~</code
            ><span
              >任何模式都拦，<b>连 bypass 也拦</b>；v2.1.208 起
              <code>$(…)</code>
              <code>&lt;(…)</code>
              包裹的变体一并拦。只熔断"注定毁灭级"，不是所有 rm。</span
            >
          </div>
        </div>
        <div class="delrow ask">
          <b>删具体文件</b>
          <div>
            <code>rm build/output.js</code
            ><span
              >不撞熔断，看模式：Manual <b>问</b> / acceptEdits 是目录内 fs 命令
              <b>放</b> / bypass <b>放</b>。你若写
              <code>deny Bash(rm *)</code> 则任何模式都拦。</span
            >
          </div>
        </div>
        <div class="delrow out">
          <b>越界删</b>
          <div>
            删到工作目录外<span
              >任何<b>非 bypass</b> 模式都不自动放；bypass
              可放。删<b>受保护目录</b>则连 bypass 也先问（见下）。</span
            >
          </div>
        </div>
      </div>
      <div>
        <div data-node="code-2" class="code-cap">路径安全校验</div>
        <div class="card">
          <div class="label">规整成绝对路径再判</div>
          <p>
            相对路径、<code>..</code>、软链接都会先规整成绝对路径，再拿去匹配规则和范围。
          </p>
        </div>
        <div class="card" style="margin-top: 12px">
          <div class="label">和符号链接较劲（堵 TOCTOU）</div>
          <p>
            <b>allow</b> 要求<b>软链接和它指向的目标都匹配</b>才放行；<b
              >deny</b
            >
            只要沾上任意一边就拦。防止先建个软链接再偷换目标。
          </p>
        </div>
        <div class="card" style="margin-top: 12px">
          <div class="label">受保护目录</div>
          <p>
            <code>.git</code> <code>.claude</code>(除 worktrees)
            <code>.ssh</code> <code>.vscode</code> <code>.idea</code> 等。写入<b
              >任何模式都不自动放，连 bypass 也强制先问</b
            >——安全检查排在 bypass 判断之前，防"改权限根基文件自我提权"。
          </p>
        </div>
      </div>
    </div>
    <div class="foot">
      <span
        >同样一条
        rm，删根目录永远拦、删范围内的文件按模式判——判的是目标和范围</span
      ><span>29</span>
    </div>
  </Slide>
</template>

<notes lang="md">
专门回答那个具体问题：rm -rf / 明显该拦，但删一个具体文件到底怎么判？这页把"删除"和"路径"两件事讲透。上半：删除分三档。第一档，rm -rf / 和 rm -rf ~ 是硬熔断，任何模式都拦，连 bypass 都拦，而且 v2.1.208 起把 $(...)、<() 包起来的变体也一起拦；注意这是"命令注定失败/毁灭级"才熔断，不是所有 rm 都拦。第二档，删具体文件比如 rm build/output.js，本身不撞熔断，怎么判看模式和范围：Manual 下要问、acceptEdits 因为是工作目录内的 fs 命令直接放、bypass 放；如果你写了 deny Bash(rm *) 那就任何模式都拦。第三档，删到工作目录外，任何非 bypass 模式都不自动放（bypass 可放）；但删受保护目录连 bypass 也先问。下半讲路径校验：所有文件操作路径都会被规整成绝对路径再判，还会跟符号链接较劲——allow 要求软链接和它指向的目标都匹配才放，deny 只要沾一边就拦，堵 TOCTOU。受保护目录清单 .git .claude(除 worktrees) .ssh .vscode .idea 等，这些的写入任何模式都不自动放、连 bypass 也强制先问，因为安全检查排在 bypass 判断之前，防的是改掉权限根基文件来自我提权。落脚：删除危不危险，系统看的是"目标是什么、在不在范围、什么模式"，不是命令长什么样。
</notes>
