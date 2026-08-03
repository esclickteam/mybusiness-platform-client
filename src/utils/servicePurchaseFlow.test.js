import { describe, expect, it } from "vitest";
import {
  buildServiceOrderPayload,
  createCheckoutLaunchSignature,
  createServiceCheckoutAttempt,
  getActivePricingPlan,
  getPurchaseModeNextStep,
  shouldPreservePendingServicePurchase,
} from "./servicePurchaseFlow";

describe("service purchase payload", () => {
  it("contains identifiers only and derives userId from authentication", () => {
    const payload = buildServiceOrderPayload(
      {
        serviceKey: "service",
        purchaseMode: "bundle",
        selectedPlanKey: "yearly",
        selectedAddOnKeys: ["addon"],
        quantities: { addon: 2 },
        userId: "stale",
        amount: 999,
        currency: "ILS",
        priceId: "price_123",
        billingInterval: "year",
      },
      { _id: "authenticated", businessId: "business" }
    );

    expect(payload).toEqual({
      serviceKey: "service",
      purchaseMode: "bundle",
      selectedPlanKey: "yearly",
      selectedAddOnKeys: ["addon"],
      quantities: { addon: 2 },
      businessId: "business",
      userId: "authenticated",
    });
  });

  it("rejects payload construction without an authenticated user", () => {
    expect(() =>
      buildServiceOrderPayload(
        { serviceKey: "service", purchaseMode: "standalone" },
        null
      )
    ).toThrow("AUTH_REQUIRED");
  });
});

describe("active plan detection", () => {
  it("accepts a known paid plan", () => {
    expect(
      getActivePricingPlan({
        subscriptionPlan: "monthly",
        paymentStatus: "paid",
      })?.key
    ).toBe("monthly");
  });

  it("rejects unknown, trial, expired-cancelled, and unpaid plans", () => {
    expect(
      getActivePricingPlan({
        subscriptionPlan: "enterprise",
        paymentStatus: "paid",
      })
    ).toBeNull();
    expect(
      getActivePricingPlan({
        subscriptionPlan: "trial",
        paymentStatus: "active",
      })
    ).toBeNull();
    expect(
      getActivePricingPlan({
        subscriptionPlan: "yearly",
        paymentStatus: "pending",
      })
    ).toBeNull();
    expect(
      getActivePricingPlan({
        subscriptionPlan: "website",
        paymentStatus: "paid",
        subscriptionCancelled: true,
        subscriptionEnd: "2020-01-01T00:00:00.000Z",
      })
    ).toBeNull();
  });

  it("keeps cancellation-scheduled access active until its period ends", () => {
    const futureEnd = new Date(Date.now() + 60_000).toISOString();

    expect(
      getActivePricingPlan({
        subscriptionPlan: "monthly",
        paymentStatus: "active",
        subscriptionCancelled: true,
        subscriptionEnd: futureEnd,
      })
    ).toMatchObject({ key: "monthly", nextRenewal: futureEnd });
    expect(
      getActivePricingPlan({
        subscriptionPlan: "yearly",
        hasPaid: true,
        cancel_at_period_end: true,
        currentPeriodEnd: futureEnd,
      })
    ).toMatchObject({ key: "yearly", nextRenewal: futureEnd });
  });

  it("does not resurrect a cancelled plan without paid or valid state", () => {
    expect(
      getActivePricingPlan({
        subscriptionPlan: "monthly",
        subscriptionStatus: "cancelled",
        subscriptionCancelled: true,
        subscriptionEnd: new Date(Date.now() + 60_000).toISOString(),
      })
    ).toBeNull();
  });
});

describe("purchase mode navigation", () => {
  it("skips plan selection for standalone and active-plan purchases", () => {
    expect(getPurchaseModeNextStep("standalone", null)).toBe("summary");
    expect(
      getPurchaseModeNextStep("bundle", { key: "monthly" })
    ).toBe("summary");
  });

  it("requires a plan when bundling without an active plan", () => {
    expect(getPurchaseModeNextStep("bundle", null)).toBe("plan");
  });
});

describe("sequential checkout continuation", () => {
  const restoredIntent = {
    serviceKey: "monthly_service",
    purchaseMode: "bundle",
    selectedPlanKey: "monthly",
    selectedAddOnKeys: ["addon"],
    quantities: { addon: 2 },
    returnPath: "/pricing",
    createdAt: 1_000,
  };

  it("uses the existing-plan sentinel without mutating persisted intent", () => {
    const attempt = createServiceCheckoutAttempt(restoredIntent, {
      automatic: true,
      activePlan: { key: "monthly" },
    });

    expect(attempt.isSequentialContinuation).toBe(true);
    expect(attempt.intent).toEqual({
      ...restoredIntent,
      purchaseMode: "bundle",
      selectedPlanKey: "existing",
    });
    expect(restoredIntent.selectedPlanKey).toBe("monthly");

    expect(
      buildServiceOrderPayload(attempt.intent, {
        _id: "authenticated",
        businessId: "business",
      })
    ).toMatchObject({
      purchaseMode: "bundle",
      selectedPlanKey: "existing",
      userId: "authenticated",
    });
  });

  it("does not transform before automatic active-plan confirmation", () => {
    expect(
      createServiceCheckoutAttempt(restoredIntent, {
        automatic: false,
        activePlan: { key: "monthly" },
      })
    ).toMatchObject({
      isSequentialContinuation: false,
      intent: { selectedPlanKey: "monthly" },
    });
    expect(
      createServiceCheckoutAttempt(restoredIntent, {
        automatic: true,
        activePlan: null,
      })
    ).toMatchObject({
      isSequentialContinuation: false,
      intent: { selectedPlanKey: "monthly" },
    });
  });

  it("completes the second call once a service checkout URL exists", () => {
    expect(
      shouldPreservePendingServicePurchase({
        response: { url: "https://checkout.test", nextStep: "ignored" },
        isSequentialContinuation: true,
        isNewPlan: true,
        serviceBilling: "recurring_month",
      })
    ).toBe(false);
  });

  it("preserves the first-call intent for a monthly service continuation", () => {
    expect(
      shouldPreservePendingServicePurchase({
        response: { url: "https://checkout.test" },
        isSequentialContinuation: false,
        isNewPlan: true,
        serviceBilling: "recurring_month",
      })
    ).toBe(true);
  });

  it("uses quantities and continuation mode in the launch signature", () => {
    const quantityOne = createCheckoutLaunchSignature(restoredIntent);
    const quantityThree = createCheckoutLaunchSignature({
      ...restoredIntent,
      quantities: { addon: 3 },
    });
    const continuation = createCheckoutLaunchSignature(restoredIntent, {
      automatic: true,
    });

    expect(quantityOne).not.toBe(quantityThree);
    expect(quantityOne).not.toBe(continuation);
  });
});
