<template>
  <Slide class="slide">
    <div class="top">
      <div class="kicker">二、循环与配置</div>
      <div class="chapter">07 / 49</div>
    </div>
    <h2 data-node="title">配置读哪些、谁盖谁、改完要不要重启？</h2>
    <p data-node="subtitle" class="subtitle">
      这几个问题最容易踩坑：同一条规则在不同项目表现不一样，多半是优先级和"合并还是覆盖"没搞清。
    </p>
    <div data-node="grid-1" class="grid two" style="margin-top: 14px">
      <div>
        <div data-node="code-1" class="code-cap">
          settings.json 五级优先级（高 → 低）
        </div>
        <div data-node="priostack-1" class="priostack">
          <div class="ptier">
            <b>企业 managed</b
            ><span
              >组织下发的
              <code>managed-settings.json</code>，放在系统级目录（macOS
              <code>/Library/Application Support/ClaudeCode/</code>），由 MDM
              统一推送，谁都盖不掉</span
            >
          </div>
          <div class="ptier">
            <b>命令行参数</b
            ><span
              >本次启动临时指定，如
              <code>--permission-mode plan</code
              >、<code>--dangerously-skip-permissions</code>（跳过绝大多数确认）、<code
                >--add-dir ../lib</code
              ></span
            >
          </div>
          <div class="ptier">
            <b>项目本地 <code>.claude/settings.local.json</code></b
            ><span>只你自己、不提交 git</span>
          </div>
          <div class="ptier">
            <b>项目共享 <code>.claude/settings.json</code></b
            ><span>随仓库提交，团队共享</span>
          </div>
          <div class="ptier">
            <b>用户 <code>~/.claude/settings.json</code></b
            ><span>你所有项目的兜底</span>
          </div>
        </div>
        <div class="band" style="margin-top: 12px">
          <b>注意：权限规则走"合并"，不走"覆盖"。</b
          >高优先级不会把低优先级整份盖掉；各层的 allow / ask / deny
          叠加在一起生效。
        </div>
      </div>
      <div>
        <div data-node="code-2" class="code-cap">改完要重启吗？大多不用</div>
        <table data-node="matrix-1" class="matrix">
          <tr>
            <th>改什么</th>
            <th>生效方式</th>
          </tr>
          <tr>
            <td>权限规则</td>
            <td><span class="yes">实时</span> · 热更新，改完即生效</td>
          </tr>
          <tr>
            <td>Hook 配置</td>
            <td><span class="yes">实时</span> · 热重载，不用重启</td>
          </tr>
          <tr>
            <td><code>model</code></td>
            <td><span class="no">要重启</span> · 换模型需新会话</td>
          </tr>
          <tr>
            <td><code>outputStyle</code></td>
            <td><span class="no">要重启</span></td>
          </tr>
        </table>
        <div data-node="code-3" class="code-cap" style="margin-top: 16px">
          CLAUDE.md 也分四层（跨会话长期记忆）
        </div>
        <table data-node="matrix-2" class="matrix">
          <tr>
            <td>企业</td>
            <td>组织策略，优先级最高</td>
          </tr>
          <tr>
            <td><code>~/.claude/CLAUDE.md</code></td>
            <td>你所有项目通用的个人习惯</td>
          </tr>
          <tr>
            <td><code>./CLAUDE.md</code></td>
            <td>随仓库提交，团队共享</td>
          </tr>
          <tr>
            <td><code>CLAUDE.local.md</code></td>
            <td>只你自己、不提交</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="foot">
      <span>不确定当前生效的是哪条，用 /permissions、/context 看真实结果</span
      ><span>07</span>
    </div>
  </Slide>
</template>

<notes lang="md">
接着讲配置——它和循环一样，是启动就定下的宏观设置，所以放在这一章。直接回答审核问的：配置文件读哪些？优先级什么？按什么顺序覆盖？加载后锁定还是运行时能改？分两张表。左边 settings.json 的五级优先级，高到低：企业 managed、命令行参数、项目本地 settings.local.json、项目共享 settings.json、用户 ~/.claude。强调一点：权限规则是合并不是覆盖。右边讲生效方式：大多数实时热更新（权限、hook 改完就生效），例外是 model 和 outputStyle 要重启。再顺带把 CLAUDE.md 那四层放上来。落脚：别把该热更新的当成要重启，也别以为高优先级会把低优先级整个盖掉。
</notes>
