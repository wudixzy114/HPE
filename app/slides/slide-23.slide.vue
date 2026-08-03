<template>
  <Slide class="slide slide-31-density">
    <div class="top">
      <div class="kicker">四、工具与权限</div>
      <div class="chapter">23 / 49</div>
    </div>
    <h2 data-node="title">贴源码：那个决定分发的标记，默认是什么？</h2>
    <p data-node="subtitle" class="subtitle">
      上一页切批全看
      <code>isConcurrencySafe</code>。可要是写新工具的人<b>忘了声明</b>呢？看
      <code>buildTool</code> 的默认值——方向本身就是一条安全设计。
    </p>
    <div data-node="grid-1" class="grid two" style="margin-top: 12px">
      <div>
        <div data-node="code-1" class="code-cap">工具默认值（材料 §4.7.1）</div>
        <div data-node="code-2" class="code">
          <span class="k">const</span> TOOL_DEFAULTS = { isEnabled: () =&gt;
          <span class="s">true</span>, isConcurrencySafe: () =&gt;
          <span class="s">false</span>,
          <span class="c">// 保守：假设不安全</span> isReadOnly: () =&gt;
          <span class="s">false</span>,
          <span class="c">// 保守：假设会写入</span> isDestructive: () =&gt;
          <span class="s">false</span>, checkPermissions: allow,
          toAutoClassifierInput: <span class="s">''</span>, }
        </div>
        <div class="hint" style="margin-top: 12px">
          忘了声明<b>并发安全</b> →
          默认<b>串行</b>执行（上一页里自己占一格）。<br />忘了声明<b>只读</b> →
          默认<b>要过权限检查</b>。
        </div>
      </div>
      <div>
        <div class="band" style="margin-bottom: 12px">
          <b>这叫 Fail-Closed（安全默认）：</b
          >拿不准就往"更安全"的那边倒。宁可<b>多串行一次、多弹一次确认</b>，也不能<b>漏放一次危险操作</b>。
        </div>
        <div data-node="code-3" class="code-cap">
          为什么不反过来（默认并行、默认只读）？
        </div>
        <div class="band orange-band" style="margin-top: 8px">
          <b>代价不对称：</b><br />· 误判"安全" →
          可能<b>数据丢失</b>（不可逆）<br />· 误判"危险" →
          最多<b>让你多点一次确认</b>（可逆）<br />两害相权，默认往可逆的那边靠。
        </div>
        <div class="hint" style="margin-top: 12px">
          连起来看前两页：默认 false
          让新工具<b>天生串行、天生要授权</b>；开发者主动声明
          <code>isConcurrencySafe: true</code
          >，它才有资格进上一页的并发批。安全是默认，性能是主动争取来的。
        </div>
      </div>
    </div>
    <div class="foot">
      <span
        >拿不准就往安全倒：默认不并发、默认要授权；因为误判"安全"的代价远大于误判"危险"（源码取自逆向材料，随版本变）</span
      ><span>23</span>
    </div>
  </Slide>
</template>

<notes lang="md">
贴源码页，接上一页。上一页切批全靠 isConcurrencySafe 这个布尔，那新工具没声明它会怎样？看 buildTool 的默认值 TOOL_DEFAULTS：isConcurrencySafe 默认 false（假设不安全）、isReadOnly 默认 false（假设会写入）、isDestructive 默认 false、checkPermissions 默认 allow。重点是前两个的方向——这是经典 Fail-Closed（安全默认）：开发者定义新工具时忘了声明并发安全性，系统默认它串行执行；忘了声明只读，默认要过权限检查。宁可多弹一次确认、多串行一次，不可漏放一次危险操作。材料给的理由是代价不对称——一次误判'安全'可能导致数据丢失，一次误判'危险'最多让用户多点一次确认按钮。这页把上一页那个决定分发的布尔标记补完：它的默认值本身就是一条安全设计。数字取自材料 4.7.1 / 4.3，随版本变。
</notes>
