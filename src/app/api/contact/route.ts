import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";

const attempts = new Map<string, { count: number; reset: number }>();
function limited(ip: string) {
  const now = Date.now();
  const current = attempts.get(ip);
  if (!current || current.reset < now) {
    attempts.set(ip, { count: 1, reset: now + 60 * 60 * 1000 });
    return false;
  }
  current.count++;
  return current.count > 5;
}
function escapeHtml(s: string) {
  return s.replace(
    /[&<>'"]/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        c
      ]!,
  );
}
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip))
    return NextResponse.json(
      {
        message:
          "Too many attempts. Please wait an hour or email contact@vantalume.com.",
      },
      { status: 429 },
    );
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json(
      {
        message:
          "The form data could not be read. Please refresh and try again.",
      },
      { status: 400 },
    );
  }
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success)
    return NextResponse.json(
      {
        message: "Please check the required fields and try again.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  const d = parsed.data;
  if (Date.now() - d.startedAt < 2500)
    return NextResponse.json(
      { message: "The form was submitted too quickly. Please try again." },
      { status: 400 },
    );
  if (
    !process.env.RESEND_API_KEY ||
    !process.env.CONTACT_TO_EMAIL ||
    !process.env.CONTACT_FROM_EMAIL
  ) {
    console.error("Contact delivery is not configured. See .env.example.");
    return NextResponse.json(
      {
        message:
          "Email delivery is temporarily unavailable. Please email contact@vantalume.com.",
      },
      { status: 503 },
    );
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: d.email,
      subject: `Vantalume enquiry: ${d.need}`,
      html: `<h1>New Vantalume enquiry</h1><p><b>Name:</b> ${escapeHtml(d.name)}</p><p><b>Email:</b> ${escapeHtml(d.email)}</p><p><b>Company:</b> ${escapeHtml(d.company)}</p><p><b>Need:</b> ${escapeHtml(d.need)}</p><p><b>Budget:</b> ${escapeHtml(d.budget)}</p><p><b>Timing:</b> ${escapeHtml(d.timeline)}</p><p><b>URL:</b> ${escapeHtml(d.url)}</p><h2>Details</h2><p>${escapeHtml(d.details).replace(/\n/g, "<br>")}</p>`,
    });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(
      "Contact delivery failed",
      err instanceof Error ? err.message : "provider error",
    );
    return NextResponse.json(
      {
        message:
          "We could not send this right now. Please try once more or email contact@vantalume.com.",
      },
      { status: 502 },
    );
  }
}
