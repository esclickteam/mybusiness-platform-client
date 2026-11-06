/** Approved International Partner commission helpers. Do not invent rates here. */

export const RECURRING_TIERS = [
  { min: 1, max: 19, rate: 0.3, label: "30%" },
  { min: 20, max: 39, rate: 0.35, label: "35%" },
  { min: 40, max: null, rate: 0.4, label: "40%" },
];

export const ONE_TIME_RATE = 0.1;

export function commissionRateForCustomers(customers) {
  const count = Math.max(0, Math.round(customers));
  if (count >= 40) return 0.4;
  if (count >= 20) return 0.35;
  if (count >= 1) return 0.3;
  return 0;
}

export function tierCount(rate) {
  if (rate >= 0.4) return 40;
  if (rate >= 0.35) return 20;
  return 1;
}

export function estimatePartnerCommission({
  customers = 0,
  monthlyPrice = 0,
  oneTimeDeals = 0,
  oneTimeAverage = 0,
  oneTimeRate = ONE_TIME_RATE,
} = {}) {
  const count = Math.max(0, Math.round(Number(customers) || 0));
  const price = Math.max(0, Number(monthlyPrice) || 0);
  const deals = Math.max(0, Math.round(Number(oneTimeDeals) || 0));
  const dealAvg = Math.max(0, Number(oneTimeAverage) || 0);
  const rate = commissionRateForCustomers(count);
  const monthlyRevenue = Math.round(count * price);
  const monthlyCommission = Math.round(monthlyRevenue * rate);
  const annualCommission = monthlyCommission * 12;
  const oneTimeCommission = Math.round(deals * dealAvg * oneTimeRate);
  const totalIllustrated = annualCommission + oneTimeCommission;
  return {
    rate,
    monthlyRevenue,
    monthlyCommission,
    annualCommission,
    oneTimeCommission,
    totalIllustrated,
  };
}

export function money(amount) {
  return `$${Math.round(Number(amount) || 0).toLocaleString("en-US")}`;
}
