import { defineTheme } from "@hpe/theme";

import "../claude-code/legacy.css";
import "../claude-code/demos.css";
import "../claude-code/theme.css";
import "./theme.css";

export default defineTheme({
  id: "ink-wash",
  name: "水墨朱黛",
  description:
    "面向中文技术与知识分享的水墨主题，以灰黑为底、松绿为结构、朱砂为唯一强强调，呈现安静而有分量的东方气质。",
  preview: "./preview.png",
  canvas: { width: 1600, height: 900, aspectRatio: "16:9" },
  colors: {
    ink: { value: "#1D211E", usage: "标题、正文、深色页面与主要边界" },
    paper: { value: "#ECEBE5", usage: "默认内容页背景，如雾灰宣纸" },
    pine: { value: "#3D6454", usage: "结构、正向状态与辅助强调" },
    vermilion: { value: "#A63E35", usage: "关键判断、风险与唯一强强调" },
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
      description: "灰黑封面、一个主标题和三到五个章节线索，以朱砂轻点强调",
      useFor: ["开场", "章节总览", "收尾"],
      capacity: { maxItems: 5, titleMaxChars: 42 },
    },
    {
      id: "explanation",
      description: "结论标题、副标题和一个清晰的主结构，以留白和松绿建立秩序",
      useFor: ["概念解释", "架构图", "流程"],
      capacity: { maxItems: 8, titleMaxChars: 36, bodyMaxChars: 280 },
    },
    {
      id: "comparison",
      description: "两列或矩阵式对照，用细墨线与朱砂标记关键差异",
      useFor: ["方案对比", "规则矩阵", "前后变化"],
      capacity: { maxItems: 8, titleMaxChars: 36, bodyMaxChars: 360 },
    },
    {
      id: "application",
      description: "行动卡和一句结论带，强调克制、可执行与层次",
      useFor: ["实操", "落地步骤", "检查清单"],
      capacity: { maxItems: 3, titleMaxChars: 36, bodyMaxChars: 240 },
    },
    {
      id: "interactive-demo",
      description: "左侧可视状态、右侧过程记录和底部控制栏，保持黑绿红三色秩序",
      useFor: ["状态机演示", "逐步解释", "规则模拟"],
      capacity: { maxItems: 10, titleMaxChars: 34 },
    },
    {
      id: "source-code",
      description:
        "高密度源码或配置示例，以深墨底、松绿标记和朱砂警示维持可读性",
      useFor: ["源码", "配置", "命令示例"],
      capacity: { maxItems: 2, titleMaxChars: 36, bodyMaxChars: 720 },
    },
  ],
  ai: {
    visualObjective:
      "像一幅现代水墨中的信息版式：低饱和灰黑与松绿铺陈，朱砂只落在真正需要记住的位置。",
    density: "high",
    motif: "雾灰纸面、细墨边界、松绿结构和朱砂落款；颜色只用于建立判断层级。",
    prefer: [
      "以灰黑、松绿、朱砂三色建立层级",
      "以留白和细线代替大色块与重阴影",
      "标题使用宋体，正文保持现代无衬线可读性",
      "一页只保留一个朱砂级重点",
    ],
    avoid: [
      "高饱和彩虹语义色",
      "渐变、玻璃拟态和仿古纹样堆砌",
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
