export function formatCurrency(
  value: number,
  currency = "ILS",
  locale = "he-IL"
) {
  const amount = Number(value) || 0;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: amount >= 100 ? 0 : 2,
    }).format(amount);
  } catch {
    return `₪ ${amount.toLocaleString(locale)}`;
  }
}

export function formatNumber(value: number, locale = "he-IL") {
  return new Intl.NumberFormat(locale).format(Number(value) || 0);
}

export function formatPercent(value: number, digits = 1) {
  return `${(Number(value) || 0).toFixed(digits)}%`;
}

export function formatRoas(value: number) {
  return `${(Number(value) || 0).toFixed(1)}x`;
}

export function statusTone(status: string) {
  const value = String(status || "").toUpperCase();
  if (value === "ACTIVE") {
    return {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-100",
      dot: "bg-emerald-500",
    };
  }
  if (value === "PAUSED") {
    return {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-100",
      dot: "bg-amber-500",
    };
  }
  if (value === "DRAFT" || value === "PENDING_REVIEW" || value === "IN_PROCESS") {
    return {
      bg: "bg-slate-100",
      text: "text-slate-600",
      border: "border-slate-200",
      dot: "bg-slate-400",
    };
  }
  return {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
  };
}

export function daysAgoIso(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export const DATE_RANGE_OPTIONS = [
  { value: 7, labelKey: "metaCampaigns.ranges.last7" },
  { value: 14, labelKey: "metaCampaigns.ranges.last14" },
  { value: 30, labelKey: "metaCampaigns.ranges.last30" },
  { value: 90, labelKey: "metaCampaigns.ranges.last90" },
] as const;

export const SEGMENT_OPTIONS = [
  { value: "all", labelKey: "metaCampaigns.segments.all" },
  { value: "leads", labelKey: "metaCampaigns.segments.leads" },
  { value: "sales", labelKey: "metaCampaigns.segments.sales" },
  { value: "traffic", labelKey: "metaCampaigns.segments.traffic" },
  { value: "awareness", labelKey: "metaCampaigns.segments.awareness" },
  { value: "engagement", labelKey: "metaCampaigns.segments.engagement" },
] as const;

export const OBJECTIVE_OPTIONS = [
  {
    value: "OUTCOME_AWARENESS",
    labelKey: "metaCampaigns.objectives.awareness",
    descriptionKey: "metaCampaigns.objectives.awarenessDesc",
  },
  {
    value: "OUTCOME_TRAFFIC",
    labelKey: "metaCampaigns.objectives.traffic",
    descriptionKey: "metaCampaigns.objectives.trafficDesc",
  },
  {
    value: "OUTCOME_ENGAGEMENT",
    labelKey: "metaCampaigns.objectives.engagement",
    descriptionKey: "metaCampaigns.objectives.engagementDesc",
  },
  {
    value: "OUTCOME_LEADS",
    labelKey: "metaCampaigns.objectives.leads",
    descriptionKey: "metaCampaigns.objectives.leadsDesc",
  },
  {
    value: "OUTCOME_APP_PROMOTION",
    labelKey: "metaCampaigns.objectives.app",
    descriptionKey: "metaCampaigns.objectives.appDesc",
  },
  {
    value: "OUTCOME_SALES",
    labelKey: "metaCampaigns.objectives.sales",
    descriptionKey: "metaCampaigns.objectives.salesDesc",
  },
] as const;

/** Numeric Meta ad account id (without `act_` prefix), matching Ads Manager. */
export function resolveAdAccountId(account?: {
  accountId?: string | null;
  id?: string | null;
} | null) {
  const raw = String(account?.accountId || "").trim();
  if (raw) return raw.replace(/^act_/i, "");
  const graphId = String(account?.id || "").trim();
  if (!graphId) return "";
  return graphId.replace(/^act_/i, "");
}

/** Meta-style label: `Name (USD) · 1234567890` */
export function formatAdAccountLabel(
  account?: {
    name?: string | null;
    currency?: string | null;
    accountId?: string | null;
    id?: string | null;
  } | null,
  options?: { fallbackName?: string; includeCurrency?: boolean }
) {
  const name =
    String(account?.name || "").trim() ||
    options?.fallbackName ||
    "Ad Account";
  const currency = String(account?.currency || "").trim();
  const accountId = resolveAdAccountId(account);
  const includeCurrency = options?.includeCurrency !== false;

  const parts = [name];
  if (includeCurrency && currency) {
    parts[0] = `${name} (${currency})`;
  }
  if (accountId) {
    parts.push(accountId);
  }
  return parts.join(" · ");
}
