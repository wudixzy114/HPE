import { defineTheme } from "@hpe/theme";

import baseTheme from "../ai-cognition/theme";
import "./theme.css";

export default defineTheme({
  ...baseTheme,
  id: "ai-cognition-blueprint",
  name: "认知蓝图",
  description:
    "以冷白、深蓝和青色呈现学习闭环，适合工程团队、技术培训和方案评审。",
  colors: {
    ink: { value: "#102A43", usage: "标题、正文与深色封面" },
    paper: { value: "#EEF5F8", usage: "冷白蓝内容页背景" },
    surface: { value: "#FFFFFF", usage: "卡片与模板面板" },
    cyan: { value: "#087E8B", usage: "人的判断与行动" },
    blue: { value: "#3D5A80", usage: "AI 的角色与结构" },
    amber: { value: "#C58B20", usage: "记忆点与重点判断" },
  },
  typography: {
    ...baseTheme.typography,
    body: {
      family: "Avenir Next",
      fallback: ["PingFang SC", "Microsoft YaHei", "Arial", "sans-serif"],
      minSizePx: 14,
      maxSizePx: 25,
    },
  },
  ai: {
    ...baseTheme.ai,
    visualObjective:
      "像一张工程化认知蓝图：冷静、清晰、关系明确，强调闭环和可执行步骤。",
    motif: "冷白蓝图纸、深蓝结构、青色行动路径与琥珀色判断点。",
  },
});
