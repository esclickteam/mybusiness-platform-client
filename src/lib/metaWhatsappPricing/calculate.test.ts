import { describe, expect, it } from "vitest";
import { calculateMetaQuote, OFFICIAL_RATE_CARD } from "./calculate";
import { isRateCardStale } from "./staleness";

const card = OFFICIAL_RATE_CARD;

describe("official Meta rate card snapshot", () => {
  it("is the October 1, 2026 card imported from Meta's docs", () => {
    expect(card.sourceUrl).toBe("https://developers.facebook.com/docs/whatsapp/pricing");
    expect(card.effectiveDate).toBe("2026-10-01");
    expect(card.importMethod).toBe("official_docs_workbook");
    expect(card.markets).toHaveLength(47);
    expect(card.currencies).toContain("USD");
    expect(card.currencies).not.toContain("ILS");
    expect(card.serviceFreeMessagesPerPhone).toBe(1000);
    const israel = card.markets.find((market) => market.id === "israel");
    expect(israel?.rates.USD).toEqual({
      marketing: "0.0353",
      utility: "0.0053",
      authentication: "0.0053",
      authentication_international: null,
      service: "0.0053",
    });
  });

  it("is current on October 2, 2026 and stale after the next quarter", () => {
    expect(isRateCardStale(card.effectiveDate, new Date("2026-10-02T12:00:00Z"))).toBe(false);
    expect(isRateCardStale(card.effectiveDate, new Date("2027-01-01T00:00:00Z"))).toBe(true);
  });
});

describe("calculateMetaQuote", () => {
  const now = new Date("2026-10-02T12:00:00Z");

  it("prices Israel marketing from the list rate with no volume tier", () => {
    const quote = calculateMetaQuote(
      {
        currency: "USD",
        phoneNumbers: 1,
        serviceFreeForEligibleOrganization: false,
        lines: [{ id: "m", countryIso: "IL", category: "marketing", quantity: 1000 }],
      },
      { now }
    );
    expect(quote.kind).toBe("forecast");
    expect(quote.lines[0].monthlyCost).toBe("35.3");
    expect(quote.lines[0].averageRate).toBe("0.0353");
    expect(quote.lines[0].listRate).toBe("0.0353");
    expect(quote.lines[0].tiered).toBe(false);
    expect(quote.metaMonthly).toBe("35.3");
    expect(quote.metaYearly).toBe("423.6");
    expect(quote.bizuplyMonthlyUsd).toBe("29");
    expect(quote.combinedMonthlyUsd).toBe("64.3");
  });

  it("applies Argentina utility tiers only to messages inside each tier", () => {
    const quote = calculateMetaQuote(
      {
        currency: "USD",
        phoneNumbers: 1,
        serviceFreeForEligibleOrganization: false,
        lines: [
          {
            id: "u",
            countryIso: "AR",
            category: "utility",
            quantity: 100001,
          },
        ],
      },
      { now }
    );
    expect(quote.lines[0].monthlyCost).toBe("2600.0247");
    expect(quote.lines[0].tiered).toBe(true);
  });

  it("shares one service free tier across countries in row order", () => {
    const quote = calculateMetaQuote(
      {
        currency: "USD",
        phoneNumbers: 1,
        serviceFreeForEligibleOrganization: false,
        lines: [
          { id: "a", countryIso: "IL", category: "service", quantity: 600 },
          { id: "b", countryIso: "US", category: "service", quantity: 500 },
        ],
      },
      { now }
    );
    expect(quote.lines[0].freeMessages).toBe(600);
    expect(quote.lines[0].monthlyCost).toBe("0");
    expect(quote.lines[1].freeMessages).toBe(400);
    expect(quote.lines[1].billableMessages).toBe(100);
    expect(quote.lines[1].monthlyCost).toBe("0.34");
  });

  it("does not invent an authentication-international rate when Meta publishes none", () => {
    const quote = calculateMetaQuote(
      {
        currency: "USD",
        phoneNumbers: 1,
        serviceFreeForEligibleOrganization: false,
        lines: [
          {
            id: "ai",
            countryIso: "IL",
            category: "authentication_international",
            quantity: 10,
          },
        ],
      },
      { now }
    );
    expect(quote.lines[0].status).toBe("rate_unavailable");
    expect(quote.metaMonthly).toBe("0");
    expect(quote.pricedLineCount).toBe(0);
  });

  it("uses the official authentication-international tier for Bangladesh", () => {
    const quote = calculateMetaQuote(
      {
        currency: "USD",
        phoneNumbers: 1,
        serviceFreeForEligibleOrganization: false,
        lines: [
          {
            id: "ai",
            countryIso: "BD",
            category: "authentication_international",
            quantity: 100001,
          },
        ],
      },
      { now }
    );
    expect(quote.lines[0].status).toBe("priced");
    expect(quote.lines[0].eligibilityNote).toBe("authentication_international");
    expect(quote.lines[0].monthlyCost).toBe("9600.0912");
  });

  it("keeps the Bizuply fee in USD when Meta is billed in another currency", () => {
    const quote = calculateMetaQuote(
      {
        currency: "EUR",
        phoneNumbers: 1,
        serviceFreeForEligibleOrganization: false,
        lines: [{ id: "m", countryIso: "DE", category: "marketing", quantity: 1 }],
      },
      { now }
    );
    expect(quote.currency).toBe("EUR");
    expect(quote.combinedMonthlyUsd).toBeNull();
    expect(quote.bizuplyMonthlyUsd).toBe("29");
    expect(quote.lines[0].listRate).toBe(
      card.markets.find((market) => market.id === "germany")?.rates.EUR.marketing
    );
  });

  it("applies one portfolio tier when two rows share a market and category", () => {
    const split = calculateMetaQuote(
      {
        currency: "USD",
        phoneNumbers: 1,
        serviceFreeForEligibleOrganization: false,
        lines: [
          { id: "a", countryIso: "AR", category: "utility", quantity: 100000 },
          { id: "b", countryIso: "AR", category: "utility", quantity: 1 },
        ],
      },
      { now }
    );
    const together = calculateMetaQuote(
      {
        currency: "USD",
        phoneNumbers: 1,
        serviceFreeForEligibleOrganization: false,
        lines: [{ id: "u", countryIso: "AR", category: "utility", quantity: 100001 }],
      },
      { now }
    );
    expect(split.metaMonthly).toBe(together.metaMonthly);
  });
});
