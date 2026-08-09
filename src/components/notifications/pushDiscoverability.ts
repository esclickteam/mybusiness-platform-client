import type { PushBillingStatus } from "../../api/pushBillingApi";

export type PushDiscoverabilityState = {
  showUpsell: boolean;
  trialEligible: boolean;
};

/**
 * Acquisition upsell appears only when Push billing is enforced and the
 * business is not currently entitled (trialing/active/soft-cancel window).
 * Soft-cancel with remaining entitlement must NOT show acquisition upsell.
 */
export function getPushDiscoverabilityState(
  status: Pick<PushBillingStatus, "billingEnabled" | "entitled" | "subscription"> | null | undefined
): PushDiscoverabilityState {
  if (!status || !status.billingEnabled) {
    return { showUpsell: false, trialEligible: false };
  }

  const trialEligible = !status.subscription?.trialUsedAt;
  const showUpsell = !status.entitled;

  return { showUpsell, trialEligible };
}
