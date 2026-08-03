<template>
  <Slide class="slide">
    <div class="top">
      <div class="kicker">四、工具与权限</div>
      <div class="chapter">30 / 49</div>
    </div>
    <h2 data-node="title">这轮授的权，换个对话/子代理/Hook 还算数吗？</h2>
    <p data-node="subtitle" class="subtitle">
      这是使用者最容易踩坑的地方。答案得分情况——记住下面这张表，基本就不会误判了。
    </p>
    <div data-node="grid-1" class="grid two" style="margin-top: 12px">
      <table data-node="matrix-1" class="matrix">
        <tr>
          <th>你在哪授的权</th>
          <th>换个场景还算数吗</th>
        </tr>
        <tr>
          <td>Bash "不再问"</td>
          <td>
            <span class="yes">算</span> · 写进
            <code>.claude/settings.local.json</code
            >，<b>同一仓库跨会话</b>都记得
          </td>
        </tr>
        <tr>
          <td>文件编辑 "不再问"</td>
          <td>
            <span class="no">不算</span> · 只在<b>当前会话</b>有效，重开就没了
          </td>
        </tr>
        <tr>
          <td>主代理 → 子代理</td>
          <td>
            <span class="yes">默认继承</span> · 可在子代理 frontmatter 用
            <code>tools</code>/<code>disallowedTools</code>/<code
              >permissionMode</code
            >
            收窄
          </td>
        </tr>
        <tr>
          <td>Hook 与权限</td>
          <td>
            Hook 跑在<b>前面</b> · <code>PreToolUse</code> 能返回
            allow/deny/ask，但盖不过静态硬 deny
          </td>
        </tr>
      </table>
      <div>
        <div data-node="code-1" class="code-cap">
          粒度：能精确到命令前缀、目录、参数
        </div>
        <div data-node="code-2" class="code">
          <span class="c"># .claude/settings.json —— 按需自定义</span>
          <span class="k">"permissions"</span>: {
          <span class="k">"allow"</span>: [<span class="s"
            >"Bash(npm test *)"</span
          >, <span class="s">"Edit(src/**)"</span>],
          <span class="k">"ask"</span>: [<span class="s"
            >"Bash(git push *)"</span
          >], <span class="k">"deny"</span>: [<span class="s"
            >"Read(./.env)"</span
          >, <span class="s">"Bash(rm -rf *)"</span>] }
        </div>
        <div class="band orange-band" style="margin-top: 14px">
          <b>记住：多层规则是"合并"的。</b>各来源的 allow/ask/deny 叠加，<b
            >deny 永远最硬</b
          >。不确定当前生效哪条，用 <code>/permissions</code> 看。
        </div>
      </div>
    </div>
    <div class="foot">
      <span
        >能管到命令前缀、目录、参数这一级；跨会话记不记得，取决于写进了哪个文件</span
      ><span>30</span>
    </div>
  </Slide>
</template>

<notes lang="md">
专门回答大家最疑惑的：这轮授的权，换个场景还算不算数。逐格讲：Bash 的不再问会写进 settings.local.json，同一个仓库跨会话都记得；文件编辑的不再问只当次有效。子代理默认继承父的权限，可以用 frontmatter 收窄。Hook 跑在权限之前，能 allow/deny/ask，但盖不过硬 deny。最后给粒度和五级优先级，告诉大家怎么自定义。
</notes>
