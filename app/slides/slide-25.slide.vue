<template>
  <Slide class="slide slide-31-density">
    <div class="top">
      <div class="kicker">四、工具与权限</div>
      <div class="chapter">25 / 49</div>
    </div>
    <h2 data-node="title">auto 模式那个"后台分类器"，到底怎么审你</h2>
    <p data-node="subtitle" class="subtitle">
      上一页 auto 那行写了"后台分类器审"。这页把这台分类器拆开：它<b
        >先花极少 token 快筛，可疑的才升级细判</b
      >，而且两处都往"拦"那边倒。
    </p>
    <div data-node="grid-1" class="grid two" style="margin-top: 12px">
      <div>
        <div data-node="code-1" class="code-cap">
          两段式：便宜快筛 → 贵一点的细判
        </div>
        <div data-node="code-2" class="code">
          <span class="k">classifyYoloActionXml</span>(systemPrompt, transcript,
          action)

          <span class="c">// 第一段：极便宜的快筛</span>
          max_tokens: <span class="s">64</span> stop_sequences: [<span class="s"
            >'&lt;/block&gt;'</span
          >]
          <span class="c"
            >// prompt 明写：Err on the side of blocking（拿不准就拦）</span
          >
          &lt;block&gt;no&lt;/block&gt;
          <span class="c">→ 直接放行，结束</span> &lt;block&gt;yes
          <span class="c">→ 可疑，进第二段</span>

          <span class="c">// 第二段：细判 + 说理由</span>
          max_tokens: <span class="s">4096</span>
          &lt;thinking&gt;…&lt;/thinking&gt; &lt;block&gt;yes|no&lt;/block&gt; +
          &lt;reason&gt;…&lt;/reason&gt;
          <span class="c">// 解析失败 → 一律 block（fail-closed）</span>
        </div>
      </div>
      <div>
        <div class="band" style="margin-bottom: 12px">
          <b>为什么分两段？</b>你在 auto 模式下的绝大多数操作是安全的。第一段用
          64 个 token 就把它们放过去，成本几乎为零；只有少数可疑的才值得花 4096
          token 去细想。省钱又快。
        </div>
        <div data-node="code-3" class="code-cap">返回结构</div>
        <div data-node="code-4" class="code">
          <span class="k">YoloClassifierResult</span> { shouldBlock, reason,
          thinking?, stage, <span class="c">// 走到第几段</span> usage,
          durationMs <span class="c">// token 用量 / 耗时</span> }
        </div>
        <div class="band orange-band" style="margin-top: 12px">
          <b>被拦不是死路：</b>auto 模式下
          <b>3 连被拦 / 20 次累计被拦</b
          >就自动降级回手动弹窗——分类器拿不准的时候，方向盘还给你。这跟"拿不准就拦"是一套思路：<b>出错往安全那边倒</b>，跟
          <a href="#" style="color: inherit" @click.prevent
            >工具默认值 Fail-Closed</a
          >
          那页同一个道理。
        </div>
      </div>
    </div>
    <div class="foot">
      <span
        >快筛 64 token 放行大多数，可疑的才升级 4096
        细判；解析失败一律拦；连续被拦自动降级还权（函数/参数取自源码，随版本变）</span
      ><span>25</span>
    </div>
  </Slide>
</template>

<notes lang="md">
上一页 auto 模式那行写了'后台分类器审'，这页把这台'审你'的分类器拆开看——它到底怎么决定放不放行。核心函数 classifyYoloActionXml，输入三样：当前的 systemPrompt、到目前为止的对话 transcript、以及待判的 action（就是这次要跑的工具调用）。它分两段跑，是典型的'先便宜快筛、再贵一点细判'：第一段极便宜，max_tokens 只给 64、遇到 </block> 就停，prompt 里明写一句 'Err on the side of blocking'（拿不准就拦），模型只回一个 <block>no</block> 或 <block>yes</block>——回 no 直接放行，成本极低，绝大多数安全操作走这条就结束了；只有回 yes（可疑）才进第二段。第二段给到 max_tokens 4096，让它先 <thinking> 想一遍，再给结构化结论：<block>yes|no</block> + <reason> 说明理由。关键的兜底：如果第二段输出解析失败（格式不对、被截断等），一律按 block 处理——这就是 fail-closed，跟工具默认值那页一个道理，出错就往安全那边倒。返回结构 YoloClassifierResult 带 shouldBlock、reason、可选 thinking、走到第几 stage、usage(token 用量)、durationMs(耗时)。连到用户体验：被拦不是一次性的——auto 模式下 3 连被拦 / 20 次累计被拦，就自动降级回手动弹窗，把方向盘还给你。函数名 stop_sequences 那句英文照抄源码，随版本变。
</notes>
