# HPE · HTML Presentation Engine

TypeScript 驱动、AI 友好、模块可替换的 HTML 演示引擎。第一阶段产品链路已经覆盖制稿、编译、播放、演讲者视图、打印、确定性检查和事务式自动化。

## 快速开始

```bash
npm install
npm run dev
npm run check
npm run verify
```

CLI 在 workspace 安装后可通过 `npm exec deck -- ...` 使用：

```bash
npm exec deck -- list --json
npm exec deck -- validate --json
npm exec deck -- slide create summary --after architecture
npm exec deck -- slide move summary --before appendix
npm exec deck -- slide delete legacy --json
npm exec deck -- notes set architecture --file notes.md
npm exec deck -- render
```

`inspect`/`screenshot` 默认会自行构建并启动临时预览，无需预先运行开发服务器。结构命令受文件锁保护，修改后自动执行完整编译，失败会回滚；删除的页面进入 `.hpe/trash`。完整命令、JSON 协议和退出码见 [CLI contract](docs/cli.md)。

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

所有跨模块调用只允许经过包的公开 `exports`。依赖规则由 `dependency-cruiser` 在 `npm run check` 中强制执行；浏览器同步、Shiki、Vite 渲染和 Playwright 都是独立子路径，未引用就不会进入相应 bundle。

核心状态机只包含翻页所需的最小状态。确定性时间线与声明式可检查状态分别通过 `@hpe/runtime-core/timeline` 和 `@hpe/runtime-core/slide-state` 显式引入；静态 deck 不会把这些实现打进运行时 bundle。

浏览器层同样提供 `keyboard`、`touch`、`fullscreen`、`url`、`timeline` 与 `sync` 子路径。标准播放器使用键盘、触摸、全屏和 `#slide=<id>&step=<n>&mode=<mode>` 深链接；嵌入场景可以只组合需要的适配器。跨窗口同步仅传递 slide/step，窗口本地的 fullscreen 与 mode 不会互相污染。

标准播放器已内置 overview、speaker view（当前页、下一页、讲稿、计时与远程翻页）、全页打印以及 timeline 控制。按 `O` 打开总览，按 `S` 打开演讲者窗口，按 `F` 切换全屏；演讲者窗口通过 `BroadcastChannel` 同步导航、timeline 和已声明的页面交互状态，同时保持自己的 speaker mode。

编译器会在构建前验证 SFC 契约、静态 Tailwind class、重复 `data-node`、本地资源和 theme，并导出 node 到源码行列的映射。`<ShikiCode lang="typescript" code="..." />` 会在 Vite 编译阶段转换为静态高亮 HTML；Shiki、语法 grammar 与 TextMate runtime 不会进入浏览器产物。

Playwright 检查器会遍历 slide、step、声明交互状态和 timeline 检查点的笛卡尔积，并检查画布尺寸/scroll overflow、节点越界、文本裁切、图片与媒体、最小字号、颜色对比度、安全区以及显式 `data-layout` 重叠。启用截图时同时输出 raw、带源码节点标记的 annotated 图、contact sheet、HTML 报告和 JSON 协议；状态组合默认硬限制为 512，避免 CI 失控。

## 范围边界

当前交付对应 [架构方案](docs/architecture.md) 定义的第一阶段。可视化拖拽编辑、多人协作、PowerPoint 导入和高保真可编辑 PPTX 导出明确不在本阶段承诺内；这些能力不会以空接口或隐藏运行时成本预埋。

## 文档

- [已采纳的架构方案](docs/architecture.md)
- [CLI 命令与事务协议](docs/cli.md)
- [开发、模块替换与发布门禁](docs/development.md)
- [第一阶段逐项完成审计](docs/completion-audit.md)
- [AI 友好的主题系统](docs/themes.md)
- [Claude Code 50 页演示迁移记录](docs/migrations/claude-code-sharing.md)
- [开源项目调研与技术建议](docs/open-source-landscape.md)
- [项目元数据快照](data/projects.json)

调研快照日期：2026-07-30。
