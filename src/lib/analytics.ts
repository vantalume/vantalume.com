type AnalyticsEvent = "generate_lead" | "chat_open";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackAnalyticsEvent(
  event: AnalyticsEvent,
  parameters?: Record<string, string | number | boolean>,
) {
  window.gtag?.("event", event, parameters);
}
