export interface ThemeCanvas {
  readonly width: number;
  readonly height: number;
  readonly aspectRatio: string;
}

export interface ThemeColorRole {
  readonly value: `#${string}`;
  readonly usage: string;
}

export interface ThemeTypographyRole {
  readonly family: string;
  readonly fallback: readonly string[];
  readonly weight?: number;
  readonly minSizePx?: number;
  readonly maxSizePx?: number;
}

export interface ThemeLayoutDescriptor {
  readonly id: string;
  readonly description: string;
  readonly useFor: readonly string[];
  readonly component?: string;
  readonly capacity?: {
    readonly maxItems?: number;
    readonly titleMaxChars?: number;
    readonly bodyMaxChars?: number;
  };
}

export interface ThemeAiGuidance {
  readonly visualObjective: string;
  readonly density: "low" | "medium" | "high";
  readonly motif: string;
  readonly prefer: readonly string[];
  readonly avoid: readonly string[];
  readonly contentRules: readonly string[];
}

export interface ThemeDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly preview?: string;
  readonly canvas: ThemeCanvas;
  readonly colors: Readonly<Record<string, ThemeColorRole>>;
  readonly typography: Readonly<Record<string, ThemeTypographyRole>>;
  readonly spacing: Readonly<Record<string, number>>;
  readonly layouts: readonly ThemeLayoutDescriptor[];
  readonly ai: ThemeAiGuidance;
}

function positive(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0)
    throw new Error(`${label} must be positive`);
}

/** Type-preserving identity helper with development-time invariant checks. */
export function defineTheme<const T extends ThemeDefinition>(theme: T): T {
  if (!/^[a-z][a-z0-9-]*$/u.test(theme.id)) {
    throw new Error(`Theme id must be kebab-case: ${theme.id}`);
  }
  positive(theme.canvas.width, "Theme canvas width");
  positive(theme.canvas.height, "Theme canvas height");
  if (theme.layouts.length === 0)
    throw new Error("A theme must declare at least one layout");
  const layoutIds = new Set<string>();
  for (const layout of theme.layouts) {
    if (layoutIds.has(layout.id))
      throw new Error(`Duplicate theme layout: ${layout.id}`);
    layoutIds.add(layout.id);
  }
  for (const [name, value] of Object.entries(theme.spacing))
    positive(value, `Spacing ${name}`);
  return Object.freeze(theme);
}
