# HPE · HTML Presentation Runtime

TypeScript 驱动、AI 友好、模块可替换的 HTML 演示引擎。源码仓库可以同时保存多套 deck；`npm run release:runtime` 生成的发布包只包含引擎、播放器、检查器、CLI、Agent Skill 和测试夹具，明确排除 `app` 文稿与整个 `presentations/`，不会把业务演示内容带进 Runtime 发布物。

## 快速开始

```bash
npm install        # 会自动下载 Playwright Chromium
npm run dev        # 源码仓库默认打开 presentations/hello-hpe
```

播放器快捷键：`→`/`←`/空格 翻页与步进，`O` 总览，`S` 演讲者视图，`N` 讲稿，`F` 全屏，`P`/`H`/`C` 画笔/荧光笔/清除，右上角工具栏可切换主题。深链接格式：`#slide=<id>&step=<n>&mode=<mode>`。

## 你的第一份 deck

一个 deck 就是一个自包含目录：

```text
presentations/my-deck/
  deck.json          # 清单：尺寸、主题、页面列表（稳定 id）
  slides/*.slide.vue # 一页一个标准 Vue SFC
  themes/<slug>/     # theme.ts（类型化元数据）+ theme.css
```

最小的一页：

```vue
<template>
  <Slide>
    <h1 data-node="title">一个结论式的标题，而不是话题标签</h1>
    <div data-node="evidence" class="grid grid-cols-2 gap-6">...</div>
  </Slide>
</template>

<notes lang="md">
讲稿写在这里：怎么讲、怎么过渡、有什么注意事项。
</notes>
```

交互能力从弱到强：静态模板 → `<Step :at="n">` 分步揭示（配 manifest `maxStep`）→ `<Timeline>` 确定性动画 → `useSlideState(key, { initial, inspect })` 可检查的有限交互。每一步都保持标准 Vue/TS/CSS，没有自创 DSL。

常用命令（deck 不在默认位置时记得带 `--root`）：

```bash
npm run dev -- --deck-root presentations/my-deck
npm run deck -- list --json --root presentations/my-deck
npm run deck -- validate --json --root presentations/my-deck
npm run deck -- slide create summary --after intro --root presentations/my-deck
npm run deck -- notes set intro --file notes.md --root presentations/my-deck
npm run deck -- screenshot --slide all --states all --annotate --json --root presentations/my-deck
```

结构命令（create/move/rename/delete）受文件锁保护，改动后自动全量编译，失败回滚；删除的页面进 `.hpe/trash`。截图检查会遍历 slide × step × 交互状态 的组合，报告越界、文本裁切、最小字号、对比度等问题，产出 raw/annotated 图、contact sheet、HTML 与 JSON 报告。

## 把 deck 打成单文件离线 HTML

```bash
node scripts/package-offline.mjs presentations/my-deck artifacts/releases/my-deck/my-deck.html
node scripts/verify-offline.mjs artifacts/releases/my-deck/my-deck.html presentations/my-deck
```

产物是一个双击即开、完全离线的 HTML（JS/CSS 全内联，规避 `file://` 的模块 CORS 限制）。verify 脚本会用真实浏览器断言：零控制台错误、标题与 `deck.json` 一致、内容探针命中、能翻到最后一页——防止把错误的 deck 打进包里。

## 发布纯 Runtime

```bash
npm run release:runtime
npm run release:runtime:verify -- artifacts/releases/hpe-runtime-shell-20260819.zip --full
```

发布包不包含仓库中的任何正式 deck：`app/deck.json`、`app/slides/`、`app/themes/` 和 `presentations/` 都会被验包脚本拒绝。包内仅保留 `tests/fixtures/` 作为安装、构建和 E2E 自检输入；发布包中的 `npm run dev` 默认打开该测试夹具，实际使用时通过 `--deck-root <目录>` 指向自己的 deck。

## 给 AI 用：内置 hpe-slides Skill

`.agents/skills/hpe-slides/`（源码仓库的 `.claude/skills/` 下有软链，Runtime ZIP 内会实体化为普通目录）是给 Claude Code / 兼容 Agent 的技能：建稿、改页、迁移既有 PPT/HTML、做主题、离线打包、Runtime 发布，以及一整套纪律（页脚页码与 manifest 同步、不许用省略号截断文字、绿色构建不算视觉完成等）。让 Agent「用 hpe-slides 建一个 20 页的 deck」即可。

## 模块边界

| 包                     | 唯一职责                         | 可替换边界               |
| ---------------------- | -------------------------------- | ------------------------ |
| `@hpe/schema`          | 持久化契约与校验                 | JSON Schema / validator  |
| `@hpe/theme`           | 类型安全主题元数据与 AI 设计约束 | Theme contract           |
| `@hpe/runtime-core`    | 纯状态机与 `DeckEngine` port     | 任意兼容状态机实现       |
| `@hpe/runtime-browser` | 键盘、全屏、跨窗口同步           | Browser adapter          |
| `@hpe/renderer-vue`    | Vue 渲染组件和响应式桥接         | Renderer adapter         |
| `@hpe/compiler`        | SFC、notes、Vite、Shiki          | Compiler adapter/subpath |
| `@hpe/checker`         | 诊断协议、Playwright 检查        | Checker adapter/subpath  |
| `@hpe/cli`             | 稳定自动化入口                   | Application service      |

跨模块调用只走包的公开 `exports`；依赖规则由 dependency-cruiser 在 `npm run check` 里强制。Shiki 高亮、浏览器同步、Playwright 都是独立子路径，未引用就不进 bundle。

## 质量门禁

```bash
npm run check    # format + lint + 边界 + typecheck + test + build
npm run verify   # check + 覆盖率 + 包完整性 + bundle + 隔离 + e2e + license
```

## 范围边界

可视化拖拽编辑、多人协作、PowerPoint 导入、高保真可编辑 PPTX 导出不在当前承诺内，也不会以空接口或隐藏运行时成本预埋。

## 文档

- [已采纳的架构方案](docs/architecture.md)
- [CLI 命令与事务协议](docs/cli.md)
- [开发、模块替换与发布门禁](docs/development.md)
- [纯 Runtime 发布说明](docs/runtime-release.md)
- [AI 友好的主题系统](docs/themes.md)
- [开源项目调研与技术建议](docs/open-source-landscape.md)
