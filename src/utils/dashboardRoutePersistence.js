const STORAGE_PREFIX = "bizuply:lastDashboard:";

const AUTOMATION_SECTION_SEGMENTS = new Set([
  "templates",
  "runs",
  "connections",
  "ai-results",
]);

/**
 * The Automations menu and session restore always land on the list.
 * An open editor is not a menu destination.
 */
export function automationsListRoute(route) {
  if (!route || typeof route !== "string") return route;
  const hashIndex = route.indexOf("#");
  const withoutHash = hashIndex >= 0 ? route.slice(0, hashIndex) : route;
  const queryIndex = withoutHash.indexOf("?");
  const pathname = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
  const search = queryIndex >= 0 ? withoutHash.slice(queryIndex) : "";
  const match = pathname.match(/^(.*\/dashboard\/automations)(?:\/([^/]+))?\/?$/);
  if (!match) return route;
  const segment = match[2] || "";
  if (!segment || AUTOMATION_SECTION_SEGMENTS.has(segment)) {
    return `${pathname}${search}`;
  }
  return match[1];
}

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
      automationsListRoute(`${pathname}${search || ""}`)
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

    return automationsListRoute(saved);
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
