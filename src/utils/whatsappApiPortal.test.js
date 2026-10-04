import { describe, expect, it } from "vitest";
import {
  isWhatsAppApiPortalPathAllowed,
  isWhatsAppApiPortalUser,
  whatsappApiPortalHome,
} from "./whatsappApiPortal";
import { resolvePostLoginDestination } from "./safeInternalRedirect";

const BIZ = "507f1f77bcf86cd799439011";
const dash = (rest = "") => `/business/${BIZ}/dashboard${rest}`;

describe("isWhatsAppApiPortalUser", () => {
  it("is true only for business accounts on the whatsapp_api plan", () => {
    expect(isWhatsAppApiPortalUser({ role: "business", subscriptionPlan: "whatsapp_api" })).toBe(true);
    expect(isWhatsAppApiPortalUser({ role: "business", subscriptionPlan: "monthly" })).toBe(false);
    expect(isWhatsAppApiPortalUser({ role: "business", subscriptionPlan: "crm_only" })).toBe(false);
    expect(isWhatsAppApiPortalUser({ role: "business", subscriptionPlan: "trial" })).toBe(false);
    expect(isWhatsAppApiPortalUser({ role: "business" })).toBe(false);
    expect(isWhatsAppApiPortalUser(null)).toBe(false);
  });

  it("never applies to admin, partner, marketer or demo sessions", () => {
    for (const role of ["admin", "partner", "marketer", "staff", "customer"]) {
      expect(isWhatsAppApiPortalUser({ role, subscriptionPlan: "whatsapp_api" })).toBe(false);
    }
    expect(
      isWhatsAppApiPortalUser({ role: "business", subscriptionPlan: "whatsapp_api", isGuidedDemo: true })
    ).toBe(false);
    expect(
      isWhatsAppApiPortalUser({ role: "business", subscriptionPlan: "whatsapp_api", isShowcaseDemo: true })
    ).toBe(false);
  });

  it("ignores complimentary WhatsApp-only module packages on other plans", () => {
    expect(
      isWhatsAppApiPortalUser({
        role: "business",
        subscriptionPlan: "monthly",
        enabledModules: ["dashboard", "whatsapp"],
      })
    ).toBe(false);
  });
});

describe("isWhatsAppApiPortalPathAllowed", () => {
  it("allows the WhatsApp API screens and billing", () => {
    for (const rest of [
      "/whatsapp",
      "/whatsapp/overview",
      "/whatsapp/connection",
      "/whatsapp/developers",
      "/whatsapp/templates",
      "/whatsapp/performance/overview",
      "/whatsapp/billing",
      "/whatsapp/meta-costs",
      "/billing",
    ]) {
      expect(isWhatsAppApiPortalPathAllowed(dash(rest))).toBe(true);
    }
  });

  it("blocks the business dashboard, CRM and other products", () => {
    for (const rest of [
      "",
      "/dashboard",
      "/dashboard/profile",
      "/crm",
      "/crm/leads",
      "/crm/appointments",
      "/website",
      "/automations",
      "/collab",
      "/global-club",
      "/BizUply",
      "/meta-campaigns/overview",
      "/build",
      "/help-center",
      "/whatsapp/messages/compose",
      "/whatsapp/inbox",
      "/whatsapp/lists",
    ]) {
      expect(isWhatsAppApiPortalPathAllowed(dash(rest))).toBe(false);
    }
  });
});

describe("resolvePostLoginDestination for WhatsApp API customers", () => {
  const apiUser = { role: "business", businessId: BIZ, hasAccess: true, subscriptionPlan: "whatsapp_api" };

  it("sends API-only customers straight to the portal", () => {
    expect(resolvePostLoginDestination(apiUser)).toBe(whatsappApiPortalHome(BIZ));
    expect(resolvePostLoginDestination({ ...apiUser, enabledModules: ["dashboard", "billing", "whatsapp"] })).toBe(
      dash("/whatsapp/overview")
    );
  });

  it("drops stale deep links into the business dashboard", () => {
    expect(resolvePostLoginDestination({ ...apiUser, storedRedirect: dash("/crm/leads") })).toBe(
      dash("/whatsapp/overview")
    );
    expect(resolvePostLoginDestination({ ...apiUser, storedRedirect: dash("/dashboard") })).toBe(
      dash("/whatsapp/overview")
    );
    expect(resolvePostLoginDestination({ ...apiUser, queryRedirect: "/dashboard" })).toBe(
      dash("/whatsapp/overview")
    );
  });

  it("keeps deep links that stay inside the portal", () => {
    expect(resolvePostLoginDestination({ ...apiUser, queryRedirect: dash("/whatsapp/developers") })).toBe(
      dash("/whatsapp/developers")
    );
  });

  it("does not change Business Plan, CRM-only, admin or partner destinations", () => {
    expect(
      resolvePostLoginDestination({ role: "business", businessId: BIZ, hasAccess: true, subscriptionPlan: "monthly" })
    ).toBe(dash());
    expect(
      resolvePostLoginDestination({
        role: "business",
        businessId: BIZ,
        hasAccess: true,
        subscriptionPlan: "crm_only",
        enabledModules: ["dashboard", "billing", "crm"],
      })
    ).toBe(dash());
    expect(
      resolvePostLoginDestination({
        role: "business",
        businessId: BIZ,
        hasAccess: true,
        subscriptionPlan: "monthly",
        storedRedirect: dash("/crm/leads"),
      })
    ).toBe(dash("/crm/leads"));
    expect(resolvePostLoginDestination({ role: "admin", subscriptionPlan: "whatsapp_api" })).toBe(
      "/admin/dashboard"
    );
    expect(resolvePostLoginDestination({ role: "partner", subscriptionPlan: "whatsapp_api" })).toBe(
      "/partner/dashboard"
    );
  });

  it("keeps the pricing gate for API customers without access", () => {
    expect(resolvePostLoginDestination({ ...apiUser, hasAccess: false })).toBe("/pricing");
  });
});
