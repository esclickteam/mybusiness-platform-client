import { describe, expect, it } from "vitest";

import { resolveCheckoutProvider } from "../../../api/publicStoreApi";

describe("resolveCheckoutProvider", () => {
  it("prefers stripe/paypal when ready", () => {
    expect(
      resolveCheckoutProvider({
        providers: [],
        stripeReady: true,
        paypalReady: false,
        checkoutReady: true,
        primaryProvider: "stripe",
        currency: "ILS",
        storeName: "",
        isStoreActive: true,
      })
    ).toBe("stripe");
  });

  it("falls back to manual for staging TEST businesses", () => {
    expect(
      resolveCheckoutProvider({
        providers: [{ provider: "manual", label: "Manual", isPrimary: true }],
        stripeReady: false,
        paypalReady: false,
        manualReady: true,
        checkoutReady: true,
        primaryProvider: "manual",
        currency: "ILS",
        storeName: "",
        isStoreActive: true,
      })
    ).toBe("manual");
  });
});