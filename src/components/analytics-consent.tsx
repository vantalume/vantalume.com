"use client";

import { Analytics } from "@vercel/analytics/react";
import { useEffect, useState } from "react";

type Choice = "unknown" | "accepted" | "declined";

export function AnalyticsConsent({ enabled }: { enabled: boolean }) {
  const [choice, setChoice] = useState<Choice>("unknown");

  useEffect(() => {
    if (!enabled) return;
    const saved = localStorage.getItem("vantalume-analytics-consent");
    if (saved === "accepted" || saved === "declined") {
      const update = window.setTimeout(() => setChoice(saved), 0);
      return () => window.clearTimeout(update);
    }
  }, [enabled]);

  if (!enabled) return null;

  function choose(value: Exclude<Choice, "unknown">) {
    localStorage.setItem("vantalume-analytics-consent", value);
    setChoice(value);
  }

  return (
    <>
      {choice === "accepted" && <Analytics />}
      {choice === "unknown" && (
        <aside className="consent-banner" aria-label="Analytics preference">
          <div>
            <b>Optional analytics</b>
            <p>
              May we collect privacy-conscious usage data to improve this
              website? No advertising profiles.
            </p>
          </div>
          <div>
            <button className="button" onClick={() => choose("accepted")}>
              Allow analytics
            </button>
            <button
              className="button secondary"
              onClick={() => choose("declined")}
            >
              No thanks
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
