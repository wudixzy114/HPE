<template>
  <Slide class="slide">
    <div class="top">
      <div class="kicker">四、工具与权限</div>
      <div class="chapter">28 / 49</div>
    </div>
    <h2 data-node="title">一条 Bash 命令，是被拆开来判的</h2>
    <p data-node="subtitle" class="subtitle">
      上页 <code>echo "$(cat .env)"</code> 为什么被拦？因为 Bash
      不拿整行撞规则——先剥壳、再拆成子命令，<b>每一段都要单独过</b>，一段不过整条不过。
    </p>
    <div
      data-node="grid-1"
      class="grid two"
      style="margin-top: 14px; align-items: start"
    >
      <div class="cmds">
        <div class="card">
          <div class="label">① 先剥掉包装前缀</div>
          <p>
            <code>timeout time nice nohup stdbuf command builtin xargs</code>
            会被<b>剥掉</b>，拿里面真正的命令去判。想用
            <code>timeout rm -rf /</code> 绕过？剥完照样撞熔断。
          </p>
        </div>
        <div class="card">
          <div class="label">② 拆复合命令，逐段匹配</div>
          <p>
            <code>&amp;&amp;</code> <code>||</code> <code>|</code>
            <code>;</code> 和命令替换 <code>$(…)</code>
            <code>&lt;(…)</code>
            全部拆开。<b>任何一段不过，整条就不过</b>——<code
              >echo "$(cat .env)"</code
            >
            里 echo 无害，但内联的 <code>cat .env</code> 命中了
            deny，于是整条被拦。
          </p>
        </div>
      </div>
      <div class="cmds">
        <div class="card">
          <div class="label">③ 只读内建：不用问</div>
          <p>
            <code
              >ls cat echo pwd head tail grep find wc which diff stat du</code
            >
            + 只读 git，直接放。<b>但一旦和危险段复合，这条豁免就不算数了。</b>
          </p>
        </div>
        <div class="card">
          <div class="label">④ 通配符看边界（<code>*</code> 可在任意位置）</div>
          <table data-node="matrix-1" class="matrix" style="margin-top: 4px">
            <tr>
              <th>规则写法</th>
              <th>能匹配到</th>
            </tr>
            <tr>
              <td><code>Bash(ls *)</code></td>
              <td>
                <span class="yes">ls -la</span>；<span class="no"
                  >lsof 不算</span
                >
                —— 空格是词边界
              </td>
            </tr>
            <tr>
              <td><code>Bash(git * main)</code></td>
              <td>
                <span class="yes">git checkout main</span> /
                <span class="yes">git push origin main</span> ——
                <code>*</code> 能在中间
              </td>
            </tr>
            <tr>
              <td><code>Bash(ls)</code></td>
              <td>
                只精确 <span class="yes">ls</span>；<span class="no"
                  >ls -la 不算</span
                >
              </td>
            </tr>
            <tr>
              <td><code>deny Read(./.env)</code></td>
              <td>顺带盖住 <code>cat/head/tail/sed .env</code></td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <div class="band red-band" style="margin-top: 16px">
      <b>一句话：</b
      >常见的绕过花招（换个包装、藏进管道、用等价读法），基本都被这套"剥壳 +
      拆段 + 逐段过"堵住了。
    </div>
    <div class="foot">
      <span
        >把整行拆成一段段单独判，是 Bash 权限最容易被误解、也最关键的一环</span
      ><span>28</span>
    </div>
  </Slide>
</template>

<notes lang="md">
上页那条 echo $(cat .env) 为什么会被拦？这页拆给大家看：Bash 命令不是拿整行去撞规则，是先做一串静态校验再逐段匹配。讲四件事。第一，剥壳：timeout/time/nice/nohup/xargs 这些包装前缀会被先剥掉，拿里面真正的命令去判——所以你别想用 timeout rm -rf / 绕过。第二，拆复合：&&、||、|、; 、以及 $(...) <(...) 命令替换，都会被拆成一个个子命令，每一段都要单独过规则，任何一段不过整条就不过——这就是 echo $(cat .env) 被拦的原因，echo 本身无害，但内联的 cat .env 命中了 deny Read(.env)。第三，只读内建直接放：ls cat echo pwd head tail grep find wc which diff stat 这些加只读的 git，不用问——但注意，一旦和危险段复合就不算数了。第四，通配符讲边界：星号可以出现在命令任意位置——Bash(ls *) 匹配 ls -la 但不匹配 lsof，那个空格是词边界；Bash(git * main) 里星号在中间，git checkout main、git push origin main 都命中。不带星号的 Bash(ls) 只精确匹配 ls 一条。还有 Read/Edit 的 deny 会顺带盖住 cat/head/tail/sed 这些等价读法。收尾一句：绕过的花招基本都被这套拆解堵掉了。
</notes>
