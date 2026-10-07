import { describe, expect, it } from "vitest";
import { portalSubscriptionState, type WhatsAppApiSubscriptionAccess } from "./whatsappApiPortal";

const END = "2026-11-04T00:00:00.000Z";
const GRACE = "2026-10-07T00:00:00.000Z";

function access(
  subscription: WhatsAppApiSubscriptionAccess["subscription"],
  reason = subscription?.reason || "no_subscription"
): WhatsAppApiSubscriptionAccess {
  return {
    allowed: Boolean(subscription?.active),
    via: subscription?.active ? "subscription" : null,
    reason: String(reason),
    subscription,
  };
}

describe("portalSubscriptionState", () => {
  it("reports an active, renewing subscription as active", () => {
    expect(
      portalSubscriptionState(
        access({ status: "active", active: true, reason: "active", currentPeriodEnd: END, cancelAtPeriodEnd: false })
      )
    ).toEqual({ state: "active", date: END });
  });

  it("never reports a cancelled subscription as fully active", () => {
    expect(
      portalSubscriptionState(
        access({
          status: "active",
          active: true,
          reason: "active_until_period_end",
          currentPeriodEnd: END,
          cancelAtPeriodEnd: true,
        })
      )
    ).toEqual({ state: "cancelsAtPeriodEnd", date: END });
    expect(
      portalSubscriptionState(
        access({ status: "active", active: true, reason: "active", currentPeriodEnd: END, cancelAtPeriodEnd: true })
      ).state
    ).toBe("cancelsAtPeriodEnd");
  });

  it("shows past-due subscriptions inside the grace period with the grace end date", () => {
    expect(
      portalSubscriptionState(
        access({ status: "past_due", active: true, reason: "payment_grace", currentPeriodEnd: END, graceEndsAt: GRACE })
      )
    ).toEqual({ state: "pastDueGrace", date: GRACE });
  });

  it("treats overdue, ended and expired subscriptions as expired", () => {
    for (const [status, reason] of [
      ["past_due", "payment_overdue"],
      ["active", "ended"],
      ["expired", "expired"],
      ["cancelled", "cancelled"],
    ]) {
      expect(
        portalSubscriptionState(access({ status, active: false, reason, currentPeriodEnd: END, cancelAtPeriodEnd: true }))
          .state
      ).toBe("expired");
    }
  });

  it("dates an expired subscription by when access actually ended", () => {
    const ENDED = "2026-10-07T09:37:54.497Z";
    const PAST = "2020-01-01T00:00:00.000Z";
    const expired = (extra: Partial<NonNullable<WhatsAppApiSubscriptionAccess["subscription"]>>) =>
      portalSubscriptionState(access({ status: "canceled", active: false, reason: "canceled", ...extra }));

    expect(expired({ currentPeriodEnd: END, endedAt: ENDED })).toEqual({ state: "expired", date: ENDED });
    expect(expired({ currentPeriodEnd: END })).toEqual({ state: "expired", date: null });
    expect(expired({ currentPeriodEnd: PAST })).toEqual({ state: "expired", date: PAST });
  });

  it("distinguishes no subscription from an unavailable status API", () => {
    expect(portalSubscriptionState(access(null)).state).toBe("none");
    expect(portalSubscriptionState(null).state).toBe("unknown");
  });
});
