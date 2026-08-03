<template>
  <Slide class="slide">
    <div class="top">
      <div class="kicker">附：多 Agent</div>
      <div class="chapter">46 / 49</div>
    </div>
    <h2 data-node="title">多 Agent：子 Agent 怎么起、上下文怎么不打架</h2>
    <p data-node="subtitle" class="subtitle">
      起子 Agent 有两种玩法，差别就在"子 Agent
      能不能看见你的对话"。子任务干完，回来的<b>只有一段结论</b>，不是它一路的流水账。
    </p>
    <div class="agent-compare">
      <div class="mode fork">
        <h3>派个替身（Fork）</h3>
        <p>
          源码 <code>forkSubagent.ts</code> 的
          <code>buildForkedMessages()</code>：把主对话<b>整段历史复制</b>给子
          Agent，再附一条 directive 说"你去干这个"。子 Agent 拿到<b
            >自己独立的 QueryEngine 循环</b
          >，连你读过的文件缓存都<b>克隆一份</b>。
        </p>
        <ul>
          <li>
            <b>模型：</b><code>inherit</code>——跟你用同一个，免得切模型把 prompt
            cache 冲掉
          </li>
          <li><b>适合：</b>几路并行搜索、独立审查这种"带着同样背景各干各的"</li>
        </ul>
      </div>
      <div class="mode coord">
        <h3>调度 + 工人（Coordinator）</h3>
        <p>
          源码 <code>coordinatorMode.ts</code>，靠
          <code>COORDINATOR_MODE</code>
          开关开。调度只管拆活、拼结果，<b>工人看不到调度的对话</b>——所以给工人的
          prompt <b>必须自包含</b>。
        </p>
        <ul>
          <li><b>适合：</b>阶段分明、结果能结构化拼起来的流程</li>
          <li><b>隔离更狠：</b>信息不外泄，好局部重试</li>
        </ul>
      </div>
    </div>
    <div class="band" style="margin-top: 18px">
      <b>结果怎么回来：</b>子 Agent 干完，只把<b>最终那段结论</b>用一条
      <code>&lt;task-notification&gt;</code> 回传（就一个
      <code>&lt;result&gt;</code> +
      用量统计），<b>不会把它一路的对话历史并回主线</b>——这正是"保护主上下文不被撑爆"的关键。
    </div>
    <div class="band orange-band" style="margin-top: 12px">
      <b>两条要记的红线：</b><br />· <b>成本：</b>N 个 fork 天真算就是 N
      倍上下文；靠 prompt cache <b>前缀对齐共享</b>省掉大头（材料称最多省 ~90%
      输入成本）<br />· <b>深度只有一层：</b>fork 出来的子 Agent
      <b>不能再 fork</b>（报错 "Fork is not available inside a forked
      worker"），防无限递归
    </div>
    <div class="foot">
      <span
        >子 Agent =
        独立上下文的替身；回来的是结论不是流水账，代价是复制上下文</span
      ><span>46</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这页讲子 Agent 到底怎么起、上下文怎么隔离，全部对着逆向材料第 6 章讲。两种模式：Fork 和 Coordinator。Fork：源码 forkSubagent.ts 的 buildForkedMessages()，把父对话整段历史复制给子 Agent，再附一条 directive；子 Agent 拿到自己独立的 QueryEngine 循环，连父的文件读取缓存都克隆一份 cloneFileStateCache；model 用 inherit，跟父同一个模型，免得切模型把 prompt cache 冲掉。Coordinator：coordinatorMode.ts，靠 COORDINATOR_MODE 开关，工人看不到调度的对话，prompt 必须自包含。最要强调：结果回传只有最终那段，用一条 XML task-notification（就一个 result + 用量），子 Agent 一路的对话历史不会并回主线——这正是保护主上下文不膨胀。成本：N 个 fork 天真算就是 N 倍上下文，靠 prompt cache 前缀对齐共享省掉大头，材料称最多省 90% 输入成本。深度只有一层：fork 出来的不能再 fork，报错 Fork is not available inside a forked worker，防无限递归。名字/数字都取自逆向材料，随版本变。
</notes>
