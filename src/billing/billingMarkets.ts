/**
 * Billing markets. The Lemon store charges in USD only, so every market uses the
 * same USD price list (no FX conversion); market ids still gate regional features.
 * billingCountry wins when present; UI locale may seed a public default market.
 */

export type BillingCurrency = "ILS" | "USD" | "EUR" | "BRL" | "AED";

export type BillingMarketId =
  | "israel"
  | "usa"
  | "europe"
  | "brazil"
  | "uae"
  | "latam"
  | "global";

export type RegionalPlanKey =
  | "websiteAnnual"
  | "crmMonthly"
  | "businessMonthly"
  | "websiteStaffBuild";

export type RegionalPriceTable = Record<RegionalPlanKey, number>;

export type BillingMarket = {
  id: BillingMarketId;
  currency: BillingCurrency;
  stripeCurrency: string;
  labelKey: string;
  prices: RegionalPriceTable;
};

const EUROZONE = new Set([
  "AT",
  "BE",
  "CY",
  "DE",
  "EE",
  "ES",
  "FI",
  "FR",
  "GR",
  "HR",
  "IE",
  "IT",
  "LT",
  "LU",
  "LV",
  "MT",
  "NL",
  "PT",
  "SI",
  "SK",
]);

const LATAM_USD = new Set([
  "MX",
  "AR",
  "CO",
  "CL",
  "PE",
  "UY",
  "PY",
  "EC",
  "BO",
  "VE",
  "CR",
  "PA",
  "DO",
  "GT",
  "HN",
  "SV",
  "NI",
  "CU",
  "PR",
]);

const USD_PRICES: RegionalPriceTable = {
  websiteAnnual: 129,
  crmMonthly: 49,
  businessMonthly: 99,
  websiteStaffBuild: 699,
};

export const BILLING_MARKETS: Record<BillingMarketId, BillingMarket> = {
  israel: {
    id: "israel",
    currency: "USD",
    stripeCurrency: "usd",
    labelKey: "billing.markets.israel",
    prices: { ...USD_PRICES },
  },
  usa: {
    id: "usa",
    currency: "USD",
    stripeCurrency: "usd",
    labelKey: "billing.markets.usa",
    prices: { ...USD_PRICES },
  },
  europe: {
    id: "europe",
    currency: "USD",
    stripeCurrency: "usd",
    labelKey: "billing.markets.europe",
    prices: { ...USD_PRICES },
  },
  brazil: {
    id: "brazil",
    currency: "USD",
    stripeCurrency: "usd",
    labelKey: "billing.markets.brazil",
    prices: { ...USD_PRICES },
  },
  uae: {
    id: "uae",
    currency: "USD",
    stripeCurrency: "usd",
    labelKey: "billing.markets.uae",
    prices: { ...USD_PRICES },
  },
  latam: {
    id: "latam",
    currency: "USD",
    stripeCurrency: "usd",
    labelKey: "billing.markets.latam",
    prices: { ...USD_PRICES },
  },
  global: {
    id: "global",
    currency: "USD",
    stripeCurrency: "usd",
    labelKey: "billing.markets.global",
    prices: { ...USD_PRICES },
  },
};

export const BILLING_COUNTRY_STORAGE_KEY = "bizuply_billing_country";

/** Public pricing default when no billingCountry is known yet. */
export function defaultBillingCountryFromLocale(language: unknown): string | null {
  const raw = String(language || "")
    .trim()
    .replace(/_/g, "-")
    .toLowerCase();
  if (!raw) return null;
  if (raw === "he" || raw.startsWith("he-")) return "IL";
  if (raw === "ar" || raw.startsWith("ar-")) return "AE";
  if (raw === "es" || raw.startsWith("es-")) return "ES";
  if (raw === "pt-br" || raw === "pt" || raw.startsWith("pt-")) return "BR";
  if (raw === "en" || raw.startsWith("en-")) return "US";
  return null;
}

export function normalizeCountryCode(value: unknown): string | null {
  const code = String(value || "")
    .trim()
    .toUpperCase();
  if (!code || code === "XX" || code === "T1" || code === "EU") return null;
  if (!/^[A-Z]{2}$/.test(code)) return null;
  return code;
}

export function billingMarketFromCountry(country: unknown): BillingMarket {
  const code = normalizeCountryCode(country);
  if (!code) return BILLING_MARKETS.global;
  if (code === "IL") return BILLING_MARKETS.israel;
  if (code === "BR") return BILLING_MARKETS.brazil;
  if (code === "AE") return BILLING_MARKETS.uae;
  if (code === "US") return BILLING_MARKETS.usa;
  if (EUROZONE.has(code)) return BILLING_MARKETS.europe;
  if (LATAM_USD.has(code)) return BILLING_MARKETS.latam;
  return BILLING_MARKETS.global;
}

export function resolveBillingCountry(sources: {
  savedBillingCountry?: unknown;
  businessCountry?: unknown;
  checkoutCountry?: unknown;
  localeCountry?: unknown;
  language?: unknown;
  geoCountry?: unknown;
}): string | null {
  return (
    normalizeCountryCode(sources.savedBillingCountry) ||
    normalizeCountryCode(sources.businessCountry) ||
    normalizeCountryCode(sources.checkoutCountry) ||
    normalizeCountryCode(sources.localeCountry) ||
    defaultBillingCountryFromLocale(sources.language) ||
    normalizeCountryCode(sources.geoCountry)
  );
}

export function resolveBillingMarket(sources: {
  savedBillingCountry?: unknown;
  businessCountry?: unknown;
  checkoutCountry?: unknown;
  localeCountry?: unknown;
  language?: unknown;
  geoCountry?: unknown;
}): BillingMarket {
  return billingMarketFromCountry(resolveBillingCountry(sources));
}

export function readStoredBillingCountry(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return normalizeCountryCode(window.localStorage.getItem(BILLING_COUNTRY_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function persistBillingCountry(country: unknown): string | null {
  const code = normalizeCountryCode(country);
  if (!code || typeof window === "undefined") return code;
  try {
    const existing = readStoredBillingCountry();
    if (existing) return existing;
    window.localStorage.setItem(BILLING_COUNTRY_STORAGE_KEY, code);
  } catch {
    /* private mode */
  }
  return code;
}

export function formatMarketMoney(
  amount: number,
  currency: BillingCurrency,
  locale = "en-US"
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

export function stripeLookupKeyForPlan(
  plan: "website" | "monthly" | "yearly" | "crm_only" | "website_staff",
  market: BillingMarket
): string {
  const amount = planAmount(plan, market);
  const cur = market.stripeCurrency;
  if (plan === "website") return `website_only_${amount}_${cur}`;
  if (plan === "website_staff") return `expert_website_build_${amount}_${cur}`;
  if (plan === "crm_only") return `bizuply_crm_only_monthly_${amount}_${cur}`;
  if (plan === "yearly") return `bizuply_yearly_${amount}_${cur}`;
  return `bizuply_monthly_${amount}_${cur}`;
}

export function planAmount(
  plan: "website" | "monthly" | "yearly" | "crm_only" | "website_staff",
  market: BillingMarket
): number {
  if (plan === "website") return market.prices.websiteAnnual;
  if (plan === "crm_only") return market.prices.crmMonthly;
  if (plan === "website_staff") return market.prices.websiteStaffBuild;
  if (plan === "yearly") return market.prices.businessMonthly * 10;
  return market.prices.businessMonthly;
}
