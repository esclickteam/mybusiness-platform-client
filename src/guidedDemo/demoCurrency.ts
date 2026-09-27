import { normalizeDemoLocale, readGuidedDemoLocaleLock, type DemoLocale } from "./sessionStore";

export type DemoCurrency = {
  code: "ILS" | "USD";
  symbol: "₪" | "$";
};

export type DemoMoneyPer = "day" | "month" | "lifetime";

const ILS: DemoCurrency = { code: "ILS", symbol: "₪" };
const USD: DemoCurrency = { code: "USD", symbol: "$" };

const PER_SUFFIX: Record<DemoLocale, Record<Exclude<DemoMoneyPer, "lifetime">, string>> = {
  en: { day: "/day", month: "/mo" },
  he: { day: " ליום", month: " לחודש" },
  es: { day: "/día", month: "/mes" },
  "pt-BR": { day: "/dia", month: "/mês" },
  ar: { day: " / يوم", month: " / شهر" },
};

/** Hebrew demos use Shekels; every other demo locale uses US dollars. */
export function currencyForDemoLocale(locale: unknown): DemoCurrency {
  return normalizeDemoLocale(locale) === "he" ? ILS : USD;
}

/** Currency of the active guided demo, or null outside a demo. */
export function getDemoCurrency(locale?: unknown): DemoCurrency | null {
  const resolved = locale ? normalizeDemoLocale(locale) : readGuidedDemoLocaleLock();
  return resolved ? currencyForDemoLocale(resolved) : null;
}

export function formatDemoMoney(
  amount: number | string | null | undefined,
  { per, locale }: { per?: DemoMoneyPer; locale?: unknown } = {},
): string {
  const resolved = (locale ? normalizeDemoLocale(locale) : readGuidedDemoLocaleLock()) || "en";
  const currency = currencyForDemoLocale(resolved);
  const value = Number(amount || 0);
  const number = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
    minimumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
  const suffix = per && per !== "lifetime" ? PER_SUFFIX[resolved][per] : "";
  return `${currency.symbol}${number}${suffix}`;
}
