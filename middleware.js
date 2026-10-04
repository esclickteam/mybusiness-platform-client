/**
 * Host-aware SEO middleware for customer sites.
 *
 * - /sitemap.xml + /robots.txt: existing API proxy (unchanged behavior)
 * - HTML document navigations: edge <head> injection for all customer hosts
 *
 * Vite SPA on Vercel Routing Middleware (not Next.js).
 * Use standard Request/URL/Response APIs only — never request.nextUrl
 * or next/server helpers.
 *
 * Rollback: set BIZUPLY_SEO_EDGE_INJECTION=0
 * Optional narrow: BIZUPLY_SEO_EDGE_ALLOWLIST=host1,host2 (omit or "*" = 100%)
 */

import {
  TRAVEL_SEO_DESCRIPTION,
  TRAVEL_SEO_TITLE,
  isBizuplyTravelHost,
} from "./src/lib/travelHost.mjs";
import {
  WHATSAPP_NOT_FOUND_META,
  WHATSAPP_OG_IMAGE,
  WHATSAPP_PRODUCT_SCHEMA,
  WHATSAPP_SEO_KEYWORDS,
  buildWhatsAppSitemapXml,
  getWhatsAppPageMeta,
  isBizuplyWhatsAppHost,
  whatsappCanonicalUrl,
} from "./src/lib/whatsappHost.mjs";

const PUBLIC_SITE_DOMAIN =
  process.env.BIZUPLY_PUBLIC_SITE_DOMAIN || "sites.bizuply.com";
const STAGING_PUBLIC_SITE_DOMAIN = "sites-staging.bizuply.com";

const PRODUCTION_PUBLIC_API =
  "https://api.bizuply.com/api/site-builder/public";
const STAGING_PUBLIC_API =
  "https://server-staging-15bb.up.railway.app/api/site-builder/public";

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

const SEO_EDGE_ALLOWLIST_VALUES = String(
  process.env.BIZUPLY_SEO_EDGE_ALLOWLIST || "*",
)
  .split(",")
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean);

/** Empty / "*" => all customer hosts (100% rollout). */
const SEO_EDGE_ALLOWLIST_ALL =
  SEO_EDGE_ALLOWLIST_VALUES.length === 0 ||
  SEO_EDGE_ALLOWLIST_VALUES.includes("*");

const SEO_EDGE_ALLOWLIST = new Set(
  SEO_EDGE_ALLOWLIST_ALL ? [] : SEO_EDGE_ALLOWLIST_VALUES,
);

const SEO_HEAD_TIMEOUT_MS = Math.max(
  200,
  Number(process.env.BIZUPLY_SEO_EDGE_TIMEOUT_MS || 1200) || 1200,
);

export const config = {
  matcher: [
    "/sitemap.xml",
    "/robots.txt",
    /*
      Google Search Console HTML verification files at site root.
      Must be listed explicitly — the catch-all below skips extensions.
    */
    "/:googleFile(google[a-z0-9]+\\.html)",
    "/",
    /*
      Document navigations only — skip APIs, assets, and files with extensions.
      Marketing hosts still hit this matcher but are passed through untouched.
    */
    "/((?!api/|assets/|.*\\.[a-zA-Z0-9]+$).+)",
  ],
};

function isStagingCustomerHost(host) {
  if (!host) return false;
  return (
    host === STAGING_PUBLIC_SITE_DOMAIN ||
    host.endsWith(`.${STAGING_PUBLIC_SITE_DOMAIN}`)
  );
}

function publicSiteApiBase(host) {
  if (isStagingCustomerHost(host)) {
    return process.env.BIZUPLY_STAGING_PUBLIC_API || STAGING_PUBLIC_API;
  }
  return process.env.BIZUPLY_PRODUCTION_PUBLIC_API || PRODUCTION_PUBLIC_API;
}

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
  if (isBizuplyTravelHost(host) || isBizuplyWhatsAppHost(host)) return false;
  if (host === PUBLIC_SITE_DOMAIN || host === STAGING_PUBLIC_SITE_DOMAIN) return false;
  if (host.endsWith(`.${PUBLIC_SITE_DOMAIN}`)) return true;
  if (host.endsWith(`.${STAGING_PUBLIC_SITE_DOMAIN}`)) return true;
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
  if (SEO_EDGE_ALLOWLIST_ALL) return true;
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
      `${publicSiteApiBase(host)}/by-host/${endpoint}` +
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

function fallbackHtmlResponse(html, status, started, reason) {
  return new Response(html, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
      "x-bizuply-seo-edge": "fallback",
      "x-bizuply-seo-edge-reason": reason,
      "x-bizuply-seo-edge-ms": String(Date.now() - started),
    },
  });
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
      `${publicSiteApiBase(host)}/by-host/seo-head?host=${encodeURIComponent(host)}` +
      `&path=${encodeURIComponent(pathname)}&_t=${Date.now()}`;

    const htmlPromise = fetch(new URL("/index.html", request.url), {
      headers: {
        accept: "text/html",
        "x-bizuply-seo-middleware": "1",
      },
    });

    let seoRes = null;
    let seoReason = "empty";
    try {
      seoRes = await fetchWithTimeout(
        seoUrl,
        { headers: { accept: "application/json" } },
        SEO_HEAD_TIMEOUT_MS,
      );
    } catch {
      seoReason = "timeout";
    }

    const htmlRes = await htmlPromise;

    if (!htmlRes.ok) {
      return passThrough();
    }

    const html = await htmlRes.text();
    if (!html || !/<html[\s>]/i.test(html)) {
      return passThrough();
    }

    let headHtml = "";
    if (seoRes && seoRes.ok) {
      try {
        const payload = await seoRes.json();
        headHtml = String(payload?.headHtml || "").trim();
        if (!headHtml) seoReason = "empty";
      } catch {
        headHtml = "";
        seoReason = "parse";
      }
    } else if (seoRes && !seoRes.ok) {
      seoReason = `seo-${seoRes.status}`;
    }

    // Safe fallback: never break the SPA if SEO fetch/parse fails.
    if (!headHtml) {
      return fallbackHtmlResponse(html, htmlRes.status, started, seoReason);
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
    // Last resort: never return 500 from SEO middleware.
    return passThrough();
  }
}

function getGoogleHtmlVerificationFile(pathname) {
  const clean = String(pathname || "")
    .trim()
    .replace(/^\/+/, "")
    .toLowerCase();
  if (!/^google[a-z0-9]+\.html$/i.test(clean)) return "";
  return clean;
}

async function handleGoogleHtmlVerification(request, fileName) {
  const host = getHost(request);
  if (!isCustomerSiteHost(host)) {
    return passThrough();
  }

  try {
    const apiUrl =
      `${publicSiteApiBase(host)}/by-host/google-html` +
      `?host=${encodeURIComponent(host)}` +
      `&file=${encodeURIComponent(fileName)}` +
      `&_t=${Date.now()}`;
    const apiRes = await fetch(apiUrl, {
      headers: { accept: "text/html,*/*" },
    });
    const body = await apiRes.text();
    return new Response(body, {
      status: apiRes.status,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=0, must-revalidate",
        "x-bizuply-seo-source": "google-html",
      },
    });
  } catch {
    return new Response("Not found", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
}

function saasMarketplaceHeadHtml() {
  return [
    `<title>Launch Your Own SaaS Business | White Label Marketplace | Bizuply</title>`,
    `<meta name="description" content="Choose a ready-to-launch SaaS platform, preview the demo, and talk with Bizuply about partnership, white-label licensing, or an exclusive country license. No checkout on this page." />`,
    `<meta name="robots" content="noindex, follow" />`,
    `<meta name="googlebot" content="noindex, follow" />`,
  ].join("\n");
}

async function handleSaasMarketplaceDocument(request) {
  if (!isDocumentNavigation(request)) return passThrough();
  try {
    const htmlRes = await fetch(new URL("/index.html", request.url), {
      headers: {
        accept: "text/html",
        "x-bizuply-seo-middleware": "1",
      },
    });
    if (!htmlRes.ok) return passThrough();
    const html = await htmlRes.text();
    if (!html || !/<html[\s>]/i.test(html)) return passThrough();
    return new Response(injectSeoHead(html, saasMarketplaceHeadHtml()), {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=0, must-revalidate",
        "x-robots-tag": "noindex, follow",
        "x-bizuply-seo-edge": "saas-unlisted",
      },
    });
  } catch {
    return passThrough();
  }
}

function travelHeadHtml() {
  return [
    `<title>${TRAVEL_SEO_TITLE}</title>`,
    `<meta name="description" content="${TRAVEL_SEO_DESCRIPTION}" />`,
    `<meta name="robots" content="index, follow" />`,
    `<link rel="canonical" href="https://travel.bizuply.com/" />`,
    `<meta property="og:title" content="${TRAVEL_SEO_TITLE}" />`,
    `<meta property="og:description" content="${TRAVEL_SEO_DESCRIPTION}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="https://travel.bizuply.com/" />`,
    `<meta property="og:locale" content="en_US" />`,
  ].join("\n");
}

function travelSeoFile(pathname) {
  const isRobots = pathname === "/robots.txt";
  const body = isRobots
    ? "User-agent: *\nAllow: /\n\nSitemap: https://travel.bizuply.com/sitemap.xml\n"
    : `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://travel.bizuply.com/</loc></url>\n</urlset>\n`;
  return seoResponse(body, { isRobots, status: 200, source: "travel" });
}

function escapeHtmlAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function whatsappHeadHtml(pathname) {
  const page = getWhatsAppPageMeta(pathname);
  const title = escapeHtmlAttr(page?.title || WHATSAPP_NOT_FOUND_META.title);
  const description = escapeHtmlAttr(page?.description || WHATSAPP_NOT_FOUND_META.description);
  const canonical = page ? whatsappCanonicalUrl(pathname) : "";
  const image = escapeHtmlAttr(WHATSAPP_OG_IMAGE.url);
  const imageAlt = escapeHtmlAttr(WHATSAPP_OG_IMAGE.alt);
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta name="keywords" content="${escapeHtmlAttr(WHATSAPP_SEO_KEYWORDS)}" />`,
    `<meta name="robots" content="${page ? "index, follow" : "noindex, follow"}" />`,
    canonical ? `<link rel="canonical" href="${canonical}" />` : "",
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Bizuply WhatsApp API" />`,
    canonical ? `<meta property="og:url" content="${canonical}" />` : "",
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="${WHATSAPP_OG_IMAGE.width}" />`,
    `<meta property="og:image:height" content="${WHATSAPP_OG_IMAGE.height}" />`,
    `<meta property="og:image:alt" content="${imageAlt}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<link rel="icon" href="/favicon.ico" sizes="any" />`,
    `<link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />`,
    `<link rel="apple-touch-icon" href="/apple-touch-icon-v3.png" />`,
    page
      ? `<script id="wa-product-schema" type="application/ld+json">${JSON.stringify(WHATSAPP_PRODUCT_SCHEMA).replace(/</g, "\\u003c")}</script>`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function whatsappSeoFile(pathname) {
  const isRobots = pathname === "/robots.txt";
  const body = isRobots
    ? "User-agent: *\nAllow: /\n\nSitemap: https://whatsapp.bizuply.com/sitemap.xml\n"
    : buildWhatsAppSitemapXml();
  return seoResponse(body, { isRobots, status: 200, source: "whatsapp" });
}

async function handleWhatsAppDocument(request) {
  if (!isDocumentNavigation(request)) return passThrough();

  try {
    const htmlRes = await fetch(new URL("/index.html", request.url), {
      headers: {
        accept: "text/html",
        "x-bizuply-seo-middleware": "1",
      },
    });
    if (!htmlRes.ok) return passThrough();
    const html = await htmlRes.text();
    if (!html || !/<html[\s>]/i.test(html)) return passThrough();
    const pathname = getPathname(request);
    return new Response(injectSeoHead(html, whatsappHeadHtml(pathname)), {
      status: getWhatsAppPageMeta(pathname) ? 200 : 404,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=0, must-revalidate",
        "x-bizuply-seo-edge": "whatsapp",
      },
    });
  } catch {
    return passThrough();
  }
}

async function handleTravelDocument(request) {
  if (!isDocumentNavigation(request)) return passThrough();

  try {
    const htmlRes = await fetch(new URL("/index.html", request.url), {
      headers: {
        accept: "text/html",
        "x-bizuply-seo-middleware": "1",
      },
    });
    if (!htmlRes.ok) return passThrough();
    const html = await htmlRes.text();
    if (!html || !/<html[\s>]/i.test(html)) return passThrough();
    return new Response(injectSeoHead(html, travelHeadHtml()), {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=0, must-revalidate",
        "x-bizuply-seo-edge": "travel",
      },
    });
  } catch {
    return passThrough();
  }
}

export default async function middleware(request) {
  const host = getHost(request);
  const pathname = getPathname(request);

  if (isBizuplyWhatsAppHost(host)) {
    if (pathname === "/sitemap.xml" || pathname === "/robots.txt") {
      return whatsappSeoFile(pathname);
    }
    return handleWhatsAppDocument(request);
  }

  if (isBizuplyTravelHost(host)) {
    if (pathname === "/sitemap.xml" || pathname === "/robots.txt") {
      return travelSeoFile(pathname);
    }
    return handleTravelDocument(request);
  }

  if (pathname === "/sitemap.xml" || pathname === "/robots.txt") {
    return handleRobotsOrSitemap(request, pathname);
  }

  if (pathname === "/saas" || pathname.startsWith("/saas/")) {
    return handleSaasMarketplaceDocument(request);
  }

  const googleFile = getGoogleHtmlVerificationFile(pathname);
  if (googleFile) {
    return handleGoogleHtmlVerification(request, googleFile);
  }

  return handleHtmlSeoInjection(request);
}
