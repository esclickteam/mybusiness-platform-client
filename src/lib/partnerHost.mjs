const PARTNER_HOST_BLOCKLIST = new Set([
  "www",
  "api",
  "admin",
  "app",
  "login",
  "auth",
  "support",
  "billing",
  "partner",
  "partners",
  "demo",
  "staging",
  "dev",
  "mail",
  "cdn",
  "static",
  "assets",
  "status",
  "docs",
]);

export function isPartnerWhiteLabelHostname(hostname) {
  const host = String(hostname || "")
    .toLowerCase()
    .trim()
    .split(":")[0];
  if (!host) return false;
  if (host.endsWith(".sites.bizuply.com") || host.endsWith(".sites-staging.bizuply.com")) {
    return false;
  }
  let prefix = "";
  if (host.endsWith(".bizuply.co.il")) {
    prefix = host.slice(0, -".bizuply.co.il".length);
  } else if (host.endsWith(".bizuply.com")) {
    prefix = host.slice(0, -".bizuply.com".length);
  } else {
    return false;
  }
  const sub = prefix.split(".").filter(Boolean)[0] || "";
  if (!sub || PARTNER_HOST_BLOCKLIST.has(sub)) return false;
  return true;
}
