import { defineTheme } from "@hpe/theme";

import "./theme.css";

export default defineTheme({
  id: "ai-cognition",
  name: "AI 时代的认知与学习",
  description:
    "面向工程师的沉浸式深色演示主题，以单一主视觉承载每页论点，用流程、时序、坐标、漏斗和路径替代卡片堆叠。",
  canvas: { width: 1600, height: 900, aspectRatio: "16:9" },
  colors: {
    ink: { value: "#F4F7FB", usage: "标题、正文与关键标签" },
    paper: { value: "#07111F", usage: "沉浸式深色画布" },
    surface: { value: "#14263D", usage: "玻璃面板与图形节点" },
    teal: { value: "#38D6C5", usage: "人的行动、主路径与正向结构" },
    violet: { value: "#A78BFA", usage: "AI、元认知与抽象层" },
    orange: { value: "#FB923C", usage: "风险、摩擦与需要注意的边界" },
    yellow: { value: "#F6C453", usage: "记忆点、判断与决策" },
    red: { value: "#FB7185", usage: "错误、损失和危险水位" },
    blue: { value: "#60A5FA", usage: "系统结构、过程与信息流" },
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
    ui: {
      family: "PingFang SC",
      fallback: ["Microsoft YaHei", "Arial", "sans-serif"],
      minSizePx: 12,
      maxSizePx: 16,
    },
    code: {
      family: "SF Mono",
      fallback: ["Consolas", "monospace"],
      minSizePx: 14,
      maxSizePx: 20,
    },
  },
  spacing: { edge: 72, top: 58, footer: 52, grid: 14, card: 22 },
  layouts: [
    {
      id: "cover",
      description: "非对称封面：左侧大标题与记忆点，右侧问题轨道",
      useFor: ["开场"],
      capacity: { maxItems: 5, titleMaxChars: 36 },
    },
    {
      id: "single-visual",
      description: "一个占据主要画面的关系图，文字直接附着在结构节点上",
      useFor: ["不等式", "三角校验", "金字塔", "漏斗", "坐标系"],
      capacity: { maxItems: 5, titleMaxChars: 38, bodyMaxChars: 260 },
    },
    {
      id: "loop",
      description: "环形步骤与中心结论，支持按步骤逐个揭示",
      useFor: ["五步闭环", "过程"],
      capacity: { maxItems: 8, titleMaxChars: 34 },
    },
    {
      id: "flow",
      description: "时序、桥梁、实验和决策管线，用方向与碰撞解释因果",
      useFor: ["TCP", "迁移", "实践", "幻觉验证"],
      capacity: { maxItems: 6, titleMaxChars: 38, bodyMaxChars: 340 },
    },
    {
      id: "template",
      description: "完整可抄提示词与一个明确的记忆结构，最多并列两个模板",
      useFor: ["模板", "坑与对策"],
      capacity: { maxItems: 6, titleMaxChars: 34, bodyMaxChars: 400 },
    },
  ],
  ai: {
    visualObjective:
      "像一场高完成度的前端叙事：每页只有一个视觉主角，关系比装饰更醒目，逐步揭示帮助观众沿着结构理解。",
    density: "high",
    motif:
      "深色网格画布上，青绿色代表人的行动和主路径，紫色代表 AI 与抽象，黄色只标记需要记住的判断。",
    prefer: [
      "标题直接写结论",
      "优先使用金字塔、漏斗、环路、时序图、坐标系和路径图",
      "模板指令完整可抄，并与用途结构绑定",
      "使用 Step 逐步揭示复杂关系",
      "辅助文字直接挂在主结构上",
    ],
    avoid: [
      "理论术语堆叠",
      "五六个同权重文本框并列",
      "把关系图退化成卡片网格",
      "为了塞字单独缩小字号",
      "一页同时强调多个结论",
    ],
    contentRules: [
      "一页只解决一个判断问题",
      "原稿内容不改写成新的观点，只合并或删除重复注解",
      "模板指令保持完整句，不截断",
      "所有坑同时给出可执行对策",
      "讲稿备注补充讲法，不重复屏幕文字",
    ],
  },
});
