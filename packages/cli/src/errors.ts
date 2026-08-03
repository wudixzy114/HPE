export type CliErrorCode =
  | "DECK_LOCKED"
  | "DECK_NOT_FOUND"
  | "DECK_INVALID"
  | "SLIDE_EXISTS"
  | "SLIDE_NOT_FOUND"
  | "SLIDE_ID_INVALID"
  | "SLIDE_POSITION_INVALID"
  | "SLIDE_LAST_DELETE"
  | "NOTES_INVALID"
  | "TRANSACTION_FAILED"
  | "COMMAND_FAILED";

export class CliError extends Error {
  public readonly code: CliErrorCode;
  public readonly exitCode: number;
  public readonly details?: unknown;

  public constructor(
    code: CliErrorCode,
    message: string,
    options: {
      readonly exitCode?: number;
      readonly cause?: unknown;
      readonly details?: unknown;
    } = {},
  ) {
    super(message, { cause: options.cause });
    this.name = "CliError";
    this.code = code;
    this.exitCode = options.exitCode ?? 1;
    if (options.details !== undefined) this.details = options.details;
  }
}

export function normalizeCliError(error: unknown): CliError {
  if (error instanceof CliError) return error;
  return new CliError(
    "COMMAND_FAILED",
    error instanceof Error ? error.message : String(error),
    { cause: error },
  );
}

export interface CliErrorPayload {
  readonly ok: false;
  readonly error: {
    readonly code: CliErrorCode;
    readonly message: string;
    readonly details?: unknown;
  };
}

export function errorPayload(error: CliError): CliErrorPayload {
  return {
    ok: false,
    error: {
      code: error.code,
      message: error.message,
      ...(error.details === undefined ? {} : { details: error.details }),
    },
  };
}
