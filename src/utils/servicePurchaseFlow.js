const ACTIVE_PLAN_KEYS = new Set(["monthly", "yearly", "website"]);
const PAID_STATUSES = new Set(["active", "paid", "valid"]);

export function getPurchaseModeNextStep(purchaseMode, activePlan) {
  if (purchaseMode === "standalone" || activePlan) return "summary";
  if (purchaseMode === "bundle") return "plan";
  return "mode";
}

export function createServiceCheckoutAttempt(
  intent,
  { automatic = false, activePlan = null } = {}
) {
  const isSequentialContinuation = Boolean(
    automatic && activePlan && intent?.purchaseMode === "bundle"
  );

  return {
    intent: isSequentialContinuation
      ? {
          ...intent,
          purchaseMode: "bundle",
          selectedPlanKey: "existing",
        }
      : { ...intent },
    isSequentialContinuation,
  };
}

export function createCheckoutLaunchSignature(
  intent,
  { automatic = false } = {}
) {
  return JSON.stringify([
    intent?.serviceKey || "",
    intent?.purchaseMode || null,
    intent?.selectedPlanKey || null,
    intent?.selectedAddOnKeys || [],
    intent?.quantities || {},
    automatic ? "continuation" : "manual",
  ]);
}

export function shouldPreservePendingServicePurchase({
  response,
  isSequentialContinuation = false,
  isNewPlan = false,
  serviceBilling,
}) {
  if (isSequentialContinuation) return false;
  return Boolean(
    response?.continuation ||
      response?.requiresContinuation ||
      response?.nextStep ||
      (isNewPlan && serviceBilling === "recurring_month")
  );
}

export function getActivePricingPlan(user) {
  if (!user || typeof user !== "object") return null;

  const key = [
    user.subscriptionPlan,
    user.currentPlan,
    user.plan,
    user.planKey,
  ]
    .map((value) => String(value || "").toLowerCase())
    .find((value) => ACTIVE_PLAN_KEYS.has(value));
  if (!key) return null;

  const statuses = [
    user.paymentStatus,
    user.subscriptionStatus,
    user.status,
  ].map((value) => String(value || "").toLowerCase());
  const paid =
    user.hasPaid === true ||
    user.isSubscriptionValid === true ||
    statuses.some((status) => PAID_STATUSES.has(status));
  if (!paid) return null;

  const accessEnd =
    user.subscriptionEnd || user.currentPeriodEnd || user.nextRenewal || null;
  const cancellationScheduled =
    user.subscriptionCancelled === true ||
    user.cancel_at_period_end === true ||
    user.cancelAtPeriodEnd === true;
  if (
    cancellationScheduled &&
    accessEnd &&
    new Date(accessEnd).getTime() <= Date.now()
  ) {
    return null;
  }

  return {
    key,
    name:
      user.subscriptionPlanName ||
      user.planName ||
      (key === "monthly"
        ? "חבילה עסקית חודשית"
        : key === "yearly"
          ? "חבילה עסקית שנתית"
          : "בניית אתר בלבד"),
    nextRenewal: accessEnd,
  };
}

export function buildServiceOrderPayload(intent, authenticatedUser) {
  const userId =
    authenticatedUser?._id ||
    authenticatedUser?.userId ||
    authenticatedUser?.id ||
    null;
  if (!userId) throw new Error("AUTH_REQUIRED");
  const selectedAddOnKeys = Array.isArray(intent?.selectedAddOnKeys)
    ? [...new Set(intent.selectedAddOnKeys.map(String).filter(Boolean))]
    : [];
  const selectedAddOnSet = new Set(selectedAddOnKeys);
  const quantities =
    intent?.quantities && typeof intent.quantities === "object"
      ? Object.fromEntries(
          Object.entries(intent.quantities)
            .filter(
              ([key, quantity]) =>
                selectedAddOnSet.has(key) &&
                Number.isFinite(Number(quantity))
            )
            .map(([key, quantity]) => [
              key,
              Math.max(1, Math.floor(Number(quantity))),
            ])
        )
      : {};

  return {
    serviceKey: String(intent?.serviceKey || ""),
    purchaseMode: intent?.purchaseMode,
    selectedPlanKey: intent?.selectedPlanKey || null,
    selectedAddOnKeys,
    quantities,
    businessId:
      authenticatedUser?.businessId || authenticatedUser?.business?._id || null,
    userId,
  };
}
