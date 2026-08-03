<template>
  <Slide class="slide" data-locked="true">
    <div class="top">
      <div class="kicker">三、上下文与记忆</div>
      <div class="chapter">13 / 49</div>
    </div>
    <h2 data-node="title">
      压缩不是一下全压——五道工序按顺序过，只有最后一道调模型
    </h2>
    <div data-node="compdemo-1" class="demo compdemo">
      <div id="compLayers" class="comp-layers">
        <div
          class="comp-layer"
          :class="{ done: manualStep > 0, on: activeLayers.includes(0) }"
          data-layer="0"
        >
          <b>1 · budget 削减</b
          ><span>先按预算砍掉明显能省的：老旧的大工具输出整块丢掉</span
          ><span class="tag-local">本地 · 不调模型</span>
        </div>
        <div
          class="comp-layer"
          :class="{ done: manualStep > 1, on: activeLayers.includes(1) }"
          data-layer="1"
        >
          <b>2 · snip 裁剪</b><span>某条特别长的输出，留头尾、中间省略</span
          ><span class="tag-local">本地 · 不调模型</span>
        </div>
        <div
          class="comp-layer"
          :class="{ done: manualStep > 2, on: activeLayers.includes(2) }"
          data-layer="2"
        >
          <b>3 · microcompact 微压缩</b
          ><span>一批旧结果去重、大块换成一行引用（缓存版走 cache_edits）</span
          ><span class="tag-local">本地 · 不调模型 · 最常做</span>
        </div>
        <div
          class="comp-layer"
          :class="{ done: manualStep > 3, on: activeLayers.includes(3) }"
          data-layer="3"
        >
          <b>4 · context collapse 折叠</b
          ><span>一大段历史折叠成更紧凑的表示</span
          ><span class="tag-local">本地 · 代价很低</span>
        </div>
        <div
          class="comp-layer"
          :class="{ done: manualStep > 4, on: activeLayers.includes(4) }"
          data-layer="4"
        >
          <b>5 · auto-compact 全量</b
          ><span>调一次模型压成摘要 + 边界 + 保留最近原文 + 回填关键文件</span
          ><span class="tag-llm">调一次模型 · 成本最高 · 放最后</span>
        </div>
      </div>
      <div class="comp-right">
        <div class="meter" :class="{ over }">
          <div class="thresh"></div>
          <div class="track">
            <div class="fill used" :style="{ width: `${used}%` }"></div>
            <div class="free"></div>
            <div class="cap">
              <span class="used-label">已用 {{ used }}%</span
              ><span class="free-label">空余 {{ 100 - used }}%</span>
            </div>
          </div>
        </div>
        <div class="ctx">
          <div class="chead">
            当前上下文里都装了啥（点"压一步"逐道看这五道各动了什么 /
            或点"看动态压缩"看 autoCompact 越过阈值线后如何按序升级）
          </div>
          <div class="ctx-list">
            <div
              v-for="block in blocks"
              :key="block.id"
              class="block"
              :class="{
                keep: block.kind === 'keep',
                model: block.kind === 'model',
                bulky: block.kind === 'bulky',
                shrunk: block.kind === 'shrunk',
                summary: block.kind === 'summary',
              }"
            >
              <span class="btag">{{ block.tag }}</span>
              <template v-for="line in block.lines" :key="line">
                {{ line }}<br />
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div data-node="demo-1" class="demo-bar" style="margin-top: 14px">
      <button
        class="demo-btn"
        :disabled="manualStep >= 5 || dynamic"
        @click="nextManual"
      >
        {{ manualStep >= 5 ? "五道走完 ✓" : "压一步 ▼" }}
      </button>
      <button class="demo-btn" @click="nextDynamic">
        {{
          dynamic && dynamicStep >= dynamicStates.length - 1
            ? "动态跑完 · 再看一次 ▶"
            : "动态 · 下一步 ▶"
        }}
      </button>
      <button class="demo-btn ghost" @click="reset">重来</button>
      <span class="demo-status">{{ caption }}</span>
    </div>
    <div class="foot">
      <span
        >绿=本地工序(1~4，不调模型)，黄=第 5
        道全量压缩(调一次模型)；阈值线=有效窗口−13k，越线才开始压；全量那次模型请求若失败，会话会继续涨到
        Prompt too long（占用百分比为实测示例，随版本变）</span
      ><span>13</span>
    </div>
  </Slide>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { useSlideState } from "@hpe/renderer-vue/slide-state";

type BlockKind = "keep" | "model" | "bulky" | "shrunk" | "summary";
interface ContextBlock {
  readonly id: string;
  readonly kind: BlockKind;
  readonly tag: string;
  readonly lines: readonly string[];
}

const manualStates = Array.from({ length: 6 }, (_, index) => `manual-${index}`);
const dynamicStates = Array.from(
  { length: 12 },
  (_, index) => `dynamic-${index}`,
);
const demoState = useSlideState<string>("compression-state", {
  slideId: "slide-13",
  initial: "manual-0",
  inspect: [...manualStates, ...dynamicStates],
});
const manualStep = computed(() =>
  demoState.value.startsWith("manual-") ? Number(demoState.value.slice(7)) : 0,
);
const dynamic = computed(() => demoState.value.startsWith("dynamic-"));
const dynamicStep = computed(() =>
  dynamic.value ? Number(demoState.value.slice(8)) : -1,
);

const initialBlocks: readonly ContextBlock[] = [
  {
    id: "goal",
    kind: "keep",
    tag: "用户目标",
    lines: ["重构 parsePath，保持兼容，跑测试验证"],
  },
  {
    id: "stale",
    kind: "bulky",
    tag: "20 轮前的构建日志",
    lines: ["vendor.js 3.2 MiB", "210 行 chunk 哈希", "很久前，早已用不上"],
  },
  {
    id: "long",
    kind: "bulky",
    tag: "测试 stdout（900 行）",
    lines: [
      "PASS parse.test.ts",
      "中间大量逐用例输出",
      "1 项失败：空 query 返回 null",
    ],
  },
  {
    id: "duplicate",
    kind: "bulky",
    tag: "重复 Grep 结果",
    lines: ["WARNING deprecated × 3", "完整命中正文 180 行"],
  },
  {
    id: "arc",
    kind: "model",
    tag: "早期探索历史",
    lines: ["尝试正则重写 → 回退", "尝试 URL API → 接近结论"],
  },
  {
    id: "recent",
    kind: "keep",
    tag: "最近原文（保留）",
    lines: ["补空 query 分支，准备再跑测试"],
  },
];
const dynamicMeta = [
  {
    used: 30,
    layers: [],
    over: false,
    cap: "起点：只有用户目标，占用 30%",
    count: 1,
  },
  { used: 36, layers: [], over: false, cap: "模型发起 Read", count: 2 },
  { used: 52, layers: [], over: false, cap: "Read 结果回填 → 52%", count: 3 },
  { used: 78, layers: [], over: false, cap: "构建日志回填 → 78%", count: 4 },
  {
    used: 93,
    layers: [],
    over: true,
    cap: "测试结果回填，越过阈值线",
    count: 5,
  },
  {
    used: 54,
    layers: [0, 1, 2],
    over: false,
    cap: "前三道本地工序压回 54%，够了就停",
    count: 4,
  },
  {
    used: 60,
    layers: [],
    over: false,
    cap: "接着运行，新消息继续增长",
    count: 5,
  },
  { used: 78, layers: [], over: false, cap: "又积累一段探索历史", count: 6 },
  { used: 94, layers: [], over: true, cap: "新日志回填，再次越线", count: 6 },
  {
    used: 72,
    layers: [3],
    over: true,
    cap: "升级 context collapse，仍高于阈值",
    count: 5,
  },
  {
    used: 34,
    layers: [4],
    over: false,
    cap: "前四道压无可压，才调模型做全量摘要",
    count: 3,
  },
  {
    used: 40,
    layers: [],
    over: false,
    cap: "摘要后继续完成任务；全量请求失败时不会自动变瘦",
    count: 4,
  },
] as const;

const used = computed(() =>
  dynamic.value
    ? (dynamicMeta[dynamicStep.value]?.used ?? 30)
    : ([92, 82, 70, 60, 50, 30][manualStep.value] ?? 92),
);
const over = computed(() =>
  dynamic.value ? (dynamicMeta[dynamicStep.value]?.over ?? false) : false,
);
const activeLayers = computed<readonly number[]>(() => {
  if (dynamic.value) return dynamicMeta[dynamicStep.value]?.layers ?? [];
  return manualStep.value > 0 ? [manualStep.value - 1] : [];
});
const blocks = computed<readonly ContextBlock[]>(() => {
  if (dynamic.value) {
    const meta = dynamicMeta[dynamicStep.value] ?? dynamicMeta[0];
    if (dynamicStep.value === 5)
      return initialBlocks
        .filter((block) => block.id !== "stale")
        .slice(0, meta.count);
    if (dynamicStep.value === 9)
      return [
        initialBlocks[0]!,
        {
          id: "collapse",
          kind: "summary",
          tag: "探索折叠",
          lines: ["已确认 URL API 路径，保留边界结论"],
        },
        ...initialBlocks.slice(-2),
      ];
    if (dynamicStep.value >= 10)
      return [
        {
          id: "summary",
          kind: "summary",
          tag: "压缩摘要 + 边界",
          lines: ["目标、已改文件、失败原因和下一步"],
        },
        initialBlocks.at(-1)!,
      ];
    return initialBlocks.slice(0, meta.count);
  }
  const step = manualStep.value;
  if (step === 5)
    return [
      {
        id: "summary",
        kind: "summary",
        tag: "旧历史摘要 + 压缩边界",
        lines: ["parsePath 已改用 URL API；空 query 是最后边界"],
      },
      initialBlocks.at(-1)!,
    ];
  return initialBlocks
    .filter((block) => step < 1 || block.id !== "stale")
    .map((block) => {
      if (step >= 2 && block.id === "long")
        return {
          ...block,
          kind: "shrunk" as const,
          lines: [
            "PASS parse.test.ts",
            "…中间 897 行已裁剪…",
            "1 项失败：空 query",
          ],
        };
      if (step >= 3 && block.id === "duplicate")
        return {
          ...block,
          kind: "shrunk" as const,
          lines: ["WARNING deprecated × 1", "→ .hpe/results/grep-42.txt"],
        };
      if (step >= 4 && block.id === "arc")
        return {
          ...block,
          kind: "summary" as const,
          lines: ["结论：URL API 可行，需补空 query"],
        };
      return block;
    });
});
const caption = computed(() => {
  if (dynamic.value) return dynamicMeta[dynamicStep.value]?.cap ?? "动态压缩";
  const labels = [
    "五道按顺序过：便宜的先做，实在不够才调用模型",
    "第 1 道：丢掉很久前的大工具输出",
    "第 2 道：900 行 stdout 只保留头尾",
    "第 3 道：重复结果去重并换成引用",
    "第 4 道：早期探索折叠成结论",
    "五道走完：前四道本地 92→50%，最后模型摘要 50→30%",
  ];
  return labels[manualStep.value] ?? labels[0]!;
});

function nextManual(): void {
  demoState.value = `manual-${Math.min(5, manualStep.value + 1)}`;
}

function nextDynamic(): void {
  demoState.value = `dynamic-${dynamic.value ? (dynamicStep.value + 1) % dynamicStates.length : 0}`;
}

function reset(): void {
  demoState.value = "manual-0";
}
</script>

<notes lang="md">
全场最重要的一页，慢慢讲。压缩不是笼统一下全压，源码里准备下一轮请求前，上下文按'先便宜、先不伤信息'的顺序过五道收窄工序，够了就停。左边五个盒子就是这五道：1 budget 削减——先按预算砍掉明显能省的，比如很多轮前那块早就用不上的大工具输出，整块丢掉；2 snip 裁剪——某一条特别长的输出，留头尾、中间省略；3 microcompact 微压缩——一批旧结果去重、大块换成一行引用（缓存版走 cache_edits 在服务端删、还不破坏缓存命中），本地不调模型，这是最常发生的；4 context collapse 折叠——把一大段历史折叠成更紧凑的表示，范围比裁单条更大；5 auto-compact 全量——前四道都腾不出空间了，才花一次模型调用把旧历史压成摘要 + 打边界 + 保留最近原文 + 回填关键文件，成本最高放最后。前四道都在本地(不调模型或代价极低)，只有第 5 道真正调一次模型。手动模式：点压一步，逐道看右边上下文里对应那块被怎么处理、仪表占用一步步回落。动态模式(看动态压缩)：上下文一轮轮涨过阈值线(有效窗口减 13k)就触发压缩，先上便宜的前几道、够了就停；再涨、旧结果已压无可压仍超限，才升级到折叠、乃至第 5 道全量。强调两点：一是能省的先省、动模型的放最后，大多数时候前几道就够了；二是全量那次是独立模型请求，失败会导致会话继续涨到 Prompt too long——这是我本地日志里真见过的。这页演过程，第 14 页那张表是它的文字速查。
</notes>
