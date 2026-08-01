/**
 * Host-aware sitemap.xml / robots.txt for customer sites.
 * Matcher is intentionally tiny so the SPA homepage is never touched.
 *
 * This is a Vite SPA on Vercel Routing Middleware (not Next.js), so we use
 * the standard Request/Response APIs — not request.nextUrl / NextResponse.
 */

const PUBLIC_SITE_DOMAIN =
  process.env.BIZUPLY_PUBLIC_SITE_DOMAIN || "sites.bizuply.com";

const MARKETING_HOSTS = new Set([
  "bizuply.com",
  "www.bizuply.com",
  "localhost",
]);

export const config = {
  matcher: ["/sitemap.xml", "/robots.txt"],
};

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

/** Vercel rewrite without depending on next/server. */
function rewrite(destinationUrl) {
  return new Response(null, {
    headers: {
      "x-middleware-rewrite": destinationUrl.toString(),
    },
  });
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const host = getHost(request);
  const isRobots = url.pathname === "/robots.txt";

  // Marketing site: serve the static files generated into /public
  if (!isCustomerSiteHost(host)) {
    const marketingPath = isRobots
      ? "/marketing-robots.txt"
      : "/marketing-sitemap.xml";
    return rewrite(new URL(marketingPath, request.url));
  }

  // Customer custom-domain / subdomain sites: proxy from API by host
  const endpoint = isRobots ? "robots.txt" : "sitemap.xml";
  const apiUrl =
    `https://api.bizuply.com/api/site-builder/public/by-host/${endpoint}` +
    `?host=${encodeURIComponent(host)}&_t=${Date.now()}`;

  try {
    const apiRes = await fetch(apiUrl, {
      headers: {
        accept: isRobots
          ? "text/plain,*/*"
          : "application/xml,text/xml,*/*",
      },
    });
    const body = await apiRes.text();

    return new Response(body, {
      status: apiRes.status,
      headers: {
        "content-type": isRobots
          ? "text/plain; charset=utf-8"
          : "application/xml; charset=utf-8",
        "cache-control": "public, max-age=0, must-revalidate",
        "x-bizuply-seo-source": "customer",
        "x-bizuply-seo-host": host,
      },
    });
  } catch {
    return new Response(
      isRobots
        ? "User-agent: *\nDisallow: /\n"
        : `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
      {
        status: 502,
        headers: {
          "content-type": isRobots
            ? "text/plain; charset=utf-8"
            : "application/xml; charset=utf-8",
        },
      },
    );
  }
}
