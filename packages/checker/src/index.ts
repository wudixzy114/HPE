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
  readonly stateId?: string;
  readonly step?: number;
  readonly timelineMs?: number;
  readonly nodeId?: string;
  readonly source?: SourceLocation;
  readonly bounds?: Bounds;
  readonly slideBounds?: Pick<Bounds, "width" | "height">;
  readonly screenshot?: string;
}

export type ArtifactType =
  | "raw-screenshot"
  | "annotated-screenshot"
  | "contact-sheet"
  | "html-report"
  | "json-report";

export interface CheckArtifact {
  readonly type: ArtifactType;
  readonly path: string;
  readonly slideId?: string;
  readonly stateId?: string;
}

export interface CheckReport {
  readonly version: 1;
  readonly generatedAt: string;
  readonly statesChecked: number;
  readonly diagnostics: readonly DeckDiagnostic[];
  readonly artifacts: readonly CheckArtifact[];
  readonly summary: Readonly<Record<DiagnosticSeverity, number>>;
}

export interface CreateCheckReportOptions {
  readonly generatedAt?: Date;
  readonly statesChecked?: number;
  readonly artifacts?: readonly CheckArtifact[];
}

export function createCheckReport(
  diagnostics: readonly DeckDiagnostic[],
  options: CreateCheckReportOptions | Date = {},
): CheckReport {
  const normalized: CreateCheckReportOptions =
    options instanceof Date ? { generatedAt: options } : options;
  const summary = { error: 0, warning: 0, info: 0 };
  for (const diagnostic of diagnostics) summary[diagnostic.severity] += 1;
  return {
    version: 1,
    generatedAt: (normalized.generatedAt ?? new Date()).toISOString(),
    statesChecked: normalized.statesChecked ?? 0,
    diagnostics,
    artifacts: normalized.artifacts ?? [],
    summary,
  };
}
