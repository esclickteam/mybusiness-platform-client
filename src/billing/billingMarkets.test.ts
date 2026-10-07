import { describe, expect, it } from "vitest";
import {
  BILLING_MARKETS,
  billingMarketFromCountry,
  defaultBillingCountryFromLocale,
  formatMarketMoney,
  planAmount,
  resolveBillingCountry,
  resolveBillingMarket,
  stripeLookupKeyForPlan,
} from "./billingMarkets";

describe("billing markets", () => {
  it("prices every market from the same USD list (no FX conversion)", () => {
    for (const market of Object.values(BILLING_MARKETS)) {
      expect(market.currency).toBe("USD");
      expect(market.stripeCurrency).toBe("usd");
      expect(market.prices).toEqual({
        websiteAnnual: 129,
        crmMonthly: 49,
        businessMonthly: 99,
        websiteStaffBuild: 399,
      });
    }
  });

  it("maps countries to market ids", () => {
    expect(billingMarketFromCountry("IL").id).toBe("israel");
    expect(billingMarketFromCountry("IL").prices.businessMonthly).toBe(99);
    expect(billingMarketFromCountry("US").id).toBe("usa");
    expect(billingMarketFromCountry("ES").id).toBe("europe");
    expect(billingMarketFromCountry("BR").id).toBe("brazil");
    expect(billingMarketFromCountry("AE").id).toBe("uae");
    expect(billingMarketFromCountry("MX").id).toBe("latam");
    expect(billingMarketFromCountry("GB").id).toBe("global");
  });

  it("keeps saved billing country over travel/IP and language", () => {
    const englishInIsrael = resolveBillingMarket({
      savedBillingCountry: "IL",
      language: "en",
      geoCountry: "US",
    });
    expect(englishInIsrael.id).toBe("israel");
    expect(englishInIsrael.currency).toBe("USD");

    const market = resolveBillingMarket({
      savedBillingCountry: "AE",
      language: "en",
      geoCountry: "US",
      checkoutCountry: "BR",
    });
    expect(market.id).toBe("uae");
  });

  it("uses locale defaults when no billing country is known", () => {
    expect(defaultBillingCountryFromLocale("he")).toBe("IL");
    expect(defaultBillingCountryFromLocale("en")).toBe("US");
    expect(defaultBillingCountryFromLocale("es")).toBe("ES");
    expect(defaultBillingCountryFromLocale("pt-BR")).toBe("BR");
    expect(defaultBillingCountryFromLocale("ar")).toBe("AE");

    expect(resolveBillingCountry({ language: "ar" })).toBe("AE");
    expect(resolveBillingMarket({ language: "ar" }).id).toBe("uae");
    expect(resolveBillingMarket({ language: "en" }).prices.businessMonthly).toBe(99);
  });

  it("prefers locale default over geo for public pages without billingCountry", () => {
    const market = resolveBillingMarket({
      language: "ar",
      geoCountry: "IL",
    });
    expect(market.id).toBe("uae");
  });

  it("builds lookup keys and yearly amounts from the USD list", () => {
    const usa = billingMarketFromCountry("US");
    expect(stripeLookupKeyForPlan("monthly", usa)).toBe("bizuply_monthly_99_usd");
    expect(planAmount("website", usa)).toBe(129);
    expect(planAmount("yearly", billingMarketFromCountry("IL"))).toBe(990);
    expect(formatMarketMoney(99, "USD", "en-US")).toContain("99");
    expect(formatMarketMoney(99, "USD", "he-IL")).not.toMatch(/₪/);
  });
});
