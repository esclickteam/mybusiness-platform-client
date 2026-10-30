import { describe, expect, it } from "vitest";
import {
  INTERNATIONAL_PARTNER_PLAN,
  INTERNATIONAL_PLAN_KEY,
  LEGACY_PLAN_KEYS,
  canOpenPartnerCenter,
  internationalAnnualFeeUsd,
  internationalOneTimeCommission,
  internationalRecurringCommission,
  isInternationalRegisterLock,
  mergeInternationalCatalogRow,
  plansForRegisterForm,
  requireInternationalPlanKey,
  resolvePartnerRegisterPlanKey,
  validateManualInternationalPayment,
} from "./partnerInternationalPlan";

const legacyCatalog = LEGACY_PLAN_KEYS.map((planKey) => ({
  planKey,
  nameHe: planKey,
  nameEn: planKey,
  setupIls: planKey === "partner_basic" ? 249 : 0,
  monthlyIls: planKey === "partner_basic" ? 149 : 0,
  softwareDiscountCap: 0,
  humanServiceDiscountCap: 0,
  aiDiscountCap: 0,
  partnerMarkupShare: planKey === "partner_basic" ? 0.75 : 0,
  additionalTeamUsers: 0,
  customDomainEligible: false,
  canHideBizuplyBranding: false,
})) as any;

describe("partner_international is additive", () => {
  it("does not reuse a legacy key and keeps $5000 / 30-35-40 / 10% with billing off", () => {
    expect(LEGACY_PLAN_KEYS.includes(INTERNATIONAL_PLAN_KEY as never)).toBe(false);
    expect(INTERNATIONAL_PARTNER_PLAN.annualUsd).toBe(5000);
    expect(INTERNATIONAL_PARTNER_PLAN.oneTimeSaleCommissionRate).toBe(0.1);
    expect(INTERNATIONAL_PARTNER_PLAN.recurringTiers?.map((row) => row.rate)).toEqual([0.3, 0.35, 0.4]);
    expect(INTERNATIONAL_PARTNER_PLAN.liveBillingEnabled).toBe(false);
    expect(internationalAnnualFeeUsd()).toEqual({
      amountUsd: 5000,
      chargedLive: false,
      liveBillingEnabled: false,
    });
  });

  it("rejects mismatched planKeys instead of coercing them", () => {
    expect(requireInternationalPlanKey("").ok).toBe(false);
    expect(requireInternationalPlanKey("partner_basic").ok).toBe(false);
    expect(requireInternationalPlanKey("partner_basic").error).toMatch(/partner_basic/);
    expect(requireInternationalPlanKey("partner_gold").ok).toBe(false);
    expect(requireInternationalPlanKey("partner_international").ok).toBe(true);

    const genericBasic = resolvePartnerRegisterPlanKey({
      requested: "partner_basic",
      lockedToInternational: false,
    });
    expect(genericBasic).toEqual({ ok: true, planKey: "partner_basic" });

    const lockedBasic = resolvePartnerRegisterPlanKey({
      requested: "partner_basic",
      lockedToInternational: true,
    });
    expect(lockedBasic.ok).toBe(false);
  });

  it("locks the international query without listing legacy radios", () => {
    expect(isInternationalRegisterLock("?planKey=partner_international")).toBe(true);
    expect(isInternationalRegisterLock("?planKey=partner_basic")).toBe(false);
    const generic = plansForRegisterForm(mergeInternationalCatalogRow(legacyCatalog), false);
    expect(generic.map((p) => p.planKey)).toEqual([...LEGACY_PLAN_KEYS]);
    const locked = plansForRegisterForm(mergeInternationalCatalogRow(legacyCatalog), true);
    expect(locked.map((p) => p.planKey)).toEqual([INTERNATIONAL_PLAN_KEY]);
  });

  it("does not mutate legacy catalog rows when merging international", () => {
    const before = JSON.stringify(legacyCatalog);
    const merged = mergeInternationalCatalogRow(legacyCatalog);
    expect(JSON.stringify(legacyCatalog)).toBe(before);
    expect(merged).toHaveLength(5);
    expect(merged[0].setupIls).toBe(249);
    expect(merged[0].monthlyIls).toBe(149);
    expect(merged[0].partnerMarkupShare).toBe(0.75);
  });

  it("computes agreement commissions without live charge", () => {
    expect(internationalRecurringCommission(1, 200)).toEqual({
      rate: 0.3,
      commissionUsd: 60,
      chargedLive: false,
    });
    expect(internationalRecurringCommission(20, 1000).rate).toBe(0.35);
    expect(internationalRecurringCommission(40, 1000).rate).toBe(0.4);
    expect(internationalOneTimeCommission(1000)).toEqual({
      rate: 0.1,
      commissionUsd: 100,
      chargedLive: false,
    });
  });

  it("opens Partner Center only after payment proof and an active agreement", () => {
    expect(
      canOpenPartnerCenter({
        role: "partner",
        status: "pending_setup",
        planKey: "partner_basic",
      }).ok
    ).toBe(true);
    expect(
      canOpenPartnerCenter({
        role: "partner",
        status: "pending_setup",
        planKey: INTERNATIONAL_PLAN_KEY,
        feeReady: false,
        agreementReady: false,
      }).ok
    ).toBe(false);
    expect(
      canOpenPartnerCenter({
        role: "partner",
        status: "active",
        planKey: INTERNATIONAL_PLAN_KEY,
        feeReady: false,
        agreementReady: true,
        permissions: ["view_clients"],
      }).reason
    ).toMatch(/not proof of payment/);
    expect(
      canOpenPartnerCenter({
        role: "partner",
        status: "payment_due",
        planKey: INTERNATIONAL_PLAN_KEY,
        feeReady: false,
        agreementReady: true,
        permissions: ["view_clients"],
      }).ok
    ).toBe(false);
    expect(
      canOpenPartnerCenter({
        role: "partner",
        status: "active",
        planKey: INTERNATIONAL_PLAN_KEY,
        feeReady: true,
        agreementReady: true,
        permissions: ["view_clients"],
      }).ok
    ).toBe(true);
    expect(canOpenPartnerCenter({ role: "customer", status: "active" }).ok).toBe(false);
  });

  it("requires amount, date, reference, and billing period before a manual payment", () => {
    expect(validateManualInternationalPayment({ amount: 5000 }).ok).toBe(false);
    expect(
      validateManualInternationalPayment({
        amount: 5000,
        paidAt: "2026-10-30",
        reference: "WIRE-1",
        periodStart: "2026-10-30",
        periodEnd: "2027-10-30",
      }).ok
    ).toBe(true);
  });
});
