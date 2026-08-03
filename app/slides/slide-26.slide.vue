<template>
  <Slide class="slide">
    <div class="top">
      <div class="kicker">四、工具与权限</div>
      <div class="chapter">26 / 49</div>
    </div>
    <h2 data-node="title">我配的规则，谁盖谁、什么时候生效</h2>
    <p data-node="subtitle" class="subtitle">
      先记一句最容易踩的：权限规则是<b>合并，不是覆盖</b>。各来源的 allow / ask
      / deny 全叠起来，再按 deny → ask → allow 判。
    </p>
    <div
      data-node="grid-1"
      class="grid two"
      style="margin-top: 14px; align-items: start"
    >
      <div>
        <div data-node="code-1" class="code-cap">五级优先级（高 → 低）</div>
        <div data-node="priostack-1" class="priostack">
          <div class="ptier"><b>企业 managed</b><span>谁都改不了</span></div>
          <div class="ptier">
            <b>命令行参数</b><span>本次会话临时覆盖</span>
          </div>
          <div class="ptier">
            <b>项目 local</b><code>settings.local.json</code>
          </div>
          <div class="ptier"><b>项目共享</b><code>settings.json</code></div>
          <div class="ptier"><b>用户</b><code>~/.claude</code></div>
        </div>
        <div class="band" style="margin-top: 14px">
          <b>任何一级写了 deny，别处都 allow 不回来。</b>deny 从任意来源都先于
          allow 判。
        </div>
      </div>
      <div class="cmds">
        <div class="card">
          <div class="label">① 合并，不是覆盖</div>
          <p>
            别以为高优先级会把低优先级<b>整段盖掉</b>。三类规则各自叠加，只有同一条被更高级的
            deny 命中才失效。
          </p>
        </div>
        <div class="card">
          <div class="label">② 工作区信任弹窗</div>
          <p>
            项目 <code>settings.json</code> 里的 <b>allow 规则</b>和
            <code>additionalDirectories</code>
            是"给能力"，<b>必须先点信任这个文件夹才生效</b>；没点之前读到但不应用。deny
            / ask 只做限制，不受此限。
          </p>
        </div>
        <div class="card">
          <div class="label">③ 热更新 vs 重启</div>
          <p>
            权限、hook 规则改完<b>即时生效</b>；模式切换用
            <code>Shift+Tab</code> 或启动参数。不确定当前生效哪条，<code
              >/permissions</code
            >
            看来源。
          </p>
        </div>
      </div>
    </div>
    <div class="foot">
      <span>合并不覆盖 · 项目 allow 要先信任 · deny 恒赢</span><span>26</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这页回答：我配的规则，读哪些、谁盖谁、什么时候才真生效。左边五级优先级从高到低：企业 managed 谁也改不了、命令行参数、项目 local settings.local.json、项目共享 settings.json、用户 ~/.claude。最关键一句：权限规则是合并不是覆盖——各来源的 allow/ask/deny 全叠加到一起，然后按 deny→ask→allow 判，所以任何一级写了 deny，别的地方都 allow 不回来。右边三个坑：一，合并不覆盖，别以为高优先级会把低优先级整段盖掉；二，工作区信任弹窗——项目 settings.json 里的 allow 规则和 additionalDirectories 属于给能力，必须你先点了信任这个文件夹才生效，没点之前读到但不应用，deny/ask 不受这限制因为它们只做限制；settings.local.json 是你自己的文件一般免信任。三，热更新还是重启：权限和 hook 规则改完即时生效，模式切换用 Shift+Tab 或启动参数。落脚：不确定当前生效哪条，直接 /permissions 看，它会告诉你每条规则来自哪个文件。
</notes>
