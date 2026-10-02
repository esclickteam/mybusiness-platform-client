export type MessageCategory =
  | "marketing"
  | "utility"
  | "authentication"
  | "authentication_international"
  | "service";

export type VolumeTier = {
  from: number;
  to: number | null;
  rate: string;
};

export type CategoryRates = Record<MessageCategory, string | null>;

export type RateCardMarket = {
  id: string;
  name: string;
  rates: Record<string, CategoryRates>;
  tiers: Record<string, Partial<Record<MessageCategory, VolumeTier[]>>>;
};

export type RateCardCountry = {
  iso: string;
  name: string;
  callingCode: string;
  marketId: string;
};

export type MetaRateCard = {
  schemaVersion: number;
  sourceUrl: string;
  callingCodesUrl: string;
  volumeTiersUrl: string;
  authenticationInternationalUrl: string;
  effectiveDate: string;
  fetchedAt: string;
  importMethod: string;
  serviceFreeMessagesPerPhone: number;
  pricingQuarterMonths: number[];
  bizuplyPlatformFee: {
    amount: string;
    currency: string;
    period: string;
    plan: string;
  };
  currencies: string[];
  categories: MessageCategory[];
  volumeTierCategories: MessageCategory[];
  markets: RateCardMarket[];
  countries: RateCardCountry[];
};

export type QuoteLineInput = {
  id: string;
  countryIso: string;
  category: MessageCategory;
  quantity: number;
  /** Delivered messages already counted this month for this market and category. */
  priorVolume?: number;
};

export type MetaQuoteInput = {
  currency: string;
  phoneNumbers: number;
  /** Eligibility is declared by the user. It is not verified with Meta. */
  serviceFreeForEligibleOrganization: boolean;
  lines: QuoteLineInput[];
};

export type QuoteLineResult = {
  id: string;
  countryIso: string;
  countryName: string;
  marketId: string;
  marketName: string;
  category: MessageCategory;
  quantity: number;
  freeMessages: number;
  billableMessages: number;
  monthlyCost: string;
  averageRate: string | null;
  listRate: string | null;
  tiered: boolean;
  status: "priced" | "rate_unavailable" | "invalid";
  eligibilityNote:
    | null
    | "authentication_international"
    | "service_organization"
    | "service_free_tier";
};

export type MetaQuote = {
  kind: "forecast";
  currency: string;
  metaMonthly: string;
  metaYearly: string;
  yearlyBasis: "twelve_times_monthly_forecast";
  bizuplyMonthlyUsd: string;
  bizuplyYearlyUsd: string;
  /** Present only when the Meta currency is USD, so the two fees share a currency. */
  combinedMonthlyUsd: string | null;
  combinedYearlyUsd: string | null;
  lines: QuoteLineResult[];
  pricedLineCount: number;
  stale: boolean;
};
