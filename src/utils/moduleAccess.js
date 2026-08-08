/**
 * Module ACL helpers for limited business accounts (marketer clients + plan entitlements).
 * null / empty enabledModules = full access (legacy).
 * When the server attaches derived modules from entitlements, treat as plan-limited.
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
  // aliases
  websites: "website",
  billing: "billing",
};

function isEntitlementAccessible(entitlements, featureKey) {
  if (!entitlements || typeof entitlements !== "object") return false;
  const entry = entitlements[featureKey];
  if (!entry) return false;
  if (entry.enabled) return true;
  return Boolean(
    entry.includedInPlan && !entry.comingSoon && !entry.requiresAddOn
  );
}

/**
 * Mirror of server deriveEnabledModulesFromEntitlements — client fallback
 * when /auth/me has entitlements but no enabledModules yet.
 */
export function deriveEnabledModulesFromEntitlements(entitlements) {
  if (!entitlements || typeof entitlements !== "object") return null;

  const modules = new Set(["dashboard", "billing"]);
  const business =
    isEntitlementAccessible(entitlements, "crm") ||
    isEntitlementAccessible(entitlements, "leads") ||
    isEntitlementAccessible(entitlements, "automations") ||
    isEntitlementAccessible(entitlements, "appointments") ||
    isEntitlementAccessible(entitlements, "collaborations");

  if (
    isEntitlementAccessible(entitlements, "crm") ||
    isEntitlementAccessible(entitlements, "leads")
  ) {
    modules.add("crm");
  }
  if (isEntitlementAccessible(entitlements, "automations")) {
    modules.add("automations");
  }
  if (isEntitlementAccessible(entitlements, "collaborations")) {
    modules.add("collab");
  }
  if (isEntitlementAccessible(entitlements, "aiAssistant")) {
    modules.add("BizUply");
  }
  if (isEntitlementAccessible(entitlements, "websiteBuilder")) {
    modules.add("website");
    modules.add("build");
  }
  if (business) {
    modules.add("build");
  }

  return Array.from(modules);
}

export function normalizeEnabledModules(enabledModules) {
  if (!Array.isArray(enabledModules) || enabledModules.length === 0) {
    return null;
  }
  return enabledModules.map((m) => String(m).trim()).filter(Boolean);
}

/**
 * Resolve dashboard ACL from user profile.
 * Prefer server-authored enabledModules; else derive from entitlements.
 */
export function resolveDashboardModules(user) {
  const fromAcl = normalizeEnabledModules(user?.enabledModules);
  if (fromAcl) return fromAcl;
  return normalizeEnabledModules(
    deriveEnabledModulesFromEntitlements(user?.entitlements)
  );
}

export function isPlanLimitedUser(user) {
  if (user?.planLimited) return true;
  return resolveDashboardModules(user) !== null;
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

  const moduleKey = NAV_PATH_MODULE_MAP[segment] || segment;
  return isModuleEnabled(enabledModules, moduleKey);
}

export function getDefaultDashboardPath(businessId, enabledModules) {
  const base = `/business/${businessId}/dashboard`;
  const normalized = normalizeEnabledModules(enabledModules);

  if (!normalized) return base;

  if (normalized.includes("crm")) return `${base}/crm`;
  if (normalized.includes("website")) return `${base}/website`;
  if (normalized.includes("meta-campaigns")) return `${base}/meta-campaigns`;
  return `${base}/${normalized[0]}`;
}
