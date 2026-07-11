# Launch QA results

Final local verification: 11 July 2026

## Passed

- Next.js production build: 25 routes generated; dynamic contact endpoint compiled.
- ESLint: zero warnings/errors.
- TypeScript strict typecheck: passed.
- Unit tests: 5/5 contact validation and anti-spam schema tests passed.
- Browser E2E: 42/42 passed on desktop and iPhone-sized Chromium.
- Automated accessibility: no serious or critical axe violations across every primary customer route; WCAG 2.2 AA tags included.
- Link crawl: every same-origin link exposed on the home page returned below HTTP 400.
- Interaction: all five Opportunity Mapper steps completed and passed the recommended route into the contact form.
- Contact: required-field/native invalid handling passed; server configuration-failure path displayed a clear recovery route. Real provider success requires the owner credentials listed in `README.md`.
- Console: no browser console errors across tested routes.
- SEO surface: titles, descriptions, canonicals, Open Graph, ProfessionalService schema, sitemap and robots routes generated.
- Security: HTTP headers include CSP, HSTS, frame denial, MIME sniffing protection, restricted permissions, referrer policy and opener policy.
- Dependency audit: zero known vulnerabilities after overriding the vulnerable transitive PostCSS version with 8.5.16.
- Lighthouse home-page audit: Performance 96, Accessibility 100, Best Practices 100, SEO 100; simulated LCP 2.8 s, CLS 0, total blocking time 30 ms.
- Final regression run after form, CSP and dependency fixes: all build, lint, type, unit and 42 browser checks passed.

## External verification still required

- Safari, Firefox and Edge should be checked on the final deployed origin; the automated suite used Chromium desktop/mobile.
- Successful email delivery cannot be exercised without a verified sender and server credential.
- Production DNS, TLS, redirects, caching and provider headers exist only after hosting/domain configuration.
- Legal text requires qualified professional approval and the owner’s registered identity.
- Search Console/Bing indexing and optional consent-aware analytics require owner accounts.

Exact configuration and verification steps are in the owner launch checklist in `README.md`.
