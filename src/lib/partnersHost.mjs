/**
 * Bizuply Global Partners host helpers.
 * Planned production host: partners.bizuply.com (internal owner-only, Hebrew RTL).
 * Distinct from white-label `{slug}.bizuply.com` partner storefronts.
 */

export function normalizeHostname(hostname) {
  return String(hostname || "")
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "");
}

export function isGlobalPartnersHost(hostname = "") {
  const host = normalizeHostname(hostname);
  return host === "partners.bizuply.com" || host === "www.partners.bizuply.com";
}

export function isGlobalPartnersStagingBuild() {
  try {
    return String(import.meta.env?.VITE_GLOBAL_PARTNERS_STAGING || "") === "1";
  } catch {
    return false;
  }
}
