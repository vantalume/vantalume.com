import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const adminCookieName = "vantalume_admin";
const sessionLength = 60 * 60 * 12;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("ADMIN_SESSION_SECRET is not configured");
  return value;
}

function signature(expires: string) {
  return createHmac("sha256", secret()).update(expires).digest("base64url");
}

export function createAdminSession() {
  const expires = String(Math.floor(Date.now() / 1000) + sessionLength);
  return { value: `${expires}.${signature(expires)}`, maxAge: sessionLength };
}

export async function isAdminAuthenticated() {
  const token = (await cookies()).get(adminCookieName)?.value;
  if (!token) return false;
  const [expires, supplied] = token.split(".");
  if (!expires || !supplied || Number(expires) < Date.now() / 1000) return false;
  const expected = signature(expires);
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function passwordMatches(supplied: string) {
  const expected = process.env.ADMIN_DASHBOARD_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
