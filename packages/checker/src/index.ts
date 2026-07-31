import type { SourceLocation } from "@hpe/schema";

export type DiagnosticSeverity = "error" | "warning" | "info";

export interface Bounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface DeckDiagnostic {
  readonly code: string;
  readonly severity: DiagnosticSeverity;
  readonly message: string;
  readonly slideId?: string;
  readonly nodeId?: string;
  readonly source?: SourceLocation;
  readonly bounds?: Bounds;
  readonly slideBounds?: Pick<Bounds, "width" | "height">;
  readonly screenshot?: string;
}

export interface CheckReport {
  readonly version: 1;
  readonly generatedAt: string;
  readonly diagnostics: readonly DeckDiagnostic[];
  readonly summary: Readonly<Record<DiagnosticSeverity, number>>;
}

export function createCheckReport(
  diagnostics: readonly DeckDiagnostic[],
  generatedAt = new Date(),
): CheckReport {
  const summary = { error: 0, warning: 0, info: 0 };
  for (const diagnostic of diagnostics) summary[diagnostic.severity] += 1;
  return {
    version: 1,
    generatedAt: generatedAt.toISOString(),
    diagnostics,
    summary,
  };
}
