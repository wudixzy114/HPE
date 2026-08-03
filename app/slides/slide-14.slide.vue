<template>
  <Slide class="slide slide-31-density">
    <div class="top">
      <div class="kicker">三、上下文与记忆</div>
      <div class="chapter">14 / 49</div>
    </div>
    <h2 data-node="title">压缩不是一下子全压——是五道工序按顺序过</h2>
    <p data-node="subtitle" class="subtitle">
      上一页 demo
      把这五道逐道演了一遍。这页把它摊成一张速查表：准备下一轮请求前，上下文<b>顺序过五道收窄工序，从最便宜、最不伤信息的先上</b>，一道不够再上下一道。
    </p>
    <div data-node="grid-1" class="grid two" style="margin-top: 12px">
      <div>
        <div data-node="code-1" class="code-cap">
          五道工序（越往下越贵，全量压缩放最后）
        </div>
        <div data-node="code-2" class="code">
          <span class="c">// 准备下一轮请求前，顺序尝试收窄上下文</span>
          <span class="k">1. budget 削减</span>
          <span class="c">按预算砍可省的（老旧大工具输出）</span>
          <span class="k">2. snip</span>
          <span class="c">裁剪单条过长的消息/输出</span>
          <span class="k">3. microcompact</span>
          <span class="c">本地合并简写一批消息 · 不调模型</span>
          <span class="k">4. context collapse</span>
          <span class="c">更大范围历史折叠成紧凑表示</span>
          <span class="k">5. auto-compact</span>
          <span class="c">调一次模型生成摘要 · 成本最高</span>
        </div>
        <div class="hint" style="margin-top: 10px">
          前四道都不调模型（或代价很低），能在这几步腾出空间就不惊动模型；只有都不够，才升级到第五道那次真正的模型请求。
        </div>
      </div>
      <div>
        <div class="band" style="margin-bottom: 12px">
          <b>为什么排这个序？</b
          >越靠前越便宜、对信息的损伤越小。先扔明显能省的（老工具输出），再裁过长单条，再本地合并，再折叠，实在不行才花一次模型调用做全量摘要。<b
            >能省的先省，动模型的放最后。</b
          >
        </div>
        <div class="band orange-band">
          <b>和上一页什么关系？</b>上一页 demo
          现在把这五道<b>全部演出来了</b>——手动「压一步」逐道走、动态「看动态压缩」按序升级。这页是它的<b>文字速查表</b>：把每道叫什么、贵不贵、动模型没，一眼列清，跟
          demo 互补。
        </div>
        <div class="band red-band" style="margin-top: 12px">
          <b>接回上一页那个坑：</b>第 5 道那次模型请求要是失败了（日志里
          <code>summarization returned API error</code
          >），空间没腾出来，会话就继续涨，直到下次输入直接
          <code>Prompt too long</code>。所以长任务别全等它自动。
        </div>
      </div>
    </div>
    <div class="foot">
      <span
        >一轮里顺序过 budget→snip→microcompact→collapse→auto-compact
        五道，便宜的先上、调模型的全量放最后（工序名/行号取自源码，随版本变）</span
      ><span>14</span>
    </div>
  </Slide>
</template>

<notes lang="md">
上一页 demo 现在把五道工序全演出来了（手动逐道 + 动态按序升级），这页是它的文字速查表——把'一轮里到底按什么顺序动手'一眼摊清。源码里在准备下一轮请求前，上下文要顺序过五道收窄工序（query.ts 附近那段，行号随版本变），从最便宜、最不伤信息的先上，一道不够再上下一道：第一道 budget 削减，先按预算砍掉可省的部分（比如老旧的大工具输出）；第二道 snip，裁剪单条过长的消息/输出；第三道 microcompact 微压缩，本地把一批消息合并简写，不调模型、零 API 成本；第四道 context collapse，把更大范围的历史折叠成更紧凑的表示；第五道才是 auto-compact 全量压缩——真正调一次模型生成摘要，成本最高，放最后。核心设计取舍：便宜的、损失小的排前面，能在前几道解决就不惊动模型；只有前面都不够腾出空间，才升级到调模型的全量压缩。跟上一页的关系一句话：上一页是动画演过程，这页是同一套五道工序的文字清单，互补不冲突。工序名/行号取自源码，随版本变。
</notes>
