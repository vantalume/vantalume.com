import { z } from "zod";

export const opportunityAnswersSchema = z.object({
  org: z.enum(["small", "startup", "established", "team"]),
  challenge: z.enum(["explain", "workflow", "product", "ai"]),
  friction: z.enum(["customers", "operations", "data", "decision"]),
  budget: z.enum(["explore", "small", "medium", "large"]),
  timeline: z.enum(["soon", "quarter", "later", "open"]),
});

export const opportunityReportSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  company: z.string().trim().max(150).optional().default(""),
  website: z.union([z.literal(""), z.string().trim().url().max(300)]).optional().default(""),
  marketingConsent: z.boolean().optional().default(false),
  answers: opportunityAnswersSchema,
  startedAt: z.coerce.number(),
  companyWebsite: z.string().max(0).optional().default(""),
});

export type OpportunityAnswers = z.infer<typeof opportunityAnswersSchema>;

const labels = {
  org: { small: "Small business", startup: "Startup or new venture", established: "Established organisation", team: "Internal team" },
  challenge: { explain: "Explain and convert better", workflow: "Improve a manual workflow", product: "Test or build a product", ai: "Find a sensible AI direction" },
  friction: { customers: "Customer acquisition or service", operations: "Internal operations", data: "Information and data flow", decision: "Uncertainty about what to build" },
  budget: { explore: "Still exploring", small: "Under £5,000", medium: "£5,000–£20,000", large: "£20,000+" },
  timeline: { soon: "Within 1–2 months", quarter: "This quarter", later: "Later this year", open: "No fixed date" },
} as const;

export function buildOpportunityReport(answers: OpportunityAnswers) {
  const title =
    answers.challenge === "explain"
      ? "Website clarity and conversion sprint"
      : answers.challenge === "workflow"
        ? "Workflow mapping and automation pilot"
        : answers.challenge === "product"
          ? "Product discovery and prototype sprint"
          : "AI opportunity mapping sprint";
  const first =
    answers.challenge === "explain"
      ? "Audit the proposition, priority journeys, content gaps and measurement."
      : answers.challenge === "workflow"
        ? "Observe the real workflow and quantify volume, exceptions and failure cost."
        : answers.challenge === "product"
          ? "Define the user, core job and riskiest assumption before choosing features."
          : "Rank candidate use cases by value, feasibility, data readiness and consequence of error.";
  const urgency = answers.timeline === "soon" ? 88 : answers.timeline === "quarter" ? 72 : 55;
  const clarity = answers.friction === "decision" ? 48 : answers.challenge === "explain" ? 62 : 70;
  const readiness = answers.budget === "large" ? 88 : answers.budget === "medium" ? 74 : answers.budget === "small" ? 58 : 42;
  const score = Math.round(urgency * 0.35 + clarity * 0.25 + readiness * 0.4);
  return {
    title,
    score,
    signal: score >= 75 ? "Ready to frame" : score >= 58 ? "Worth testing" : "Clarify before building",
    steps: [first, "Create one testable model of the improved journey.", "Use evidence from the test to decide whether to build, buy, integrate or stop."],
    caution: answers.budget === "small" ? "Keep the first engagement tightly bounded. Prioritise a decision or pilot, not a compressed full build." : "Confirm scope, operating ownership and measurable acceptance criteria before implementation.",
    labels: {
      organisation: labels.org[answers.org],
      challenge: labels.challenge[answers.challenge],
      friction: labels.friction[answers.friction],
      budget: labels.budget[answers.budget],
      timeline: labels.timeline[answers.timeline],
    },
  };
}
