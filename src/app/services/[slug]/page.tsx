import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTA, PageIntro } from "@/components/ui";
import { services } from "@/lib/site";

export function generateStaticParams(){ return services.map(x=>({slug:x.slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const s=services.find(x=>x.slug===slug);if(!s)return{};return{title:s.title,description:s.intro,alternates:{canonical:`/services/${slug}`}}}
export default async function ServicePage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const s=services.find(x=>x.slug===slug);if(!s)notFound();return <><PageIntro eyebrow="Service" title={s.title} intro={s.intro}/><section className="section shell detail-grid"><div><p className="kicker">What changes</p><h2>{s.eyebrow}</h2><p className="standfirst">{s.fit}</p></div><ul className="outcomes">{s.outcomes.map((x,i)=><li key={x}><span>0{i+1}</span>{x}</li>)}</ul></section><section className="split-panel"><div className="shell"><p className="kicker">The route</p><ol className="timeline">{s.process.map((x,i)=><li key={x}><b>0{i+1}</b><span>{x}</span></li>)}</ol></div></section><section className="section shell detail-grid"><div><p className="kicker">Investment</p><h2>A useful starting point, not a bait price.</h2></div><div><p className="standfirst">{s.starting}</p><p>The written proposal sets out scope, assumptions, exclusions, timing, payment stages and acceptance criteria before work begins.</p></div></section><CTA /></>}
