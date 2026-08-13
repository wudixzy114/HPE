import { defineTheme } from "@hpe/theme";

import "./legacy.css";
import "./demos.css";
import "./theme.css";

export default defineTheme({
  id: "claude-code-architecture",
  name: "Claude Code 架构分享",
  description:
    "高信息密度的中文技术分享主题，以纸张色画布、深墨文字与五色语义编码构建。",
  preview: "./preview.png",
  canvas: { width: 1600, height: 900, aspectRatio: "16:9" },
  colors: {
    ink: { value: "#172026", usage: "正文、深色封面和高权重边界" },
    paper: { value: "#F6F6F1", usage: "默认内容页背景" },
    teal: { value: "#007C73", usage: "主强调、正向状态、基础能力" },
    orange: { value: "#D75C2D", usage: "工具、风险和运行时状态" },
    yellow: { value: "#E5AA31", usage: "注意、待确认和关键高亮" },
    purple: { value: "#7657A6", usage: "入口、扩展、用户输入" },
    red: { value: "#B74141", usage: "拒绝、错误和硬约束" },
  },
  typography: {
    display: {
      family: "PingFang SC",
      fallback: ["Microsoft YaHei", "Arial", "sans-serif"],
      weight: 700,
      minSizePx: 40,
      maxSizePx: 56,
    },
    body: {
      family: "PingFang SC",
      fallback: ["Microsoft YaHei", "Arial", "sans-serif"],
      minSizePx: 16,
      maxSizePx: 24,
    },
    code: {
      family: "SF Mono",
      fallback: ["Consolas", "monospace"],
      minSizePx: 13,
      maxSizePx: 17,
    },
  },
  spacing: { edge: 92, top: 72, footer: 68, grid: 18, card: 20 },
  layouts: [
    {
      id: "cover",
      description: "深色封面、一个主标题和 3–5 个章节线索",
      useFor: ["开场", "章节总览"],
      capacity: { maxItems: 5, titleMaxChars: 42 },
    },
    {
      id: "explanation",
      description: "标题、副标题和一个主视觉结构",
      useFor: ["概念解释", "架构图", "流程"],
      capacity: { maxItems: 8, titleMaxChars: 36, bodyMaxChars: 280 },
    },
    {
      id: "comparison",
      description: "两列或矩阵式对照，强调同一判断维度",
      useFor: ["方案对比", "规则矩阵", "前后变化"],
      capacity: { maxItems: 8, titleMaxChars: 36, bodyMaxChars: 360 },
    },
    {
      id: "application",
      description: "三张行动卡加一条结论带",
      useFor: ["实操", "落地步骤", "检查清单"],
      capacity: { maxItems: 3, titleMaxChars: 36, bodyMaxChars: 240 },
    },
    {
      id: "interactive-demo",
      description: "左侧可视状态、右侧过程记录、底部控制栏",
      useFor: ["状态机演示", "逐步解释", "规则模拟"],
      capacity: { maxItems: 10, titleMaxChars: 34 },
    },
    {
      id: "source-code",
      description: "高密度源码或配置示例，保留清晰注释层级",
      useFor: ["源码", "配置", "命令示例"],
      capacity: { maxItems: 2, titleMaxChars: 36, bodyMaxChars: 720 },
    },
  ],
  ai: {
    visualObjective:
      "像工程团队内部精心制作的技术分享：可信、清楚、信息密度高，但不拥挤。",
    density: "high",
    motif: "五种语义色贯穿架构层、状态和风险；圆角只服务于信息分组。",
    prefer: [
      "先画信息关系，再写短句",
      "每页只突出一个判断",
      "同类结构保持尺寸与间距一致",
      "用真实流程、矩阵和状态替代装饰插图",
    ],
    avoid: [
      "无意义渐变和玻璃拟态",
      "标题下装饰线",
      "整页只有普通项目符号",
      "为了塞字缩小同级字号",
      "混用语义色",
    ],
    contentRules: [
      "标题优先写结论，不写章节名复述",
      "正文句子不截断，不用省略号掩盖溢出",
      "数值注明口径或版本边界",
      "复杂内容拆页，不降低可读字号",
    ],
  },
});
