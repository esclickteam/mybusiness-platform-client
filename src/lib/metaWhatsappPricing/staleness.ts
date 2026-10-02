const QUARTER_MONTHS = [1, 4, 7, 10];

export function currentPricingQuarterStart(now: Date): string {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  let quarter = 1;
  for (const candidate of QUARTER_MONTHS) {
    if (month >= candidate) quarter = candidate;
  }
  return `${year}-${String(quarter).padStart(2, "0")}-01`;
}

/**
 * Meta publishes rate-card changes on Jan 1, Apr 1, Jul 1, and Oct 1.
 * A card is stale when its effective date is before the current quarter.
 */
export function isRateCardStale(effectiveDate: string, now: Date): boolean {
  return String(effectiveDate || "") < currentPricingQuarterStart(now);
}
