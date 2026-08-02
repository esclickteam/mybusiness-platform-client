/**
 * Module ACL helpers for limited business accounts (e.g. marketer clients).
 * null / empty enabledModules = full access.
 */

export const MODULE_ROUTE_PREFIXES = {
  crm: "crm",
  automations: "automations",
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

export function isDashboardPathAllowed(pathname, enabledModules) {
  if (hasFullModuleAccess(enabledModules)) return true;

  const segment = getDashboardModuleFromPath(pathname);
  if (!segment) return true;

  // Always allow help-center as a soft landing is not required; block it for limited accounts
  const moduleKey = NAV_PATH_MODULE_MAP[segment] || segment;
  const alwaysAllowed = new Set([]); // keep strict: only enabled modules
  if (alwaysAllowed.has(segment)) return true;

  return isModuleEnabled(enabledModules, moduleKey);
}

export function getDefaultDashboardPath(businessId, enabledModules) {
  const base = `/business/${businessId}/dashboard`;
  const normalized = normalizeEnabledModules(enabledModules);

  if (!normalized) return base;

  if (normalized.includes("crm")) return `${base}/crm`;
  if (normalized.includes("meta-campaigns")) return `${base}/meta-campaigns`;
  return `${base}/${normalized[0]}`;
}
