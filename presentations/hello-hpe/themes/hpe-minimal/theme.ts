import { defineTheme } from "@hpe/theme";

import "./theme.css";

export default defineTheme({
  id: "hpe-minimal",
  name: "HPE Minimal",
  description:
    "Clean light starter theme for the demo deck: generous whitespace, one accent color, no decorative noise.",
  canvas: { width: 1600, "height": 900, aspectRatio: "16:9" },
  colors: {
    ink: { value: "#172026", usage: "Primary text" },
    paper: { value: "#FFFFFF", usage: "Canvas background" },
    surface: { value: "#F1F5F9", usage: "Panels and code blocks" },
    accent: { value: "#007C73", usage: "Emphasis, markers, active states" },
    muted: { value: "#64748B", usage: "Secondary text and footers" },
  },
  typography: {
    display: {
      family: "system-ui",
      fallback: ["PingFang SC", "Microsoft YaHei", "sans-serif"],
      weight: 700,
      minSizePx: 40,
      maxSizePx: 64,
    },
    body: {
      family: "system-ui",
      fallback: ["PingFang SC", "Microsoft YaHei", "sans-serif"],
      minSizePx: 16,
      maxSizePx: 24,
    },
    code: {
      family: "SF Mono",
      fallback: ["Consolas", "monospace"],
      minSizePx: 14,
      maxSizePx: 18,
    },
  },
  spacing: { edge: 88, top: 64, footer: 48, grid: 16, card: 24 },
  layouts: [
    {
      id: "cover",
      description: "Full-bleed cover with kicker, large title, and one-line lede",
      useFor: ["opening page"],
      capacity: { maxItems: 3, titleMaxChars: 32 },
    },
    {
      id: "content",
      description: "Conclusion-style heading with one supporting visual structure",
      useFor: ["explanation", "feature tour"],
      capacity: { maxItems: 5, titleMaxChars: 40, bodyMaxChars: 280 },
    },
  ],
  ai: {
    visualObjective: "Make the single message per page impossible to miss.",
    density: "low",
    motif: "Left accent rule anchoring every content block",
    prefer: ["one primary claim per slide", "system font stack", "high contrast text"],
    avoid: ["decorative filler", "card grids without meaning"],
    contentRules: ["write conclusions as titles, not topic labels"],
  },
});
