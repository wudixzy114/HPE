import "../themes/classic-minimal/theme.css";
import "../themes/ink-wash/theme.css";

export interface PresentationThemeOption {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly swatches: readonly string[];
}

export const presentationThemes: readonly PresentationThemeOption[] = [
  {
    id: "ink-wash",
    name: "水墨朱黛",
    description: "灰黑、松绿、朱砂",
    swatches: ["#1D211E", "#3D6454", "#A63E35"],
  },
  {
    id: "classic-minimal",
    name: "古典简约",
    description: "宣纸、墨色、朱砂",
    swatches: ["#29251F", "#F5F0E5", "#A44832"],
  },
  {
    id: "claude-code-architecture",
    name: "技术多彩",
    description: "原有五色语义",
    swatches: ["#007C73", "#E5AA31", "#7657A6"],
  },
];

export function hasPresentationTheme(id: string): boolean {
  return presentationThemes.some((theme) => theme.id === id);
}
