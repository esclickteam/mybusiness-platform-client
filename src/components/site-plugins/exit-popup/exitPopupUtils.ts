import i18n from "../../../i18n/i18n";

export type ExitPopupSettings = {
  isActive: boolean;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  successMessage: string;
  trigger: "exit" | "delay" | "exit-or-delay" | "scroll";
  delaySeconds: number;
  showOncePerDays: number;
  requirePhone: boolean;
  accentColor: string;
  popups?: Array<Partial<ExitPopupSettings> & { id?: string }>;
  scrollPercent?: number;
  deviceTargeting?: { desktop?: boolean; tablet?: boolean; mobile?: boolean };
  pageTargeting?: { mode?: "all" | "include" | "exclude"; pageIds?: string[] };
  schedule?: { enabled?: boolean; startAt?: string; endAt?: string };
  variantKey?: string;
};

function exitPopupDefaults(): ExitPopupSettings {
  return {
    isActive: true,
    headline: i18n.t("publicWidgets.exitPopup.headline"),
    subheadline: i18n.t("publicWidgets.exitPopup.subheadline"),
    ctaLabel: i18n.t("publicWidgets.exitPopup.cta"),
    successMessage: i18n.t("publicWidgets.exitPopup.success"),
    trigger: "exit-or-delay",
    delaySeconds: 25,
    showOncePerDays: 7,
    requirePhone: true,
    accentColor: "#EF4444",
  };
}

export function mergeExitPopupSettings(
  stored?: Partial<ExitPopupSettings> | null
): ExitPopupSettings {
  return { ...exitPopupDefaults(), ...(stored || {}) };
}

export function exitPopupSeenKey(siteKey: string) {
  return `bizuply-exit-popup-seen:${siteKey || "site"}`;
}

export function wasExitPopupSeenRecently(
  siteKey: string,
  showOncePerDays: number
) {
  const key = exitPopupSeenKey(siteKey);
  const days = Number(showOncePerDays);
  try {
    // 0 / missing = once per tab session, never a permanent lock.
    if (!Number.isFinite(days) || days <= 0) {
      return sessionStorage.getItem(key) === "1";
    }
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const seenAt = Number(raw);
    if (!Number.isFinite(seenAt)) return false;
    return Date.now() - seenAt < days * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export function markExitPopupSeen(siteKey: string) {
  const key = exitPopupSeenKey(siteKey);
  try {
    sessionStorage.setItem(key, "1");
  } catch {
    // ignore
  }
  try {
    localStorage.setItem(key, String(Date.now()));
  } catch {
    // ignore
  }
}
