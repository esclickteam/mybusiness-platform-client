import type { PartnerPriceLine } from "../types/partner";

export const COMMISSION_ONE_TIME_SKU = "partner_commission_onetime";
export const COMMISSION_MONTHLY_SKU = "partner_commission_monthly";

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

export function isCommissionSku(sku?: string) {
  return sku === COMMISSION_ONE_TIME_SKU || sku === COMMISSION_MONTHLY_SKU;
}

function splitFee(amount: number, partnerShareRate: number) {
  const markup = Math.max(0, Number(amount) || 0);
  const share = Number(partnerShareRate) || 0;
  const partnerShare = roundIls(markup * share);
  return {
    markup,
    partnerShare,
    bizShare: roundIls(markup - partnerShare),
  };
}

function feeLine(
  sku: string,
  billing: string,
  nameHe: string,
  nameEn: string,
  amount: number,
  partnerShareRate: number
): PartnerPriceLine {
  const split = splitFee(amount, partnerShareRate);
  return {
    sku,
    nameHe,
    nameEn,
    displayNameHe: nameHe,
    billing,
    category: "partner_fee",
    retailPrice: 0,
    partnerWholesalePrice: 0,
    markup: split.markup,
    customerFinalPrice: split.markup,
    partnerMarkupShare: split.partnerShare,
    bizuplyMarkupShare: split.bizShare,
    partnerShareRate,
    bizuplyShareRate: roundIls(1 - partnerShareRate),
  };
}

export function computeDealPreview(
  items: PartnerPriceLine[],
  selectedSkus: string[],
  additionalMarkup = 0,
  partnerShareRate = 0.75,
  monthlyCommission = 0
) {
  const selected = selectedSkus
    .map((sku) => items.find((row) => row.sku === sku))
    .filter((row): row is PartnerPriceLine => Boolean(row && !isCommissionSku(row.sku)));
  const primary =
    selected.find((line) => isMainPackageSku(line.sku)) || selected[0] || null;
  const oneTimeFee = Math.max(0, Number(additionalMarkup) || 0);
  const monthlyFee = Math.max(0, Number(monthlyCommission) || 0);
  const share = Number(partnerShareRate) || 0;
  const lines: PartnerPriceLine[] = selected.map((line) => {
    const wholesale = Number(line.partnerWholesalePrice) || 0;
    return {
      ...line,
      markup: 0,
      customerFinalPrice: roundIls(wholesale),
      partnerMarkupShare: 0,
      bizuplyMarkupShare: 0,
    };
  });
  if (oneTimeFee > 0) {
    lines.push(
      feeLine(
        COMMISSION_ONE_TIME_SKU,
        "one_time",
        "עמלה חד-פעמית",
        "One-time partner fee",
        oneTimeFee,
        share
      )
    );
  }
  if (monthlyFee > 0) {
    lines.push(
      feeLine(
        COMMISSION_MONTHLY_SKU,
        "recurring_month",
        "עמלה חודשית",
        "Monthly partner fee",
        monthlyFee,
        share
      )
    );
  }
  const totals = {
    oneTime: 0,
    monthly: 0,
    annual: 0,
    customerNow: 0,
    partnerPaysBizuply: 0,
    partnerCommission: 0,
    bizuplyShare: 0,
    wholesale: 0,
    oneTimeCommission: oneTimeFee,
    monthlyCommission: monthlyFee,
    partnerOneTimeCommission: 0,
    partnerMonthlyCommission: 0,
    bizuplyOneTimeShare: 0,
    bizuplyMonthlyShare: 0,
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
    if (line.sku === COMMISSION_ONE_TIME_SKU) {
      totals.partnerOneTimeCommission = partnerShare;
      totals.bizuplyOneTimeShare = bizShare;
    }
    if (line.sku === COMMISSION_MONTHLY_SKU) {
      totals.partnerMonthlyCommission = partnerShare;
      totals.bizuplyMonthlyShare = bizShare;
    }
  }
  return { lines, totals, primary };
}
