export const CURRENT_SCHEMA_VERSION = 1 as const;
export const DEFAULT_SLIDE_SIZE = Object.freeze({ width: 1280, height: 720 });

export type SlideMode = "present" | "speaker" | "inspect";

export interface SlideSize {
  readonly width: number;
  readonly height: number;
}

export interface SlideEntry {
  readonly id: string;
  readonly file: string;
  readonly title?: string;
  readonly maxStep?: number;
  readonly durationMs?: number;
}

export interface DeckManifest {
  readonly schemaVersion: typeof CURRENT_SCHEMA_VERSION;
  readonly id: string;
  readonly title: string;
  readonly size: SlideSize;
  readonly theme: string;
  readonly slides: readonly SlideEntry[];
}

export interface SourceLocation {
  readonly file: string;
  readonly line: number;
  readonly column: number;
}
