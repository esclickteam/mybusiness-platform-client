import { describe, expect, it } from "vitest";
import {
  billingMarketFromCountry,
  defaultBillingCountryFromLocale,
  formatMarketMoney,
  planAmount,
  resolveBillingCountry,
  resolveBillingMarket,
  stripeLookupKeyForPlan,
} from "./billingMarkets";

describe("billing markets", () => {
  it("maps countries to fixed regional catalogs", () => {
    expect(billingMarketFromCountry("IL").prices.businessMonthly).toBe(149);
    expect(billingMarketFromCountry("US").prices.businessMonthly).toBe(99);
    expect(billingMarketFromCountry("ES").currency).toBe("EUR");
    expect(billingMarketFromCountry("BR").currency).toBe("BRL");
    expect(billingMarketFromCountry("AE").prices.websiteAnnual).toBe(499);
    expect(billingMarketFromCountry("AE").prices.businessMonthly).toBe(349);
    expect(billingMarketFromCountry("MX").id).toBe("latam");
    expect(billingMarketFromCountry("GB").id).toBe("global");
  });

  it("keeps saved billing country over travel/IP and language", () => {
    const englishInIsrael = resolveBillingMarket({
      savedBillingCountry: "IL",
      language: "en",
      geoCountry: "US",
    });
    expect(englishInIsrael.currency).toBe("ILS");
    expect(englishInIsrael.prices.businessMonthly).toBe(149);

    const market = resolveBillingMarket({
      savedBillingCountry: "AE",
      language: "en",
      geoCountry: "US",
      checkoutCountry: "BR",
    });
    expect(market.id).toBe("uae");
    expect(market.currency).toBe("AED");
  });

  it("uses locale defaults when no billing country is known", () => {
    expect(defaultBillingCountryFromLocale("he")).toBe("IL");
    expect(defaultBillingCountryFromLocale("en")).toBe("US");
    expect(defaultBillingCountryFromLocale("es")).toBe("ES");
    expect(defaultBillingCountryFromLocale("pt-BR")).toBe("BR");
    expect(defaultBillingCountryFromLocale("ar")).toBe("AE");

    expect(resolveBillingCountry({ language: "ar" })).toBe("AE");
    expect(resolveBillingMarket({ language: "ar" }).currency).toBe("AED");
    expect(resolveBillingMarket({ language: "en" }).prices.businessMonthly).toBe(99);
    expect(resolveBillingMarket({ language: "es" }).currency).toBe("EUR");
  });

  it("prefers locale default over geo for public pages without billingCountry", () => {
    const market = resolveBillingMarket({
      language: "ar",
      geoCountry: "IL",
    });
    expect(market.id).toBe("uae");
    expect(market.currency).toBe("AED");
  });

  it("builds Stripe lookup keys from the regional amount", () => {
    const usa = billingMarketFromCountry("US");
    expect(stripeLookupKeyForPlan("monthly", usa)).toBe("bizuply_monthly_99_usd");
    expect(planAmount("website", usa)).toBe(129);
    expect(stripeLookupKeyForPlan("website", billingMarketFromCountry("AE"))).toBe(
      "website_only_499_aed",
    );
    expect(formatMarketMoney(99, "USD", "en-US")).toContain("99");
    expect(formatMarketMoney(349, "AED", "ar")).not.toMatch(/₪/);
  });
});
