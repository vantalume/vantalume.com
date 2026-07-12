# Vantalume.com

Production website for Vantalume: strategy, design, service content, Opportunity Mapper, insights and secure contact-delivery adapter.

## Run locally

```bash
npm install
npm run dev
```

Use Node.js 22 or 24. Copy `.env.example` to `.env.local` only when configuring external services; never commit the resulting file.

## Quality commands

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

## Deployment

The application targets a Node-capable Next.js host. On Vercel, import the repository, keep the default Next.js build settings, add the environment variables below, deploy a preview, complete the launch checks, then attach `vantalume.com` and redirect `www` to the canonical host.

Required for production enquiry delivery:

- `NEXT_PUBLIC_SITE_URL=https://vantalume.com`
- `RESEND_API_KEY`: server-only Resend credential
- `CONTACT_TO_EMAIL`: verified receiving mailbox
- `CONTACT_FROM_EMAIL`: sender on a domain verified with Resend

Optional:

- `NEXT_PUBLIC_ANALYTICS_ENABLED=true`: exposes a consent prompt and loads Vercel Analytics only after acceptance. Keep `false` until the owner approves the provider and legal wording.

Required to accept guided-assistant leads:

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: Hostinger MySQL connection used to durably store concierge leads and transcripts. The `concierge_leads` table is created automatically on the first valid enquiry.

The assistant fails closed when persistence is unavailable: it shows `contact@vantalume.com` instead of claiming the lead was saved. Resend notification is attempted only after persistence succeeds and is not the system of record.

## Contact security

The route uses shared client/server constraints, server-side Zod validation, HTML escaping, a hidden honeypot, minimum completion time, generic provider errors and a lightweight per-instance rate limit. At higher traffic, replace the in-memory limit with a distributed store and consider a privacy-conscious challenge after measured abuse. Do not weaken server validation.

## Owner launch checklist

1. **Business identity:** add the registered legal name, legal form, company number and postal address to the Privacy Policy and Terms. Required for transparent contracting and privacy notices. Obtain solicitor/privacy-professional approval and verify the final pages in production.
2. **Email:** create/choose the Resend account; verify `vantalume.com` using the DNS records Resend provides; create `contact@vantalume.com`; add the three server variables; submit a valid test and confirm receipt/reply routing; submit invalid data and confirm no email is sent.
3. **Domain and hosting:** deploy a preview; add `vantalume.com`; configure the DNS records shown by the host; make `https://vantalume.com` canonical; redirect HTTP and `www`; verify TLS and every security header.
4. **Analytics decision:** either leave analytics disabled (valid privacy-first launch) or approve Vercel Analytics, set the variable, verify that no analytics request occurs before consent, and update the production cookie register.
5. **Legal review:** have qualified UK professionals review Privacy, Cookies, Terms, retention periods, processor list, transfer safeguards and commercial agreement language. Clearly marked draft notices must remain until approval, then be replaced with approved wording.
6. **Search tools:** verify domain ownership in Google Search Console and Bing Webmaster Tools; submit `https://vantalume.com/sitemap.xml`; inspect the home page and one service page; confirm robots and canonical selection.
7. **Business profiles:** add only genuine LinkedIn/social profile URLs before exposing social icons. None are rendered now, so there are no placeholder or dead social links.
8. **Final production QA:** rerun the commands above against the final commit; execute browser tests against production; inspect console/network/storage; test at 375, 768, 1024 and 1440 px; verify a real contact submission; check major current Chrome, Firefox, Safari and Edge; archive the results and launch approval.

## Maintenance

- Monthly: test contact delivery and all critical routes; review enquiry quality and abuse.
- Quarterly: update dependencies, run audit/build/browser tests, review analytics and search performance, inspect broken external links.
- Annually or after material change: review all legal text, service/pricing guidance, structured data and every article’s factual claims.
- Before any content publish: source check, expert review, accessibility/metadata QA and relevant internal links.

Research, positioning and acquisition documentation lives in `docs/`.
