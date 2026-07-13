export const site = {
  name: "Vantalume",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://vantalume.com",
  email: "contact@vantalume.com",
  description:
    "Websites, software and practical AI systems designed around a clear business case.",
};

export const services = [
  {
    slug: "ai-video-production",
    nav: "AI video production",
    title: "AI video production",
    eyebrow: "Short-form video built for the way people watch now.",
    intro:
      "Professional AI-powered product videos, social content and advertisements—shaped through scripting, editing, captions, voice-over and your brand assets.",
    outcomes: [
      "Platform-ready short-form creative",
      "A clear concept, script and storyboard",
      "Adaptable formats for campaigns and markets",
    ],
    process: [
      "Share the product, audience and objective",
      "Agree the concept, script and storyboard",
      "Create, animate and edit the scenes",
      "Review and deliver platform-ready videos",
    ],
    fit: "Startups, e-commerce brands and small businesses that need credible video content without a traditional production footprint.",
    starting:
      "Every engagement is shaped around the objective, source material, formats, production requirements and delivery plan.",
  },
  {
    slug: "web-design-development",
    nav: "Websites",
    title: "Website design and development",
    eyebrow: "Clearer story. Better customer journey. Faster site.",
    intro:
      "For organisations whose website no longer reflects the quality of their work—or does not turn attention into useful conversations.",
    outcomes: [
      "A focused message and information architecture",
      "An accessible, responsive interface built for speed",
      "A maintainable publishing and measurement foundation",
    ],
    process: [
      "Audit the current journey and search landscape",
      "Agree the proposition, page plan and measurement",
      "Design and build in working slices",
      "Test, launch and improve from real behaviour",
    ],
    fit: "Established small businesses, specialist firms and internal teams preparing a meaningful launch or repositioning.",
    starting:
      "Focused websites typically start from £6,500. Scope, integrations and content depth determine the final proposal.",
  },
  {
    slug: "web-applications-saas",
    nav: "Web apps & SaaS",
    title: "Web applications and SaaS",
    eyebrow: "Move the important workflow out of the spreadsheet.",
    intro:
      "We turn validated product ideas and cumbersome internal processes into dependable web software people can actually use.",
    outcomes: [
      "A deliberately scoped first release",
      "Secure, understandable product architecture",
      "A roadmap based on evidence rather than feature volume",
    ],
    process: [
      "Define the job, users and risk",
      "Prototype the riskiest interaction",
      "Build and validate the core journey",
      "Harden, document and release",
    ],
    fit: "Founders validating a product and operational teams replacing fragile manual systems.",
    starting:
      "Paid discovery starts from £2,500; production builds are estimated after scope and risk are understood.",
  },
  {
    slug: "mobile-app-development",
    nav: "Mobile apps",
    title: "Mobile app development",
    eyebrow: "A reason to live on the home screen.",
    intro:
      "Mobile products designed around repeatable value—not a smaller copy of a website or an expensive list of features.",
    outcomes: [
      "A validated mobile use case",
      "Accessible native-feeling journeys",
      "A practical release and iteration plan",
    ],
    process: [
      "Challenge the mobile proposition",
      "Map the smallest complete journey",
      "Prototype on real devices",
      "Build, test and prepare store release",
    ],
    fit: "Teams with a clear recurring mobile use case, field workflow or customer service opportunity.",
    starting:
      "A prototype sprint starts from £3,500. Full app estimates follow technical discovery.",
  },
  {
    slug: "ai-automation",
    nav: "AI automation",
    title: "AI automation",
    eyebrow: "Remove repeat work without removing judgement.",
    intro:
      "We find the steps where automation is useful, connect the right systems and keep people in control where mistakes matter.",
    outcomes: [
      "A prioritised automation map",
      "A working, observable workflow",
      "Clear ownership, fallbacks and operating guidance",
    ],
    process: [
      "Observe the real workflow",
      "Score value, feasibility and failure cost",
      "Pilot one bounded automation",
      "Measure, document and extend",
    ],
    fit: "Operations, service and commercial teams spending meaningful time moving, checking or rewriting information.",
    starting:
      "Automation discovery starts from £1,500; fixed-scope pilots typically start from £4,000.",
  },
  {
    slug: "ai-consulting-prototyping",
    nav: "AI consulting",
    title: "AI consulting and prototyping",
    eyebrow: "Find the useful AI bet before funding the build.",
    intro:
      "A structured way to test where AI can create value, what it will cost to operate and what must remain reliably human.",
    outcomes: [
      "A ranked opportunity and risk map",
      "A testable prototype where useful",
      "A build, buy or stop recommendation",
    ],
    process: [
      "Frame the decision",
      "Inspect data and operational constraints",
      "Prototype the uncertain part",
      "Recommend the next defensible step",
    ],
    fit: "Leaders with AI pressure, several possible use cases and no appetite for a vague transformation programme.",
    starting:
      "Opportunity Mapping Sprints start from £1,500 and finish with a decision-ready recommendation.",
  },
] as const;

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/how-we-work", label: "How we work" },
  { href: "/opportunity-mapper", label: "Opportunity Mapper" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
];

export const articles = [
  {
    slug: "website-redesign-business-case",
    title: "How to build a business case for a website redesign",
    description:
      "A practical framework for deciding whether the problem is cosmetic, structural or commercial.",
    category: "Web strategy",
    read: "8 min",
  },
  {
    slug: "ai-automation-opportunity-scorecard",
    title: "Which workflow should you automate first?",
    description:
      "Score frequency, friction, data quality and failure cost before choosing a tool.",
    category: "AI automation",
    read: "9 min",
  },
  {
    slug: "mvp-scope-without-regret",
    title: "How to scope an MVP without creating a disposable product",
    description:
      "Reduce scope while preserving the complete customer journey and technical choices that matter.",
    category: "Product development",
    read: "10 min",
  },
  {
    slug: "website-project-costs",
    title: "What determines the cost of a professional website?",
    description:
      "The work behind strategy, content, design, integration and assurance—without mystery ranges.",
    category: "Buying guide",
    read: "8 min",
  },
  {
    slug: "ai-prototype-production-gap",
    title: "Why useful AI prototypes fail on the way to production",
    description:
      "Reliability, evaluation, data, operating cost and human fallbacks are product requirements.",
    category: "AI delivery",
    read: "11 min",
  },
] as const;
