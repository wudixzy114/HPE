# HPE — HTML Presentation Runtime

> **TypeScript 驱动、AI 友好、模块可替换的 HTML 演示引擎。**
> 一个源码仓库同时存多个 deck；`npm run release:runtime` 出的发布包**只**含引擎、播放器、检查器、CLI、Agent Skill 和测试套件，业务演示内容被明确排除。

## 快速开始

```bash
npm install        # 会自动下载 Playwright Chromium
npm run dev        # 默认打开 presentations/hello-hpe
```

播放器快捷键：

- `→` / `Space` / `↓` 下一页与步进
- `O` 概览，`S` 演讲者视图，`N` 草稿
- `F` 全屏，`P` / `H` / `C` 笔 / 激光笔 / 清除
- 右上角工具栏切换主题
- 深链：`#slide=<id>&step=<n>&mode=<mode>`

## 你的第一个 deck

每个 deck 是自包含目录：

```text
presentations/my-deck/
  deck.json          # 清单：尺寸、主题、页面列表（稳定 id）
  slides/*.slide.vue # 一页一个标记的 Vue SFC
  themes/<slug>/     # theme.ts（类型化元数据）+ theme.css
```

最小一页：

```vue
<template>
  <Slide>
    <h1 data-node="title">一个结论式的标题，而不是话题标签</h1>
  </Slide>
</template>
```

## 仓库结构

```
HPE/
├─ app/                      # 引擎 + 播放器 + 检查器（dev 时跑这些）
├─ data/                     # 内置 deck 数据 / 配置
├─ docs/                     # 设计文档、迁移指南
├─ packages/                 # 独立可发布的子包
├─ presentations/            # 业务 deck 集合（不在 runtime 发布包内）
├─ scripts/                  # CLI 入口、构建脚本
├─ tests/                    # Playwright E2E + Vitest 单测
├─ .agents/                  # 给 AI 协作者的指引
├─ .claude/                  # Claude skill
├─ .github/                  # CI 配置
├─ eslint.config.js
├─ playwright.config.ts
└─ vitest.config.ts
```

## 技术栈

- **前端**：Vue 3 + TypeScript + Vite
- **样式**：CSS 变量 + 主题系统（type-safe theme.ts）
- **渲染**：声明式 SFC + `data-node` 标识
- **测试**：Playwright（E2E）+ Vitest（单元）
- **AI 集成**：`.agents/` + `.claude/` skill
- **构建**：ESLint + Prettier + pnpm（隐式）

## 关键设计

| 设计点 | 说明 |
|---|---|
| **多 deck 单仓** | 演示是数据，引擎是代码，两者解耦 |
| **类型化主题** | `theme.ts` 是元数据，`theme.css` 是表现，编译期对齐 |
| **AI 友好** | 引擎有 `.agents/` 和 `.claude/` skill，AI 可以直接读懂并写新 deck |
| **稳定的 slide id** | 用于深链、跨 deck 引用、增量更新 |
| **发布包边界** | `release:runtime` 显式排除 `app` 和 `presentations/`，发布只含引擎 |

## 已完成

- ✅ Vue 3 + TS 引擎（Slide / 主题 / 步进）
- ✅ 播放器（键盘、笔、激光笔、概览、演讲者视图）
- ✅ 检查器（dev 时打开）
- ✅ CLI（构建 / 校验 / 导出）
- ✅ Playwright + Vitest 测试套件
- ✅ 多个内置 deck 演示

## 与其他演示工具的差异

| 工具 | 范式 | HPE 的差异 |
|---|---|---|
| reveal.js | HTML 静态 | HPE 的 slide 是 Vue SFC，逻辑可复用 |
| Slidev | Markdown + Vue | HPE 把引擎和 deck 完全分离，多 deck 单仓 |
| Keynote | 二进制 | HPE 一切都是文本，AI 可写、可 diff、可 review |

## License

MIT
