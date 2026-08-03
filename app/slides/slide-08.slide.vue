<template>
  <Slide class="slide">
    <div class="top">
      <div class="kicker">二、循环与配置</div>
      <div class="chapter">08 / 49</div>
    </div>
    <h2 data-node="title">项目指令：不只分层，还能「改到某类文件才生效」</h2>
    <p data-node="subtitle" class="subtitle">
      承接上一页的配置文件——指令也一样有层级，而且比配置多一招：<code
        >.claude/rules/</code
      >
      条件规则，能让某条规矩<b>只在你动某类文件时</b>才进上下文。很多人没用过这个。
    </p>
    <div
      data-node="grid-1"
      class="grid two"
      style="margin-top: 12px; align-items: start; gap: 26px"
    >
      <div>
        <div data-node="code-1" class="code-cap">
          CLAUDE.md 四层：无条件加载（低 → 高覆盖）
        </div>
        <div data-node="priostack-1" class="priostack">
          <div class="ptier">
            <b>企业 <code>/etc/claude-code/CLAUDE.md</code></b
            ><span>MDM 下发，最硬</span>
          </div>
          <div class="ptier">
            <b>用户 <code>~/.claude/CLAUDE.md</code></b
            ><span>个人全局，不进 git</span>
          </div>
          <div class="ptier">
            <b>项目 <code>./CLAUDE.md</code>·<code>.claude/CLAUDE.md</code></b
            ><span>进 git，团队共享</span>
          </div>
          <div class="ptier">
            <b>条件 <code>.claude/rules/*.md</code></b
            ><span>命中 paths 才注入</span>
          </div>
          <div class="ptier">
            <b>私有 <code>CLAUDE.local.md</code></b
            ><span>gitignore，只你自己</span>
          </div>
        </div>
        <div class="band" style="margin-top: 12px">
          <b>@import 引用：</b>CLAUDE.md 里可写
          <code>@./coding-standards.md</code> 把别的文件拼进来——有防循环、限深度
          5、符号链接安全三重防护。
        </div>
      </div>
      <div>
        <div data-node="code-2" class="code-cap">
          条件规则：frontmatter 写 <code>paths</code>，按文件触发
        </div>
        <div data-node="code-3" class="code">
          <span class="c"># .claude/rules/frontend.md</span>
          <span class="k">---</span>
          <span class="k">paths</span>: -
          <span class="s">"src/components/**/*.tsx"</span> -
          <span class="s">"src/hooks/**/*.ts"</span>
          <span class="k">---</span>
          React 组件一律用函数组件，不用 class。 hooks 必须以 use 前缀命名。
        </div>
        <div class="band orange-band" style="margin-top: 12px">
          <b
            >只在改
            <code>src/components</code> 下的文件时，这条规矩才进上下文</b
          >；改后端时它根本不占位。这就是「最小权限」搬到 Prompt——尤其适合
          monorepo 前后端分治，省窗口、也少让模型分心。
        </div>
      </div>
    </div>
    <div class="foot">
      <span
        >会变的进度放会话摘要，别塞永久指令；跟文件强相关的规矩用 rules + paths
        按需触发（字段名取自逆向材料，随版本变）</span
      ><span>08</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这页接着上一页的配置文件讲，回答一个很实的问题：项目指令除了分层，还能不能'只在改某类文件时才生效'？能——这就是 .claude/rules 条件规则，很多人没用过。别把项目规矩写成一大段永远在场的长 Prompt，那样既费上下文、模型遵循度还下降。CLAUDE.md 是无条件加载（四层覆盖链：企业 /etc/claude-code → 用户 ~/.claude → 项目 repo 根和 .claude → 条件规则 .claude/rules → 私有 CLAUDE.local.md）。而 .claude/rules/*.md 是条件规则：frontmatter 里写 paths（源码内部字段叫 globs），只有当 glob 匹配到当前在改的文件时，这条规则才注入。举例：前端组件规范只在改 src/components 下的 tsx 时才进上下文，改后端时根本不占位。这是'最小权限原则'搬到 Prompt 工程，尤其适合 monorepo 前后端分治。再提一句 @import：CLAUDE.md 里能用 @./path 引另一个文件，有防循环、限深度 5、符号链接安全三重防护。落脚：会变的进度别塞永久指令，放会话摘要；跟文件强相关的规矩用 rules+paths 按需触发。字段名和路径取自逆向材料，随版本变。
</notes>
