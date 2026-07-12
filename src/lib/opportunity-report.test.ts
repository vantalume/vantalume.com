import { describe, expect, it } from "vitest";
import { buildOpportunityReport, opportunityReportSchema } from "./opportunity-report";

const answers = { org: "small", challenge: "workflow", friction: "operations", budget: "medium", timeline: "quarter" } as const;

describe("opportunity report", () => {
  it("derives a bounded, useful report from validated answers", () => {
    const report = buildOpportunityReport(answers);
    expect(report.title).toContain("automation pilot");
    expect(report.score).toBeGreaterThan(0);
    expect(report.steps).toHaveLength(3);
  });

  it("keeps marketing consent optional and separate", () => {
    const parsed = opportunityReportSchema.parse({ name: "Ada Lovelace", email: "ada@example.com", answers, startedAt: 1 });
    expect(parsed.marketingConsent).toBe(false);
  });

  it("rejects invalid email and answer values", () => {
    expect(opportunityReportSchema.safeParse({ name: "A", email: "not-email", answers: { ...answers, budget: "free" }, startedAt: 1 }).success).toBe(false);
  });
});
