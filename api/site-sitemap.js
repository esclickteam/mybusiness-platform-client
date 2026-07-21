/**
 * Serves sitemap.xml per host:
 * - Customer sites (*.sites.bizuply.com / custom domains) → site-builder API
 * - Main BizUply app → marketing sitemap
 */

const API_BASE =
  "https://api.bizuply.com/api/site-builder/public/by-host/sitemap.xml";
const PUBLIC_SITE_DOMAIN =
  process.env.BIZUPLY_PUBLIC_SITE_DOMAIN || "sites.bizuply.com";
function getHost(req) {
  const raw = String(
    req.headers["x-forwarded-host"] ||
      req.headers["x-vercel-forwarded-host"] ||
      req.headers.host ||
      "",
  )
    .split(",")[0]
    .trim()
    .toLowerCase();
  return raw.split(":")[0];
}

function getMarketingSitemapUrl(req, host) {
  const proto = String(req.headers["x-forwarded-proto"] || "https")
    .split(",")[0]
    .trim();
  if (host) return `${proto}://${host}/marketing-sitemap.xml`;
  return "https://bizuply.com/marketing-sitemap.xml";
}

function isCustomerSiteHost(host) {
  if (!host) return false;
  if (host === PUBLIC_SITE_DOMAIN) return false;
  if (host.endsWith(`.${PUBLIC_SITE_DOMAIN}`)) return true;
  if (
    host === "bizuply.com" ||
    host === "www.bizuply.com" ||
    host === "localhost" ||
    host.endsWith(".vercel.app")
  ) {
    return false;
  }
  // Custom domain attached to a published customer site.
  return true;
}

export default async function handler(req, res) {
  try {
    if (req.method && req.method !== "GET" && req.method !== "HEAD") {
      res.statusCode = 405;
      res.end("Method Not Allowed");
      return;
    }

    const host = getHost(req);
    const apiUrl = isCustomerSiteHost(host)
      ? `${API_BASE}?host=${encodeURIComponent(host)}&_t=${Date.now()}`
      : getMarketingSitemapUrl(req, host);

    const apiRes = await fetch(apiUrl, {
      headers: { accept: "application/xml,text/xml,*/*" },
    });
    const body = await apiRes.text();

    res.statusCode = apiRes.status;
    res.setHeader("content-type", "application/xml; charset=utf-8");
    res.setHeader("cache-control", "public, max-age=0, must-revalidate");
    res.setHeader("x-bizuply-sitemap-host", host || "");
    res.setHeader(
      "x-bizuply-sitemap-source",
      isCustomerSiteHost(host) ? "customer" : "marketing",
    );

    if (req.method === "HEAD") {
      res.end();
      return;
    }

    res.end(body);
  } catch (error) {
    res.statusCode = 502;
    res.setHeader("content-type", "application/xml; charset=utf-8");
    res.end(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
    );
  }
}
