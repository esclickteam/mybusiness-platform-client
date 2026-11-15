import { describe, expect, it } from "vitest";
import { BILLING_MARKETS, planAmount } from "../billing/billingMarkets";
import { PRICING_PACKAGES } from "../data/pricingPackagesData";
import { PRICE_PER_NUMBER_USD } from "../pages/public/whatsapp/siteConfig";
import { getCrmCopy } from "./crmMarketingCopy.mjs";
import { getGuide } from "./guidesMarketing.mjs";

const LOCALES = ["en", "he", "es", "pt-BR", "ar"];

describe("public price sources", () => {
  it("keeps the charged catalog at 49, 99, 990 and 29", () => {
    const market = BILLING_MARKETS.usa;
    expect(planAmount("crm_only", market)).toBe(49);
    expect(planAmount("monthly", market)).toBe(99);
    expect(planAmount("yearly", market)).toBe(990);
    expect(PRICE_PER_NUMBER_USD).toBe(29);
  });

  it("puts the business and website cards on the pricing page, and CRM only on the CRM page", () => {
    expect(PRICING_PACKAGES.map((item) => item.price)).toEqual([129, 99, 990]);
    for (const locale of LOCALES) {
      const copy = getCrmCopy(locale);
      expect(copy.pricing.crmPrice).toBe("$49");
      expect(copy.pricing.businessPrice).toBe("$99");
      expect(copy.pricing.priceSentence).toMatch(/49/);
      expect(copy.pricing.priceSentence).toMatch(/990/);
    }
  });

  it("tells the plan guide which page shows each price", () => {
    const plan = getGuide("crm-and-business-platform", "en");
    const faq = plan.faq.map((pair) => pair.join(" ")).join("\n");
    expect(faq).toContain("CRM page");
    expect(faq).toContain("WhatsApp API page");
    const whatsapp = getGuide("whatsapp-cloud-api-cost", "en");
    expect(whatsapp.review).toContain("WhatsApp API page");
    expect(whatsapp.review).toContain("not one of the cards");
  });
});
