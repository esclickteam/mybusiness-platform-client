/**
 * Invistimo Admin workspace identity (UI branding only).
 * Authorization must never key off this email — only businessId + role.
 */

export const INVISTIMO_BUSINESS_ID = "6a8df4e95c704a03773a9966";

export const INVISTIMO_ADMIN_LABEL = "Invistimo Admin";

export function isInvistimoAdminBusiness(businessId) {
  return String(businessId || "").trim() === INVISTIMO_BUSINESS_ID;
}

export function workspaceDisplayName({
  businessId,
  businessName,
  fallbackName,
} = {}) {
  if (isInvistimoAdminBusiness(businessId)) {
    return INVISTIMO_ADMIN_LABEL;
  }
  return String(businessName || fallbackName || "").trim();
}
