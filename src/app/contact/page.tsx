import type { Metadata } from "next";
import { ContactForm } from "./contact-form";
export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell Vantalume what needs to change. Get a clear response within two working days.",
  alternates: { canonical: "/contact" },
};
export default function Contact() {
  return (
    <>
      <section className="page-intro shell">
        <p className="kicker">Start a conversation</p>
        <h1>What needs to work better?</h1>
        <p className="lede">
          Share the situation in your own words. We will reply within two UK
          working days with a useful next step—or say plainly if we are not the
          right fit.
        </p>
      </section>
      <section className="section shell contact-layout">
        <ContactForm />
        <aside className="contact-aside">
          <p className="kicker">Prefer email?</p>
          <a className="text-link" href="mailto:contact@vantalume.com">
            contact@vantalume.com
          </a>
          <h3>What happens next</h3>
          <ol>
            <li>We read the details and check fit.</li>
            <li>
              You receive a direct response, not an automated sales sequence.
            </li>
            <li>
              If a conversation is useful, we agree an agenda before booking it.
            </li>
          </ol>
          <p className="small">
            Please do not include passwords, health information, financial
            account details or other sensitive personal data.
          </p>
        </aside>
      </section>
    </>
  );
}
