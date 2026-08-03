<template>
  <Slide class="slide slide-31-density">
    <div class="top">
      <div class="kicker">三、上下文与记忆</div>
      <div class="chapter">18 / 49</div>
    </div>
    <h2 data-node="title">整段对话存哪、断了怎么原样接回来</h2>
    <p data-node="subtitle" class="subtitle">
      前面讲了记忆有几种。这页往下一层：<b>对话本身</b>怎么落盘、怎么保证不丢、断电重开怎么把你上次那条线一模一样接回来。
    </p>
    <div data-node="grid-1" class="grid two" style="margin-top: 12px">
      <div>
        <div data-node="code-1" class="code-cap">
          ① 存成一棵树，不是一条直线
        </div>
        <div data-node="code-2" class="code">
          <span class="c">// 每条消息一行 JSON（append-only 只追加）</span> {
          <span class="k">uuid</span>: <span class="s">"..."</span>,
          <span class="k">parentUuid</span>: <span class="s">"..."</span>, ... }
          <span class="c">// 编辑重发、分叉子代理 → 产生分支 → 整体是 DAG</span>

          <span class="c">// 大段粘贴单独存，超 1024 字节才落盘</span>
          paste-cache/
          <span class="c">// 文件名 = 内容 SHA256 前 16 位（去重）</span>
        </div>
        <div data-node="code-3" class="code-cap" style="margin-top: 12px">
          ② 写盘保证不丢
        </div>
        <div data-node="code-4" class="code">
          <span class="k">immediateFlushHistory</span>() {
          <span class="k">lock</span>(path, {stale:10000, retries:{retries:3,
          minTimeout:50}}) <span class="k">appendFile</span>(path, lines,
          {mode:<span class="s">0o600</span>})
          <span class="c">// 只有自己可读写</span>
          }
          <span class="k">registerCleanup</span>(() =&gt; flush pendingEntries)
          <span class="c">// 退出兜底</span>
        </div>
      </div>
      <div>
        <div data-node="code-5" class="code-cap">
          ③ 断了怎么接回来（loadMessagesFromJsonlPath）
        </div>
        <div data-node="code-6" class="code">
          <span class="c">// 1. 全量加载，按 UUID 建索引</span>
          <span class="c">// 2. 找叶子节点：没有别的消息把它当 parent</span>
          <span class="c"
            >// 3. 叶子里挑「最新 + 非 sidechain」那个当恢复点</span
          >
          <span class="c">// 4. 顺 parentUuid 一路回溯，重建这条链</span>
        </div>
        <div class="band" style="margin-top: 12px">
          <b>跟 Git 一个思路：</b>从某个末梢 commit
          顺着父指针往上追，就还原出完整历史。这里的 parentUuid
          就是那根父指针，sidechain
          就是子代理拉出去的旁支——恢复时默认走主线，不误接到旁支上。
        </div>
        <div class="band orange-band" style="margin-top: 12px">
          <b>为什么值得这么设计：</b
          >只追加不改旧的，任何一步崩溃，之前写下的都还在；加锁 +
          退出兜底刷盘，保证并发和意外退出都不丢；树结构让"编辑重发""分叉"这些分支天然能表达，还能精确恢复到你要的那一条。
        </div>
      </div>
    </div>
    <div class="foot">
      <span
        >JSONL append-only + UUID/parentUuid 成树，加锁 0o600 写盘 +
        退出兜底，恢复靠找叶子回溯父指针（文件名/参数取自逆向材料，随版本变）</span
      ><span>18</span>
    </div>
  </Slide>
</template>

<notes lang="md">
前面讲了记忆有几种、能写多少。这页回答一个更底层的问题：整段对话本身存在哪、格式是什么、断了怎么恢复。三件事。第一，存在哪：会话以 append-only（只追加、不改旧的）的 JSONL 落盘，每条消息一行 JSON，带自己的 UUID 和指向上一条的 parentUuid——所以整个会话不是一条直线，而是一棵树（一个 DAG），因为你中途编辑重发、分叉子代理都会产生分支。另外历史命令写 ~/.claude/history.jsonl，大段粘贴内容单独存 paste-cache/（超过 1024 字节才落盘，用内容 SHA256 前 16 位做文件名去重）。第二，怎么安全写：immediateFlushHistory 先对文件加锁 lock(stale:10000, retries 3 次 minTimeout 50ms)，再 appendFile 追加，文件权限 0o600（只有自己能读写）；平时批量攒着 pendingEntries，进程退出时 registerCleanup 兜底把没落盘的强制刷完——保证不丢。第三，断了怎么接回来：conversationRecovery 的 loadMessagesFromJsonlPath 四步——1 全量加载、按 UUID 建索引；2 找叶子节点（没有别的消息把它当 parent 的，就是分支末梢）；3 在叶子里挑最新的、非 sidechain（非子代理旁支）的那个当恢复点；4 顺着 parentUuid 往回一路回溯，把这条链重建出来。跟 Git 从某个 commit 往上追溯父提交是一模一样的思路。文件名、参数照抄逆向材料，随版本变。
</notes>
