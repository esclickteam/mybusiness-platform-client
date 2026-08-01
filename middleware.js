/**
 * Host-aware sitemap.xml / robots.txt for customer sites.
 * Matcher is intentionally tiny so the SPA homepage is never touched.
 *
 * This is a Vite SPA on Vercel Routing Middleware (not Next.js).
 * Use standard Request/URL/Response APIs only — never request.nextUrl
 * or next/server helpers.
 */

const PUBLIC_SITE_DOMAIN =
  process.env.BIZUPLY_PUBLIC_SITE_DOMAIN || "sites.bizuply.com";

const MARKETING_HOSTS = new Set([
  "bizuply.com",
  "www.bizuply.com",
  "localhost",
]);

const EMPTY_SITEMAP =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;

export const config = {
  matcher: ["/sitemap.xml", "/robots.txt"],
};

function getPathname(request) {
  try {
    return new URL(request.url).pathname;
  } catch {
    return "";
  }
}

function getHost(request) {
  const raw = String(
    request.headers.get("x-forwarded-host") ||
      request.headers.get("x-vercel-forwarded-host") ||
      request.headers.get("host") ||
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
  if (MARKETING_HOSTS.has(host) || host.endsWith(".vercel.app")) return false;
  return true;
}

function seoResponse(body, { isRobots, status = 200, source = "fallback" }) {
  return new Response(body, {
    status,
    headers: {
      "content-type": isRobots
        ? "text/plain; charset=utf-8"
        : "application/xml; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
      "x-bizuply-seo-source": source,
    },
  });
}

export default async function middleware(request) {
  const pathname = getPathname(request);
  const isRobots = pathname === "/robots.txt";

  try {
    const host = getHost(request);

    // Marketing site: proxy the static files from /public (copied to dist root)
    if (!isCustomerSiteHost(host)) {
      const marketingPath = isRobots
        ? "/marketing-robots.txt"
        : "/marketing-sitemap.xml";

      const assetRes = await fetch(new URL(marketingPath, request.url));
      const body = await assetRes.text();

      return seoResponse(body, {
        isRobots,
        status: assetRes.ok ? 200 : assetRes.status,
        source: "marketing",
      });
    }

    // Customer custom-domain / subdomain sites: fetch SEO docs from API by host
    const endpoint = isRobots ? "robots.txt" : "sitemap.xml";
    const apiUrl =
      `https://api.bizuply.com/api/site-builder/public/by-host/${endpoint}` +
      `?host=${encodeURIComponent(host)}&_t=${Date.now()}`;

    const apiRes = await fetch(apiUrl, {
      headers: {
        accept: isRobots
          ? "text/plain,*/*"
          : "application/xml,text/xml,*/*",
      },
    });
    const body = await apiRes.text();

    return seoResponse(body, {
      isRobots,
      status: apiRes.status,
      source: "customer",
    });
  } catch {
    // Never let an unhandled exception become MIDDLEWARE_INVOCATION_FAILED
    return seoResponse(
      isRobots ? "User-agent: *\nAllow: /\n" : EMPTY_SITEMAP,
      { isRobots, status: 200, source: "error-fallback" },
    );
  }
}
