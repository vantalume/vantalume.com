import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { chatLeadSchema } from "@/lib/chat-lead-schema";
import { saveConciergeLead } from "@/lib/database";

const attempts = new Map<string, { count: number; reset: number }>();

function isLimited(ip: string) {
  const now = Date.now();
  const current = attempts.get(ip);
  if (!current || current.reset < now) {
    attempts.set(ip, { count: 1, reset: now + 60 * 60 * 1000 });
    return false;
  }
  current.count += 1;
  return current.count > 8;
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character]!,
  );
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isLimited(ip)) {
    return NextResponse.json(
      {
        message:
          "Too many attempts. Please try later or email contact@vantalume.com.",
      },
      { status: 429 },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json(
      { message: "The enquiry could not be read." },
      { status: 400 },
    );
  }

  const parsed = chatLeadSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message:
          parsed.error.issues[0]?.message || "Please check your details.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const lead = parsed.data;
  if (Date.now() - lead.startedAt < 2500) {
    return NextResponse.json(
      { message: "That was submitted too quickly. Please try again." },
      { status: 400 },
    );
  }

  const leadId = crypto.randomUUID();
  const createdAt = new Date();

  try {
    await saveConciergeLead({
      id: leadId,
      createdAt,
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      preferredContact: lead.preferredContact,
      message: lead.message,
      transcript: lead.transcript,
    });
  } catch (error) {
    console.error(
      "Lead persistence failed",
      error instanceof Error ? error.message : "unknown",
    );
    return NextResponse.json(
      {
        message:
          "We could not safely save this conversation. Please email contact@vantalume.com.",
      },
      { status: 502 },
    );
  }

  if (
    process.env.RESEND_API_KEY &&
    process.env.CONTACT_TO_EMAIL &&
    process.env.CONTACT_FROM_EMAIL
  ) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.CONTACT_FROM_EMAIL,
        to: process.env.CONTACT_TO_EMAIL,
        replyTo: lead.email || undefined,
        subject: `Concierge enquiry: ${lead.name}`,
        html: `<h1>New concierge enquiry</h1><p><b>Lead:</b> ${leadId}</p><p><b>Name:</b> ${escapeHtml(lead.name)}</p><p><b>Company:</b> ${escapeHtml(lead.company)}</p><p><b>Email:</b> ${escapeHtml(lead.email)}</p><p><b>Phone:</b> ${escapeHtml(lead.phone)}</p><p><b>Preferred contact:</b> ${escapeHtml(lead.preferredContact)}</p><h2>Project note</h2><p>${escapeHtml(lead.message).replace(/\n/g, "<br>")}</p>`,
      });
    } catch (error) {
      console.error(
        "Lead notification failed",
        error instanceof Error ? error.message : "unknown",
      );
    }
  }

  return NextResponse.json({ ok: true, leadId });
}
