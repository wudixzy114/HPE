import { describe, expect, it } from "vitest";

import { createCheckReport } from "./index.js";

describe("createCheckReport", () => {
  it("creates a stable machine-readable summary", () => {
    const report = createCheckReport(
      [{ code: "TEST", severity: "warning", message: "example" }],
      new Date("2026-01-01T00:00:00Z"),
    );
    expect(report.summary).toEqual({ error: 0, warning: 1, info: 0 });
    expect(report.generatedAt).toBe("2026-01-01T00:00:00.000Z");
  });
});
