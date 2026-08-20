/**
 * Client-side helpers for plan entitlements attached on the user profile.
 * Missing/unknown entitlements -> treat as full access (legacy accounts).
 */

export function normalizeEntitlements(entitlements) {
  if (!entitlements || typeof entitlements !== "object") return null;
  return entitlements;
}

export function hasEntitlementRecord(entitlements) {
  const normalized = normalizeEntitlements(entitlements);
  return Boolean(normalized && Object.keys(normalized).length > 0);
}

/**
 * Mirror of server isFeatureAccessible for UI gating.
 * When entitlements are absent, allow (legacy full access).
 */
export function isFeatureAccessible(entitlements, featureKey) {
  const normalized = normalizeEntitlements(entitlements);
  if (!hasEntitlementRecord(normalized)) return true;
  const entry = normalized[featureKey];
  if (!entry || typeof entry !== "object") return false;
  if (entry.enabled) return true;
  const status = String(entry.status || "").toLowerCase();
  if (["canceled", "cancelled", "expired", "suspended", "revoked"].includes(status)) {
    return false;
  }
  return Boolean(entry.includedInPlan && !entry.comingSoon && !entry.requiresAddOn);
}
