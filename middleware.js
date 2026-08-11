/**
 * Host-aware SEO middleware for customer sites.
 *
 * - /sitemap.xml + /robots.txt: existing API proxy (unchanged behavior)
 * - HTML document navigations: optional edge <head> injection (Phase 1 allowlist)
 *
 * Vite SPA on Vercel Routing Middleware (not Next.js).
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

const SEO_EDGE_ENABLED =
  String(process.env.BIZUPLY_SEO_EDGE_INJECTION || "1").trim() !== "0";

const SEO_EDGE_ALLOWLIST = new Set(
  String(
    process.env.BIZUPLY_SEO_EDGE_ALLOWLIST ||
      "launchgateb12.sites.bizuply.com",
  )
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean),
);

const SEO_HEAD_TIMEOUT_MS = Math.max(
  200,
  Number(process.env.BIZUPLY_SEO_EDGE_TIMEOUT_MS || 1200) || 1200,
);

const API_SEO_HEAD =
  "https://api.bizuply.com/api/site-builder/public/by-host/seo-head";

export const config = {
  matcher: [
    "/sitemap.xml",
    "/robots.txt",
    "/",
    /*
      Document navigations only — skip APIs, assets, and files with extensions.
      Marketing hosts still hit this matcher but are passed through untouched.
    */
    "/((?!api/|assets/|.*\\.[a-zA-Z0-9]+$).+)",
  ],
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

function passThrough() {
  return new Response(null, {
    headers: {
      "x-middleware-next": "1",
    },
  });
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

function isDocumentNavigation(request) {
  if (request.method !== "GET" && request.method !== "HEAD") return false;
  const accept = String(request.headers.get("accept") || "").toLowerCase();
  if (!accept) return true;
  if (accept.includes("text/html")) return true;
  if (accept.includes("application/xhtml+xml")) return true;
  // Prefetch / some crawlers send */*
  if (accept.includes("*/*") && !accept.includes("application/json")) return true;
  return false;
}

function shouldInjectHtmlSeo(host) {
  if (!SEO_EDGE_ENABLED) return false;
  if (!isCustomerSiteHost(host)) return false;
  return SEO_EDGE_ALLOWLIST.has(host);
}

async function fetchWithTimeout(url, options = {}, timeoutMs = SEO_HEAD_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function stripShellSeoTags(html) {
  let next = String(html || "");

  // Remove existing BizUply shell SEO / social / schema / icons that would duplicate.
  next = next.replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, "");
  next = next.replace(
    /<meta\b[^>]*\bname=["']description["'][^>]*>/gi,
    "",
  );
  next = next.replace(/<meta\b[^>]*\bname=["']keywords["'][^>]*>/gi, "");
  next = next.replace(/<meta\b[^>]*\bname=["']author["'][^>]*>/gi, "");
  next = next.replace(/<meta\b[^>]*\bname=["']robots["'][^>]*>/gi, "");
  next = next.replace(
    /<meta\b[^>]*\bname=["']google-site-verification["'][^>]*>/gi,
    "",
  );
  next = next.replace(
    /<meta\b[^>]*\bname=["']facebook-domain-verification["'][^>]*>/gi,
    "",
  );
  next = next.replace(/<meta\b[^>]*\bproperty=["']og:[^"']+["'][^>]*>/gi, "");
  next = next.replace(/<meta\b[^>]*\bname=["']twitter:[^"']+["'][^>]*>/gi, "");
  next = next.replace(/<link\b[^>]*\brel=["']canonical["'][^>]*>/gi, "");
  next = next.replace(
    /<link\b[^>]*\brel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*>/gi,
    "",
  );
  next = next.replace(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,
    "",
  );
  next = next.replace(/<meta\b[^>]*\bdata-bizuply-edge-seo=["']1["'][^>]*>/gi, "");

  return next;
}

function injectSeoHead(html, headHtml) {
  const clean = stripShellSeoTags(html);
  const block =
    `\n<!-- bizuply-edge-seo -->\n${headHtml}\n<!-- /bizuply-edge-seo -->\n`;

  if (/<head\b[^>]*>/i.test(clean)) {
    return clean.replace(/<head\b[^>]*>/i, (match) => `${match}${block}`);
  }
  if (/<\/head>/i.test(clean)) {
    return clean.replace(/<\/head>/i, `${block}</head>`);
  }
  return `${block}${clean}`;
}

async function handleRobotsOrSitemap(request, pathname) {
  const isRobots = pathname === "/robots.txt";
  const host = getHost(request);

  try {
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
    return seoResponse(
      isRobots ? "User-agent: *\nAllow: /\n" : EMPTY_SITEMAP,
      { isRobots, status: 200, source: "error-fallback" },
    );
  }
}

async function handleHtmlSeoInjection(request) {
  const host = getHost(request);
  if (!shouldInjectHtmlSeo(host)) {
    return passThrough();
  }

  if (!isDocumentNavigation(request)) {
    return passThrough();
  }

  const pathname = getPathname(request) || "/";
  const started = Date.now();

  try {
    const seoUrl =
      `${API_SEO_HEAD}?host=${encodeURIComponent(host)}` +
      `&path=${encodeURIComponent(pathname)}&_t=${Date.now()}`;

    const seoPromise = fetchWithTimeout(
      seoUrl,
      { headers: { accept: "application/json" } },
      SEO_HEAD_TIMEOUT_MS,
    );

    const htmlPromise = fetch(new URL("/index.html", request.url), {
      headers: {
        accept: "text/html",
        "x-bizuply-seo-middleware": "1",
      },
    });

    const [seoRes, htmlRes] = await Promise.all([seoPromise, htmlPromise]);

    if (!htmlRes.ok) {
      return passThrough();
    }

    const html = await htmlRes.text();
    if (!html || !/<html[\s>]/i.test(html)) {
      return passThrough();
    }

    let headHtml = "";
    if (seoRes.ok) {
      try {
        const payload = await seoRes.json();
        headHtml = String(payload?.headHtml || "").trim();
      } catch {
        headHtml = "";
      }
    }

    // Safe fallback: never break the SPA if SEO fetch/parse fails.
    if (!headHtml) {
      const response = new Response(html, {
        status: htmlRes.status,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "public, max-age=0, must-revalidate",
          "x-bizuply-seo-edge": "fallback",
          "x-bizuply-seo-edge-ms": String(Date.now() - started),
        },
      });
      return response;
    }

    const injected = injectSeoHead(html, headHtml);
    return new Response(injected, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=0, must-revalidate",
        "x-bizuply-seo-edge": "injected",
        "x-bizuply-seo-edge-host": host,
        "x-bizuply-seo-edge-ms": String(Date.now() - started),
      },
    });
  } catch {
    return passThrough();
  }
}

export default async function middleware(request) {
  const pathname = getPathname(request);

  if (pathname === "/sitemap.xml" || pathname === "/robots.txt") {
    return handleRobotsOrSitemap(request, pathname);
  }

  return handleHtmlSeoInjection(request);
}
