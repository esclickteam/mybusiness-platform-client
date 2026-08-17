export function formatIls(value?: number) {
  const n = Number(value || 0);
  const fractionDigits = Number.isInteger(n) ? 0 : 3;
  return `₪${n.toLocaleString("he-IL", {
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
