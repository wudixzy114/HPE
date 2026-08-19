import { defineTheme } from "@hpe/theme";
import "./theme.css";

export default defineTheme({
  id: "e2e-suite",
  name: "E2E Suite Sans",
  description: "Deterministic deck for player e2e assertions.",
  canvas: { width: 1600, height: 900, aspectRatio: "16:9" },
  colors: {
    ink: { value: "#0f172a", usage: "Text" },
    paper: { value: "#ffffff", usage: "Canvas" },
  },
  typography: {
    display: {
      family: "Helvetica Neue",
      fallback: ["Arial", "sans-serif"],
      weight: 700,
      minSizePx: 40,
    },
    body: {
      family: "Helvetica Neue",
      fallback: ["Arial", "sans-serif"],
      minSizePx: 16,
    },
    ui: {
      family: "Helvetica Neue",
      fallback: ["Arial", "sans-serif"],
      minSizePx: 12,
    },
  },
  spacing: { edge: 80, top: 60, footer: 48, grid: 16, card: 20 },
  layouts: [
    {
      id: "content",
      description: "Heading plus body",
      useFor: ["e2e"],
      capacity: { maxItems: 4, titleMaxChars: 40 },
    },
  ],
  ai: {
    visualObjective: "Deterministic e2e rendering.",
    density: "low",
    motif: "plain",
    prefer: ["plain"],
    avoid: ["decoration"],
    contentRules: ["keep deterministic"],
  },
});
