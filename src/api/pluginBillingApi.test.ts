import { beforeEach, describe, expect, it, vi } from "vitest";

const post = vi.fn();

vi.mock("../api", () => ({
  default: {
    post: (...args: unknown[]) => post(...args),
  },
}));

describe("pluginBillingApi", () => {
  beforeEach(() => {
    vi.resetModules();
    post.mockReset();
    post.mockResolvedValue({
      data: {
        ok: true,
        url: "https://checkout.stripe.com/c/pay/cs_live_test",
        planKey: "countdown_monthly_15_ils",
        addonKey: "countdown",
        amountIls: 15,
        livemode: true,
      },
    });
    // @ts-expect-error test stub
    delete window.location;
    // @ts-expect-error test stub
    window.location = { assign: vi.fn() };
  });

  it("redirects unpaid addons to Stripe Checkout and reuses an in-flight request", async () => {
    const api = await import("./pluginBillingApi");
    const first = api.startPluginCheckout("countdown", "site1", "pro");
    const second = api.startPluginCheckout("countdown", "site1", "pro");
    const [a, b] = await Promise.all([first, second]);
    expect(post).toHaveBeenCalledTimes(1);
    expect(post.mock.calls[0][0]).toBe("/plugin-billing/checkout");
    expect(post.mock.calls[0][1]).toEqual({
      planKey: "countdown_monthly_15_ils",
      siteId: "site1",
    });
    expect(a.url).toContain("checkout.stripe.com");
    expect(b.url).toBe(a.url);
    expect(window.location.assign).toHaveBeenCalledWith(a.url);
  });

  it("uses Popup Pro when the pro tier is requested", async () => {
    const api = await import("./pluginBillingApi");
    expect(api.resolvePluginPlanKey("exit-popup", "pro")).toBe(
      "exit_popup_pro_monthly_29_ils"
    );
    expect(api.resolvePluginPlanKey("whatsapp-float", "pro")).toBe(
      "whatsapp_pro_monthly_29_ils"
    );
  });
});
