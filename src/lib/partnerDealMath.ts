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

export function publicProductCopy(value?: string) {
  const text = String(value || "").trim();
  if (!text || isBizuplyBrandedName(text)) return "";
  return text;
}

export function computeDealPreview(
  items: PartnerPriceLine[],
  selectedSkus: string[],
  partnerShareRate = 0.75
) {
  const selected = selectedSkus
    .map((sku) => items.find((row) => row.sku === sku))
    .filter((row): row is PartnerPriceLine => Boolean(row && !isCommissionSku(row.sku)));
  const primary =
    selected.find((line) => isMainPackageSku(line.sku)) || selected[0] || null;
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
    const oneTimeAmt = Number(line.customerOneTimeAmount) || 0;
    const recurringAmt = Number(line.customerRecurringAmount) || 0;
    const hasDual = oneTimeAmt > 0 || recurringAmt > 0;
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
          ? oneTimeAmt + recurringAmt
          : bucket === "oneTime" || bucket === "monthly" || bucket === "annual"
            ? customer
            : 0)
    );
  }
  return { lines, totals, primary };
}
