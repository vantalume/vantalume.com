"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";

type Message = { role: "visitor" | "assistant"; text: string };

const answers = {
  services:
    "Vantalume designs and builds websites, web and mobile products, workflow automation and practical AI systems. We start with the business constraint before choosing the technology.",
  pricing:
    "Focused websites typically start from £6,500. Opportunity Mapping Sprints start from £1,500, prototype sprints from £3,500, and production software is scoped after discovery.",
  process:
    "Work moves through four visible stages: frame the decision, focus the opportunity, build in working slices, then prove the release through testing and measurement.",
  ai: "A useful AI project starts with one bounded workflow, representative examples, a defined failure cost and a human fallback. We may recommend conventional automation—or not building—when that is the stronger answer.",
};

const initialMessage: Message = {
  role: "assistant",
  text: "I can answer common questions and collect the details for Vantalume. For project-specific advice, I’ll pass this conversation to a person who will respond as soon as available.",
};

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [state, setState] = useState<"idle" | "saving" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const [leadId, setLeadId] = useState("");
  const [startedAt, setStartedAt] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  function openAssistant() {
    setStartedAt(Date.now());
    setOpen(true);
  }

  function answer(topic: keyof typeof answers, label: string) {
    setMessages((current) => [
      ...current,
      { role: "visitor", text: label },
      { role: "assistant", text: answers[topic] },
    ]);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setState("saving");
    setError("");
    const data = Object.fromEntries(new FormData(form));
    if (!String(data.email || "").trim() && !String(data.phone || "").trim()) {
      setState("error");
      setError("Enter an email address or phone number so we can respond.");
      form.querySelector<HTMLInputElement>("#chat-email")?.focus();
      return;
    }

    try {
      const response = await fetch("/api/chat-lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, transcript: messages, startedAt }),
      });
      const body = await response.json();
      if (!response.ok)
        throw new Error(body.message || "The conversation could not be saved.");
      setLeadId(body.leadId);
      setState("success");
      form.reset();
    } catch (submissionError) {
      setState("error");
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "The conversation could not be saved. Please email contact@vantalume.com.",
      );
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        className="concierge-trigger"
        onClick={openAssistant}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span aria-hidden="true" className="concierge-signal" />
        Ask Vantalume
      </button>

      {open && (
        <div className="concierge-layer" role="presentation">
          <button
            className="concierge-scrim"
            aria-label="Close enquiry assistant"
            onClick={() => setOpen(false)}
          />
          <div
            ref={dialogRef}
            className="concierge-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="concierge-title"
            tabIndex={-1}
          >
            <header className="concierge-header">
              <div>
                <p className="kicker">Guided enquiry assistant</p>
                <h2 id="concierge-title">Ask Vantalume</h2>
              </div>
              <button
                className="concierge-close"
                onClick={() => {
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
                aria-label="Close enquiry assistant"
              >
                Close
              </button>
            </header>

            <div className="concierge-body">
              <div className="concierge-messages" aria-live="polite">
                {messages.map((message, index) => (
                  <p
                    key={`${message.role}-${index}`}
                    className={`concierge-message ${message.role}`}
                  >
                    <span>
                      {message.role === "assistant" ? "Vantalume" : "You"}
                    </span>
                    {message.text}
                  </p>
                ))}
              </div>

              {!capturing && state !== "success" && (
                <div className="concierge-options">
                  <p>What would you like to know?</p>
                  <div>
                    <button
                      onClick={() =>
                        answer("services", "What services do you provide?")
                      }
                    >
                      Services
                    </button>
                    <button
                      onClick={() =>
                        answer("pricing", "What are the starting prices?")
                      }
                    >
                      Starting prices
                    </button>
                    <button
                      onClick={() =>
                        answer("process", "How does a project work?")
                      }
                    >
                      How projects work
                    </button>
                    <button
                      onClick={() => answer("ai", "Where can AI be useful?")}
                    >
                      Practical AI
                    </button>
                  </div>
                  <button
                    className="button concierge-start"
                    onClick={() => setCapturing(true)}
                  >
                    Pass an enquiry to a person →
                  </button>
                </div>
              )}

              {capturing && state !== "success" && (
                <form className="concierge-form" onSubmit={submit}>
                  <div className="concierge-form-heading">
                    <p className="kicker">Human handoff</p>
                    <h3>How can we reach you?</h3>
                    <p>Name and at least one contact method are required.</p>
                  </div>
                  {state === "error" && (
                    <div className="error-summary" role="alert">
                      <b>Conversation not saved</b>
                      <p>{error}</p>
                    </div>
                  )}
                  <div className="field">
                    <label htmlFor="chat-name">Name *</label>
                    <input
                      id="chat-name"
                      name="name"
                      autoComplete="name"
                      minLength={2}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="chat-company">
                      Company or organisation
                    </label>
                    <input
                      id="chat-company"
                      name="company"
                      autoComplete="organization"
                    />
                  </div>
                  <div className="field-row">
                    <div className="field">
                      <label htmlFor="chat-email">Email</label>
                      <input
                        id="chat-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="chat-phone">Phone or WhatsApp</label>
                      <input
                        id="chat-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="chat-preference">Preferred response</label>
                    <select
                      id="chat-preference"
                      name="preferredContact"
                      defaultValue="either"
                    >
                      <option value="either">Email or phone</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone call</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="chat-message">
                      What would you like help with? *
                    </label>
                    <textarea
                      id="chat-message"
                      name="message"
                      rows={4}
                      minLength={10}
                      maxLength={2000}
                      required
                    />
                  </div>
                  <div className="honeypot" aria-hidden="true">
                    <label htmlFor="chat-website">Leave blank</label>
                    <input
                      id="chat-website"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>
                  <label className="consent">
                    <input
                      type="checkbox"
                      name="consent"
                      value="yes"
                      required
                    />
                    <span>
                      I agree that Vantalume may save this conversation and use
                      my details to respond, as explained in the{" "}
                      <a href="/privacy">Privacy Policy</a>. *
                    </span>
                  </label>
                  <div className="concierge-form-actions">
                    <button
                      type="button"
                      className="button secondary"
                      onClick={() => setCapturing(false)}
                    >
                      Back
                    </button>
                    <button className="button" disabled={state === "saving"}>
                      {state === "saving"
                        ? "Saving safely…"
                        : "Save and hand over →"}
                    </button>
                  </div>
                </form>
              )}

              {state === "success" && (
                <div className="concierge-success" role="status">
                  <p className="kicker">Saved for follow-up</p>
                  <h3>Your conversation is in the queue.</h3>
                  <p>
                    We will respond using your preferred contact method as soon
                    as available.
                  </p>
                  <p className="concierge-reference">
                    Reference <b>{leadId}</b>
                  </p>
                  <Link className="button" href="/">
                    Continue exploring →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
