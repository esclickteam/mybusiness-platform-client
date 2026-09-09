import { describe, expect, it } from "vitest";
import { localizeBillingLabel } from "./billingCopy";

const CATALOG: Record<string, string> = {
  "billing.planNames.monthly": "Monthly business plan",
  "billing.planNames.website": "Website only",
  "billing.planNames.crm_only": "CRM only",
  "billing.upcoming.websiteRenewal": "Website renewal for another year",
  "billing.history.domainRenewal": "Domain renewal {{domain}}",
  "billing.addons.push_notifications": "Push notifications",
};

function t(key: string, options?: Record<string, unknown>) {
  const template = CATALOG[key] || (options?.defaultValue as string) || key;
  return template.replace("{{domain}}", String(options?.domain || ""));
}

describe("localizeBillingLabel", () => {
  it("maps plan SKUs without using the Hebrew API fallback", () => {
    expect(
      localizeBillingLabel(t, {
        sku: "monthly",
        name: "חבילה עסקית חודשית",
      })
    ).toBe("Monthly business plan");
    expect(
      localizeBillingLabel(t, {
        sku: "website_only",
        name: "בניית אתר בלבד",
      })
    ).toBe("Website only");
    expect(
      localizeBillingLabel(t, { sku: "crm_only_monthly" })
    ).toBe("CRM only");
  });

  it("localizes upcoming website renewal and domain history chrome", () => {
    expect(
      localizeBillingLabel(t, {
        kind: "website_manual_renewal",
        name: "חידוש אתר לשנה נוספת",
      })
    ).toBe("Website renewal for another year");
    expect(
      localizeBillingLabel(t, {
        type: "domain_renewal",
        domainName: "example.com",
        description: "חידוש דומיין example.com",
      })
    ).toBe("Domain renewal example.com");
  });

  it("localizes add-on product keys", () => {
    expect(
      localizeBillingLabel(t, {
        kind: "addon_subscription",
        productKey: "push_notifications",
        name: "התראות Push",
      })
    ).toBe("Push notifications");
  });
});
