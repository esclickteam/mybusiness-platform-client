/**
 * GEO Intelligence host helpers.
 * Planned production host: geo.bizuply.com (internal admin-only).
 */

export function normalizeHostname(hostname) {
  return String(hostname || "")
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "");
}

export function isGeoIntelHost(hostname = "") {
  const host = normalizeHostname(hostname);
  return host === "geo.bizuply.com" || host === "www.geo.bizuply.com";
}

export function isGeoStagingBuild() {
  try {
    return String(import.meta.env?.VITE_GEO_STAGING || "") === "1";
  } catch {
    return false;
  }
}
