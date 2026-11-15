import { describe, expect, it } from "vitest";
import { BILLING_MARKETS, planAmount } from "../billing/billingMarkets";
import { getCrmCopy } from "../lib/crmMarketingCopy.mjs";
import { PRICE_PER_NUMBER_USD } from "../pages/public/whatsapp/siteConfig";
import { PRICING_PACKAGES, PRICING_PAGE_PACKAGES } from "./pricingPackagesData";

describe("pricing page cards", () => {
  it("keeps the existing prices and adds CRM and WhatsApp only on the pricing page", () => {
    expect(PRICING_PACKAGES.map((item) => item.price)).toEqual([129, 99, 990]);
    expect(PRICING_PAGE_PACKAGES.map((item) => [item.type, item.price])).toEqual([
      ["website", 129],
      ["monthly", 99],
      ["yearly", 990],
      ["crm_only", 49],
      ["whatsapp_api", 29],
    ]);
    const crm = PRICING_PAGE_PACKAGES.find((item) => item.type === "crm_only");
    const whatsapp = PRICING_PAGE_PACKAGES.find((item) => item.type === "whatsapp_api");
    expect(crm?.checkoutPlan).toBe("crm_only");
    expect(whatsapp?.checkoutPlan).toBeNull();
    expect(whatsapp?.externalHref).toContain("whatsapp.bizuply.com");
    expect(whatsapp?.price).toBe(PRICE_PER_NUMBER_USD);
    expect(planAmount("crm_only", BILLING_MARKETS.usa)).toBe(49);
    expect(planAmount("monthly", BILLING_MARKETS.usa)).toBe(99);
    expect(planAmount("yearly", BILLING_MARKETS.usa)).toBe(990);
  });

  it("says the Business connection is included and the API subscription is separate", () => {
    const monthly = PRICING_PACKAGES.find((item) => item.type === "monthly");
    expect(monthly?.featuresEn.join(" ")).toContain("no extra Bizuply fee");
    expect(monthly?.featuresEn.join(" ")).toContain("separate subscription");
    const whatsapp = PRICING_PAGE_PACKAGES.find((item) => item.type === "whatsapp_api");
    expect(whatsapp?.noteEn).toContain("separately");
    expect(whatsapp?.noteEn).toContain("no free trial");
  });

  it("translates the yearly price label on the CRM page", () => {
    expect(getCrmCopy("he").pricing.businessAlt).toBe("או 990$ לשנה");
    expect(getCrmCopy("es").pricing.businessAlt).toBe("o $990 al año");
    expect(getCrmCopy("pt-BR").pricing.businessAlt).toBe("ou US$ 990 por ano");
    expect(getCrmCopy("ar").pricing.businessAlt).toBe("أو 990$ في السنة");
    expect(getCrmCopy("en").pricing.businessAlt).toBe("or $990 / year");
  });
});
