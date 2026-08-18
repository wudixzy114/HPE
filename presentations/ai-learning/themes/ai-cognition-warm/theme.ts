import { defineTheme } from "@hpe/theme";

import baseTheme from "../ai-cognition/theme";
import "./theme.css";

export default defineTheme({
  ...baseTheme,
  id: "ai-cognition-warm",
  name: "书卷暖纸",
  description:
    "以暖纸、墨褐和松石色组织学习方法，适合偏人文、思辨和教学氛围的分享。",
  colors: {
    ink: { value: "#352D25", usage: "标题、正文与深色封面" },
    paper: { value: "#F4ECDC", usage: "暖纸内容页背景" },
    surface: { value: "#FFFAF0", usage: "卡片与模板面板" },
    teal: { value: "#4F776C", usage: "人的判断与行动" },
    violet: { value: "#805D6B", usage: "AI 的角色与能力" },
    ochre: { value: "#B47A2A", usage: "记忆点与重点判断" },
  },
  typography: {
    ...baseTheme.typography,
    body: {
      family: "Songti SC",
      fallback: ["STSong", "Noto Serif CJK SC", "PingFang SC", "serif"],
      minSizePx: 14,
      maxSizePx: 25,
    },
  },
  ai: {
    ...baseTheme.ai,
    visualObjective:
      "像一本结构清楚的学习札记：温和但不松散，让方法论更适合慢下来理解。",
    motif: "暖纸底、墨褐正文、松石结构与赭石记忆点。",
  },
});
