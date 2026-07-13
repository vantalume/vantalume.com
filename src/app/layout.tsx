import type { Metadata, Viewport } from "next";
import { DM_Mono, Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnalyticsConsent } from "@/components/analytics-consent";
import { ChatAssistant } from "@/components/chat-assistant";
import { site } from "@/lib/site";
import "./globals.css";

const display = Newsreader({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Vantalume — Web, App & AI Solutions",
    template: "%s — Vantalume",
  },
  description: "We build websites, applications and AI automation solutions.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "Vantalume — Web, App & AI Solutions",
    description: "We build websites, applications and AI automation solutions.",
    url: site.url,
    images: [{ url: "/images/vantalume-social-share.png", width: 1200, height: 630, alt: "Vantalume" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vantalume — Web, App & AI Solutions",
    description: "We build websites, applications and AI automation solutions.",
    images: ["/images/vantalume-social-share.png"],
  },
  icons: { icon: "/icon.svg" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ee4f26",
};

const schema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  url: site.url,
  description: site.description,
  email: site.email,
  areaServed: "Worldwide",
  serviceType: [
    "Website development",
    "Software development",
    "AI video production",
    "AI automation",
    "AI consulting",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const analytics = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true";
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <ChatAssistant />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <AnalyticsConsent
          enabled={analytics || Boolean(measurementId)}
          measurementId={measurementId}
        />
      </body>
    </html>
  );
}
