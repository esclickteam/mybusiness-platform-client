import { afterEach, describe, expect, it } from "vitest";
import {
  businessNoAccessPath,
  isLoginPath,
  isWhatsAppApiPortalDashboardPath,
  isWhatsAppApiPortalPathAllowed,
  isWhatsAppApiPortalUser,
  legacyWhatsAppApiLoginRedirect,
  loginPathForBrowser,
  rememberLoginProduct,
  WHATSAPP_API_LOGIN_PATH,
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

  it("sends expired API customers to the portal billing page, not Business Plan pricing", () => {
    const lapsed = { ...apiUser, hasAccess: false };
    expect(resolvePostLoginDestination(lapsed)).toBe(dash("/whatsapp/billing"));
    expect(resolvePostLoginDestination({ ...lapsed, storedRedirect: "/pricing" })).toBe(dash("/whatsapp/billing"));
    expect(resolvePostLoginDestination({ ...lapsed, storedRedirect: dash("/crm/leads") })).toBe(
      dash("/whatsapp/billing")
    );
    expect(resolvePostLoginDestination({ ...lapsed, queryRedirect: dash("/whatsapp/overview") })).toBe(
      dash("/whatsapp/overview")
    );
  });

  it("keeps the pricing gate for every other account without access", () => {
    for (const subscriptionPlan of ["monthly", "crm_only", "trial", "free"]) {
      expect(resolvePostLoginDestination({ role: "business", businessId: BIZ, hasAccess: false, subscriptionPlan })).toBe(
        "/pricing"
      );
    }
  });
});

describe("no-access landing", () => {
  it("routes lapsed API accounts to their portal billing page and everyone else to pricing", () => {
    expect(businessNoAccessPath({ role: "business", businessId: BIZ, subscriptionPlan: "whatsapp_api" })).toBe(
      dash("/whatsapp/billing")
    );
    expect(businessNoAccessPath({ role: "business", businessId: BIZ, subscriptionPlan: "monthly" })).toBe("/pricing");
    expect(businessNoAccessPath({ role: "business", subscriptionPlan: "whatsapp_api" })).toBe("/pricing");
    expect(businessNoAccessPath(null)).toBe("/pricing");
  });

  it("lets lapsed API accounts stay only on portal screens inside the dashboard", () => {
    for (const rest of ["/whatsapp/overview", "/whatsapp/billing", "/whatsapp/connection", "/billing"]) {
      expect(isWhatsAppApiPortalDashboardPath(dash(rest))).toBe(true);
    }
    for (const path of [dash(""), dash("/crm/leads"), dash("/whatsapp/inbox"), `/business/${BIZ}`, "/pricing", "/dashboard"]) {
      expect(isWhatsAppApiPortalDashboardPath(path)).toBe(false);
    }
  });
});

describe("product login", () => {
  afterEach(() => localStorage.clear());

  it("moves old WhatsApp API login links to /whatsapp-api/login, keeping the rest of the query", () => {
    expect(legacyWhatsAppApiLoginRedirect("?product=whatsapp_api")).toBe("/whatsapp-api/login");
    expect(legacyWhatsAppApiLoginRedirect("?product=whatsapp_api&oauth=success")).toBe("/whatsapp-api/login?oauth=success");
    expect(legacyWhatsAppApiLoginRedirect("?product=whatsapp_api&oauth_error=no_account&provider=google")).toBe(
      "/whatsapp-api/login?oauth_error=no_account&provider=google"
    );
    expect(legacyWhatsAppApiLoginRedirect("?product=whatsapp_api&checkout=whatsapp_api&email=a%40b.c&ref=1")).toBe(
      "/whatsapp-api/login?checkout=whatsapp_api&email=a%40b.c&ref=1"
    );
    expect(legacyWhatsAppApiLoginRedirect("?checkout=whatsapp_api&email=a%40b.c&ref=1")).toBe(
      "/whatsapp-api/login?checkout=whatsapp_api&email=a%40b.c&ref=1"
    );
  });

  it("never turns a plain /login into the WhatsApp API login, even after a WhatsApp API session", () => {
    rememberLoginProduct({ role: "business", subscriptionPlan: "whatsapp_api" });
    for (const search of ["", "?product=business", "?checkout=success", "?redirect=/pricing", "?lang=he"]) {
      expect(legacyWhatsAppApiLoginRedirect(search)).toBeNull();
    }
  });

  it("an expired WhatsApp API session returns to the WhatsApp API login; everyone else to /login", () => {
    expect(loginPathForBrowser()).toBe("/login");
    rememberLoginProduct({ role: "business", subscriptionPlan: "whatsapp_api" });
    expect(loginPathForBrowser()).toBe(WHATSAPP_API_LOGIN_PATH);
    for (const user of [
      { role: "business", subscriptionPlan: "monthly" },
      { role: "business", subscriptionPlan: "crm_only" },
      { role: "admin" },
      { role: "partner" },
    ]) {
      rememberLoginProduct({ role: "business", subscriptionPlan: "whatsapp_api" });
      rememberLoginProduct(user);
      expect(loginPathForBrowser()).toBe("/login");
    }
  });

  it("recognises both login pages", () => {
    expect(isLoginPath("/login")).toBe(true);
    expect(isLoginPath("/whatsapp-api/login")).toBe(true);
    expect(isLoginPath("/whatsapp-api")).toBe(false);
    expect(isLoginPath("/register")).toBe(false);
  });
});

