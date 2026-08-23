import type { PartnerPriceLine } from "../types/partner";

export function roundIls(value: number) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

export function billingBucket(billing?: string) {
  if (billing === "recurring_month") return "monthly" as const;
  if (billing === "recurring_year") return "annual" as const;
  return "oneTime" as const;
}

export function billingLabel(billing?: string) {
  if (billing === "recurring_month") return "חודשי";
  if (billing === "recurring_year") return "שנתי";
  return "חד-פעמי";
}

export function isMainPackageSku(sku?: string) {
  return sku === "monthly" || sku === "yearly" || sku === "website_only";
}

export function computeDealPreview(
  items: PartnerPriceLine[],
  selectedSkus: string[],
  additionalMarkup = 0,
  partnerShareRate = 0.75
) {
  const selected = selectedSkus
    .map((sku) => items.find((row) => row.sku === sku))
    .filter(Boolean) as PartnerPriceLine[];
  const primary =
    selected.find((line) => isMainPackageSku(line.sku)) || selected[0] || null;
  const markup = Math.max(0, Number(additionalMarkup) || 0);
  const share = Number(partnerShareRate) || 0;
  const lines = selected.map((line) => {
    const wholesale = Number(line.partnerWholesalePrice) || 0;
    const extra = line === primary ? markup : 0;
    const partnerShare = roundIls(extra * share);
    const bizShare = roundIls(extra - partnerShare);
    return {
      ...line,
      markup: extra,
      customerFinalPrice: roundIls(wholesale + extra),
      partnerMarkupShare: partnerShare,
      bizuplyMarkupShare: bizShare,
    };
  });
  const totals = {
    oneTime: 0,
    monthly: 0,
    annual: 0,
    customerNow: 0,
    partnerPaysBizuply: 0,
    partnerCommission: 0,
    bizuplyShare: 0,
    wholesale: 0,
  };
  for (const line of lines) {
    const customer = Number(line.customerFinalPrice) || 0;
    const wholesale = Number(line.partnerWholesalePrice) || 0;
    const bizShare = Number(line.bizuplyMarkupShare) || 0;
    const partnerShare = Number(line.partnerMarkupShare) || 0;
    const bucket = billingBucket(line.billing);
    totals[bucket] = roundIls(totals[bucket] + customer);
    totals.wholesale = roundIls(totals.wholesale + wholesale);
    totals.bizuplyShare = roundIls(totals.bizuplyShare + bizShare);
    totals.partnerCommission = roundIls(totals.partnerCommission + partnerShare);
    totals.partnerPaysBizuply = roundIls(totals.partnerPaysBizuply + wholesale + bizShare);
    if (bucket === "oneTime" || bucket === "monthly") {
      totals.customerNow = roundIls(totals.customerNow + customer);
    }
  }
  return { lines, totals, primary };
}
