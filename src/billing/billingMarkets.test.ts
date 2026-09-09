import { describe, expect, it } from "vitest";
import {
  billingMarketFromCountry,
  formatMarketMoney,
  planAmount,
  resolveBillingMarket,
  stripeLookupKeyForPlan,
} from "./billingMarkets";

describe("billing markets", () => {
  it("maps countries to fixed regional catalogs", () => {
    expect(billingMarketFromCountry("IL").prices.businessMonthly).toBe(149);
    expect(billingMarketFromCountry("US").prices.businessMonthly).toBe(99);
    expect(billingMarketFromCountry("ES").currency).toBe("EUR");
    expect(billingMarketFromCountry("BR").currency).toBe("BRL");
    expect(billingMarketFromCountry("AE").prices.businessMonthly).toBe(349);
    expect(billingMarketFromCountry("MX").id).toBe("latam");
    expect(billingMarketFromCountry("GB").id).toBe("global");
  });

  it("never uses UI language as a pricing input", () => {
    const englishInIsrael = resolveBillingMarket({
      savedBillingCountry: "IL",
      geoCountry: "US",
    });
    expect(englishInIsrael.currency).toBe("ILS");
    expect(englishInIsrael.prices.businessMonthly).toBe(149);
  });

  it("locks saved billing country over travel/IP changes", () => {
    const market = resolveBillingMarket({
      savedBillingCountry: "AE",
      geoCountry: "US",
      checkoutCountry: "BR",
    });
    expect(market.id).toBe("uae");
    expect(market.currency).toBe("AED");
  });

  it("builds Stripe lookup keys from the regional amount", () => {
    const usa = billingMarketFromCountry("US");
    expect(stripeLookupKeyForPlan("monthly", usa)).toBe("bizuply_monthly_99_usd");
    expect(planAmount("website", usa)).toBe(129);
    expect(formatMarketMoney(99, "USD", "en-US")).toContain("99");
  });
});
