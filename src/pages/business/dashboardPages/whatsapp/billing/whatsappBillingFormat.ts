import i18n from "../../../../../i18n/i18n";
import { getIntlLocale } from "../../../../../i18n/localeUtils";

function resolveLocale(locale?: string) {
  return locale || getIntlLocale(i18n.language);
}

export const WHATSAPP_DEFAULT_UNIT_PRICE_ILS = 0.2;

export function formatHeNumber(value: number, locale?: string) {
  return new Intl.NumberFormat(resolveLocale(locale)).format(
    Number.isFinite(value) ? value : 0
  );
}

export function formatHeIls(value: number, locale?: string) {
  const amount = new Intl.NumberFormat(resolveLocale(locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
  return `${amount} ₪`;
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

export function resolveWhatsAppUnitPriceIls(unitPriceIls?: number | null) {
  const n = Number(unitPriceIls);
  return Number.isFinite(n) && n > 0 ? n : WHATSAPP_DEFAULT_UNIT_PRICE_ILS;
}
