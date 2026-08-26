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
  "sites",
  "sites-staging",
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
  const labels = prefix.split(".").filter(Boolean);
  if (labels.length !== 1) return false;
  const sub = labels[0];
  if (!sub || PARTNER_HOST_BLOCKLIST.has(sub)) return false;
  return true;
}

export function partnerHostAllowsPath(pathname) {
  const path = String(pathname || "").split("?")[0] || "/";
  if (path === "/" || path === "") return true;
  if (path === "/plans" || path.startsWith("/plans/")) return true;
  if (path === "/checkout/success" || path.startsWith("/checkout/success/")) return true;
  if (path.startsWith("/p/")) return true;
  if (path === "/login" || path.startsWith("/login/")) return true;
  if (path.startsWith("/forgot-password")) return true;
  if (path.startsWith("/reset-password")) return true;
  if (path.startsWith("/change-password")) return true;
  if (path.includes("/dashboard")) return true;
  if (path.startsWith("/admin")) return true;
  if (path.startsWith("/staff")) return true;
  if (path.startsWith("/client")) return true;
  if (path.includes("/messages")) return true;
  if (path.includes("/chat")) return true;
  if (path.startsWith("/partner/register")) return false;
  if (path.startsWith("/partner/")) return true;
  return false;
}

export function partnerHostDeniedRedirect(
  pathname,
  { entitled = false, slug = "" } = {}
) {
  if (partnerHostAllowsPath(pathname)) return "";
  if (entitled) return "/plans";
  const clean = String(slug || "").trim();
  if (clean) return `/p/${encodeURIComponent(clean)}/plans`;
  return "/";
}
