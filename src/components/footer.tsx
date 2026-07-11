import Link from "next/link";
import { nav, services, site } from "@/lib/site";

export function Footer() {
  return <footer className="footer">
    <div className="footer-lead"><p className="kicker">Have a useful problem?</p><h2>Let’s make the next step clearer.</h2><Link className="text-link light" href="/contact">Tell us what is getting in the way →</Link></div>
    <div className="footer-grid">
      <div><Link href="/" className="footer-brand">Vantalume</Link><p>{site.description}</p></div>
      <div><h3>Explore</h3>{nav.map(x => <Link key={x.href} href={x.href}>{x.label}</Link>)}<Link href="/contact">Contact</Link></div>
      <div><h3>Services</h3>{services.map(x => <Link key={x.slug} href={`/services/${x.slug}`}>{x.nav}</Link>)}</div>
      <div><h3>Company</h3><a href={`mailto:${site.email}`}>{site.email}</a><Link href="/privacy">Privacy</Link><Link href="/cookies">Cookies</Link><Link href="/terms">Terms</Link></div>
    </div>
    <div className="footer-base"><span>© {new Date().getFullYear()} Vantalume.</span><span>Designed and built with restraint in the United Kingdom.</span></div>
  </footer>;
}
