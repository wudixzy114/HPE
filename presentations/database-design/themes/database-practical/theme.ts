import { defineTheme } from "@hpe/theme";

import "./theme.css";

export default defineTheme({
  id: "database-practical",
  name: "数据库设计实用分享",
  description:
    "面向产品经理的 40 分钟中文实用分享主题，以数据表格、关系连线和判断卡片组织高密度内容。",
  canvas: { width: 1600, height: 900, aspectRatio: "16:9" },
  colors: {
    ink: { value: "#17233B", usage: "标题、正文与关键边界" },
    paper: { value: "#F7F7F2", usage: "默认内容页背景" },
    surface: { value: "#FFFFFF", usage: "卡片与数据表面板" },
    teal: { value: "#087F75", usage: "推荐方案、主路径与正确做法" },
    blue: { value: "#315E9E", usage: "结构、关系与数据库能力" },
    orange: { value: "#D66B32", usage: "风险、反例与需要注意的边界" },
    yellow: { value: "#E5B33D", usage: "判断重点和现场记忆点" },
    red: { value: "#B74747", usage: "错误、冲突与禁止项" },
  },
  typography: {
    display: {
      family: "PingFang SC",
      fallback: ["Microsoft YaHei", "Arial", "sans-serif"],
      weight: 700,
      minSizePx: 40,
      maxSizePx: 58,
    },
    body: {
      family: "PingFang SC",
      fallback: ["Microsoft YaHei", "Arial", "sans-serif"],
      minSizePx: 14,
      maxSizePx: 25,
    },
    code: {
      family: "SF Mono",
      fallback: ["Consolas", "monospace"],
      minSizePx: 14,
      maxSizePx: 20,
    },
  },
  spacing: { edge: 84, top: 66, footer: 58, grid: 18, card: 22 },
  layouts: [
    {
      id: "cover",
      description: "深色封面，一句结果导向标题与三项内容线索",
      useFor: ["开场"],
      capacity: { maxItems: 4, titleMaxChars: 36 },
    },
    {
      id: "decision",
      description: "结论标题加判断流程、关系图或三到四张卡片",
      useFor: ["决策方法", "字段归属", "拆表"],
      capacity: { maxItems: 6, titleMaxChars: 34, bodyMaxChars: 300 },
    },
    {
      id: "comparison",
      description: "左右对比或紧凑矩阵，突出同一维度上的选择",
      useFor: ["类型选择", "方案对比", "反例"],
      capacity: { maxItems: 8, titleMaxChars: 34, bodyMaxChars: 420 },
    },
    {
      id: "case-study",
      description: "业务案例关系图、表职责和关键结论带",
      useFor: ["中台案例"],
      capacity: { maxItems: 8, titleMaxChars: 34, bodyMaxChars: 380 },
    },
    {
      id: "checklist",
      description: "行动清单或底线规则，以两列短句展示",
      useFor: ["PRD", "性能", "总结"],
      capacity: { maxItems: 16, titleMaxChars: 34, bodyMaxChars: 500 },
    },
  ],
  ai: {
    visualObjective:
      "像一场高质量的产品与研发联合评审：结构清楚、判断直接、案例可信，听完能立刻用于 PRD。",
    density: "high",
    motif: "数据表行、字段标签与关系连线贯穿全篇，黄色只标记需要记住的判断。",
    prefer: [
      "标题直接写结论",
      "用关系图和判断流程替代大段文字",
      "正确与错误方案并排比较",
      "每页底部给出一句可执行结论",
    ],
    avoid: [
      "理论术语堆叠",
      "只有普通项目符号的整页",
      "无意义装饰和渐变",
      "为了塞字单独缩小字号",
      "一页同时强调多个结论",
    ],
    contentRules: [
      "一页只解决一个判断问题",
      "字段示例保留完整类型和业务语义",
      "所有反例同时给出可执行替代方案",
      "讲稿备注补充讲法，不重复屏幕文字",
    ],
  },
});
