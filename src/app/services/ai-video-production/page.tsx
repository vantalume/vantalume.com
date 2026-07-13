import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui";
import { VideoProjectCard } from "@/components/video-project-card";
import { site } from "@/lib/site";

const contactHref = "/contact?route=AI%20Video%20Production";

const videoServices = [
  ["Social Media Videos", "Short-form videos for Instagram Reels, TikTok, LinkedIn and YouTube Shorts."],
  ["AI Product Videos", "Turn product photography and brand assets into engaging animated content."],
  ["Startup Explainer Videos", "Explain products, apps and services through concise visual storytelling."],
  ["AI Advertising Creatives", "Develop creative variations for paid and organic campaigns."],
  ["Website Launch Videos", "Create promotional videos from an existing website, screenshots and brand content."],
  ["Localised Video Campaigns", "Adapt videos for different languages, markets and aspect ratios."],
] as const;

const process = [
  "Share your website, product or idea.",
  "We prepare the concept, script and storyboard.",
  "We create and animate the visual scenes.",
  "We add editing, captions, music and voice-over.",
  "You review and receive the final platform-ready videos.",
] as const;

const considerations = [
  "Video purpose and target audience",
  "Number and length of videos",
  "Social platforms and required dimensions",
  "Available product images, footage and brand assets",
  "Voice-over, captions and music",
  "Languages and market adaptations",
  "Delivery timeline and revision requirements",
] as const;

const projects = [
  { title: "Product story system", format: "Product video · vertical", poster: "/images/video-production/product-story.svg", description: "A demonstration of how product imagery, motion and concise messaging can form a short social narrative." },
  { title: "Website launch sequence", format: "Launch video · multi-format", poster: "/images/video-production/launch-story.svg", description: "A concept showing how interface captures and brand assets can become a focused launch announcement." },
  { title: "Market adaptation set", format: "Localisation · social campaign", poster: "/images/video-production/localised-story.svg", description: "A demonstration of one campaign idea adapted across language, dimensions and platform context." },
] as const;

const faqs = [
  ["What do you need from the customer?", "A useful starting point is your objective, audience, platform, desired timing and any product images, footage, website links or brand guidance you already have. We will identify gaps before production begins."],
  ["Can you create a video from an existing website?", "Yes. An existing website can provide approved messaging, interface captures, imagery and visual direction. We will agree what can be used and what needs to be created."],
  ["Can videos be produced in different languages?", "Yes, subject to agreeing the required languages, supplied or reviewed translations, voice requirements and market-specific adaptations."],
  ["Which platforms and dimensions are supported?", "We can prepare common vertical, square and landscape formats for platforms such as Instagram, TikTok, LinkedIn, YouTube and websites. The exact deliverables are agreed for each project."],
  ["How many revisions are included?", "Revision requirements are agreed after the concept, number of videos and production complexity are understood. The written proposal will clearly define review stages and what is included."],
  ["Who owns the final video?", "Usage and ownership terms are set out in the project agreement. They depend on the commissioned work and any third-party music, voice, footage, fonts or other licensed assets involved."],
  ["How long does production take?", "Timing depends on the number and length of videos, source material, languages, review availability and creative complexity. We will recommend a delivery plan after reviewing the brief."],
  ["Can existing product images and footage be used?", "Usually, yes, provided you have permission to use them and they are suitable for the intended output. We will assess quality, dimensions and creative fit before confirming the approach."],
] as const;

export const metadata: Metadata = {
  title: "AI Video Production",
  description: "AI video production for startups, e-commerce brands and small businesses: product videos, short-form social content, explainers and advertising creative.",
  alternates: { canonical: "/services/ai-video-production" },
  openGraph: {
    title: "AI Video Production — Vantalume",
    description: "Professional AI marketing videos built around your audience, platforms and brand assets.",
    url: `${site.url}/services/ai-video-production`,
    images: [{ url: "/images/vantalume-social-share.png", width: 1200, height: 630, alt: "Vantalume AI video production" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "AI Video Production",
  serviceType: "AI video production",
  provider: { "@type": "ProfessionalService", name: "Vantalume", url: site.url },
  areaServed: "Worldwide",
  url: `${site.url}/services/ai-video-production`,
  description: "Short-form AI marketing videos, AI product videos, explainers and localised social content for startups, e-commerce brands and small businesses.",
};

export default function AiVideoProductionPage() {
  return (
    <>
      <section className="video-hero shell">
        <div className="video-hero-copy">
          <p className="kicker">AI Video Production</p>
          <h1>Turn Your Ideas Into Scroll-Stopping AI Videos</h1>
          <p className="lede">Professional AI-powered product videos, social content and advertisements—created with a focused, modern production process.</p>
          <div className="actions">
            <ButtonLink href={contactHref}>Discuss Your Video</ButtonLink>
            <ButtonLink href="#how-it-works" secondary>See How It Works</ButtonLink>
          </div>
        </div>
        <div className="video-hero-frame" aria-hidden="true">
          <span>9:16</span><span>1:1</span><span>16:9</span>
          <div><i /><i /><i /><b>Play</b></div>
        </div>
      </section>

      <section className="section shell">
        <div className="section-head"><p className="kicker">What we create</p><h2>Video content shaped for the message and the medium.</h2></div>
        <div className="video-service-grid">
          {videoServices.map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="split-panel" id="how-it-works">
        <div className="shell video-process">
          <div><p className="kicker">How it works</p><h2>From raw idea to platform-ready video.</h2><p>AI supports the production process; judgement, storytelling and quality control shape the result.</p></div>
          <ol>{process.map((item, index) => <li key={item}><span>0{index + 1}</span><p>{item}</p></li>)}</ol>
        </div>
      </section>

      <section className="section shell tailored-project">
        <div className="tailored-heading"><p className="kicker">Tailored to Your Project</p><h2>AI Video Production Built Around Your Goals</h2><p className="standfirst">Every project is different. We’ll discuss your objectives, audience, platforms, video length and creative requirements before recommending the right production approach.</p></div>
        <div className="tailored-considerations">
          <p className="label">Project considerations</p>
          <ul>{considerations.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ul>
          <div className="tailored-action"><p>Share your idea with us, and we’ll arrange a conversation to understand your requirements.</p><ButtonLink href={contactHref}>Discuss Your Project</ButtonLink></div>
        </div>
      </section>

      <section className="video-work">
        <div className="section shell">
          <div className="section-head"><p className="kicker">Creative directions</p><h2>Built to move across formats, stories and markets.</h2><p>These concept projects demonstrate possible production directions. They are not client work or performance claims.</p></div>
          <div className="video-project-grid">{projects.map((project) => <VideoProjectCard key={project.title} {...project} />)}</div>
        </div>
      </section>

      <section className="section shell video-faq">
        <div><p className="kicker">Frequently asked questions</p><h2>Useful details before we begin.</h2></div>
        <div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
      </section>

      <section className="cta shell video-final-cta">
        <div><p className="kicker">Start a conversation</p><h2>Ready to bring your idea to life?</h2></div>
        <div><p>Tell us what you want to promote, and we’ll recommend the right video format and production approach.</p><p className="small">Share your idea with us, and we’ll arrange a conversation to understand your requirements.</p><div className="actions"><ButtonLink href={contactHref}>Start Your Video Project</ButtonLink></div></div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
