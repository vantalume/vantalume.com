import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Enquiry desk login", robots: { index: false, follow: false } };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdminAuthenticated()) redirect("/admin/enquiries");
  const error = (await searchParams).error;
  return (
    <div className="admin-viewport admin-login">
      <section className="admin-login-card">
        <p className="admin-eyebrow">Vantalume / private operations</p>
        <div className="admin-login-mark" aria-hidden="true">V</div>
        <h1>Enquiry desk</h1>
        <p>Review conversations, contact prospects and keep every opportunity moving.</p>
        {error && (
          <div className="admin-alert" role="alert">
            {error === "limited" ? "Too many attempts. Try again later." : "That password was not recognised."}
          </div>
        )}
        <form action="/api/admin/login" method="post">
          <label htmlFor="admin-password">Dashboard password</label>
          <input id="admin-password" name="password" type="password" autoComplete="current-password" required autoFocus />
          <button type="submit">Open enquiry desk <span aria-hidden="true">→</span></button>
        </form>
        <small>Sessions expire after 12 hours. Customer data stays server-side.</small>
      </section>
    </div>
  );
}
