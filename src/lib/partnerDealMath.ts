import type { PartnerPriceLine } from "../types/partner";
import { quotePreviewComponents } from "./partnerMoney";

export const COMMISSION_ONE_TIME_SKU = "partner_commission_onetime";
export const COMMISSION_MONTHLY_SKU = "partner_commission_monthly";

export function isCommissionSku(sku?: string) {
  const key = String(sku || "");
  return key === COMMISSION_ONE_TIME_SKU || key === COMMISSION_MONTHLY_SKU;
}

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

export function isBizuplyBrandedName(value?: string) {
  return /bizuply/i.test(String(value || ""));
}

export function publicPackageLabel(name?: string, fallback = "רישיון שימוש במערכת") {
  const trimmed = String(name || "").trim();
  if (trimmed && !isBizuplyBrandedName(trimmed)) return trimmed;
  return fallback;
}

export function customerPackageAmount(
  wholesale: number,
  monthlyCommission: number,
  billing?: string
) {
  const base = roundIls(Number(wholesale) || 0);
  if (billing === "recurring_month" || billing === "recurring_year") {
    return roundIls(base + Number(monthlyCommission || 0));
  }
  return base;
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
    const quoted = quotePreviewComponents({ ...line, partnerShareRate: share });
    const markup = roundIls(quoted.oneTimeMarkup + quoted.recurringMarkup);
    const partnerShare = roundIls(
      quoted.oneTimePartnerShare + quoted.recurringPartnerShare
    );
    const wholesale =
      roundIls(quoted.oneTimeBase + quoted.recurringBase) ||
      roundIls(Number(line.partnerWholesalePrice) || 0);
    const recurringPrimary = String(line.billing || "").startsWith("recurring_");
    const quotedCustomer =
      (recurringPrimary
        ? quoted.customerRecurringAmount
        : quoted.customerOneTimeAmount) ||
      quoted.customerRecurringAmount ||
      quoted.customerOneTimeAmount;
    return {
      ...line,
      markup,
      customerFinalPrice: roundIls(quotedCustomer || Number(line.partnerWholesalePrice) || 0),
      customerOneTimeAmount: quoted.customerOneTimeAmount,
      customerRecurringAmount: quoted.customerRecurringAmount,
      partnerMarkupShare: partnerShare,
      bizuplyMarkupShare: roundIls(markup - partnerShare),
      partnerWholesalePrice: wholesale,
      baseOneTimeAmount: quoted.oneTimeBase,
      baseRecurringAmount: quoted.recurringBase,
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
    const oneTimeAmt = Number(line.customerOneTimeAmount) || 0;
    const recurringAmt = Number(line.customerRecurringAmount) || 0;
    const hasDual = !isCommissionSku(line.sku) && (oneTimeAmt > 0 || recurringAmt > 0);
    const wholesale = Number(line.partnerWholesalePrice) || 0;
    const bizShare = Number(line.bizuplyMarkupShare) || 0;
    const partnerShare = Number(line.partnerMarkupShare) || 0;
    const bucket = billingBucket(line.billing);
    if (hasDual) {
      totals.oneTime = roundIls(totals.oneTime + oneTimeAmt);
      if (bucket === "annual") totals.annual = roundIls(totals.annual + recurringAmt);
      else totals.monthly = roundIls(totals.monthly + recurringAmt);
    } else {
      totals[bucket] = roundIls(totals[bucket] + customer);
    }
    totals.wholesale = roundIls(totals.wholesale + wholesale);
    totals.bizuplyShare = roundIls(totals.bizuplyShare + bizShare);
    totals.partnerCommission = roundIls(totals.partnerCommission + partnerShare);
    totals.partnerPaysBizuply = roundIls(totals.partnerPaysBizuply + wholesale + bizShare);
    totals.customerNow = roundIls(
      totals.customerNow +
        (hasDual
          ? oneTimeAmt + (bucket === "annual" ? 0 : recurringAmt)
          : bucket === "oneTime" || bucket === "monthly"
            ? customer
            : 0)
    );
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
