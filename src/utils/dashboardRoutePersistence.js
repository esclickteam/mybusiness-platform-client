const STORAGE_PREFIX = "bizuply:lastDashboard:";

export function lastDashboardStorageKey(businessId) {
  return `${STORAGE_PREFIX}${businessId}`;
}

export function saveLastDashboardRoute(businessId, pathname, search = "") {
  if (!businessId || !pathname) return;

  const base = `/business/${businessId}/dashboard`;
  if (!pathname.startsWith(base)) return;

  // Don't persist bare dashboard entry — that IS the default after logout/login
  if (pathname === base || pathname === `${base}/`) return;

  try {
    sessionStorage.setItem(
      lastDashboardStorageKey(businessId),
      `${pathname}${search || ""}`
    );
  } catch {
    // ignore quota / private mode
  }
}

export function getLastDashboardRoute(businessId) {
  if (!businessId) return null;

  try {
    const saved = sessionStorage.getItem(lastDashboardStorageKey(businessId));
    if (!saved) return null;

    const base = `/business/${businessId}/dashboard`;
    if (!saved.startsWith(base)) return null;

    return saved;
  } catch {
    return null;
  }
}

export function clearLastDashboardRoute(businessId) {
  try {
    if (businessId) {
      sessionStorage.removeItem(lastDashboardStorageKey(businessId));
      return;
    }

    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        sessionStorage.removeItem(key);
      }
    });
  } catch {
    // ignore
  }
}

/**
 * Resolve where a business user should land after login / auth bootstrap.
 * Prefers the last dashboard route from this browser session.
 */
export function resolveBusinessDashboardPath(businessId, fallbackPath) {
  const saved = getLastDashboardRoute(businessId);
  if (saved) return saved;

  return (
    fallbackPath || `/business/${businessId}/dashboard`
  );
}
