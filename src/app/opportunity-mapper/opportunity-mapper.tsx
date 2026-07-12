"use client";

import Link from "next/link";
import { FormEvent, useMemo, useRef, useState } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { buildOpportunityReport, type OpportunityAnswers } from "@/lib/opportunity-report";

type PartialAnswers = Partial<OpportunityAnswers>;
const questions = [
  { key: "org", title: "What kind of organisation is this for?", options: [["small", "Small business"], ["startup", "Startup or new venture"], ["established", "Established organisation"], ["team", "Internal team"]] },
  { key: "challenge", title: "What needs to change most?", options: [["explain", "We need to explain and convert better"], ["workflow", "A workflow is too manual"], ["product", "We need to test or build a product"], ["ai", "We need a sensible AI direction"]] },
  { key: "friction", title: "Where is the strongest friction?", options: [["customers", "Customer acquisition or service"], ["operations", "Internal operations"], ["data", "Information and data flow"], ["decision", "Uncertainty about what to build"]] },
  { key: "budget", title: "What investment range is realistic?", options: [["explore", "Still exploring"], ["small", "Under £5,000"], ["medium", "£5,000–£20,000"], ["large", "£20,000+"]] },
  { key: "timeline", title: "When would progress be useful?", options: [["soon", "Within 1–2 months"], ["quarter", "This quarter"], ["later", "Later this year"], ["open", "No fixed date"]] },
] as const;

export function OpportunityMapper() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<PartialAnswers>({});
  const [capture, setCapture] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [delivered, setDelivered] = useState(false);
  const startedAt = useRef(0);
  const complete = step === questions.length;
  const result = useMemo(() => complete ? buildOpportunityReport(answers as OpportunityAnswers) : null, [complete, answers]);

  function choose(key: keyof OpportunityAnswers, value: string) {
    setAnswers((current) => ({ ...current, [key]: value }));
    setStep((current) => current + 1);
    // Capture the moment the result is shown for the low-friction bot timing check.
    // eslint-disable-next-line react-hooks/purity
    if (step === questions.length - 1) startedAt.current = Date.now();
  }

  function reset() {
    setAnswers({}); setStep(0); setCapture("idle"); setMessage(""); setDelivered(false); startedAt.current = 0;
  }

  async function requestReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity() || !result) return;
    setCapture("sending"); setMessage("");
    const data = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch("/api/opportunity-report", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, company: data.company, website: data.website, marketingConsent: data.marketingConsent === "yes", companyWebsite: data.companyWebsite, answers, startedAt: startedAt.current }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || "We could not prepare your report.");
      setDelivered(Boolean(body.delivered)); setCapture("success");
      trackAnalyticsEvent("generate_lead", { method: "opportunity_scorecard", score: result.score });
    } catch (error) {
      setCapture("error"); setMessage(error instanceof Error ? error.message : "We could not prepare your report. Please try again.");
    }
  }

  return <>
    <section className="page-intro shell mapper-intro"><p className="kicker">Free digital opportunity scorecard</p><h1>Find the useful digital bet.</h1><p className="lede">Five decisions reveal whether your next step is ready to build, worth testing or needs more clarity.</p></section>
    <section className="section shell mapper-tool">
      <div className="mapper-progress"><span>Digital Opportunity Scorecard</span><span>{complete ? "Your signal" : `Question ${step + 1} of ${questions.length}`}</span><progress max={questions.length} value={step} aria-label={`${step} of ${questions.length} questions complete`} /></div>
      {!complete ? <div className="question"><p className="kicker">Choose the closest answer</p><h2>{questions[step].title}</h2><div className="option-grid">{questions[step].options.map(([value, label]) => <button key={value} onClick={() => choose(questions[step].key, value)}><span>{label}</span><b aria-hidden="true">→</b></button>)}</div>{step > 0 && <button className="back-button" onClick={() => setStep((current) => current - 1)}>← Back</button>}</div> : result && <div className="scorecard" aria-live="polite">
        <header className="scorecard-head"><div><p className="kicker">Your opportunity signal</p><h2>{result.title}</h2><p>{result.signal}</p></div><div className="score-dial" style={{ "--score": `${result.score * 3.6}deg` } as React.CSSProperties}><strong>{result.score}</strong><span>/ 100</span></div></header>
        <div className="score-preview"><span>01</span><div><p className="label">First move</p><p>{result.steps[0]}</p></div><aside><b>Why this score?</b><p>Timing, decision clarity and investment readiness shape the result. It is a direction finder—not an automated sales verdict.</p></aside></div>
        {capture !== "success" ? <form className="report-capture" onSubmit={requestReport}><div className="report-capture-copy"><p className="kicker">Take the complete route with you</p><h3>Get all three recommended steps by email.</h3><p>Your report includes the practical sequence, the constraint to keep in view and a reply path if you want to pressure-test it.</p></div>
          {capture === "error" && <div className="error-summary" role="alert"><b>Report not sent</b><p>{message}</p></div>}
          <div className="field-row"><div className="field"><label htmlFor="score-name">Name *</label><input id="score-name" name="name" required autoComplete="name" /></div><div className="field"><label htmlFor="score-email">Business email *</label><input id="score-email" name="email" type="email" required autoComplete="email" /></div></div>
          <div className="field-row"><div className="field"><label htmlFor="score-company">Company</label><input id="score-company" name="company" autoComplete="organization" /></div><div className="field"><label htmlFor="score-website">Website</label><input id="score-website" name="website" type="url" placeholder="https://" inputMode="url" /></div></div>
          <div className="honeypot" aria-hidden="true"><label htmlFor="company-website">Leave blank</label><input id="company-website" name="companyWebsite" tabIndex={-1} autoComplete="off" /></div>
          <label className="consent score-consent"><input type="checkbox" name="marketingConsent" value="yes" /><span><b>Send me the occasional Digital Clarity Brief.</b><small>Optional. Practical website, software and AI guidance. Unsubscribe any time.</small></span></label>
          <p className="capture-privacy">The report email is not conditional on marketing consent. See our <Link href="/privacy">privacy notice</Link>.</p><button className="button submit" disabled={capture === "sending"}>{capture === "sending" ? "Preparing your report…" : "Email my complete scorecard →"}</button>
        </form> : <section className="report-delivered" role="status"><p className="kicker">Complete scorecard unlocked</p><h3>{delivered ? "Check your inbox." : "Your report is saved."}</h3>{!delivered && <p>Email delivery is delayed, but your report is safely recorded. Contact us if it does not arrive shortly.</p>}<ol>{result.steps.map((item, index) => <li key={item}><span>0{index + 1}</span><p>{item}</p></li>)}</ol><aside><b>Keep in view</b><p>{result.caution}</p></aside></section>}
        <div className="actions score-actions"><Link className="button secondary" href={`/contact?route=${encodeURIComponent(result.title)}`}>Discuss this route</Link><button className="button secondary" onClick={reset}>Start again</button></div>
      </div>}
    </section>
  </>;
}
