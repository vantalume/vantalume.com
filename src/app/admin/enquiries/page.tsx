import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listConciergeLeads, type LeadStatus } from "@/lib/database";

export const metadata: Metadata = { title: "Enquiry desk", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const statuses: Array<{ value: LeadStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "closed", label: "Closed" },
];

function date(value: Date) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/London" }).format(value);
}

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; lead?: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const params = await searchParams;
  const status = statuses.some((item) => item.value === params.status) ? (params.status as LeadStatus | "all") : "all";
  const query = (params.q || "").trim();
  const matching = await listConciergeLeads({ query });
  const visible = status === "all" ? matching : matching.filter((lead) => lead.status === status);
  const selected = visible.find((lead) => lead.id === params.lead) || visible[0];
  const whatsapp = selected?.phone.replace(/[^0-9]/g, "");

  return (
    <div className="admin-viewport admin-desk">
      <header className="admin-topbar">
        <div><span className="admin-monogram">V</span><b>Enquiry desk</b><em>Private</em></div>
        <form action="/api/admin/logout" method="post"><button type="submit">Sign out</button></form>
      </header>

      <section className="admin-command">
        <div>
          <p className="admin-eyebrow">Customer relations / live queue</p>
          <h1>{matching.filter((lead) => lead.status === "new").length} conversations need attention.</h1>
        </div>
        <dl>
          <div><dt>Total</dt><dd>{matching.length}</dd></div>
          <div><dt>Qualified</dt><dd>{matching.filter((lead) => lead.status === "qualified").length}</dd></div>
          <div><dt>Closed</dt><dd>{matching.filter((lead) => lead.status === "closed").length}</dd></div>
        </dl>
      </section>

      <div className="admin-workspace">
        <aside className="admin-queue" aria-label="Enquiry queue">
          <form className="admin-search">
            <input type="search" name="q" defaultValue={query} placeholder="Search name, company, email…" aria-label="Search enquiries" />
            {status !== "all" && <input type="hidden" name="status" value={status} />}
            <button>Search</button>
          </form>
          <nav className="admin-tabs" aria-label="Filter by status">
            {statuses.map((item) => (
              <a key={item.value} className={status === item.value ? "active" : ""} href={`/admin/enquiries?status=${item.value}${query ? `&q=${encodeURIComponent(query)}` : ""}`}>
                {item.label}<span>{item.value === "all" ? matching.length : matching.filter((lead) => lead.status === item.value).length}</span>
              </a>
            ))}
          </nav>
          <div className="admin-lead-list">
            {visible.map((lead) => (
              <a key={lead.id} className={selected?.id === lead.id ? "selected" : ""} href={`/admin/enquiries?status=${status}&lead=${lead.id}${query ? `&q=${encodeURIComponent(query)}` : ""}`}>
                <span className={`admin-status ${lead.status}`}>{lead.status}</span>
                <b>{lead.name}</b>
                <p>{lead.company || lead.email || lead.phone}</p>
                <time>{date(lead.createdAt)}</time>
              </a>
            ))}
            {!visible.length && <p className="admin-empty">No enquiries match this view.</p>}
          </div>
        </aside>

        <section className="admin-dossier" aria-label="Selected enquiry">
          {selected ? (
            <>
              <header className="admin-dossier-head">
                <div>
                  <p className="admin-eyebrow">Lead {selected.id.slice(0, 8)}</p>
                  <h2>{selected.name}</h2>
                  <p>{selected.company || "Independent enquiry"} · {date(selected.createdAt)}</p>
                </div>
                <form action="/admin/enquiries/update" method="post">
                  <input type="hidden" name="id" value={selected.id} />
                  <label htmlFor="lead-status">Pipeline status</label>
                  <select id="lead-status" name="status" defaultValue={selected.status}>
                    {statuses.slice(1).map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                  <button>Update</button>
                </form>
              </header>

              <section className="admin-contact-strip" aria-label="Contact actions">
                {selected.email && <a href={`mailto:${selected.email}?subject=${encodeURIComponent("Your Vantalume enquiry")}`}>Email <b>{selected.email}</b></a>}
                {selected.phone && <a href={`tel:${selected.phone}`}>Call <b>{selected.phone}</b></a>}
                {whatsapp && <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">WhatsApp <b>Open chat ↗</b></a>}
                <span>Prefers <b>{selected.preferredContact}</b></span>
              </section>

              <section className="admin-brief">
                <p className="admin-eyebrow">Project note</p>
                <p>{selected.message}</p>
              </section>

              <section className="admin-transcript">
                <div><p className="admin-eyebrow">Saved conversation</p><span>{selected.transcript.length} messages</span></div>
                {selected.transcript.map((message, index) => (
                  <article key={`${message.role}-${index}`} className={message.role}>
                    <b>{message.role === "assistant" ? "Vantalume assistant" : selected.name}</b>
                    <p>{message.text}</p>
                  </article>
                ))}
              </section>
            </>
          ) : (
            <div className="admin-no-selection"><span>00</span><h2>The queue is clear.</h2><p>New saved conversations will appear here.</p></div>
          )}
        </section>
      </div>
    </div>
  );
}
