<template>
  <Slide class="slide" data-locked="true">
    <div class="top">
      <div class="kicker">三、上下文与记忆</div>
      <div class="chapter">10 / 49</div>
    </div>
    <h2 data-node="title">上下文窗口里装了什么</h2>
    <p data-node="subtitle" class="subtitle">
      以 20 万 token
      的窗口为例，点一下按进入顺序填充：启动注入的固定开销、对话产生的内容、运行时回填的工具结果。
    </p>
    <div data-node="budgetdemo-1" class="budgetdemo">
      <div class="budget-bar">
        <div id="budgetTrack" class="track">
          <div
            v-for="(segment, index) in segments"
            :key="segment.kind"
            class="bseg"
            :class="{
              revealed: reveal > index,
              sys: segment.kind === 'sys',
              tools: segment.kind === 'tools',
              proj: segment.kind === 'proj',
              msg: segment.kind === 'msg',
              result: segment.kind === 'result',
              out: segment.kind === 'out',
            }"
            :style="{ width: reveal > index ? `${segment.width}%` : '0' }"
          >
            <span>{{ segment.label }}</span>
          </div>
        </div>
      </div>
      <div class="budget-legend" aria-label="内容来源图例">
        <span class="lg"><span class="sw boot"></span>会话启动时注入</span>
        <span class="lg"
          ><span class="sw conversation"></span>人输入 / 模型生成</span
        >
        <span class="lg"><span class="sw runtime"></span>运行时动态回填</span>
        <span class="lg"><span class="sw reserve"></span>为下一次输出预留</span>
      </div>
      <div id="budgetRows" class="budget-rows">
        <div
          v-for="(row, index) in rows"
          :key="row.kind"
          class="brow"
          :class="{
            lit: reveal > index,
            'b-sys': row.kind === 'sys',
            'b-tools': row.kind === 'tools',
            'b-proj': row.kind === 'proj',
            'b-msg': row.kind === 'msg',
            'b-result': row.kind === 'result',
            'b-out': row.kind === 'out',
          }"
        >
          <div class="bk">
            {{ row.title }}<span class="pct">{{ row.value }}</span
            ><span
              class="bwho"
              :class="{
                boot: row.sourceClass === 'boot',
                conversation: row.sourceClass === 'conversation',
                runtime: row.sourceClass === 'runtime',
                reserve: row.sourceClass === 'reserve',
              }"
              >{{ row.source }}</span
            >
          </div>
          <div class="btip">{{ row.tip }}</div>
        </div>
      </div>
    </div>
    <div data-node="demo-1" class="demo-bar" style="margin-top: 14px">
      <button class="demo-btn" :disabled="playing" @click="play">
        {{ reveal >= segments.length ? "再看一次 ▶" : "填充看看 ▶" }}</button
      ><button class="demo-btn ghost" @click="reset">重来</button
      ><span class="demo-status">{{
        reveal >= segments.length
          ? "橙色工具结果独占约 38%，是最容易把目标挤出去的一块"
          : "点一下，按进入顺序区分启动注入、对话产生和动态回填"
      }}</span>
    </div>
    <div class="foot">
      <span
        >token 量级与百分比均为实测示例（部分取自官方文档示意值），随版本 / 项目
        / 接入的 MCP 会变；现场可用 /context 查实际占用</span
      ><span>10</span>
    </div>
  </Slide>
</template>

<script setup lang="ts">
import { onScopeDispose, ref } from "vue";

import { useSlideState } from "@hpe/renderer-vue/slide-state";

const segments = [
  { kind: "sys", width: 12, label: "系统提示词 ~485" },
  { kind: "tools", width: 14, label: "内置工具定义 ~38.6K" },
  { kind: "proj", width: 10, label: "CLAUDE.md ~2K" },
  { kind: "msg", width: 14, label: "你的话+模型回复" },
  { kind: "result", width: 38, label: "工具结果：代码/日志/搜索" },
  { kind: "out", width: 12, label: "留给输出" },
] as const;
const rows = [
  {
    kind: "sys",
    title: "系统提示词",
    value: "~485",
    source: "启动注入",
    sourceClass: "boot",
    tip: "平台规则与运行边界，在你输入前已进入上下文；本机实测约 485 token（0.2%）。",
  },
  {
    kind: "tools",
    title: "内置工具定义",
    value: "~38.6K",
    source: "启动注入",
    sourceClass: "boot",
    tip: "Read/Edit/Bash 等工具的名称、参数、约束始终在场，是启动开销里最大的一块。",
  },
  {
    kind: "proj",
    title: "CLAUDE.md",
    value: "~2K",
    source: "启动注入",
    sourceClass: "boot",
    tip: "启动时读取的项目规则与长期记忆；官方示例项目级约 1,800 token。",
  },
  {
    kind: "msg",
    title: "你的话 + 模型回复",
    value: "~14%",
    source: "对话产生",
    sourceClass: "conversation",
    tip: "人提交任务，模型逐轮生成判断与回复。",
  },
  {
    kind: "result",
    title: "工具结果",
    value: "~38%",
    source: "动态回填",
    sourceClass: "runtime",
    tip: "工具执行后写回当前会话；大日志最容易快速膨胀。",
  },
  {
    kind: "out",
    title: "留给输出",
    value: "~12%",
    source: "输出预留",
    sourceClass: "reserve",
    tip: "它不是已注入内容，而是为下一次模型生成保留的空间。",
  },
] as const;

const reveal = useSlideState("reveal", {
  slideId: "slide-10",
  initial: 0,
  inspect: Array.from({ length: segments.length + 1 }, (_, index) => index),
});
const playing = ref(false);
let timer: ReturnType<typeof setInterval> | undefined;

function reset(): void {
  if (timer) clearInterval(timer);
  timer = undefined;
  playing.value = false;
  reveal.value = 0;
}

function play(): void {
  reset();
  playing.value = true;
  timer = setInterval(() => {
    reveal.value += 1;
    if (reveal.value >= segments.length) {
      if (timer) clearInterval(timer);
      timer = undefined;
      playing.value = false;
    }
  }, 620);
}

onScopeDispose(() => {
  if (timer) clearInterval(timer);
});
</script>

<notes lang="md">
第二专题，回答凭什么能一直聊。先破误解：它不是靠无限大的窗口，是把有限窗口当资源调度。点填充，看六块各占多少。这里不再只分看得见和看不见，而是按来源与进入时机区分：启动注入、对话产生、运行时回填、输出预留。重点看橙色工具结果，它是运行中动态回填、也最容易失控的一块。百分比是实测示例，随版本和项目会变，现场可 /context 查。
</notes>
