/**
 * Serves robots.txt per host:
 * - Customer sites → site-builder API
 * - Main BizUply app → marketing robots
 */

const API_BASE =
  "https://api.bizuply.com/api/site-builder/public/by-host/robots.txt";
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
  return true;
}

const MARKETING_ROBOTS = `User-agent: *
Allow: /

Sitemap: https://bizuply.com/sitemap.xml
`;

export default async function handler(req, res) {
  try {
    if (req.method && req.method !== "GET" && req.method !== "HEAD") {
      res.statusCode = 405;
      res.end("Method Not Allowed");
      return;
    }

    const host = getHost(req);
    let status = 200;
    let body = MARKETING_ROBOTS;
    let source = "marketing";

    if (isCustomerSiteHost(host)) {
      const apiUrl = `${API_BASE}?host=${encodeURIComponent(host)}&_t=${Date.now()}`;
      const apiRes = await fetch(apiUrl, {
        headers: { accept: "text/plain,*/*" },
      });
      status = apiRes.status;
      body = await apiRes.text();
      source = "customer";
    }

    res.statusCode = status;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.setHeader("cache-control", "public, max-age=0, must-revalidate");
    res.setHeader("x-bizuply-robots-host", host || "");
    res.setHeader("x-bizuply-robots-source", source);

    if (req.method === "HEAD") {
      res.end();
      return;
    }

    res.end(body);
  } catch {
    res.statusCode = 502;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.end("User-agent: *\nAllow: /\n");
  }
}
