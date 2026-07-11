import Link from "next/link";
import { Arrow } from "@/components/icons";
import { ButtonLink, CTA } from "@/components/ui";
import { articles, services } from "@/lib/site";

export default function Home() {
  return <>
    <section className="hero shell">
      <div className="hero-index" aria-hidden="true">Independent digital practice · 01</div>
      <div className="hero-copy"><p className="kicker">Clarity before complexity</p><h1>Make the digital thing your business actually needs.</h1><p className="lede">Vantalume designs and builds websites, software and practical AI systems—starting with the problem, not the fashionable answer.</p><div className="actions"><ButtonLink href="/contact">Discuss a project</ButtonLink><ButtonLink href="/opportunity-mapper" secondary>Map the opportunity</ButtonLink></div></div>
      <div className="signal" aria-label="Our approach"><span>Think</span><i/><span>Make</span><i/><span>Prove</span></div>
    </section>

    <section className="manifesto shell"><p>For founders with an idea to test. For growing businesses held back by an old website or manual workflow. For teams that need a senior pair of hands—not another layer of theatre.</p></section>

    <section className="section shell" id="services"><div className="section-head"><p className="kicker">What we make</p><h2>One practice, from first question to working release.</h2></div><div className="service-list">
      {services.map((service, index) => <Link className="service-row" href={`/services/${service.slug}`} key={service.slug}><span className="number">0{index+1}</span><div><h3>{service.title}</h3><p>{service.eyebrow}</p></div><Arrow /></Link>)}
    </div></section>

    <section className="split-panel"><div className="shell split-inner"><div><p className="kicker">Why Vantalume</p><h2>Small enough to stay close. Serious enough to ship.</h2></div><div className="principles">
      <article><span>01</span><h3>Evidence before features</h3><p>We test assumptions early, so the budget follows the strongest opportunity.</p></article>
      <article><span>02</span><h3>Plain-English delivery</h3><p>Clear scope, visible progress and decisions you can explain to the rest of the business.</p></article>
      <article><span>03</span><h3>Built to keep working</h3><p>Accessible, documented systems with sensible ownership—not a fragile launch-day performance.</p></article>
    </div></div></section>

    <section className="section shell"><div className="section-head"><p className="kicker">Start with a decision</p><h2>Not sure whether you need a website, an app or automation?</h2><p>Use the Opportunity Mapper. Five short questions produce a practical first-pass roadmap without asking for your email.</p></div><div className="mapper-preview"><div className="radar" aria-hidden="true"><span/><span/><span/><b>?</b></div><div><p className="label">Free interactive tool · about 3 minutes</p><h3>Turn a fuzzy business problem into a clearer digital next step.</h3><ButtonLink href="/opportunity-mapper">Open the mapper</ButtonLink></div></div></section>

    <section className="section shell"><div className="section-head horizontal"><div><p className="kicker">Working together</p><h2>A visible path from uncertainty to release.</h2></div><Link className="text-link" href="/how-we-work">See the full process →</Link></div><ol className="timeline"><li><b>Frame</b><span>Agree the outcome, constraints and evidence.</span></li><li><b>Focus</b><span>Choose the smallest complete opportunity.</span></li><li><b>Build</b><span>Design and engineer in testable slices.</span></li><li><b>Prove</b><span>Assure, release, measure and improve.</span></li></ol></section>

    <section className="section shell"><div className="section-head horizontal"><div><p className="kicker">Useful thinking</p><h2>Notes for making better digital decisions.</h2></div><Link className="text-link" href="/insights">View all insights →</Link></div><div className="article-grid">{articles.slice(0,3).map(x => <Link href={`/insights/${x.slug}`} key={x.slug} className="article-card"><span>{x.category} · {x.read}</span><h3>{x.title}</h3><p>{x.description}</p><Arrow /></Link>)}</div></section>
    <CTA />
  </>;
}
