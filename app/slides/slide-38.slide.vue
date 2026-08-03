<template>
  <Slide class="slide">
    <div class="top">
      <div class="kicker">五、Hook 与扩展</div>
      <div class="chapter">38 / 49</div>
    </div>
    <h2 data-node="title">Skill 到底怎么写？最小就是一个目录 + 一个文件</h2>
    <div data-node="grid-1" class="grid two" style="margin-top: 14px">
      <div>
        <div data-node="code-1" class="code-cap">
          最小结构：目录名 = 命令名（<code>/summarize-changes</code>）
        </div>
        <div data-node="code-2" class="code">
          <span class="c"># 用户级（所有项目可用）</span>
          ~/.claude/skills/summarize-changes/SKILL.md
          <span class="c"># 项目级（仅本项目，可提交 git）</span>
          .claude/skills/summarize-changes/SKILL.md
        </div>
        <div data-node="code-3" class="code" style="margin-top: 10px">
          <span class="k">---</span> <span class="k">name</span>:
          summarize-changes <span class="c"># 可选，默认取目录名</span>
          <span class="k">description</span>: 总结未提交改动并标记风险。
          当用户问"改了什么"、要 review diff 时使用。
          <span class="k">---</span>
          <span class="cmd">!`git diff HEAD`</span>
          <span class="c"># !反引号=先执行命令，输出注入</span> 用 2-3
          条要点总结上面的改动，并列出风险。
        </div>
        <div class="hint">
          <b>只有 description 建议必填。</b>它决定 Claude"什么时候该用这个
          skill"，写清触发场景很关键。
        </div>
      </div>
      <div>
        <div class="band" style="margin-bottom: 12px">
          <b>怎么被"按需触发"（渐进式披露）：</b>平时只把每个 skill 的<b
            >名字 + description</b
          >
          放进上下文；完整 body
          <b>只在被调用时</b
          >才载入。所以长参考资料不用时几乎零成本——就是记忆章第 08
          页那套注入机制。改完 SKILL.md <b>当场生效</b>，不用重启。
        </div>
        <div data-node="code-4" class="code-cap">官方有没有示例？有</div>
        <table data-node="matrix-1" class="matrix">
          <tr>
            <th>来源</th>
            <th>内容</th>
          </tr>
          <tr>
            <td>内置</td>
            <td>
              会话里直接输 <code>/code-review</code>、<code>/loop</code> 等
            </td>
          </tr>
          <tr>
            <td>官方 cookbooks</td>
            <td>财务建模、品牌规范等示例 SKILL.md</td>
          </tr>
          <tr>
            <td>官方 marketplace</td>
            <td>文档处理类（pptx/xlsx/pdf）、<code>skill-creator</code></td>
          </tr>
        </table>
        <div data-node="code-5" class="code-cap" style="margin-top: 12px">
          最快上手：自己写（热加载，无需重启）
        </div>
        <div data-node="code-6" class="code">
          <span class="cmd">mkdir</span> -p ~/.claude/skills/my-skill
          <span class="c"># 写好 SKILL.md → 直接可用</span>
        </div>
      </div>
    </div>
    <div class="foot">
      <span
        >装官方的：/plugin marketplace add … → /plugin install
        skill-creator@…</span
      ><span>38</span>
    </div>
  </Slide>
</template>

<notes lang="md">
直接回答 Skill 到底怎么写、官方有没有示例、怎么最快接。最小结构就是一个目录加一个 SKILL.md，目录名就是命令名。frontmatter 里只有 description 建议必填。关键机制是渐进式披露：平时只把名字和 description 放进上下文，body 只在被调用时才载入，所以长参考资料几乎零成本——这正好呼应记忆章那页注入机制。官方示例在 cookbooks 和官方 marketplace。最快上手就是 mkdir 加写文件，热加载。
</notes>
