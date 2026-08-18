/**
 * Stripe plugin/portal Checkout return detection.
 * Allows unpaid users to land on website manage only after a real billing return,
 * without permanently opening /dashboard/website to hasAccess=false accounts.
 */

export const PLUGIN_BILLING_RETURN_KEY = "bizuply:pluginBillingReturn";

export function readBillingReturnParam(search = "") {
  try {
    const params = new URLSearchParams(search || "");
    const portal = params.get("portalBilling");
    const plugin = params.get("pluginBilling");
    if (portal === "success" || portal === "cancel") return portal;
    if (plugin === "success" || plugin === "cancel") return plugin;
    return null;
  } catch {
    return null;
  }
}

export function isWebsiteDashboardPath(pathname = "") {
  return /^\/business\/[^/]+\/dashboard\/website(\/|$)/.test(
    String(pathname || "")
  );
}

export function markPluginBillingReturn() {
  try {
    sessionStorage.setItem(PLUGIN_BILLING_RETURN_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function clearPluginBillingReturn() {
  try {
    sessionStorage.removeItem(PLUGIN_BILLING_RETURN_KEY);
  } catch {
    /* ignore */
  }
}

export function hasPluginBillingReturnMarker() {
  try {
    return sessionStorage.getItem(PLUGIN_BILLING_RETURN_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * True only for a Stripe billing return (query) or the same tab after that return
 * while still on website dashboard routes (so param strip + refresh stay allowed).
 * Manual deep-links to /website without the marker must NOT pass.
 */
export function isAllowedPluginBillingReturn({ pathname, search } = {}) {
  const fromQuery = Boolean(readBillingReturnParam(search));
  if (fromQuery) {
    markPluginBillingReturn();
    return true;
  }
  return (
    hasPluginBillingReturnMarker() && isWebsiteDashboardPath(pathname)
  );
}