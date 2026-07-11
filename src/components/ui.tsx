import Link from "next/link";
import { Arrow } from "./icons";

export function ButtonLink({ href, children, secondary=false }: { href: string; children: React.ReactNode; secondary?: boolean }) {
  return <Link className={secondary ? "button secondary" : "button"} href={href}>{children}<Arrow /></Link>;
}

export function PageIntro({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return <section className="page-intro shell"><p className="kicker">{eyebrow}</p><h1>{title}</h1><p className="lede">{intro}</p></section>;
}

export function CTA() {
  return <section className="cta shell"><div><p className="kicker">A practical first step</p><h2>Map the opportunity before you commission the answer.</h2></div><div><p>Use the free mapper for an immediate direction, or bring the situation to a 20-minute fit call.</p><div className="actions"><ButtonLink href="/opportunity-mapper">Map an opportunity</ButtonLink><ButtonLink href="/contact" secondary>Talk it through</ButtonLink></div></div></section>;
}
