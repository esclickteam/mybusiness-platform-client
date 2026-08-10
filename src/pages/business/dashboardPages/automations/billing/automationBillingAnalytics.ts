/**
 * Lightweight product analytics for automation billing.
 * No new vendor — only logs when a host tracker already exists.
 */

export type AutomationBillingAnalyticsEvent =
  | "automation_plan_modal_opened"
  | "automation_plan_checkout_started"
  | "automation_plan_upgrade_requested"
  | "automation_plan_downgrade_requested"
  | "automation_plan_cancel_requested"
  | "automation_plan_reactivate_requested"
  | "automation_quota_warning_clicked";

type TrackerPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    bizuplyTrack?: (event: string, payload?: TrackerPayload) => void;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackAutomationBillingEvent(
  event: AutomationBillingAnalyticsEvent,
  payload: TrackerPayload = {}
) {
  try {
    if (typeof window === "undefined") return;
    if (typeof window.bizuplyTrack === "function") {
      window.bizuplyTrack(event, payload);
      return;
    }
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event, ...payload });
    }
  } catch {
    // Never break UX for analytics.
  }
}