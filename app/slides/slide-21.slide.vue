<template>
  <Slide class="slide">
    <div class="top">
      <div class="kicker">四、工具与权限</div>
      <div class="chapter">21 / 49</div>
    </div>
    <h2 data-node="title">一条命令，要过哪几道关</h2>
    <p data-node="subtitle" class="subtitle">
      源码里是十来步，合并成七格看。顺序是写死的——<b>deny 永远在 allow 前面判</b
      >，所以同一条命令既能 allow 又能 deny 时，deny 赢。
    </p>
    <div data-node="decflow-1" class="decflow">
      <div class="dstep">
        <i>0</i>
        <div><b>中止检查</b><span>这轮被取消了吗</span></div>
      </div>
      <div class="dstep deny-step">
        <i>1</i>
        <div><b>命中 deny 规则</b><span>整条命令撞死规则 → 当场拦</span></div>
        <em class="tag-out out-deny">拦</em>
      </div>
      <div class="dstep ask-step">
        <i>2</i>
        <div>
          <b>命中 ask 规则</b><span>如 <code>Bash(git push *)</code></span>
        </div>
        <em class="lock">🔒 bypass 也拦</em><em class="tag-out out-ask">问</em>
      </div>
      <div class="dstep">
        <i>3</i>
        <div>
          <b>单工具自校验</b
          ><span>Bash 拆子命令 / 查路径 / 验 sed；文件工具查路径安全</span>
        </div>
        <em class="tag-out out-deny">可判死</em>
      </div>
      <div class="dstep safe-step">
        <i>4</i>
        <div>
          <b>受保护路径安全检查</b
          ><span
            ><code>.git</code> <code>.claude</code> <code>.ssh</code> 等</span
          >
        </div>
        <em class="lock">🔒 bypass 也拦</em><em class="tag-out out-ask">问</em>
      </div>
      <div class="dstep">
        <i>5</i>
        <div><b>模式放行</b><span>bypassPermissions 到这一步直接放</span></div>
        <em class="tag-out out-allow">放</em>
      </div>
      <div class="dstep allow-step">
        <i>6</i>
        <div>
          <b>命中 allow 规则</b><span>如 <code>Bash(npm test *)</code></span>
        </div>
        <em class="tag-out out-allow">放</em>
      </div>
      <div class="dstep gray-step">
        <i>7</i>
        <div>
          <b>剩下的灰区</b><span>普通模式问你；auto 模式交给分类器判</span>
        </div>
        <em class="tag-out out-ask">问 / 判</em>
      </div>
    </div>
    <div
      data-node="grid-1"
      class="grid two"
      style="margin-top: 20px; gap: 16px; align-items: start"
    >
      <div class="band red-band" style="margin: 0">
        <b>两把锁记牢：</b>带 🔒 的两格（显式 ask 规则、受保护路径安全检查）<b
          >连 bypassPermissions 都盖不过</b
        >。所以 deny 恒先于 allow，规则跑完还没结论的，才叫灰区。
      </div>
      <div>
        <div data-node="code-1" class="code-cap">
          第 7 格的灰区，auto 模式怎么判？
        </div>
        <div class="clf">
          <div class="clf-row">
            <span class="clf-n">普通模式</span
            ><span>灰区<b>直接问你</b>——没有模型介入</span>
          </div>
          <div class="clf-row">
            <span class="clf-n">auto 快判</span
            ><span
              >先跑一次<b>省钱快判</b>(≤64
              token，原则"拿不准就拦")：判"安全"当场放</span
            >
          </div>
          <div class="clf-row">
            <span class="clf-n">auto 细判</span
            ><span
              >快判拿不准 → 升级<b>带思考的细判</b>，给出
              <code>block / allow</code> + 理由</span
            >
          </div>
          <div class="clf-row danger">
            <span class="clf-n">熔断</span
            ><span
              ><b>连拦 3 次 或 累计拦 20 次</b> → 自动降级<b
                >回退成问你</b
              ></span
            >
          </div>
        </div>
        <div class="hint" style="margin-top: 8px">
          只读工具(Read/Grep/Glob)走白名单直接跳过判定；写文件走 acceptEdits
          快路径——目录内放行、目录外才交给分类器。
        </div>
      </div>
    </div>
    <div class="foot">
      <span
        >规则先跑完，模型只在盖不住的灰区帮忙理解语义；连错太多次就自动收回自动权</span
      ><span>21</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这页把一条命令从请求到放行/拦住/问你的完整关卡链摊开讲。源码里其实是十来步，我合并成七格，顺序不能乱。开场先抛最反直觉的一条：deny 永远在 allow 前面判——同一条命令既命中 deny 又命中 allow，deny 赢，因为它在管线更靠前。逐格走：①先看有没有被取消；②整条命令撞死 deny 规则，当场拦；③命中 ask 规则，问你——注意这格带锁，连 bypass 模式都盖不过；④交给具体工具自己校验，Bash 会拆子命令、查路径、验 sed，文件工具查路径安全，这里可能直接判死；⑤受保护路径安全检查，.git/.claude 这类，带锁——这一步在 bypass 判断之前，所以连 bypass 模式都拦、强制问你，防的是"改掉权限根基文件来自我提权"；⑥到这才轮到模式起作用，bypass 在这步对普通灰区直接放；⑦整条命令命中 allow 规则就放，都没命中的灰区，普通模式问你、auto 模式交给分类器。收尾强调那两把锁：带锁的两格，是 bypassPermissions 也拦不住的东西，这解释了下一页为什么说 bypass 不等于无人值守。
</notes>
