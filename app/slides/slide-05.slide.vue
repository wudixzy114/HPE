<template>
  <Slide class="slide" data-locked="true">
    <div class="top">
      <div class="kicker">二、循环与配置</div>
      <div class="chapter">05 / 49</div>
    </div>
    <h2 data-node="title">点一下，看它一轮一轮把活干完</h2>
    <div data-node="demo-1" class="demo loopdemo">
      <div id="loopRing" class="ring">
        <div class="circle"></div>
        <div
          class="rstep r1"
          :class="{ on: activeRingStep === 0 }"
          data-step="0"
        >
          <b>1 准备</b
          ><span>装好项目规矩、可用工具和现在的进度（你看不见）</span>
        </div>
        <div
          class="rstep r2"
          :class="{ on: activeRingStep === 1 }"
          data-step="1"
        >
          <b>2 问模型</b><span>把手里的信息给它，它说下一步干嘛</span>
        </div>
        <div
          class="rstep r3"
          :class="{ on: activeRingStep === 2 }"
          data-step="2"
        >
          <b>3 跑工具</b
          ><span>先过权限，再真去读、改、跑（查权限你看不见）</span>
        </div>
        <div
          class="rstep r4"
          :class="{ on: activeRingStep === 3 }"
          data-step="3"
        >
          <b>4 收结果</b><span>塞回记录前先截断、脱敏（你看不见）</span>
        </div>
        <div
          class="rstep r5"
          :class="{ on: activeRingStep === 4 }"
          data-step="4"
        >
          <b>5 判断</b
          ><span
            >还要调工具就再来一轮；模型这轮<b>没再调工具</b>（或你按了取消、预算用光）就停</span
          >
        </div>
        <div class="center">
          <div class="rnd">{{ roundLabel }}</div>
          <div class="task">重构 parsePath</div>
          <div class="verdict">{{ verdict }}</div>
        </div>
      </div>
      <div class="transcript">
        <div class="thead">
          模型每一轮看到的，就是这坨记录 —— 它只会越来越长
        </div>
        <div class="tlist">
          <div
            v-for="(entry, index) in visibleEntries"
            :key="index"
            class="msg"
            :class="{
              user: entry.kind === 'user',
              model: entry.kind === 'model',
              tool: entry.kind === 'tool',
              done: entry.kind === 'done',
            }"
          >
            <b>{{ entry.title }}</b
            >{{ entry.text }}
          </div>
        </div>
      </div>
    </div>
    <div data-node="demo-2" class="demo-bar" style="margin-top: 16px">
      <button
        class="demo-btn"
        :disabled="demoStep >= entries.length"
        @click="advance"
      >
        {{ demoStep >= entries.length ? "已完成 ✓" : "下一步 ▶" }}
      </button>
      <button class="demo-btn ghost" @click="demoStep = 0">重来</button>
      <span class="demo-status">{{ status }}</span>
    </div>
    <div class="foot"><span></span><span>05</span></div>
  </Slide>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { useSlideState } from "@hpe/renderer-vue/slide-state";

const entries = [
  {
    step: 0,
    round: 1,
    kind: "user",
    title: "你",
    text: "重构 parsePath，保持兼容，跑测试验证",
  },
  {
    step: 1,
    round: 1,
    kind: "model",
    title: "模型",
    text: "我先看看这个函数现在长什么样 → 要调 Read",
  },
  {
    step: 2,
    round: 1,
    kind: "tool",
    title: "工具 Read",
    text: "parsePath(): 42 行，3 处正则拼接，无测试注释",
  },
  {
    step: 3,
    round: 1,
    kind: "model",
    title: "模型",
    text: "看懂了，用 URL 解析重写，然后改文件 → 要调 Edit",
  },
  {
    step: 2,
    round: 2,
    kind: "tool",
    title: "工具 Edit",
    text: "已改写 parsePath，diff：-31 / +18 行",
  },
  {
    step: 3,
    round: 2,
    kind: "model",
    title: "模型",
    text: "改完了，跑测试确认没改坏 → 要调 Bash",
  },
  {
    step: 2,
    round: 3,
    kind: "tool",
    title: "工具 Bash",
    text: "npm test → 1 个失败：query 为空时返回 null",
  },
  {
    step: 3,
    round: 3,
    kind: "model",
    title: "模型",
    text: "边界没处理，补一个空值分支 → 再调 Edit",
  },
  {
    step: 2,
    round: 4,
    kind: "tool",
    title: "工具 Bash",
    text: "npm test → 全部 12 项通过 ✓",
  },
  {
    step: 4,
    round: 4,
    kind: "done",
    title: "收工",
    text: "测试通过，没有新的工具调用 → 结束，汇报结果",
  },
] as const;

const demoStep = useSlideState("demo-step", {
  slideId: "slide-05",
  initial: 0,
  inspect: Array.from({ length: entries.length + 1 }, (_, index) => index),
});
const current = computed(() =>
  demoStep.value > 0 ? entries[demoStep.value - 1] : undefined,
);
const visibleEntries = computed(() => entries.slice(0, demoStep.value));
const activeRingStep = computed(() => current.value?.step ?? -1);
const stepLabels = ["准备", "问模型", "跑工具", "收结果", "判断"] as const;
const roundLabel = computed(() =>
  current.value
    ? `第 ${current.value.round} 轮 · ${stepLabels[current.value.step]}`
    : "第 0 轮",
);
const verdict = computed(() => {
  if (!current.value) return '点"下一步"开始';
  if (current.value.kind === "done") return "达成，停下";
  if (current.value.text.includes("失败")) return "测试挂了——报错回到下一轮";
  return current.value.kind === "model" ? "有新动作 → 继续下一轮" : "处理中…";
});
const status = computed(() =>
  demoStep.value >= entries.length
    ? "一共 4 轮。模型每轮看到的都是右边这份越来越长的记录"
    : "看左边高亮走到哪一步，右边记录怎么变长",
);

function advance(): void {
  demoStep.value = Math.min(entries.length, demoStep.value + 1);
}
</script>

<notes lang="md">
第一个专题，也是全场地基。别念字，直接点下一步让它一轮一轮跑。左边高亮当前走到哪，右边消息记录会一条条长出来——这就是它的上下文，越攒越长。跑到测试通过就停。强调：每一轮模型看到的，都是右边这坨不断变长的东西；准备、查权限、收拾结果这些活对你是不可见的。
</notes>
