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
  try {
    const raw = localStorage.getItem(exitPopupSeenKey(siteKey));
    if (!raw) return false;
    const seenAt = Number(raw);
    if (!Number.isFinite(seenAt)) return false;
    const days = Math.max(0, Number(showOncePerDays) || 0);
    if (days <= 0) return true;
    return Date.now() - seenAt < days * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export function markExitPopupSeen(siteKey: string) {
  try {
    localStorage.setItem(exitPopupSeenKey(siteKey), String(Date.now()));
  } catch {
    // ignore
  }
}
