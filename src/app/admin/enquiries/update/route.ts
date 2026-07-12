import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { updateConciergeLeadStatus, type LeadStatus } from "@/lib/database";

const statuses = new Set<LeadStatus>(["new", "contacted", "qualified", "closed"]);

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const origin = request.headers.get("origin");
  const publicOrigin = new URL(process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin).origin;
  if (origin && origin !== publicOrigin) return NextResponse.json({ message: "Invalid origin" }, { status: 403 });
  const form = await request.formData();
  const id = String(form.get("id") || "");
  const status = String(form.get("status") || "") as LeadStatus;
  if (!/^[0-9a-f-]{36}$/i.test(id) || !statuses.has(status)) return NextResponse.json({ message: "Invalid update" }, { status: 400 });
  await updateConciergeLeadStatus(id, status);
  return NextResponse.redirect(
    new URL(`/admin/enquiries?lead=${encodeURIComponent(id)}`, process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin),
    303,
  );
}
