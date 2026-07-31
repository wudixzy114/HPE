# HPE · HTML Presentation Engine

TypeScript 驱动、AI 友好、模块可替换的 HTML 演示引擎。仓库已经从技术调研进入可运行骨架阶段。

## 快速开始

```bash
npm install
npm run dev
npm run check
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

## 模块边界

| 包                     | 唯一职责                     | 可替换边界               |
| ---------------------- | ---------------------------- | ------------------------ |
| `@hpe/schema`          | 持久化契约与校验             | JSON Schema / validator  |
| `@hpe/runtime-core`    | 纯状态机与 `DeckEngine` port | 任意兼容状态机实现       |
| `@hpe/runtime-browser` | 键盘、全屏、跨窗口同步       | Browser adapter          |
| `@hpe/renderer-vue`    | Vue 渲染组件和响应式桥接     | Renderer adapter         |
| `@hpe/compiler`        | SFC、notes、Vite、Shiki      | Compiler adapter/subpath |
| `@hpe/checker`         | 诊断协议、Playwright 检查    | Checker adapter/subpath  |
| `@hpe/cli`             | 稳定自动化入口               | Application service      |

所有跨模块调用只允许经过包的公开 `exports`。依赖规则由 `dependency-cruiser` 在 `npm run check` 中强制执行；浏览器同步、Shiki、Vite 渲染和 Playwright 都是独立子路径，未引用就不会进入相应 bundle。

## 当前结论

- 播放内核优先研究 [Reveal.js](https://revealjs.com/)，它的浏览器运行时、演讲者视图、插件机制和打印链路最完整。
- 面向开发者的完整产品形态优先研究 [Slidev](https://sli.dev/)；Markdown 到多格式产物的编译链路优先研究 [Marp](https://marp.app/)。
- 如果目标包含类似 PowerPoint 的可视化编辑器，优先研究 [Strut](https://strut.io/) 的交互和数据模型，但其 AGPL-3.0 许可证不适合未经评估直接嵌入闭源产品。
- 目前没有一个宽松许可证项目同时成熟覆盖“可视化编辑、播放、协作、HTML/PDF/PPTX 高保真导出”。合理路线是组合成熟组件，并保持自己的文档模型。

## 文档

- [已采纳的架构方案](docs/architecture.md)
- [开源项目调研与技术建议](docs/open-source-landscape.md)
- [项目元数据快照](data/projects.json)

调研快照日期：2026-07-30。
