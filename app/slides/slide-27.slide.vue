<template>
  <Slide class="slide">
    <div class="top">
      <div class="kicker">四、工具与权限</div>
      <div class="chapter">27 / 49</div>
    </div>
    <h2 data-node="title">改一处配置，七条命令的结局一起重算</h2>
    <p data-node="subtitle" class="subtitle">
      左边切模式、切规则集；右边每条命令实时给出<b>放 / 问 / 拦</b
      >和理由。点命令牌看它卡在哪一步。
    </p>
    <div data-node="pjudge-1" class="demo pjudge">
      <div class="pj-left">
        <div data-node="code-1" class="code-cap">① 当前模式（点着切）</div>
        <div id="pjModes" class="pj-seg">
          <button
            class="pj-opt"
            :class="{ sel: mode === 'default' }"
            @click="mode = 'default'"
          >
            Manual
          </button>
          <button
            class="pj-opt"
            :class="{ sel: mode === 'acceptEdits' }"
            @click="mode = 'acceptEdits'"
          >
            acceptEdits
          </button>
          <button
            class="pj-opt"
            :class="{ sel: mode === 'bypassPermissions' }"
            @click="mode = 'bypassPermissions'"
          >
            bypass
          </button>
        </div>
        <div data-node="code-2" class="code-cap" style="margin-top: 14px">
          ② settings.json 规则集（点着切）
        </div>
        <div id="pjPresets" class="pj-seg">
          <button
            class="pj-opt"
            :class="{ sel: preset === 'empty' }"
            @click="preset = 'empty'"
          >
            空规则
          </button>
          <button
            class="pj-opt"
            :class="{ sel: preset === 'team' }"
            @click="preset = 'team'"
          >
            团队常用
          </button>
        </div>
        <div data-node="code-3" class="code pj-config">
          <span class="c">{{ configComment }}</span>
          <span class="k">"permissions"</span>: {
          <span class="k">"allow"</span>:
          {{ JSON.stringify(activeRules.allow) }}, <span class="k">"ask"</span>:
          {{ JSON.stringify(activeRules.ask) }}, <span class="k">"deny"</span>:
          {{ JSON.stringify(activeRules.deny) }} }
        </div>
      </div>
      <div class="pj-right">
        <div data-node="code-4" class="code-cap">
          ③ 同时判这些命令 —— 改左边，这一列一起变
        </div>
        <div class="pj-cmds">
          <button
            v-for="item in judgedCommands"
            :key="item.command.id"
            class="pj-card"
            :class="{
              allow: item.result.cls === 'allow',
              ask: item.result.cls === 'ask',
              deny: item.result.cls === 'deny',
              open: selectedCommand === item.command.id,
            }"
            @click="selectedCommand = item.command.id"
          >
            <code>{{ item.command.text }}</code>
            <span class="pj-verdict">{{ item.result.verdict }}</span>
            <span class="pj-why"
              >{{ item.result.step }}{{ item.result.locked ? " 🔒" : "" }}</span
            >
          </button>
        </div>
      </div>
    </div>
    <div data-node="demo-1" class="demo-bar" style="margin-top: 12px">
      <span class="demo-status">{{
        selectedResult
          ? `${selectedResult.command.text} → ${selectedResult.result.verdict}：${selectedResult.result.why}`
          : "先在团队常用 + Manual 下看一遍，再切到 bypass 看哪几条仍然拦着"
      }}</span>
    </div>
    <div class="foot">
      <span
        >规则和模式一起算：同一条命令，换个配置就是另一个结局（判定为实测示例，随版本变）</span
      ><span>27</span>
    </div>
  </Slide>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import { useSlideState } from "@hpe/renderer-vue/slide-state";

type Mode = "default" | "acceptEdits" | "bypassPermissions";
type Preset = "empty" | "team";
interface CommandCase {
  readonly id: string;
  readonly text: string;
  readonly kind: "read" | "bash";
  readonly base?: string;
  readonly path?: string;
  readonly reads?: string;
  readonly del?: boolean;
  readonly inScope?: boolean;
  readonly fuse?: boolean;
  readonly compound?: boolean;
}
interface Result {
  readonly cls: "allow" | "ask" | "deny";
  readonly verdict: "放" | "问" | "拦";
  readonly step: string;
  readonly why: string;
  readonly locked?: boolean;
}

const presets = {
  empty: { allow: [], ask: [], deny: [] },
  team: {
    allow: ["Bash(npm test:*)", "Bash(ls:*)", "Edit(src/**)"],
    ask: ["Bash(git push:*)"],
    deny: ["Read(./.env)", "Bash(rm:*)"],
  },
} as const;
const commands: readonly CommandCase[] = [
  { id: "read", text: "Read src/parse.ts", kind: "read", path: "src/parse.ts" },
  { id: "ls", text: "ls -la", kind: "bash", base: "ls" },
  { id: "test", text: "npm test", kind: "bash", base: "npm test" },
  { id: "push", text: "git push origin main", kind: "bash", base: "git push" },
  {
    id: "rmfile",
    text: "rm build/output.js",
    kind: "bash",
    base: "rm",
    del: true,
    path: "build/output.js",
    inScope: true,
  },
  { id: "rmroot", text: "rm -rf /", kind: "bash", base: "rm", fuse: true },
  {
    id: "envcat",
    text: 'echo "$(cat .env)"',
    kind: "bash",
    base: "echo",
    reads: ".env",
    compound: true,
  },
];
const readonlyCommands = new Set([
  "ls",
  "cat",
  "echo",
  "pwd",
  "head",
  "tail",
  "grep",
  "find",
  "wc",
  "which",
  "diff",
  "stat",
  "du",
]);

const mode = useSlideState<Mode>("mode", {
  slideId: "slide-27",
  initial: "default",
  inspect: ["default", "acceptEdits", "bypassPermissions"],
});
const preset = useSlideState<Preset>("preset", {
  slideId: "slide-27",
  initial: "empty",
  inspect: ["empty", "team"],
});
const selectedCommand = ref<string>();
const activeRules = computed(() => presets[preset.value]);
const configComment = computed(() =>
  preset.value === "empty"
    ? "// 没配任何规则，全看模式"
    : "// 团队共享的最小权限基线",
);

function bashMatches(rule: string, base = ""): boolean {
  const body = rule.match(/^Bash\((.+)\)$/u)?.[1];
  if (!body) return false;
  if (body.endsWith(":*")) return base.startsWith(body.slice(0, -2));
  return base === body;
}

function readMatches(rule: string, path = ""): boolean {
  const body = rule.match(/^Read\((.+)\)$/u)?.[1]?.replace(/^\.\//u, "");
  return Boolean(body && (path === body || path.endsWith(`/${body}`)));
}

function judge(command: CommandCase): Result {
  if (command.fuse)
    return {
      cls: "deny",
      verdict: "拦",
      step: "熔断",
      why: "撞死 rm -rf / 熔断——任何模式都拦",
      locked: true,
    };
  const rules = activeRules.value;
  const deny = rules.deny.find(
    (rule) =>
      (command.kind === "bash" && bashMatches(rule, command.base)) ||
      readMatches(rule, command.reads) ||
      (command.kind === "read" && readMatches(rule, command.path)),
  );
  if (deny)
    return {
      cls: "deny",
      verdict: "拦",
      step: "deny 规则",
      why: `命中 ${deny}`,
    };
  const ask = rules.ask.find(
    (rule) => command.kind === "bash" && bashMatches(rule, command.base),
  );
  if (ask)
    return {
      cls: "ask",
      verdict: "问",
      step: "ask 规则",
      why: `命中 ${ask}，bypass 也要询问`,
      locked: true,
    };
  const allow = rules.allow.find(
    (rule) => command.kind === "bash" && bashMatches(rule, command.base),
  );
  if (allow)
    return {
      cls: "allow",
      verdict: "放",
      step: "allow 规则",
      why: `命中 ${allow}`,
    };
  if (command.kind === "read")
    return {
      cls: "allow",
      verdict: "放",
      step: "只读",
      why: "范围内只读文件，直接放行",
    };
  if (
    command.base &&
    readonlyCommands.has(command.base) &&
    !command.compound &&
    !command.del
  )
    return {
      cls: "allow",
      verdict: "放",
      step: "只读内建",
      why: `${command.base} 是只读命令`,
    };
  if (mode.value === "bypassPermissions")
    return {
      cls: "allow",
      verdict: "放",
      step: "bypass",
      why: "通过两道硬门后，bypass 直接放行",
    };
  if (mode.value === "acceptEdits" && command.del && command.inScope)
    return {
      cls: "allow",
      verdict: "放",
      step: "acceptEdits",
      why: "工作目录内文件系统命令自动放行",
    };
  return {
    cls: "ask",
    verdict: "问",
    step: "灰区",
    why: command.compound
      ? "复合命令拆出的子命令没有明确规则"
      : "没有命中规则，普通模式询问",
  };
}

const judgedCommands = computed(() =>
  commands.map((command) => ({ command, result: judge(command) })),
);
const selectedResult = computed(() =>
  judgedCommands.value.find(
    (item) => item.command.id === selectedCommand.value,
  ),
);
</script>

<notes lang="md">
这是全权限章的互动中心。左边是配置：上排切模式(Manual/acceptEdits/bypass)，下排切 settings.json 规则集(空规则/团队常用)，中间显示当前生效的 allow/ask/deny。右边七条命令，每条一个判定牌。关键玩法：改左边任意一处，右边整列一起实时重算——这就是"并行看所有命令在当前配置下的结局"。现场必点几组对比：①团队规则下，npm test 命中 allow 放行、git push 命中 ask 要问、rm -rf/ 撞 deny 拦。②切到 bypass：大部分变直接放，但 git push 那条 ask 仍然要问(带锁)、rm -rf/ 仍被熔断拦(带锁)——亲眼验证 bypass 不是全放。③重点看两条删除：rm -rf/ 永远拦；但 rm build/output.js 删的是具体文件，空规则+Manual 要问、acceptEdits 因为是工作目录内 fs 命令直接放、bypass 也放——删具体文件到底问不问，取决于模式和范围，不是命令名。④echo \"$(cat .env)\"：看着是无害的 echo，但内联 $(cat .env) 想读密钥，团队 deny 了 Read(.env) 就连这条也拦——引出下一页 Bash 拆解。每张牌点开能看判定链：命中了哪条规则、卡在哪一步。
</notes>
