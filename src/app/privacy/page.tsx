import type { Metadata } from "next";
import { Legal } from "@/components/legal";
export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Vantalume handles personal information.",
  alternates: { canonical: "/privacy" },
};
export default function Privacy() {
  return (
    <Legal
      title="Privacy Policy"
      reviewed="11 July 2026"
      notice="Owner action: this policy is a carefully prepared launch draft, but must be reviewed by a qualified UK privacy professional before production use."
    >
      <h2>Who controls your information</h2>
      <p>
        Vantalume is the controller of information submitted through this
        website. Before launch, the owner must insert the registered business
        name, legal form, registration number and postal address here.
      </p>
      <h2>Information we collect</h2>
      <p>
        When you contact us, we receive the information you choose to provide,
        such as your name, work email, organisation, project needs, timing and
        budget range. Server and hosting providers may process limited technical
        logs needed for security and reliability.
      </p>
      <h2>Why we use it</h2>
      <p>
        We use enquiry information to respond, assess fit, prepare requested
        proposals, prevent abuse and keep necessary business records. The
        expected UK GDPR lawful bases are legitimate interests for ordinary
        business enquiries, steps at your request before a contract, legal
        obligation for required records, and consent where specifically
        requested.
      </p>
      <h2>Sharing and transfers</h2>
      <p>
        Information is shared only with providers needed to operate the service,
        such as hosting and transactional email, under appropriate terms. The
        owner must document selected providers, storage regions and any
        international transfer safeguards before launch.
      </p>
      <h2>Retention</h2>
      <p>
        Unsuccessful enquiries should normally be removed after 12 months unless
        there is a legal or clearly documented business reason to retain them.
        Contract and accounting records may require longer retention. Final
        schedules must be confirmed before launch.
      </p>
      <h2>Your rights</h2>
      <p>
        Depending on applicable law, you may request access, correction,
        deletion, restriction, portability or objection. You may complain to the
        UK Information Commissioner’s Office. Contact{" "}
        <a href="mailto:contact@vantalume.com">contact@vantalume.com</a> to make a
        request.
      </p>
      <h2>Security and changes</h2>
      <p>
        We use proportionate technical and organisational safeguards, but no
        internet service is completely risk-free. Material changes will be
        reflected on this page with a revised date.
      </p>
    </Legal>
  );
}
