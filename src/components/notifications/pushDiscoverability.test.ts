import { describe, expect, it } from "vitest";
import { getPushDiscoverabilityState } from "./pushDiscoverability";

describe("getPushDiscoverabilityState", () => {
  it("hides upsell when billing is disabled", () => {
    expect(
      getPushDiscoverabilityState({
        billingEnabled: false,
        entitled: false,
        subscription: null,
      })
    ).toEqual({ showUpsell: false, trialEligible: false });
  });

  it("shows trial-eligible upsell when unpaid with no trialUsedAt", () => {
    expect(
      getPushDiscoverabilityState({
        billingEnabled: true,
        entitled: false,
        subscription: null,
      })
    ).toEqual({ showUpsell: true, trialEligible: true });
  });

  it("shows paid upsell without free-trial badge when trial already used", () => {
    expect(
      getPushDiscoverabilityState({
        billingEnabled: true,
        entitled: false,
        subscription: {
          status: "canceled",
          planKey: "push_notifications_monthly_29_ils",
          cancelAtPeriodEnd: false,
          currentPeriodEnd: null,
          trialUsedAt: "2026-01-01T00:00:00.000Z",
        },
      })
    ).toEqual({ showUpsell: true, trialEligible: false });
  });

  it("hides upsell while trialing", () => {
    expect(
      getPushDiscoverabilityState({
        billingEnabled: true,
        entitled: true,
        subscription: {
          status: "trialing",
          planKey: "push_notifications_monthly_29_ils",
          cancelAtPeriodEnd: false,
          currentPeriodEnd: "2026-08-17T00:00:00.000Z",
          trialUsedAt: "2026-08-10T00:00:00.000Z",
        },
      })
    ).toEqual({ showUpsell: false, trialEligible: false });
  });

  it("hides upsell while active", () => {
    expect(
      getPushDiscoverabilityState({
        billingEnabled: true,
        entitled: true,
        subscription: {
          status: "active",
          planKey: "push_notifications_monthly_29_ils",
          cancelAtPeriodEnd: false,
          currentPeriodEnd: "2026-09-10T00:00:00.000Z",
          trialUsedAt: "2026-08-01T00:00:00.000Z",
        },
      })
    ).toEqual({ showUpsell: false, trialEligible: false });
  });

  it("hides acquisition upsell when cancel_at_period_end but still entitled", () => {
    expect(
      getPushDiscoverabilityState({
        billingEnabled: true,
        entitled: true,
        subscription: {
          status: "active",
          planKey: "push_notifications_monthly_29_ils",
          cancelAtPeriodEnd: true,
          currentPeriodEnd: "2026-09-10T00:00:00.000Z",
          trialUsedAt: "2026-08-01T00:00:00.000Z",
        },
      })
    ).toEqual({ showUpsell: false, trialEligible: false });
  });

  it("shows upsell again after entitlement becomes false", () => {
    expect(
      getPushDiscoverabilityState({
        billingEnabled: true,
        entitled: false,
        subscription: {
          status: "canceled",
          planKey: "push_notifications_monthly_29_ils",
          cancelAtPeriodEnd: false,
          currentPeriodEnd: "2026-08-01T00:00:00.000Z",
          trialUsedAt: "2026-07-01T00:00:00.000Z",
        },
      })
    ).toEqual({ showUpsell: true, trialEligible: false });
  });
});
