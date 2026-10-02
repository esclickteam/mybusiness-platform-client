import bundledCard from "./rateCard.json";
import { formatDecimal, multiplyDecimal, parseDecimal } from "./money";
import { isRateCardStale } from "./staleness";
import type {
  MessageCategory,
  MetaQuote,
  MetaQuoteInput,
  MetaRateCard,
  QuoteLineInput,
  QuoteLineResult,
  RateCardCountry,
  RateCardMarket,
  VolumeTier,
} from "./types";

export const OFFICIAL_RATE_CARD = bundledCard as MetaRateCard;

const OTHER_COUNTRY: RateCardCountry = {
  iso: "OTHER",
  name: "Other",
  callingCode: "",
  marketId: "other",
};

const TIERED = new Set<MessageCategory>([
  "utility",
  "authentication",
  "authentication_international",
]);

function asCard(card?: MetaRateCard): MetaRateCard {
  return card || OFFICIAL_RATE_CARD;
}

export function marketById(card: MetaRateCard, marketId: string): RateCardMarket | null {
  return card.markets.find((market) => market.id === marketId) || null;
}

export function countryByIso(card: MetaRateCard, iso: string): RateCardCountry | null {
  if (iso === "OTHER") return OTHER_COUNTRY;
  return card.countries.find((country) => country.iso === iso) || null;
}

export function selectableCountries(card: MetaRateCard = OFFICIAL_RATE_CARD): RateCardCountry[] {
  return [...card.countries, OTHER_COUNTRY].sort((left, right) =>
    left.name.localeCompare(right.name)
  );
}

function whole(value: number, fallback = 0): number {
  const next = Math.floor(Number(value));
  if (!Number.isSafeInteger(next) || next < 0) return fallback;
  return next;
}

function averageRate(cost: bigint, quantity: number): string | null {
  if (quantity <= 0) return null;
  const count = BigInt(quantity);
  const scaled = (cost + count / 2n) / count;
  return formatDecimal(scaled, 6);
}

function tierCost(tiers: VolumeTier[], quantity: number, priorVolume: number): bigint {
  const ordered = [...tiers].sort((left, right) => left.from - right.from);
  let cursor = priorVolume;
  let remaining = quantity;
  let cost = 0n;
  for (const tier of ordered) {
    if (remaining <= 0) break;
    const upper = tier.to == null ? Number.MAX_SAFE_INTEGER : tier.to;
    if (cursor >= upper) continue;
    const available = upper - cursor;
    const take = Math.min(remaining, available);
    if (take <= 0) continue;
    cost += multiplyDecimal(tier.rate, take);
    cursor += take;
    remaining -= take;
  }
  if (remaining > 0) {
    throw new Error("Official volume tiers do not cover this quantity");
  }
  return cost;
}

type Group = {
  market: RateCardMarket;
  category: MessageCategory;
  lines: QuoteLineInput[];
  priorVolume: number;
  quantity: number;
};

function lineMarket(card: MetaRateCard, line: QuoteLineInput): {
  country: RateCardCountry;
  market: RateCardMarket;
} | null {
  const country = countryByIso(card, line.countryIso);
  if (!country) return null;
  const market = marketById(card, country.marketId);
  if (!market) return null;
  return { country, market };
}

export function calculateMetaQuote(
  input: MetaQuoteInput,
  options: { card?: MetaRateCard; now?: Date } = {}
): MetaQuote {
  const card = asCard(options.card);
  const now = options.now || new Date();
  const currency = String(input.currency || "").toUpperCase();
  if (!card.currencies.includes(currency)) {
    throw new Error("Currency is not a Meta billing currency on this rate card");
  }

  const phoneNumbers = Math.min(100_000, Math.max(1, whole(input.phoneNumbers, 1)));
  const freePool = input.serviceFreeForEligibleOrganization
    ? Number.MAX_SAFE_INTEGER
    : card.serviceFreeMessagesPerPhone * phoneNumbers;
  let freeLeft = freePool;

  const results = new Map<string, QuoteLineResult>();
  const groups = new Map<string, Group>();

  for (const line of input.lines) {
    const quantity = whole(line.quantity, -1);
    const resolved = quantity >= 0 ? lineMarket(card, line) : null;
    if (!resolved || quantity < 0) {
      results.set(line.id, {
        id: line.id,
        countryIso: line.countryIso,
        countryName: resolved?.country.name || line.countryIso,
        marketId: resolved?.market.id || "",
        marketName: resolved?.market.name || "",
        category: line.category,
        quantity: Math.max(0, quantity),
        freeMessages: 0,
        billableMessages: 0,
        monthlyCost: "0",
        averageRate: null,
        listRate: null,
        tiered: false,
        status: "invalid",
        eligibilityNote: null,
      });
      continue;
    }

    const listRate = resolved.market.rates[currency]?.[line.category] ?? null;
    if (!listRate) {
      results.set(line.id, blankLine(line, resolved.country, resolved.market, quantity, "rate_unavailable"));
      continue;
    }

    if (line.category === "service" || line.category === "marketing") {
      let freeMessages = 0;
      let billable = quantity;
      let eligibilityNote: QuoteLineResult["eligibilityNote"] = null;
      if (line.category === "service") {
        freeMessages = Math.min(quantity, freeLeft);
        freeLeft -= freeMessages;
        billable = quantity - freeMessages;
        eligibilityNote = input.serviceFreeForEligibleOrganization
          ? "service_organization"
          : freeMessages > 0
            ? "service_free_tier"
            : null;
      }
      const cost = multiplyDecimal(listRate, billable);
      results.set(line.id, {
        id: line.id,
        countryIso: resolved.country.iso,
        countryName: resolved.country.name,
        marketId: resolved.market.id,
        marketName: resolved.market.name,
        category: line.category,
        quantity,
        freeMessages,
        billableMessages: billable,
        monthlyCost: formatDecimal(cost, 6),
        averageRate: quantity > 0 ? averageRate(cost, quantity) : "0",
        listRate,
        tiered: false,
        status: "priced",
        eligibilityNote,
      });
      continue;
    }

    if (!TIERED.has(line.category)) {
      results.set(line.id, blankLine(line, resolved.country, resolved.market, quantity, "invalid"));
      continue;
    }

    const key = `${resolved.market.id}:${line.category}`;
    const group = groups.get(key) || {
      market: resolved.market,
      category: line.category,
      lines: [],
      priorVolume: 0,
      quantity: 0,
    };
    group.lines.push({ ...line, quantity });
    group.quantity += quantity;
    group.priorVolume = Math.max(group.priorVolume, whole(line.priorVolume || 0, 0));
    groups.set(key, group);
    results.set(line.id, {
      id: line.id,
      countryIso: resolved.country.iso,
      countryName: resolved.country.name,
      marketId: resolved.market.id,
      marketName: resolved.market.name,
      category: line.category,
      quantity,
      freeMessages: 0,
      billableMessages: quantity,
      monthlyCost: "0",
      averageRate: null,
      listRate,
      tiered: true,
      status: "priced",
      eligibilityNote:
        line.category === "authentication_international"
          ? "authentication_international"
          : null,
    });
  }

  for (const group of groups.values()) {
    const tiers = group.market.tiers[currency]?.[group.category] || [];
    const listRate = group.market.rates[currency]?.[group.category];
    if (!listRate || tiers.length === 0) {
      for (const line of group.lines) {
        const current = results.get(line.id);
        if (current) current.status = "rate_unavailable";
      }
      continue;
    }
    const total = tierCost(tiers, group.quantity, group.priorVolume);
    let allocated = 0n;
    group.lines.forEach((line, index) => {
      const isLast = index === group.lines.length - 1;
      const share = isLast
        ? total - allocated
        : group.quantity === 0
          ? 0n
          : (total * BigInt(line.quantity)) / BigInt(group.quantity);
      allocated += share;
      const current = results.get(line.id);
      if (!current) return;
      current.monthlyCost = formatDecimal(share, 6);
      current.averageRate = line.quantity > 0 ? averageRate(share, line.quantity) : "0";
      current.listRate = listRate;
    });
  }

  const lines = input.lines.map((line) => results.get(line.id)).filter(Boolean) as QuoteLineResult[];
  let monthly = 0n;
  let pricedLineCount = 0;
  for (const line of input.lines) {
    const result = results.get(line.id);
    if (!result || result.status !== "priced") continue;
    pricedLineCount += 1;
  }
  for (const line of input.lines) {
    const resolved = lineMarket(card, line);
    if (!resolved) continue;
    const result = results.get(line.id);
    if (!result || result.status !== "priced") continue;
    if (line.category === "marketing" || line.category === "service") {
      monthly += parseDecimal(result.monthlyCost);
    }
  }
  for (const group of groups.values()) {
    const tiers = group.market.tiers[currency]?.[group.category] || [];
    const listRate = group.market.rates[currency]?.[group.category];
    if (!listRate || tiers.length === 0) continue;
    const priced = group.lines.some((line) => results.get(line.id)?.status === "priced");
    if (!priced) continue;
    monthly += tierCost(tiers, group.quantity, group.priorVolume);
  }
  const yearly = monthly * 12n;
  const bizuplyMonthly = parseDecimal(card.bizuplyPlatformFee.amount);
  const bizuplyYearly = bizuplyMonthly * 12n;
  const sameCurrency = currency === card.bizuplyPlatformFee.currency;

  return {
    kind: "forecast",
    currency,
    metaMonthly: formatDecimal(monthly, 4),
    metaYearly: formatDecimal(yearly, 4),
    yearlyBasis: "twelve_times_monthly_forecast",
    bizuplyMonthlyUsd: formatDecimal(bizuplyMonthly, 2),
    bizuplyYearlyUsd: formatDecimal(bizuplyYearly, 2),
    combinedMonthlyUsd: sameCurrency ? formatDecimal(monthly + bizuplyMonthly, 4) : null,
    combinedYearlyUsd: sameCurrency ? formatDecimal(yearly + bizuplyYearly, 4) : null,
    lines,
    pricedLineCount,
    stale: isRateCardStale(card.effectiveDate, now),
  };
}

function blankLine(
  line: QuoteLineInput,
  country: RateCardCountry,
  market: RateCardMarket,
  quantity: number,
  status: QuoteLineResult["status"]
): QuoteLineResult {
  return {
    id: line.id,
    countryIso: country.iso,
    countryName: country.name,
    marketId: market.id,
    marketName: market.name,
    category: line.category,
    quantity,
    freeMessages: 0,
    billableMessages: 0,
    monthlyCost: "0",
    averageRate: null,
    listRate: null,
    tiered: false,
    status,
    eligibilityNote:
      line.category === "authentication_international" ? "authentication_international" : null,
  };
}
