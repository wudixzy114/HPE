<template>
  <Slide class="slide">
    <div class="top">
      <div class="kicker">五、Hook 与扩展</div>
      <div class="chapter">43 / 49</div>
    </div>
    <h2 data-node="title">个人、团队、公司：三层配置怎么分工</h2>
    <p data-node="subtitle" class="subtitle">
      大多数人只用过自己的
      <code>~/.claude</code
      >。其实配置分三层——<b>个人偏好、团队规范、公司底线</b>，各有各的文件、各决定进不进
      git。
    </p>
    <div
      data-node="grid-1"
      class="grid two"
      style="margin-top: 12px; align-items: start; gap: 24px"
    >
      <div>
        <div data-node="code-1" class="code-cap">五层来源（高 → 低）</div>
        <div data-node="priostack-1" class="priostack">
          <div class="ptier">
            <b>公司 <code>managed-settings.json</code></b
            ><span>MDM 下发，<b>最高</b>，命令行也盖不掉</span>
          </div>
          <div class="ptier">
            <b>命令行参数</b><span>本次会话临时覆盖</span>
          </div>
          <div class="ptier">
            <b>项目私有 <code>.claude/settings.local.json</code></b
            ><span>gitignore，只你本机</span>
          </div>
          <div class="ptier">
            <b>项目共享 <code>.claude/settings.json</code></b
            ><span>进 git，团队共享</span>
          </div>
          <div class="ptier">
            <b>用户 <code>~/.claude/settings.json</code></b
            ><span>你的全局，不进 git</span>
          </div>
        </div>
        <div class="band red-band" style="margin-top: 12px">
          <b>关键两点：</b>公司 managed
          是<b>最高优先级</b>，命令行也覆盖不了它；再加上<b
            >「deny 规则恒赢、不受层级覆盖」</b
          >，用户再怎么 allow 也回不来——两重保障守住安全底线。
        </div>
      </div>
      <div>
        <div data-node="code-2" class="code-cap">
          公司 managed：强制 deny + 只信任 managed hook
        </div>
        <div data-node="code-3" class="code">
          <span class="c"># mac: /Library/Application Support/ClaudeCode/</span>
          <span class="c"># managed-settings.json（路径随 OS 变）</span>
          {
          <span class="k">"permissions"</span>: { <span class="k">"deny"</span>:
          [<span class="s">"Read(./.env)"</span>,
          <span class="s">"Bash(curl *)"</span>,
          <span class="s">"WebFetch"</span>] },
          <span class="k">"allowManagedHooksOnly"</span>:
          <span class="k">true</span> }
        </div>
        <div class="hint" style="margin-top: 8px">
          开了 <code>allowManagedHooksOnly</code>，用户/项目/插件的 hook
          <b>全被忽略</b>，只跑公司下发的 hook——防有人用 hook 绕治理。
        </div>
        <div data-node="code-4" class="code-cap" style="margin-top: 12px">
          个人放宽（<code>.local</code>，不进 git，不动团队文件）
        </div>
        <div data-node="code-5" class="code">
          <span class="c"># .claude/settings.local.json</span> {
          <span class="k">"permissions"</span>: {
          <span class="k">"allow"</span>: [<span class="s"
            >"Bash(npm run dev *)"</span
          >] } }
        </div>
      </div>
    </div>
    <div class="foot">
      <span
        >公司 managed 优先级最高 + deny 恒赢，双重守底线；团队规范进
        git；个人偏好放 .local</span
      ><span>43</span>
    </div>
  </Slide>
</template>

<notes lang="md">
新增页，回答审核点名的团队/公司/个人配置。大多数人只用自己的 ~/.claude，这页把三层摊开：个人、团队、公司(managed)，以及每层各是哪个文件、进不进 git。左边一张分层图，从下到上：公司 managed-settings.json(MDM 下发,最硬,用户改不了) → 用户 ~/.claude/settings.json(你的全局,不进 git) → 项目共享 .claude/settings.json(进 git 团队共享) → 项目私有 .claude/settings.local.json(gitignore 只你本机)。命令行参数当次临时覆盖。特别强调：公司 managed 是最高优先级——命令行也盖不掉它,而且它的 deny 规则恒赢、不受层级覆盖,用户 allow 不回来。两重保障守安全底线。右边给三个真实文件样例：一份团队 .claude/settings.json(权限+模型,提交 git)、一份公司 managed(强制 deny+只允许 managed hook)、一份个人 .local(自己放宽几条,不进 git)。落脚:安全底线用公司 managed 的 deny 兜,团队规范进 git 共享,个人偏好放 .local。managed 路径随 OS 变,mac 在 /Library/Application Support/ClaudeCode/。
</notes>
