import { describe, expect, it } from "vitest";
import { previewProductionBlockReason } from "./previewProductionGuard";

const BUSINESS_ID = "6b0a9601758e7d25935e3999";

function token(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `eyJhbGciOiJub25lIn0.${body}.sig`;
}

const businessToken = token({ role: "business", businessId: BUSINESS_ID });
const adminToken = token({ role: "admin", businessId: null });

describe("previewProductionBlockReason", () => {
  it("allows login and reads for the signed-in business", () => {
    expect(
      previewProductionBlockReason({
        method: "post",
        url: "/auth/login",
      })
    ).toBeNull();
    expect(
      previewProductionBlockReason({
        method: "get",
        url: `/business/${BUSINESS_ID}/dashboard`,
        headers: { "X-Business-Id": BUSINESS_ID },
        token: businessToken,
      })
    ).toBeNull();
    expect(
      previewProductionBlockReason({
        method: "get",
        url: "/whatsapp/conversations",
        headers: { "X-Business-Id": BUSINESS_ID },
        token: businessToken,
      })
    ).toBeNull();
  });

  it("blocks sends, automations, campaigns, and payments", () => {
    const headers = { "X-Business-Id": BUSINESS_ID };
    expect(
      previewProductionBlockReason({
        method: "post",
        url: "/whatsapp/campaigns/send",
        headers,
        token: businessToken,
      })
    ).toBe("external_action");
    expect(
      previewProductionBlockReason({
        method: "post",
        url: "/automations/abc/publish",
        headers,
        token: businessToken,
      })
    ).toBe("external_action");
    expect(
      previewProductionBlockReason({
        method: "post",
        url: "/stripe/create-checkout-session",
        headers,
        token: businessToken,
      })
    ).toBe("external_action");
    expect(
      previewProductionBlockReason({
        method: "post",
        url: "/whatsapp/campaigns/preview",
        headers,
        token: businessToken,
      })
    ).toBeNull();
    expect(
      previewProductionBlockReason({
        method: "post",
        url: "/ai/insights",
        headers,
        token: businessToken,
      })
    ).toBe("external_action");
    expect(
      previewProductionBlockReason({
        method: "post",
        url: "/ai/insights/dismiss",
        headers,
        token: businessToken,
      })
    ).toBe("external_action");
  });

  it("blocks another business, admin surfaces, and non-business roles", () => {
    expect(
      previewProductionBlockReason({
        method: "get",
        url: "/admin/customers",
        token: businessToken,
        headers: { "X-Business-Id": BUSINESS_ID },
      })
    ).toBe("admin_surface");
    expect(
      previewProductionBlockReason({
        method: "get",
        url: "/crm/clients",
        token: businessToken,
        headers: { "X-Business-Id": "aaaaaaaaaaaaaaaaaaaaaaaa" },
      })
    ).toBe("other_business");
    expect(
      previewProductionBlockReason({
        method: "get",
        url: "/crm/clients",
        token: adminToken,
      })
    ).toBe("test_business_only");
    expect(
      previewProductionBlockReason({
        method: "post",
        url: "/crm/clients",
        token: adminToken,
      })
    ).toBe("test_business_only");
    expect(
      previewProductionBlockReason({
        method: "post",
        url: "/early-access",
      })
    ).toBe("test_business_only");
  });
});
