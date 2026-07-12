import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { saveConciergeLead } from "@/lib/database";
import { buildOpportunityReport, opportunityReportSchema } from "@/lib/opportunity-report";

const attempts = new Map<string, { count: number; reset: number }>();
const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]!);

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const current = attempts.get(ip);
  if (!current || current.reset < now) attempts.set(ip, { count: 1, reset: now + 60 * 60 * 1000 });
  else if (++current.count > 6) return NextResponse.json({ message: "Too many report requests. Please try again later." }, { status: 429 });

  const parsed = opportunityReportSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message || "Please check your details." }, { status: 400 });
  if (Date.now() - parsed.data.startedAt < 2500) return NextResponse.json({ message: "That was submitted too quickly. Please try again." }, { status: 400 });

  const data = parsed.data;
  const report = buildOpportunityReport(data.answers);
  const leadId = crypto.randomUUID();
  const createdAt = new Date();
  const summary = `Opportunity score: ${report.score}/100 (${report.signal})\nSuggested route: ${report.title}\nChallenge: ${report.labels.challenge}\nFriction: ${report.labels.friction}\nBudget: ${report.labels.budget}\nTimeline: ${report.labels.timeline}${data.website ? `\nWebsite: ${data.website}` : ""}`;

  try {
    await saveConciergeLead({
      id: leadId, createdAt, name: data.name, company: data.company, email: data.email, phone: "", preferredContact: "email", message: summary,
      source: "opportunity-scorecard", marketingConsent: data.marketingConsent,
      transcript: [
        { role: "visitor", text: Object.values(report.labels).join(" · ") },
        { role: "assistant", text: `${report.title}\n${report.steps.join("\n")}\n${report.caution}` },
      ],
    });
  } catch (error) {
    console.error("Opportunity report persistence failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ message: "We could not safely save your report. Please try again." }, { status: 502 });
  }

  let delivered = false;
  if (process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL && process.env.CONTACT_TO_EMAIL) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const steps = report.steps.map((step, index) => `<li style="margin:0 0 12px"><b>0${index + 1}</b> ${escapeHtml(step)}</li>`).join("");
    try {
      const { error } = await resend.emails.send({
        from: process.env.CONTACT_FROM_EMAIL,
        to: data.email,
        replyTo: process.env.CONTACT_TO_EMAIL,
        subject: `Your Vantalume opportunity score: ${report.score}/100`,
        html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#172024"><p style="letter-spacing:.18em;text-transform:uppercase;color:#b67820">Vantalume · Digital Opportunity Scorecard</p><h1 style="font:42px Georgia,serif;margin-bottom:8px">${escapeHtml(report.title)}</h1><p style="font-size:22px"><b>${report.score}/100</b> · ${escapeHtml(report.signal)}</p><p>Hi ${escapeHtml(data.name)}, here is the complete first-pass route based on your answers.</p><ol style="padding-left:24px">${steps}</ol><div style="border-left:4px solid #c88a2d;padding:12px 18px;background:#f6f0e7"><b>Keep in view</b><p>${escapeHtml(report.caution)}</p></div><p style="margin-top:28px">If you want to pressure-test this route, reply to this email or visit <a href="https://vantalume.com/contact">vantalume.com/contact</a>.</p><p style="color:#6b6b66;font-size:13px">This report is planning guidance, not a quotation.</p></div>`,
      });
      if (error) throw error;
      delivered = true;
      await resend.emails.send({
        from: process.env.CONTACT_FROM_EMAIL,
        to: process.env.CONTACT_TO_EMAIL,
        replyTo: data.email,
        subject: `Scorecard lead: ${data.name} · ${report.score}/100`,
        html: `<h1>New scorecard lead</h1><p><b>Reference:</b> ${leadId}</p><p><b>Name:</b> ${escapeHtml(data.name)}</p><p><b>Email:</b> ${escapeHtml(data.email)}</p><p><b>Company:</b> ${escapeHtml(data.company)}</p><p><b>Marketing consent:</b> ${data.marketingConsent ? "Yes" : "No"}</p><pre>${escapeHtml(summary)}</pre>`,
      });
    } catch (error) {
      console.error("Opportunity report delivery failed", error instanceof Error ? error.message : "unknown");
    }
  }

  return NextResponse.json({ ok: true, leadId, delivered });
}
