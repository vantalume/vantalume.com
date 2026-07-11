"use client";
import { useSearchParams } from "next/navigation";
import { FormEvent, useRef, useState } from "react";

type State = "idle" | "submitting" | "success" | "error";
export function ContactForm() {
  const route = useSearchParams().get("route") || "";
  // Capture mount time once for the low-friction bot timing check.
  // eslint-disable-next-line react-hooks/purity
  const started = useRef(Date.now());
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setMessage("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, startedAt: started.current }),
      });
      const body = await res.json();
      if (!res.ok)
        throw new Error(body.message || "We could not send your enquiry.");
      setState("success");
      form.reset();
    } catch (err) {
      setState("error");
      setMessage(
        err instanceof Error
          ? err.message
          : "We could not send your enquiry. Please email hello@vantalume.com.",
      );
    }
  }
  if (state === "success")
    return (
      <div className="form-success" role="status">
        <p className="kicker">Enquiry received</p>
        <h2>Thank you. We’ll read this properly.</h2>
        <p>
          Expect a personal response within two UK working days. A copy has not
          been emailed to you, so keep this page if you need a record.
        </p>
        <button className="button secondary" onClick={() => setState("idle")}>
          Send another enquiry
        </button>
      </div>
    );
  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-intro">
        <h2>A few useful details</h2>
        <p>Fields marked * are required.</p>
      </div>
      {state === "error" && (
        <div className="error-summary" role="alert">
          <b>Submission not sent</b>
          <p>{message}</p>
        </div>
      )}
      <div className="field-row">
        <div className="field">
          <label htmlFor="name">Name *</label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            minLength={2}
          />
        </div>
        <div className="field">
          <label htmlFor="email">Work email *</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="company">Company or organisation</label>
        <input id="company" name="company" autoComplete="organization" />
      </div>
      <div className="field">
        <label htmlFor="need">What do you need help with? *</label>
        <select id="need" name="need" required defaultValue={route}>
          <option value="" disabled>
            Select the closest fit
          </option>
          {route && <option value={route}>{route}</option>}
          <option>Website design and development</option>
          <option>Web application or SaaS</option>
          <option>Mobile application</option>
          <option>AI automation</option>
          <option>AI consulting or prototype</option>
          <option>Not sure yet</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="details">
          What is happening now, and what needs to change? *
        </label>
        <textarea
          id="details"
          name="details"
          rows={7}
          minLength={20}
          maxLength={3000}
          required
          aria-describedby="details-help"
        />
        <small id="details-help">
          Useful context includes the affected people, current workaround and
          desired timing. 20–3,000 characters.
        </small>
      </div>
      <details className="optional">
        <summary>Optional project details</summary>
        <div className="field-row">
          <div className="field">
            <label htmlFor="budget">Approximate budget</label>
            <select id="budget" name="budget" defaultValue="">
              <option value="">Prefer not to say</option>
              <option>Under £5,000</option>
              <option>£5,000–£20,000</option>
              <option>£20,000–£50,000</option>
              <option>£50,000+</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="timeline">Preferred timing</label>
            <input
              id="timeline"
              name="timeline"
              placeholder="e.g. this quarter"
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="url">Current website or product URL</label>
          <input
            id="url"
            name="url"
            type="url"
            inputMode="url"
            placeholder="https://"
          />
        </div>
      </details>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Leave this field blank</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="consent">
        <input type="checkbox" name="consent" value="yes" required />
        <span>
          I agree that Vantalume may use these details to respond to this
          enquiry, as explained in the <a href="/privacy">Privacy Policy</a>. *
        </span>
      </label>
      <button className="button submit" disabled={state === "submitting"}>
        {state === "submitting" ? "Sending…" : "Send enquiry"}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
