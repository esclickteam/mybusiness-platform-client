export type PushAuthUser = {
  role?: string | null;
  businessId?: string | null;
  managedBusinessId?: string | null;
};

export function readStoredPushAuthUser(): PushAuthUser | null {
  try {
    if (typeof localStorage === "undefined") return null;
    return JSON.parse(localStorage.getItem("businessDetails") || "null");
  } catch {
    return null;
  }
}

/**
 * Web Push subscribe + business notification-settings are tenant APIs.
 * - Admins may subscribe without a businessId (platform support PWA).
 * - Business users need businessId.
 * - Partners only while operating a managed client business (businessId /
 *   managedBusinessId on the session). Pure Partner dashboard sessions must
 *   never hit /business/my/notification-settings or /push/subscribe.
 */
export function canUseBusinessPushContext(
  user?: PushAuthUser | null
): boolean {
  if (!user) return false;

  const role = String(user.role || "");
  if (role === "admin") return true;

  const businessId = String(user.businessId || "").trim();
  if (role === "partner") {
    const managedId = String(user.managedBusinessId || "").trim();
    return Boolean(businessId || managedId);
  }

  return Boolean(businessId);
}
