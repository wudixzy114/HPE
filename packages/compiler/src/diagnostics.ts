import type { SourceLocation } from "@hpe/schema";

export interface CompilationIssue {
  readonly code: string;
  readonly message: string;
  readonly slideId?: string;
  readonly source?: SourceLocation;
}

export class DeckCompilationError extends Error {
  public readonly issues: readonly CompilationIssue[];

  public constructor(issues: readonly CompilationIssue[]) {
    super(
      issues
        .map((issue) => {
          const location = issue.source
            ? `${issue.source.file}:${issue.source.line}:${issue.source.column}`
            : (issue.slideId ?? "deck");
          return `${issue.code} ${location} ${issue.message}`;
        })
        .join("\n"),
    );
    this.name = "DeckCompilationError";
    this.issues = issues;
  }
}
