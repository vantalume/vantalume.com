import { NextRequest, NextResponse } from "next/server";
import {
  adminCookieName,
  createAdminSession,
  passwordMatches,
} from "@/lib/admin-auth";

const attempts = new Map<string, { count: number; reset: number }>();

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const current = attempts.get(ip);
  if (current && current.reset > now && current.count >= 8) {
    return NextResponse.redirect(new URL("/admin/login?error=limited", request.url), 303);
  }
  if (!current || current.reset <= now) attempts.set(ip, { count: 1, reset: now + 3600000 });
  else current.count += 1;

  const form = await request.formData();
  if (!passwordMatches(String(form.get("password") || ""))) {
    return NextResponse.redirect(new URL("/admin/login?error=invalid", request.url), 303);
  }

  attempts.delete(ip);
  const session = createAdminSession();
  const response = NextResponse.redirect(new URL("/admin/enquiries", request.url), 303);
  response.cookies.set(adminCookieName, session.value, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: session.maxAge,
  });
  return response;
}
