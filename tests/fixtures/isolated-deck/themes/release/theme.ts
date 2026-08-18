import { defineTheme } from "@hpe/theme";

import "./theme.css";

export default defineTheme({
  id: "isolated-release-theme",
  name: "Isolated release theme",
  description: "A fixture proving that deck content is selected by root.",
  canvas: { width: 1280, height: 720, aspectRatio: "16:9" },
  colors: {
    ink: { value: "#102a43", usage: "Text" },
    paper: { value: "#f0f4f8", usage: "Canvas" },
  },
  typography: {
    display: {
      family: "system-ui",
      fallback: ["sans-serif"],
      weight: 700,
      minSizePx: 40,
      maxSizePx: 72,
    },
    body: {
      family: "system-ui",
      fallback: ["sans-serif"],
      minSizePx: 18,
      maxSizePx: 28,
    },
    code: {
      family: "monospace",
      fallback: ["monospace"],
      minSizePx: 14,
      maxSizePx: 20,
    },
  },
  spacing: { edge: 72, top: 64, footer: 48, grid: 16, card: 20 },
  layouts: [
    {
      id: "content",
      description: "One centered heading and supporting paragraph",
      useFor: ["release fixture"],
      capacity: { maxItems: 2, titleMaxChars: 48, bodyMaxChars: 120 },
    },
  ],
  ai: {
    visualObjective: "Prove deck-root isolation.",
    density: "low",
    motif: "Plain release fixture",
    prefer: ["Clear hierarchy"],
    avoid: ["Example-deck coupling"],
    contentRules: ["Keep the fixture deterministic"],
  },
});
