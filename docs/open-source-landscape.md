# HTML PPT 引擎开源项目调研

> 调研快照：2026-07-30（Asia/Shanghai）  
> 范围：浏览器端播放引擎、Markdown/组件化演示工具、可视化编辑器，以及可复用的编辑与导出组件。

## 1. 结论先行

现成开源项目很多，但它们解决的是不同层次的问题，不能只按“能播放幻灯片”放在一起比较。

1. **要做嵌入式 HTML 播放内核**：首选评估 **Reveal.js**。功能覆盖、API、插件、演讲者模式、打印/PDF 链路和社区实践最完整。
2. **要做给开发者使用的完整制稿工具**：重点研究 **Slidev**。它证明了 Vue/Vite、Markdown、组件和开发服务器可以组成很好的作者体验。
3. **要做稳定的 Markdown 编译与批量导出**：重点研究 **Marp**。它把主题、CLI、HTML/PDF/PPTX/图片输出拆分得很清楚。
4. **要做类似 PowerPoint 的可视化编辑器**：重点研究 **Strut**，但它采用 **AGPL-3.0**。可以研究产品交互和架构；闭源产品复用代码前必须单独做许可证评估。
5. **不要一开始以“任意 HTML 字符串”作为唯一源格式**。更稳妥的是自有、版本化的 slide/element 文档模型，HTML 只是一个渲染结果。否则选择、对齐、主题、协作、迁移和 PPTX 导出都会逐渐失控。

因此，建议的产品路线不是 fork 一个项目包办所有事情，而是：

```text
版本化文档模型
    -> DOM/HTML 渲染器
    -> 播放控制器（借鉴 Reveal.js / Shower）
    -> 编辑器（借鉴 Strut，组合 Moveable / Selecto / Tiptap）
    -> 导出适配器（HTML、PDF、图片；PPTX 由 PptxGenJS 单独实现）
```

## 2. 第一梯队：值得实际做 PoC

| 项目 | 定位 | 维护信号（截至快照日） | 许可证 | 适合怎么用 | 网址 |
| --- | --- | --- | --- | --- | --- |
| **Reveal.js** | 通用 HTML 演示运行时 | npm `6.0.1`，2026-04-11 发布；源码 2026-05 仍有提交 | MIT | 最优先的播放内核候选；也适合研究插件、演讲者视图、导航与打印 | [官网](https://revealjs.com/) · [源码](https://github.com/hakimel/reveal.js) · [示例](https://revealjs.com/demo/) · [API](https://revealjs.com/api/) |
| **Slidev** | Vue/Vite 驱动的开发者演示工具 | `@slidev/cli 52.18.0`，2026-07-14 发布；持续维护 | MIT | 借鉴作者体验、热更新、组件/代码能力、主题系统和导出工作流；不宜直接当通用嵌入式内核 | [官网](https://sli.dev/) · [源码](https://github.com/slidevjs/slidev) · [指南](https://sli.dev/guide/) |
| **Marp** | Markdown 演示生态与多格式编译器 | CLI `4.5.0`，2026-07-17 发布；持续维护 | MIT | 借鉴编译器分层、主题 CSS、CLI、批量渲染和导出 | [官网](https://marp.app/) · [CLI 源码](https://github.com/marp-team/marp-cli) · [Core 源码](https://github.com/marp-team/marp-core) |
| **Shower** | 原生 HTML/CSS/JS 播放引擎 | `@shower/core 3.6.0`，2026-07-07 发布 | MIT | DOM-first、小而清晰；非常适合作为自研内核的第二参考实现 | [演示/官网](https://shwr.me/) · [源码](https://github.com/shower/shower) · [Core](https://github.com/shower/shower/tree/main/packages/core) |
| **Spectacle** | React 组件化演示框架 | npm `10.2.3`，2025-10-10 发布；源码 2026-04 仍有提交 | MIT | React 技术栈下的组件 API、主题和演讲者工具参考 | [官网](https://formidable.com/open-source/spectacle/) · [源码](https://github.com/FormidableLabs/spectacle) · [npm](https://www.npmjs.com/package/spectacle) |
| **Strut** | 可视化空间演示编辑器 | 2026 年重做；源码在 2026-07 持续提交 | **AGPL-3.0** | 最直接的 WYSIWYG 竞品；重点研究画布交互、空间布局、数据层和产品流程，复用代码需谨慎 | [在线体验](https://strut.io/) · [源码](https://github.com/tantaman/Strut) · [许可证](https://github.com/tantaman/Strut/blob/master/LICENSE) |

### 2.1 Reveal.js

核心能力包括横向/纵向嵌套幻灯片、fragment 分步显示、Markdown、代码高亮、演讲者备注、演讲者视图、自动播放、触摸/键盘导航、URL 状态、插件 API 和 PDF 打印。它既能用全局单例，也支持创建多个 deck 实例，作为嵌入式播放器较友好。

**值得借鉴**：

- deck 生命周期、事件和插件边界；
- 当前页/历史记录/URL 的状态管理；
- overview、speaker view、notes、fragment 等演示语义；
- 16:9 固定逻辑画布向不同视口缩放的策略；
- 打印样式与 headless browser 导出路线。

**需要注意**：Reveal.js 的源文档主要是约定化 DOM。若产品要支持强编辑、实时协作和复杂迁移，不应直接把这棵 DOM 当作业务数据模型。

参考：[配置](https://revealjs.com/config/) · [演讲者视图](https://revealjs.com/speaker-view/) · [PDF 导出](https://revealjs.com/pdf-export/) · [插件](https://revealjs.com/plugins/)

### 2.2 Slidev

Slidev 面向“用 Markdown 和 Web 技术写演示”的开发者，整合 Vue、Vite、主题、布局、代码高亮/编辑、演讲者模式和导出。它最有价值的是完整工具链，而不是一个极小的播放器库。

**值得借鉴**：

- 源文件解析后形成统一 slide 数据，再交给运行时；
- layout、theme、addon 与用户组件的分层；
- dev server、热更新和演示者控制台形成的一体化体验；
- 将代码编辑、图表、动画等 Web 能力自然放进幻灯片。

**不建议直接作为通用内核的原因**：它与 Vue/Vite/Markdown 作者工作流绑定较深。若目标用户是非开发者或宿主应用使用 React/原生 Web Components，整包嵌入的边界会偏重。

参考：[功能概览](https://sli.dev/guide/why) · [语法](https://sli.dev/guide/syntax) · [导出](https://sli.dev/guide/exporting)

### 2.3 Marp

Marp 的优势是“输入 Markdown + 主题 CSS，输出确定的演示文档”。生态拆成解析/渲染核心、CLI、VS Code 扩展等部分，适合研究可测试的编译流水线。

**值得借鉴**：

- core、CLI、编辑器扩展的职责拆分；
- CSS theme 与页面尺寸的约束；
- Chromium 驱动的 PDF/图片导出；
- HTML、PDF、PPTX、PNG/JPEG 等多产物工作流。

**需要注意**：PPTX 输出与“可编辑、语义化 PowerPoint”不是一回事。任何以浏览器截图或整页图像为基础的方案，都只能保证外观，无法保证 Office 内逐元素编辑。若这是硬需求，需要建立元素级映射并使用 PptxGenJS 等工具单独生成。

参考：[Marpit 框架](https://marpit.marp.app/) · [Marp Core](https://github.com/marp-team/marp-core) · [CLI 文档](https://github.com/marp-team/marp-cli#readme)

### 2.4 Shower

Shower 明确采用 HTML、CSS 和原生 JavaScript，主题与引擎分离；核心包负责 slide 管理、导航、进度条和计时器，并支持键盘无障碍与 PDF 打印。相比 Reveal.js，它更小、更接近浏览器原生模型。

**适合用途**：当团队决定自研播放器时，用它校验最小职责集合；尤其适合研究主题/引擎解耦、可访问性和无需框架的 DOM API。

### 2.5 Spectacle

Spectacle 用 React 组件描述 Deck、Slide、布局与内容，适合 JSX/组件化团队。它可以证明“幻灯片是组件树”这条路线，但不天然解决面向普通用户的拖拽编辑，也会把内容模型与 React 耦合。

**适合用途**：React SDK、组件 API、主题上下文、演讲者模式的参考；如果希望引擎可被 Vue、Svelte 或原生页面消费，不应让 React 节点成为持久化格式。

### 2.6 Strut

Strut 是最直接的可视化编辑器参照物：在每张 slide 上放置富内容，再把 slides 排列到 3D 空间，通过类似 impress.js 的相机运动播放。2026 重做版使用 React 19、TanStack Start、Vite、SQLite、乐观本地 store 与 live query，支持自托管。

**值得借鉴**：

- 编辑器工作区和空间演示交互；
- 编辑器、播放器、存储和上传之间的边界；
- 乐观更新、服务端权威写入与实时查询；
- 从单机编辑器走向托管产品的工程结构。

**风险**：仓库为 AGPL-3.0，而不是 MIT/Apache-2.0。研究交互和公开架构没有问题；复制或修改代码、通过网络提供服务时可能触发相应义务，需由法律/合规结合实际分发与部署方式判断。

## 3. 第二梯队：专项或历史参考

| 项目 | 特点 | 当前判断 | 网址 |
| --- | --- | --- | --- |
| **impress.js** | 以 CSS 3D transform 构建无限画布和镜头飞行 | 源码在 2026-07 仍有活动，但 npm 最新稳定版仍是 `1.1.0`（2020）；适合作为空间布局/转场参考，不作为常规 deck 的第一内核 | [演示](https://impress.js.org/) · [源码](https://github.com/impress/impress.js) |
| **remark**（gnab/remark） | 浏览器内把 Markdown 转成 slideshow，支持 presenter mode | 设计简洁，源码最后明显活动在 2023；可研究轻量解析/运行时，别与 npm 上的 Markdown AST 项目 `remark` 混淆 | [官网](https://remarkjs.com/) · [源码](https://github.com/gnab/remark) |
| **WebSlides** | 约定化 HTML section + CSS 组件，适合快速制作网页演示 | npm 最后发布 `1.5.0`（2019），源码活动停在 2020；只作样式与页面范例参考 | [演示](https://webslides.tv/) · [源码](https://github.com/webslides/WebSlides) |
| **Bespoke.js** | 极小、插件化的 presentation micro-framework | npm 最后发布在 2015、源码活动停在 2020；插件粒度值得看，生产选型风险高 | [源码](https://github.com/markdalgleish/bespoke.js) |
| **deck.js** | 早期 jQuery HTML presentation 框架 | 历史项目；依赖和浏览器时代都较老，不建议作为新项目基础 | [源码](https://github.com/imakewebthings/deck.js) |
| **Fusuma** | Markdown/MDX + React 的演示构建工具 | npm 最后发布 `2.8.4`（2021）；与 Slidev/Spectacle 能力重叠且维护信号弱 | [源码](https://github.com/hiroppy/fusuma) |

## 4. 编辑器与导出层的可复用组件

| 组件 | 用途 | 许可证 | 判断 | 网址 |
| --- | --- | --- | --- | --- |
| **Moveable** | 拖拽、缩放、旋转、变形、参考线 | MIT | DOM-first 幻灯片编辑器的高价值基础件 | [官网](https://daybrush.com/moveable/) · [源码](https://github.com/daybrush/moveable) |
| **Selecto** | 框选/多选 DOM 元素 | MIT | 与 Moveable 同一生态，适合组合使用 | [演示](https://daybrush.com/selecto/) · [源码](https://github.com/daybrush/selecto) |
| **Tiptap** | 基于 ProseMirror 的富文本编辑 | MIT（核心） | 用于文本框编辑；持久化其 JSON/自有富文本 AST，避免存 HTML 字符串 | [官网](https://tiptap.dev/) · [源码](https://github.com/ueberdosis/tiptap) |
| **GrapesJS** | 可嵌入式 Web builder | BSD-3-Clause | 适合研究 block/style/trait 架构，但页面搭建语义不等于固定尺寸 slide；深改成本要做 PoC 才能判断 | [官网](https://grapesjs.com/) · [源码](https://github.com/GrapesJS/grapesjs) |
| **Konva** | Canvas 2D scene graph | MIT | 大量图形和高频交互时有价值；DOM/HTML 内容、可访问性和文本编辑更复杂 | [官网](https://konvajs.org/) · [源码](https://github.com/konvajs/konva) |
| **Fabric.js** | Canvas 对象模型与交互 | MIT | 类似 Konva；适合自由绘图，不是 HTML-first 的默认选择 | [官网](https://fabricjs.com/) · [源码](https://github.com/fabricjs/fabric.js) |
| **PptxGenJS** | 以 JavaScript 生成 `.pptx` | MIT | 元素级 PPTX 导出的首选候选；需自建 HTML 元素到 PowerPoint shape 的映射 | [官网](https://gitbrent.github.io/PptxGenJS/) · [源码](https://github.com/gitbrent/PptxGenJS) |

### DOM 还是 Canvas

如果产品明确叫“HTML PPT”，建议默认采用 **DOM-first**：文字、图片、视频、表格、代码和自定义 Web 组件都更自然，可访问性和浏览器布局能力也更好。Moveable + Selecto 处理几何交互，Tiptap 处理富文本。

Canvas 适合自由绘图、超多对象或统一 scene graph，但富文本、原生媒体、链接、复制粘贴、搜索、SEO/可访问性和嵌入任意 HTML 的成本都会升高。除非性能测试证明 DOM 不够，否则不应先选 Canvas。

## 5. 建议的自研边界

建议拥有自己的核心模型，并把第三方项目放在可替换边界后面：

```ts
type Deck = {
  schemaVersion: number
  meta: DeckMeta
  theme: ThemeRef
  slides: Slide[]
}

type Slide = {
  id: string
  size: { width: number; height: number }
  background?: Background
  elements: ElementNode[]
  notes?: RichText
  transition?: Transition
}

type ElementNode = {
  id: string
  type: 'text' | 'image' | 'shape' | 'video' | 'group' | 'html'
  frame: { x: number; y: number; width: number; height: number; rotation: number }
  style: Record<string, unknown>
  content: unknown
  children?: ElementNode[]
}
```

关键原则：

- `schemaVersion` 和迁移从第一天存在；
- 坐标基于固定逻辑画布，播放时统一缩放；
- 编辑状态（选区、参考线、hover）不写入文档模型；
- 动画/fragment 是显式时间线或步骤数据，不藏在任意 CSS 中；
- 自定义 HTML 是逃生口，不是所有元素的默认格式；
- 渲染器、播放控制器、编辑器、导出器只通过模型契约连接；
- HTML/PDF/PPTX 分别是不同后端，不承诺无法兑现的像素级跨格式一致性。

## 6. 推荐 PoC 顺序

### PoC A：播放内核（先做）

用同一份 5 页测试 deck 对比 Reveal.js 与 Shower：普通页、纵向子页、fragment、视频、演讲者备注。测试嵌入宿主页面、多实例、键盘/触摸、全屏、URL 状态、销毁重建和 PDF 导出。

**退出标准**：能明确决定“包一层现有 runtime”还是“借鉴 API 后自研控制器”。

### PoC B：可视化编辑

用 DOM + Moveable + Selecto + Tiptap 实现文本、图片、形状三类元素，覆盖创建、选择、多选、移动、缩放、旋转、层级、复制粘贴、撤销重做和 JSON 往返。

**退出标准**：100 个元素交互流畅；序列化后重放无明显漂移；编辑器状态与 deck 数据彻底分离。

### PoC C：导出

对同一 deck 生成静态 HTML、Chromium PDF 和 PptxGenJS PPTX，记录字体、文本换行、SVG、滤镜、视频和动画的降级规则。

**退出标准**：形成正式的能力矩阵，而不是笼统承诺“支持 PPTX”。

## 7. 建议决策

当前可以先做以下技术假设，待 PoC 验证：

- **持久化**：自有 versioned JSON document model；
- **渲染**：DOM-first，CSS transform 定位；
- **播放**：先适配 Reveal.js 做基准，保留替换为自研 controller 的接口；
- **编辑**：Moveable + Selecto + Tiptap；
- **PDF/图片**：Chromium/Playwright 服务端渲染；
- **PPTX**：PptxGenJS 元素级输出，明确不支持的 CSS 降级；
- **历史/协作**：命令或 transaction 层先行，后续再接 CRDT，不把 UI 操作直接写散到 store。

## 8. 数据可信度与限制

- 版本与发布时间来自 npm registry；源码活跃时间通过 GitHub commit feed 复核。
- GitHub 匿名 API 在调研时遇到共享出口限流，因此本文刻意不记录容易迅速过期且本次无法稳定复核的 star 数。
- “活跃”只表示近期有发布或提交，不等于接口稳定、无安全问题或适合直接用于生产。
- 许可证字段只用于工程初筛，不构成法律意见；特别是 Strut 的 AGPL-3.0 必须结合实际分发/网络服务方式评估。
- 机器可读快照见 [`data/projects.json`](../data/projects.json)。

## 9. 可直接打开的总链接

- Reveal.js：https://revealjs.com/ ｜ https://github.com/hakimel/reveal.js
- Slidev：https://sli.dev/ ｜ https://github.com/slidevjs/slidev
- Marp：https://marp.app/ ｜ https://github.com/marp-team/marp-cli
- Shower：https://shwr.me/ ｜ https://github.com/shower/shower
- Spectacle：https://formidable.com/open-source/spectacle/ ｜ https://github.com/FormidableLabs/spectacle
- Strut：https://strut.io/ ｜ https://github.com/tantaman/Strut
- impress.js：https://impress.js.org/ ｜ https://github.com/impress/impress.js
- remark：https://remarkjs.com/ ｜ https://github.com/gnab/remark
- WebSlides：https://webslides.tv/ ｜ https://github.com/webslides/WebSlides
- PptxGenJS：https://gitbrent.github.io/PptxGenJS/ ｜ https://github.com/gitbrent/PptxGenJS
