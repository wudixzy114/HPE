import { defineTheme } from "@hpe/theme";

import "./theme.css";

export default defineTheme({
  id: "replace-theme-id",
  name: "Replace theme name",
  description: "Replace with audience, tone, and use case.",
  canvas: { width: 1600, height: 900, aspectRatio: "16:9" },
  colors: {
    ink: { value: "#172026", usage: "Primary text" },
    paper: { value: "#FFFFFF", usage: "Default background" },
    accent: { value: "#007C73", usage: "Primary emphasis" },
  },
  typography: {
    display: {
      family: "Arial",
      fallback: ["sans-serif"],
      weight: 700,
      minSizePx: 40,
    },
    body: { family: "Arial", fallback: ["sans-serif"], minSizePx: 18 },
  },
  spacing: { edge: 80, grid: 20, card: 20 },
  layouts: [
    {
      id: "content",
      description: "Conclusion title plus one evidence structure",
      useFor: ["explanation"],
      capacity: { maxItems: 6, titleMaxChars: 36, bodyMaxChars: 260 },
    },
  ],
  ai: {
    visualObjective: "Replace with one precise visual objective.",
    density: "medium",
    motif: "Replace with one repeated motif.",
    prefer: ["clear hierarchy"],
    avoid: ["decorative filler"],
    contentRules: ["one primary claim per slide"],
  },
});
