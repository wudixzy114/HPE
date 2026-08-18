import { defineTheme } from "@hpe/theme";

import "../claude-code/legacy.css";
import "../claude-code/demos.css";
import "../claude-code/theme.css";
import "./theme.css";

export default defineTheme({
  id: "classic-minimal",
  name: "古典简约",
  description:
    "面向中文技术与知识分享的古典简约主题，以宣纸、墨色、朱砂和黛青组织清晰且克制的高密度内容。",
  preview: "./preview.png",
  canvas: { width: 1600, height: 900, aspectRatio: "16:9" },
  colors: {
    ink: { value: "#29251F", usage: "标题、正文、深色章节页与主要边界" },
    paper: { value: "#F5F0E5", usage: "默认内容页背景，如宣纸般温和" },
    vermilion: { value: "#A44832", usage: "唯一强强调、章节标记与关键判断" },
    jade: { value: "#536E68", usage: "结构、正向状态与辅助强调" },
    indigo: { value: "#596173", usage: "对比、代码与次级结构" },
  },
  typography: {
    display: {
      family: "Songti SC",
      fallback: ["STSong", "Noto Serif CJK SC", "SimSun", "serif"],
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
      description: "墨色封面、一个主标题和三到五个章节线索，以朱砂轻点强调",
      useFor: ["开场", "章节总览", "收尾"],
      capacity: { maxItems: 5, titleMaxChars: 42 },
    },
    {
      id: "explanation",
      description: "结论标题、副标题和一个清晰的主结构，留出充足呼吸感",
      useFor: ["概念解释", "架构图", "流程"],
      capacity: { maxItems: 8, titleMaxChars: 36, bodyMaxChars: 280 },
    },
    {
      id: "comparison",
      description: "两列或矩阵式对照，用细线与少量朱砂标记关键差异",
      useFor: ["方案对比", "规则矩阵", "前后变化"],
      capacity: { maxItems: 8, titleMaxChars: 36, bodyMaxChars: 360 },
    },
    {
      id: "application",
      description: "行动卡和一句结论带，强调简洁、可执行与信息层次",
      useFor: ["实操", "落地步骤", "检查清单"],
      capacity: { maxItems: 3, titleMaxChars: 36, bodyMaxChars: 240 },
    },
    {
      id: "interactive-demo",
      description: "左侧可视状态、右侧过程记录和底部控制栏，配色保持克制",
      useFor: ["状态机演示", "逐步解释", "规则模拟"],
      capacity: { maxItems: 10, titleMaxChars: 34 },
    },
    {
      id: "source-code",
      description: "高密度源码或配置示例，用墨色与宣纸层次维持可读性",
      useFor: ["源码", "配置", "命令示例"],
      capacity: { maxItems: 2, titleMaxChars: 36, bodyMaxChars: 720 },
    },
  ],
  ai: {
    visualObjective:
      "像一本排版克制的现代线装书：安静、清晰、有东方纸墨的温度，但不复古堆砌。",
    density: "high",
    motif: "细墨线、朱砂章节标记与留白；色彩只服务于层级与判断。",
    prefer: [
      "以纸白和留白建立秩序",
      "一页只保留一个朱砂级重点",
      "用细线、矩阵和短句呈现复杂关系",
      "标题使用宋体，正文保持现代无衬线可读性",
    ],
    avoid: [
      "彩虹语义色和大面积饱和色块",
      "渐变、玻璃拟态和无意义纹样",
      "粗重阴影、夸张圆角和装饰边框",
      "为了塞字单独缩小字号",
    ],
    contentRules: [
      "标题优先写结论，不写章节名复述",
      "正文句子完整，不用省略号掩盖溢出",
      "每页最多一个强强调色区域",
      "复杂内容拆页，不降低可读字号",
    ],
  },
});
