import i18n from "../i18n/i18n";
import { getIntlLocale } from "../i18n/localeUtils";

type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

export function formatIls(value?: number, locale?: string) {
  const n = Number(value || 0);
  const fractionDigits = Number.isInteger(n) ? 0 : 3;
  const resolved = locale || getIntlLocale(i18n.language);
  return `₪${n.toLocaleString(resolved, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: 3,
  })}`;
}

export function formatPct(rate?: number) {
  return `${Math.round(Number(rate || 0) * 100)}%`;
}

export function splitAdditionalCommission(
  markup: number,
  partnerShareRate: number,
  keepFractional = false
) {
  const amount = Number(markup || 0);
  const share = Number(partnerShareRate || 0);
  const round = keepFractional
    ? (value: number) => Math.round(value * 1000) / 1000
    : (value: number) => Math.round(value);
  const partnerMarkupShare = round(amount * share);
  const bizuplyMarkupShare = round(amount - partnerMarkupShare);
  return {
    partnerMarkupShare,
    bizuplyMarkupShare,
    partnerShareRate: share,
    bizuplyShareRate: Math.round((1 - share) * 100) / 100,
  };
}

export function quotePreviewLine(item: {
  partnerWholesalePrice?: number;
  partnerShareRate?: number;
  category?: string;
  markup?: number;
  markupIls?: number;
  retailIls?: number;
  retailPrice?: number;
}) {
  const wholesale = Number(item.partnerWholesalePrice || 0);
  const markup = Number(item.markup ?? item.markupIls ?? 0);
  const keepFractional = item.category === "whatsapp_usage";
  const split = splitAdditionalCommission(
    markup,
    Number(item.partnerShareRate || 0),
    keepFractional
  );
  const round = keepFractional
    ? (value: number) => Math.round(value * 1000) / 1000
    : (value: number) => Math.round(value);
  return {
    wholesale,
    markup,
    customerFinalPrice: round(wholesale + markup),
    partnerCostToBizuply: round(wholesale + split.bizuplyMarkupShare),
    retailPrice: Number(item.retailIls ?? item.retailPrice ?? 0),
    ...split,
  };
}

export function quotePreviewComponents(item: {
  billing?: string;
  partnerWholesalePrice?: number;
  partnerShareRate?: number;
  baseOneTimeAmount?: number;
  baseRecurringAmount?: number;
  oneTimeMarkupEnabled?: boolean;
  oneTimeMarkupAmount?: number;
  recurringMarkupEnabled?: boolean;
  recurringMarkupAmount?: number;
  markup?: number;
  markupIls?: number;
}) {
  const round = (value: number) => Math.round(value);
  const share = Number(item.partnerShareRate || 0);
  const oneTimeBase = round(
    Number(
      item.baseOneTimeAmount ??
        (item.billing === "one_time" ? item.partnerWholesalePrice : 0)
    ) || 0
  );
  const recurringBase = round(
    Number(
      item.baseRecurringAmount ??
        (String(item.billing || "").startsWith("recurring_")
          ? item.partnerWholesalePrice
          : 0)
    ) || 0
  );
  const oneTimeEnabled = Boolean(item.oneTimeMarkupEnabled);
  const allowsRecurring = skuAllowsRecurringMarkup(item.billing);
  const recurringEnabled = allowsRecurring && Boolean(item.recurringMarkupEnabled);
  const dualSpecified =
    item.oneTimeMarkupEnabled != null ||
    item.recurringMarkupEnabled != null ||
    item.oneTimeMarkupAmount != null ||
    item.recurringMarkupAmount != null;
  let oneTimeMarkup = oneTimeEnabled ? round(Number(item.oneTimeMarkupAmount) || 0) : 0;
  let recurringMarkup = recurringEnabled
    ? round(Number(item.recurringMarkupAmount) || 0)
    : 0;
  if (!dualSpecified) {
    const legacy = round(Number(item.markup ?? item.markupIls) || 0);
    if (item.billing === "one_time") {
      oneTimeMarkup = legacy;
    } else if (allowsRecurring) {
      recurringMarkup = legacy;
    }
  }
  return {
    oneTimeBase,
    recurringBase,
    oneTimeMarkup,
    recurringMarkup,
    customerOneTimeAmount: round(oneTimeBase + oneTimeMarkup),
    customerRecurringAmount: round(recurringBase + recurringMarkup),
    oneTimePartnerShare: round(oneTimeMarkup * share),
    recurringPartnerShare: round(recurringMarkup * share),
  };
}

export function recurringIntervalLabel(billing?: string, t?: TranslateFn) {
  const yearly = billing === "recurring_year";
  const key = yearly ? "partner.pricing.perYearShort" : "partner.pricing.perMonthShort";
  const fallback = yearly ? "per year" : "per month";
  return t ? t(key) : fallback;
}

export function catalogBillingLabel(billing?: string, t?: TranslateFn) {
  if (billing === "recurring_year") {
    return t ? t("partner.pricing.perYearShort") : "per year";
  }
  if (billing === "recurring_month") {
    return t ? t("partner.pricing.perMonthShort") : "per month";
  }
  return t ? t("partner.billing.oneTime") : "One-time";
}

export function skuAllowsRecurringMarkup(billing?: string) {
  return String(billing || "").startsWith("recurring_");
}

export function formatPublicCustomerPrice(
  product: {
    billing?: string;
    customerFinalPrice?: number;
    customerOneTimeAmount?: number;
    customerRecurringAmount?: number;
  },
  t?: TranslateFn,
  locale?: string
) {
  const money = (value: number) => formatIls(value, locale);
  const oneTime = Number(product.customerOneTimeAmount) || 0;
  const recurring = Number(product.customerRecurringAmount) || 0;
  const yearly = product.billing === "recurring_year";
  const interval = recurringIntervalLabel(product.billing, t);
  const oneTimePart = (amount: number) =>
    t
      ? t("partner.dossier.oneTimeAmount", { amount: money(amount) })
      : `${money(amount)} one-time`;
  const recurringPart = (amount: number) =>
    t
      ? t(yearly ? "partner.perYear" : "partner.perMonth", { amount: money(amount) })
      : `${money(amount)} ${interval}`;

  if (oneTime > 0 && recurring > 0) {
    return t
      ? t("partner.money.oneTimePlusRecurring", {
          oneTime: oneTimePart(oneTime),
          recurring: recurringPart(recurring),
        })
      : `${oneTimePart(oneTime)} + ${recurringPart(recurring)}`;
  }
  if (recurring > 0) return recurringPart(recurring);
  if (oneTime > 0) return oneTimePart(oneTime);
  const fallback = Number(product.customerFinalPrice) || 0;
  if (fallback > 0 && String(product.billing || "").startsWith("recurring_")) {
    return recurringPart(fallback);
  }
  if (fallback > 0) return oneTimePart(fallback);
  return money(0);
}
