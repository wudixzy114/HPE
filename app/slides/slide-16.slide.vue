<template>
  <Slide class="slide slide-14-density">
    <div class="top">
      <div class="kicker">三、上下文与记忆</div>
      <div class="chapter">16 / 49</div>
    </div>
    <h2 data-node="title">记忆不只一个 CLAUDE.md——到底有几种、存哪</h2>
    <p data-node="subtitle" class="subtitle">
      「记忆」就是把东西持久化，下次开会话还在。它其实有好几路：有你手写的，有它自己在后台攒的。先分清谁是谁。
    </p>
    <div
      data-node="grid-1"
      class="grid two"
      style="margin-top: 12px; align-items: start; gap: 24px"
    >
      <div>
        <table data-node="matrix-1" class="matrix memk-matrix">
          <tr>
            <th>种类</th>
            <th>存在哪</th>
            <th>谁写</th>
            <th>跨会话</th>
          </tr>
          <tr>
            <td><b>CLAUDE.md</b> 指令记忆</td>
            <td>
              项目/用户/企业分层文件<br /><span class="mnote">见第 7 页</span>
            </td>
            <td>你手写</td>
            <td>在</td>
          </tr>
          <tr>
            <td>随口让它记 / <code>/memory</code></td>
            <td>
              对话里说「这条记进 CLAUDE.md」它就写；或
              <code>/memory</code> 挑作用域：<code>./CLAUDE.md</code> /
              <code>~/.claude</code> / <code>.local</code>
            </td>
            <td>你一句话</td>
            <td>在</td>
          </tr>
          <tr>
            <td>会话记忆<br /><span class="mnote">Session Memory</span></td>
            <td>后台自动生成 <code>summary.md</code></td>
            <td>模型<br />(fork 子代理)</td>
            <td>压缩/续接时接着用</td>
          </tr>
          <tr>
            <td>自动记忆 AutoMem<br />团队记忆 TeamMem</td>
            <td>memory 目录自动生成的文件</td>
            <td>系统/团队</td>
            <td>在<br /><span class="mnote">≤40000 字</span></td>
          </tr>
          <tr>
            <td>Agent/Scoped 记忆</td>
            <td>
              <code>.claude/agent-memory[-local]/&lt;type&gt;/</code
              ><br />user/project/local 三档
            </td>
            <td>子代理攒</td>
            <td>在<br /><span class="mnote">project 档进 git</span></td>
          </tr>
        </table>
        <div class="band purple-band" style="margin-top: 12px">
          <b>你能直接管的只有第一路</b
          >（CLAUDE.md，手写或让它帮你写）；后几路是它自己在后台攒。要它稳稳「记住」一条规矩，最靠谱还是<b
            >说「记进 CLAUDE.md」</b
          >或用 <code>/memory</code> 挑作用域写。
        </div>
      </div>
      <div>
        <div data-node="code-1" class="code-cap">
          自动记忆目录长相：<code>MEMORY.md</code> 只是索引，正文在分文件里
        </div>
        <div data-node="code-2" class="code">
          <span class="c"># ~/.claude/projects/&lt;项目hash&gt;/memory/</span>
          <span class="k">MEMORY.md</span>
          <span class="c"># 索引：每条一行，始终载入</span> ├─ user_role.md
          <span class="c"># type: user</span> ├─ feedback_style.md
          <span class="c"># type: feedback</span> └─ project_deck.md
          <span class="c"># type: project</span>

          <span class="c"># 单条记忆文件带 frontmatter：</span>
          <span class="k">---</span>
          <span class="k">name</span>: feedback-style
          <span class="k">description</span>:
          <span class="s">这人要口语化、重细节</span>
          <span class="k">metadata</span>: { <span class="k">type</span>:
          <span class="s">feedback</span> }
          <span class="k">---</span>
          正文写「怎么跟他配合」，可 [[link]] 别条。
        </div>
        <div class="hint" style="margin-top: 10px">
          <b>分 type：</b>user（他是谁）/ feedback（怎么配合）/
          project（在忙啥）/
          reference（东西在哪）。索引常驻上下文，正文按相关性才读。
        </div>
      </div>
    </div>
    <div class="foot">
      <span
        >Session/Agent/AutoMem 取自逆向材料；<code>/memory</code> 与 MEMORY.md
        自动记忆以本机实际运行为准，随版本变</span
      ><span>16</span>
    </div>
  </Slide>
</template>

<notes lang="md">
新增记忆页（审核点名的大缺口：记忆＝持久化）。开场先破一个误解：记忆不只有一个 CLAUDE.md。列清楚到底有几种、各存在哪、谁写的、跨会话还在不在、什么时候载入。左边一张对照表五行：①CLAUDE.md 指令记忆——你手写、进文件、每次启动拼进系统提示（分层细节第7页已讲）；②说人话 / /memory——直接说「记进 CLAUDE.md」它就写，或用 /memory 打开各层 CLAUDE.md 自己挑作用域；③会话记忆 Session Memory——后台模型自动生成 summary.md，压缩/续接时用；④自动记忆 AutoMem / 团队记忆 TeamMem——memory 目录里自动生成的文件，作为动态「记忆」段注入，有 40000 字上限；⑤Agent/Scoped 记忆——.claude/agent-memory 下 user/project/local 三档，子代理跨会话攒，project 档还能进 git 团队共享。右边给一个真实的自动记忆目录长相：MEMORY.md 只是索引，真正内容在一个个带 frontmatter 的 .md 文件里，按 type 分 user/feedback/project/reference。收尾一句：你能直接管的是 CLAUDE.md（手写或让它帮你写），其余大多是它自己攒的。资料边界要讲清：Session/Agent/AutoMem 出自逆向材料；/memory 和 MEMORY.md 自动记忆以本机实际运行为准。注意：老版本那个「输入 # 一句话弹三选一写进 CLAUDE.md」的快捷命令，当前版本官方文档里已经没有了，别再讲，改成说人话或 /memory。
</notes>
