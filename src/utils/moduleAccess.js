/**
 * Module ACL helpers for limited business accounts (e.g. marketer clients).
 * null / empty enabledModules = full access.
 */

export const MODULE_ROUTE_PREFIXES = {
  crm: "crm",
  automations: "automations",
  integrations: "integrations",
  "meta-campaigns": "meta-campaigns",
  whatsapp: "whatsapp",
  "social-schedule": "social-schedule",
  collab: "collab",
  BizUply: "BizUply",
  build: "build",
  website: "website",
  billing: "billing",
  dashboard: "dashboard",
};

/** Nav item `to` suffix after `/dashboard/` → module key */
export const NAV_PATH_MODULE_MAP = {
  dashboard: "dashboard",
  crm: "crm",
  automations: "automations",
  // Gmail/integrations belong to the automations module ACL
  integrations: "automations",
  whatsapp: "whatsapp",
  "meta-campaigns": "meta-campaigns",
  "social-schedule": "social-schedule",
  collab: "collab",
  BizUply: "BizUply",
  build: "build",
  website: "website",
  billing: "billing",
};

export function normalizeEnabledModules(enabledModules) {
  if (!Array.isArray(enabledModules) || enabledModules.length === 0) {
    return null;
  }
  return enabledModules.map((m) => String(m).trim()).filter(Boolean);
}

export function hasFullModuleAccess(enabledModules) {
  return normalizeEnabledModules(enabledModules) === null;
}

export function isModuleEnabled(enabledModules, moduleKey) {
  const normalized = normalizeEnabledModules(enabledModules);
  if (!normalized) return true;
  return normalized.includes(moduleKey);
}

/** Paid Automations require a Business-plan entitlement. */
export function isAutomationsAccessible(enabledModules, automationsAccessible) {
  if (automationsAccessible === false) return false;
  return isModuleEnabled(enabledModules, "automations");
}

/**
 * Complimentary / sold WhatsApp-only access: dashboard plus WhatsApp,
 * with no other product modules. Those accounts should not see the club.
 */
export function isWhatsappOnlyPackage(enabledModules) {
  const normalized = normalizeEnabledModules(enabledModules);
  if (!normalized) return false;
  const productModules = normalized.filter(
    (key) => key !== "dashboard" && key !== "help-center" && key !== "billing"
  );
  return (
    productModules.length > 0 &&
    productModules.every((key) => key === "whatsapp")
  );
}

/**
 * Extract first dashboard segment from a path like
 * `/business/:id/dashboard/crm/leads` → `crm`
 */
export function getDashboardModuleFromPath(pathname) {
  const match = String(pathname || "").match(
    /\/business\/[^/]+\/dashboard\/([^/?#]+)/
  );
  return match?.[1] || null;
}

export function isDashboardPathAllowed(
  pathname,
  enabledModules,
  { automationsAccessible } = {}
) {
  const segment = getDashboardModuleFromPath(pathname);
  const moduleKey = segment ? NAV_PATH_MODULE_MAP[segment] || segment : null;
  if (
    (moduleKey === "automations") &&
    automationsAccessible === false
  ) {
    return false;
  }

  if (hasFullModuleAccess(enabledModules)) return true;
  if (!segment) return true;

  // Help Center stays reachable for plan-limited business accounts.
  // The Club landing stays reachable too, except on a WhatsApp-only package.
  // Club content itself is gated by Club membership on the API.
  if (segment === "global-club" && !isWhatsappOnlyPackage(enabledModules)) {
    return true;
  }
  const alwaysAllowed = new Set(["help-center"]);
  if (alwaysAllowed.has(segment)) return true;

  return isModuleEnabled(enabledModules, moduleKey);
}

export function getDefaultDashboardPath(businessId, enabledModules) {
  const base = `/business/${businessId}/dashboard`;
  const normalized = normalizeEnabledModules(enabledModules);

  if (!normalized) return `${base}/dashboard`;

  // Prefer overview after login / bare /dashboard entry.
  if (normalized.includes("dashboard")) return `${base}/dashboard`;
  if (normalized.includes("website") && !normalized.includes("crm")) {
    return `${base}/website`;
  }
  if (normalized.includes("crm")) return `${base}/crm`;
  if (normalized.includes("meta-campaigns")) return `${base}/meta-campaigns/overview`;
  return `${base}/${normalized[0]}`;
}
