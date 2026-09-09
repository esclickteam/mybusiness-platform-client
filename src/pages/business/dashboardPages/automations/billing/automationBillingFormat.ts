import i18n from "../../../../../i18n/i18n";
import { getIntlLocale } from "../../../../../i18n/localeUtils";

function resolveLocale(locale?: string) {
  return locale || getIntlLocale(i18n.language);
}

export function formatHeNumber(value: number, locale?: string) {
  return new Intl.NumberFormat(resolveLocale(locale)).format(
    Number.isFinite(value) ? value : 0
  );
}

export function formatHeDate(iso: string | null | undefined, locale?: string) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(resolveLocale(locale), {
    day: "numeric",
    month: "long",
  }).format(date);
}

export function formatHeDateTime(iso: string | null | undefined, locale?: string) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(resolveLocale(locale), {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export type UsageSeverity = "normal" | "warn" | "critical" | "exhausted";

export function getUsageSeverity(percentage: number | null | undefined): UsageSeverity {
  const pct = Number(percentage);
  if (!Number.isFinite(pct)) return "normal";
  if (pct >= 100) return "exhausted";
  if (pct >= 95) return "critical";
  if (pct >= 80) return "warn";
  return "normal";
}
