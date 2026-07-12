import { NextRequest, NextResponse } from "next/server";
import { adminCookieName } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(
    new URL("/admin/login", process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin),
    303,
  );
  response.cookies.set(adminCookieName, "", { httpOnly: true, secure: true, maxAge: 0, path: "/" });
  return response;
}
