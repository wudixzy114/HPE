import { describe, expect, it } from "vitest";

import { defineTheme, type ThemeDefinition } from "./index.js";

function fixture(): ThemeDefinition {
  return {
    id: "test-theme",
    name: "Test",
    description: "Test theme",
    canvas: { width: 1600, height: 900, aspectRatio: "16:9" },
    colors: { ink: { value: "#111111", usage: "text" } },
    typography: { body: { family: "Arial", fallback: ["sans-serif"] } },
    spacing: { edge: 80 },
    layouts: [{ id: "content", description: "Content", useFor: ["content"] }],
    ai: {
      visualObjective: "Clear",
      density: "medium",
      motif: "Cards",
      prefer: ["hierarchy"],
      avoid: ["clutter"],
      contentRules: ["one idea"],
    },
  };
}

describe("defineTheme", () => {
  it("preserves typed metadata and freezes the theme", () => {
    const theme = defineTheme(fixture());
    expect(theme.canvas).toEqual({
      width: 1600,
      height: 900,
      aspectRatio: "16:9",
    });
    expect(Object.isFrozen(theme)).toBe(true);
  });

  it("rejects duplicate layouts and invalid identifiers", () => {
    expect(() => defineTheme({ ...fixture(), id: "Invalid Theme" })).toThrow(
      "kebab-case",
    );
    expect(() =>
      defineTheme({
        ...fixture(),
        layouts: [
          ...fixture().layouts,
          { id: "content", description: "Duplicate", useFor: ["duplicate"] },
        ],
      }),
    ).toThrow("Duplicate theme layout");
  });
});
