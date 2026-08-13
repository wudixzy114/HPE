# HTML PPT 引擎架构方案

> 状态：已采纳  
> 日期：2026-07-30

## 1. 产品定位

构建一个 TypeScript 驱动、AI 友好的 HTML PPT 引擎。它不是 PowerPoint 的简单网页复刻，而是一套满足以下条件的演示文稿系统：

- 每页幻灯片都是独立、可编程的单文件组件；
- 静态页面保持简单，必要时可以升级为交互式 Web 应用；
- 页面尺寸、溢出、资源、状态和视觉产物都可以确定性检查；
- AI 可以通过稳定的 CLI 和结构化数据创建、修改、移动和验证幻灯片；
- 播放核心、页面渲染、编译、检查和 AI 接入保持明确分离。

## 2. 最终技术选型

| 领域 | 选择 | 决策 |
| --- | --- | --- |
| 开发语言 | TypeScript strict | 所有自有源码使用 TypeScript，不维护手写 JavaScript |
| 页面格式 | Vue 3 SFC | 每页一个 `.slide.vue` 文件 |
| 页面渲染 | Vue 3 | 普通页面可以完全不写脚本，交互页面按需使用响应式能力 |
| 全局状态 | 纯 TypeScript 状态机 | 播放核心不依赖 Vue 和 Pinia |
| Pinia | 第一阶段不引入 | 页面局部状态使用 Vue `ref`/`computed`，出现明确的跨页面复杂状态后再评估 |
| 样式 | Tailwind CSS + scoped CSS + global theme | Tailwind 提供 utilities，单页特殊样式使用 scoped CSS，全局主题使用 CSS Variables |
| 构建 | Vite + `@vue/compiler-sfc` | 负责 SFC、资源、HMR、notes 和源码映射 |
| 代码高亮 | Shiki 编译时渲染 | 不在播放器中携带代码高亮运行时 |
| 浏览器检查 | Playwright | 负责布局检查、全状态截图、控制台和资源错误收集 |
| 现有播放框架 | 不作为运行时依赖 | Reveal.js 等项目只用于需求清单、交互行为和测试场景参考 |
| AI 接入 | CLI 优先，后续可增加 MCP | 核心不依赖任何模型或厂商 SDK |

浏览器最终仍会执行构建产物中的 JavaScript。这里的约束是源码、接口、工具和测试均使用 TypeScript。

## 3. 仓库结构

```text
packages/
  schema/          页面契约、deck manifest、JSON Schema
  theme/           类型安全主题契约、布局角色和 AI 设计指导
  runtime-core/    纯 TypeScript 状态机、事件、步骤、时间线
  runtime-browser/ 键盘、全屏、URL、BroadcastChannel
  renderer-vue/    Vue 页面挂载、卸载和运行时上下文
  compiler/        Vue SFC、notes、Tailwind、资源和源码映射
  checker/         Playwright、布局诊断、截图和标注
  cli/             创建、移动、删除、检查和渲染命令

app/
  src/             通用播放器壳，不包含具体文稿内容
  theme.css        播放器基础 UI 与 Tailwind 入口
  deck.json        默认示例文稿元数据和页面顺序
  slides/          每页一个 .slide.vue 文件
  assets/          图片、字体、音视频等资源
```

播放器壳与文稿根目录可独立选择。`--deck-root` 指向任意包含 `deck.json`、`slides/`、`themes/` 和 `assets/` 的目录；默认值 `app` 只是仓库自带示例。切换文稿不修改播放器源码，也不共享 manifest、页面状态、主题或资源命名空间。

依赖方向保持单向：

```text
schema <- runtime-core <- runtime-browser
   ^            ^
   |            |
compiler    renderer-vue

checker 和 cli 只调用各模块公开接口
```

约束：

- `runtime-core` 不导入 Vue、Tailwind、Playwright 或 AI SDK；
- `runtime-browser` 只实现浏览器平台能力；
- `renderer-vue` 把核心状态映射为 Vue 响应式上下文；
- `compiler` 负责把作者源码转换为统一 manifest 和可执行页面；
- `checker` 只能通过公开产物和浏览器接口检查页面；
- AI 通过 CLI 和结构化文件操作系统，不直接耦合内部 store。

## 4. 单页文件格式

每页使用标准 Vue SFC，并增加自定义 `notes` block：

```vue
<template>
  <Slide>
    <h1 data-node="title" class="text-5xl font-bold">
      系统架构
    </h1>

    <Step :at="1">
      <ArchitectureDiagram data-node="diagram" />
    </Step>
  </Slide>
</template>

<script setup lang="ts">
const selectedTab = useSlideState('selectedTab', {
  initial: 'overview',
  inspect: ['overview', 'details'],
})
</script>

<style scoped>
.diagram {
  height: 420px;
}
</style>

<notes lang="md">
这一页介绍播放器、编译器和检查器之间的关系。
</notes>
```

规则：

- 普通页面只使用 `template`、`style` 和 `notes`，不要求脚本；
- 需要交互时才增加 `<script setup lang="ts">`；
- 重要布局元素提供稳定、语义化的 `data-node`；
- 编译器保留 DOM 节点到源码文件及行列位置的映射；
- 页面顺序和稳定 `slideId` 保存在 `deck.json`，不依赖文件名排序；
- AI 移动页面时修改 manifest，不修改 import 语句；
- Tailwind 类名必须静态可扫描，禁止通过字符串拼接动态生成。

## 5. 页面尺寸与布局约束

默认逻辑画布为 `1280x720`，即 16:9。播放器只对整个画布进行等比缩放，不改变页面内部布局。

基础约束：

- slide root 固定为 `1280x720`；
- 所有检查都在未缩放的标准尺寸下执行；
- 播放模式可以裁切溢出，但检查模式必须将溢出报告为错误；
- 有意出血的元素必须显式标记，例如 `data-overflow="allow"`；
- 编辑器状态、选区、参考线等信息不得进入 deck 文档；
- 全局主题通过 `theme.css` 和 CSS Variables 提供；
- Tailwind utilities 全局共享，单页特殊规则使用 `<style scoped>`；
- 使用 CSS layer 固定 reset、theme、utilities 和 slide styles 的层叠顺序。

## 6. 播放状态机

核心状态保持精简：

```ts
type DeckState = {
  slideId: string
  step: number
  mode: 'present' | 'speaker' | 'inspect'
  fullscreen: boolean
}

type DeckEvent =
  | { type: 'NEXT' }
  | { type: 'PREVIOUS' }
  | { type: 'GOTO'; slideId: string }
  | { type: 'SET_STEP'; step: number }
  | { type: 'SET_MODE'; mode: DeckState['mode'] }
```

状态转换由纯 TypeScript reducer 或等价状态机实现。Vue 只订阅状态，不拥有状态机。

第一阶段内置能力：

- 上一页、下一页和指定页面跳转；
- 键盘和触摸导航；
- 浏览器全屏；
- 页码和进度；
- overview；
- speaker view；
- 讲稿、当前页和下一页预览；
- 代码高亮；
- 页面步骤和确定性动画；
- 打印、截图和静态 HTML 输出。

演讲者窗口通过 `BroadcastChannel` 传递事件和状态快照，不使用 Pinia 处理跨窗口同步。

## 7. 页面交互与动画

动画分为三个层级：

1. `<Step :at="n">`：点击后分步出现，覆盖大部分传统 PPT 动画；
2. `<Timeline>` 或 `useTimeline()`：由引擎时钟控制的确定性时间动画；
3. 自由 Vue 逻辑：只作为高级能力和逃生口。

不鼓励在页面中直接使用不可控的 `setTimeout`、无限 CSS 动画或隐式网络状态。检查模式必须能够设置任意 step 和 timeline 时间点。

页面的可检查交互状态通过统一 API 声明：

```ts
const tab = useSlideState('tab', {
  initial: 'overview',
  inspect: ['overview', 'details', 'metrics'],
})
```

检查器据此渲染所有声明状态。没有声明的任意运行时状态不承诺被自动穷举。

## 8. AI 友好的 CLI

AI 接入首先建设确定性 CLI，而不是把模型 SDK 放进引擎：

```bash
deck list --json
deck inspect --slide all --states all --json
deck screenshot --slide all --annotate
deck slide create --after architecture
deck slide move summary --before appendix
deck slide delete legacy
deck notes set architecture --file notes.md
deck validate
deck render
```

设计原则：

- 所有查询命令支持 JSON 输出；
- 所有修改命令使用稳定的 `slideId` 和 `nodeId`；
- 结构性操作必须是事务性的，失败时不得留下半完成文件；
- 命令提供明确 exit code；
- AI 可以直接改写 SFC 内容，但页面创建、删除、排序和重命名优先通过 CLI；
- CLI 修改后自动运行 schema 和引用完整性检查；
- 后续 MCP server 只包装同一组 CLI/application service，不重复实现业务逻辑；
- AI provider 是可选适配层，核心保持模型无关。

推荐的 AI 工作循环：

```text
读取 deck graph 和诊断 JSON
    -> 修改或创建页面
    -> 运行 validate
    -> 渲染全部声明状态
    -> 查看原始/标注截图
    -> 根据诊断继续修正
```

## 9. 自动检查与页面标注

### 9.1 确定性检查

- slide 的 `scrollWidth` 和 `scrollHeight`；
- 元素 bounding box 是否超出 slide；
- 文本框是否裁切；
- 图片、字体、视频和其他资源是否加载失败；
- browser console error 和未处理异常；
- 最小字号、颜色对比度和安全区；
- 标记为布局对象的异常重叠；
- 每个 step 和每个声明交互状态；
- 原始截图、标注截图、contact sheet、HTML 报告和 JSON 报告。

元素重叠不能统一视为错误，因为设计可能有意重叠。第一阶段只对显式布局对象进行启发式检查，并把不确定结果作为 warning。

### 9.2 标注截图

检查器生成两套图片：

- raw screenshot：页面真实渲染结果；
- annotated screenshot：显示边界、安全区、节点 ID、溢出和冲突位置。

标注层只在截图时注入，不得污染页面产物。节点 ID 必须能映射回 SFC 文件和源码位置。

### 9.3 诊断协议

```json
{
  "code": "SLIDE_OVERFLOW_X",
  "severity": "error",
  "slideId": "architecture",
  "nodeId": "diagram",
  "source": "slides/03-architecture.slide.vue",
  "line": 12,
  "bounds": { "x": 80, "y": 180, "width": 1210, "height": 460 },
  "slideBounds": { "width": 1280, "height": 720 },
  "screenshot": "artifacts/architecture.annotated.png"
}
```

几何、资源和运行时错误可作为 CI 硬错误。视觉 AI 对信息密度、层级、均衡和美观的判断第一阶段只作为建议，不阻塞构建。

## 10. 第一阶段范围

第一阶段实现：

- Vue SFC 单页格式和 `notes` block；
- deck manifest 和 schema；
- TypeScript 播放状态机；
- Vue renderer；
- 翻页、全屏、页码、进度、speaker view；
- `<Step>` 和可控 timeline；
- Tailwind、scoped CSS 和 global theme；
- CLI 页面创建、删除、排序、校验和渲染；
- Playwright 溢出检查、全状态截图、截图标注和 JSON 报告。

第一阶段明确不做：

- 可视化拖拽编辑器；
- 多人协作；
- PowerPoint 导入；
- 高保真可编辑 PPTX 导出；
- 任意交互状态的自动穷举；
- 与特定 AI 模型或供应商绑定。

## 11. 架构原则

最终方案的核心价值不是“使用 Vue 制作 PPT”，而是：

- 单页可编程；
- 静态页面保持低复杂度；
- 状态可以显式枚举；
- 动画可以确定性回放；
- 布局可以自动检查；
- 截图可以稳定复现；
- DOM 节点可以追踪到源码；
- AI 可以通过稳定命令安全修改；
- 引擎核心与 Vue、AI provider 和检查工具保持可替换边界。
