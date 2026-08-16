export type ExitPopupSettings = {
  isActive: boolean;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  successMessage: string;
  trigger: "exit" | "delay" | "exit-or-delay";
  delaySeconds: number;
  showOncePerDays: number;
  requirePhone: boolean;
  accentColor: string;
};

const DEFAULTS: ExitPopupSettings = {
  isActive: true,
  headline: "לפני שאתם הולכים",
  subheadline: "השאירו פרטים ונחזור אליכם עם הצעה מותאמת",
  ctaLabel: "שלחו לי הצעה",
  successMessage: "תודה! קיבלנו את הפרטים ונחזור אליכם בהקדם.",
  trigger: "exit-or-delay",
  delaySeconds: 25,
  showOncePerDays: 7,
  requirePhone: true,
  accentColor: "#EF4444",
};

export function mergeExitPopupSettings(
  stored?: Partial<ExitPopupSettings> | null
): ExitPopupSettings {
  return { ...DEFAULTS, ...(stored || {}) };
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
