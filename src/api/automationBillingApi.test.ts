import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const post = vi.fn();
const get = vi.fn();

vi.mock("./automationPreviewGuard", () => ({
  assertAutomationWritesAllowed: vi.fn(),
  isAutomationsReadOnly: () => false,
  AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE: "blocked",
  AUTOMATION_PREVIEW_ACTION_TOOLTIP: "tooltip",
}));

vi.mock("../api", () => ({
  default: {
    get: (...args: unknown[]) => get(...args),
    post: (...args: unknown[]) => post(...args),
  },
}));

describe("automationBillingApi", () => {
  beforeEach(() => {
    vi.resetModules();
    post.mockReset();
    get.mockReset();
    post.mockResolvedValue({
      data: {
        ok: true,
        url: "https://checkout.stripe.test/s",
        planKey: "automation_basic_39_ils",
      },
    });
    get.mockResolvedValue({
      data: {
        success: true,
        billingEnabled: true,
        exempt: false,
        plan: null,
        usage: null,
        subscription: {
          cancelAtPeriodEnd: false,
          pendingDowngradePlanKey: null,
          paymentGraceEndsAt: null,
        },
        canPublish: false,
        canExecute: false,
        blockReason: null,
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("createAutomationPlanCheckout only posts { planKey }", async () => {
    const api = await import("./automationBillingApi");
    await api.createAutomationPlanCheckout(
      "biz-1",
      api.AUTOMATION_PLAN_KEYS.BASIC
    );
    expect(post).toHaveBeenCalledTimes(1);
    const [url, body, config] = post.mock.calls[0];
    expect(url).toBe("/automations/billing/checkout");
    expect(body).toEqual({ planKey: api.AUTOMATION_PLAN_KEYS.BASIC });
    expect(body).not.toHaveProperty("priceId");
    expect(body).not.toHaveProperty("amount");
    expect(config).toEqual({ params: { businessId: "biz-1" } });
  });

  it("fake frontend price ID cannot influence checkout request body", async () => {
    const api = await import("./automationBillingApi");
    // Even if a caller somehow passes extra junk, the public API signature only
    // accepts planKey — assert the posted body stays planKey-only.
    await api.createAutomationPlanCheckout(
      "biz-1",
      "automation_growth_79_ils"
    );
    const body = post.mock.calls[0][1] as Record<string, unknown>;
    expect(Object.keys(body)).toEqual(["planKey"]);
    expect(body.planKey).toBe("automation_growth_79_ils");
    expect(JSON.stringify(body)).not.toContain("price_");
    expect(JSON.stringify(body)).not.toContain("priceId");
  });

  it("changeAutomationPlan posts planKey to change-plan", async () => {
    post.mockResolvedValue({
      data: { ok: true, action: "upgraded", planKey: "automation_growth_79_ils" },
    });
    const api = await import("./automationBillingApi");
    await api.changeAutomationPlan("biz-1", api.AUTOMATION_PLAN_KEYS.GROWTH);
    expect(post).toHaveBeenCalledWith(
      "/automations/billing/change-plan",
      { planKey: api.AUTOMATION_PLAN_KEYS.GROWTH },
      { params: { businessId: "biz-1" } }
    );
  });

  it("PLAN_REQUIRED handling via readAutomationBillingErrorCode helper", async () => {
    const api = await import("./automationBillingApi");
    const code = api.readAutomationBillingErrorCode({
      response: { data: { code: api.AUTOMATION_BILLING_API_CODES.PLAN_REQUIRED } },
    });
    expect(code).toBe("AUTOMATION_PLAN_REQUIRED");
    expect(api.isAutomationBillingGateCode(code)).toBe(true);
  });

  it("readAutomationBillingErrorCode returns null for non-API errors", async () => {
    const api = await import("./automationBillingApi");
    expect(api.readAutomationBillingErrorCode(null)).toBeNull();
    expect(api.readAutomationBillingErrorCode(new Error("x"))).toBeNull();
    expect(api.readAutomationBillingErrorCode({ response: { data: {} } })).toBeNull();
  });

  it("getAutomationBillingUsage strips success envelope", async () => {
    const api = await import("./automationBillingApi");
    const overview = await api.getAutomationBillingUsage("biz-1");
    expect(get).toHaveBeenCalledWith("/automations/billing/usage", {
      params: { businessId: "biz-1" },
    });
    expect(overview).not.toHaveProperty("success");
    expect(overview.billingEnabled).toBe(true);
  });

  it("hasActiveAutomationPlan respects billing/exempt/plan", async () => {
    const api = await import("./automationBillingApi");
    expect(api.hasActiveAutomationPlan(null)).toBe(false);
    expect(api.hasActiveAutomationPlan({
      billingEnabled: false, exempt: false, plan: null, usage: null,
      subscription: { cancelAtPeriodEnd: false, pendingDowngradePlanKey: null, paymentGraceEndsAt: null },
      canPublish: true, canExecute: true, blockReason: null,
    })).toBe(true);
    expect(api.hasActiveAutomationPlan({
      billingEnabled: true, exempt: true, plan: null, usage: null,
      subscription: { cancelAtPeriodEnd: false, pendingDowngradePlanKey: null, paymentGraceEndsAt: null },
      canPublish: true, canExecute: true, blockReason: null,
    })).toBe(true);
    expect(api.hasActiveAutomationPlan({
      billingEnabled: true, exempt: false, plan: null, usage: null,
      subscription: { cancelAtPeriodEnd: false, pendingDowngradePlanKey: null, paymentGraceEndsAt: null },
      canPublish: false, canExecute: false, blockReason: "AUTOMATION_PLAN_REQUIRED",
    })).toBe(false);
    expect(api.hasActiveAutomationPlan({
      billingEnabled: true, exempt: false,
      plan: { key: "automation_basic_39_ils", name: "Basic", status: "active", priceIls: 39, executionLimit: 100 },
      usage: null,
      subscription: { cancelAtPeriodEnd: false, pendingDowngradePlanKey: null, paymentGraceEndsAt: null },
      canPublish: true, canExecute: true, blockReason: null,
    })).toBe(true);
  });
});
