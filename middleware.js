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
  WHATSAPP_LOGIN_APP_URL,
  WHATSAPP_NOT_FOUND_META,
  WHATSAPP_OG_IMAGE,
  WHATSAPP_PRODUCT_SCHEMA,
  WHATSAPP_SEO_KEYWORDS,
  buildWhatsAppSitemapXml,
  getWhatsAppPageMeta,
  isBizuplyWhatsAppHost,
  normalizeWhatsAppPath,
  whatsappCanonicalUrl,
  whatsappHomepagePrerender,
} from "./src/lib/whatsappHost.mjs";
import {
  buildMarketingDocumentHead,
  buildMarketingPrerender,
  buildMarketingRobotsTxt,
  buildMarketingSitemapXml,
  buildNotFoundHtml,
  isSeoDiscoveryPath,
  isUnknownMarketingPath,
  marketingPublicRedirect,
} from "./src/lib/marketingSeo.mjs";
import { splitMarketingLocale } from "./src/lib/localePath.mjs";
import { buildHomeFirstPaint } from "./src/lib/homeFirstPaint.mjs";

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
  matcher: ["/(.*)"],
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
  if (host === "qa.local" || host.endsWith(".qa.local") || host.endsWith(".trycloudflare.com")) {
    return false;
  }
  return true;
}

function shellDocumentHeaders() {
  const headers = {
    accept: "text/html",
    "x-bizuply-seo-middleware": "1",
  };
  const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  if (bypass) headers["x-vercel-protection-bypass"] = bypass;
  return headers;
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
    /<meta\b[^>]*\bname=["']apple-mobile-web-app-title["'][^>]*>/gi,
    "",
  );
  next = next.replace(
    /<meta\b[^>]*\bname=["']application-name["'][^>]*>/gi,
    "",
  );
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
      return seoResponse(isRobots ? buildMarketingRobotsTxt() : buildMarketingSitemapXml(), {
        isRobots,
        status: 200,
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

function insertHeadBlock(html, block) {
  if (/<head\b[^>]*>/i.test(html)) {
    return html.replace(/<head\b[^>]*>/i, (match) => `${match}${block}`);
  }
  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${block}</head>`);
  }
  return `${block}${html}`;
}

/**
 * Customer host with no usable SEO head.
 * A completed 404 means the published site does not exist, so the shell must
 * not be indexed as Bizuply. Timeout, 5xx, and unreadable JSON are temporary:
 * strip the platform brand, but do not noindex a site that may be valid.
 * Never invent a title from the hostname.
 */
function customerNeutralDocument(html, { indexable }) {
  const clean = stripShellSeoTags(html);
  const robots = indexable ? "index, follow" : "noindex, nofollow";
  const block =
    `\n<meta name="robots" content="${robots}" data-bizuply-edge-seo="1" />\n`;
  return insertHeadBlock(clean, block);
}

function customerNeutralResponse(html, status, started, reason, indexable) {
  const headers = {
    "content-type": "text/html; charset=utf-8",
    "cache-control": indexable
      ? "private, no-store"
      : "public, max-age=0, must-revalidate",
    "x-bizuply-seo-edge": indexable ? "customer-unavailable" : "customer-absent",
    "x-bizuply-seo-edge-reason": reason,
    "x-bizuply-seo-edge-ms": String(Date.now() - started),
  };
  if (!indexable) headers["x-robots-tag"] = "noindex, nofollow";
  return new Response(customerNeutralDocument(html, { indexable }), {
    status,
    headers,
  });
}

/**
 * The application shell itself could not be read. Do not pass the request
 * through to the platform index.html: that document carries Bizuply titles,
 * og:url, and Organization schema. 503 asks crawlers to keep the previous
 * customer snapshot and retry.
 */
function customerSiteUnavailableResponse(started, reason) {
  return new Response(
    '<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>',
    {
      status: 503,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "private, no-store",
        "retry-after": "120",
        "x-bizuply-seo-edge": "site-unavailable",
        "x-bizuply-seo-edge-reason": reason,
        "x-bizuply-seo-edge-ms": String(Date.now() - started),
      },
    },
  );
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
      headers: shellDocumentHeaders(),
    });

    const requestSeo = async () => {
      try {
        return await fetchWithTimeout(
          seoUrl,
          { headers: { accept: "application/json" } },
          SEO_HEAD_TIMEOUT_MS,
        );
      } catch {
        return null;
      }
    };

    let seoRes = await requestSeo();
    const temporaryFailure = !seoRes || seoRes.status >= 500;
    if (temporaryFailure) {
      seoRes = await requestSeo();
    }

    const htmlRes = await htmlPromise;

    if (!htmlRes.ok) {
      return customerSiteUnavailableResponse(started, `shell-${htmlRes.status}`);
    }

    const html = await htmlRes.text();
    if (!html || !/<html[\s>]/i.test(html)) {
      return customerSiteUnavailableResponse(started, "shell-empty");
    }

    let headHtml = "";
    let seoReason = "empty";
    if (!seoRes) {
      seoReason = "timeout";
    } else if (seoRes.ok) {
      try {
        const payload = await seoRes.json();
        headHtml = String(payload?.headHtml || "").trim();
        if (!headHtml) seoReason = "empty";
      } catch {
        headHtml = "";
        seoReason = "parse";
      }
    } else {
      seoReason = `seo-${seoRes.status}`;
    }

    // Keep the SPA body. Only the platform head is removed when the
    // customer SEO API cannot supply a real head.
    if (!headHtml) {
      const siteConfirmedMissing = seoRes?.status === 404;
      return customerNeutralResponse(
        html,
        htmlRes.status,
        started,
        seoReason,
        !siteConfirmedMissing,
      );
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
    // Never fall through to the platform shell on a customer host.
    return customerSiteUnavailableResponse(started, "shell-error");
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
      headers: shellDocumentHeaders(),
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
    normalizeWhatsAppPath(pathname) === "/"
      ? [
          `<link rel="alternate" hreflang="en" href="https://whatsapp.bizuply.com/" />`,
          `<link rel="alternate" hreflang="he" href="https://bizuply.com/he/whatsapp-api" />`,
          `<link rel="alternate" hreflang="x-default" href="https://whatsapp.bizuply.com/" />`,
        ].join("\n")
      : "",
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

const CRAWL_PLACEHOLDER = '<div id="bizuply-crawl"></div>';
const ROOT_PLACEHOLDER = '<div id="root"></div>';

/**
 * Fallback copy for clients without JavaScript. It lives in <noscript>, so a
 * JS browser never paints it and Google does not get a second hidden H1.
 * Putting the same summary in #root was the first-paint flash.
 */
function injectCrawlableDocument(html, inner) {
  const slot = `<noscript id="bizuply-crawl">${inner}</noscript>`;
  if (html.includes(CRAWL_PLACEHOLDER)) {
    return html.replace(CRAWL_PLACEHOLDER, slot);
  }
  if (html.includes(ROOT_PLACEHOLDER)) {
    return html.replace(ROOT_PLACEHOLDER, `${slot}\n  ${ROOT_PLACEHOLDER}`);
  }
  return html;
}

function injectRootInner(html, inner) {
  if (html.includes(ROOT_PLACEHOLDER)) {
    return html.replace(ROOT_PLACEHOLDER, `<div id="root">${inner}</div>`);
  }
  return html.replace(
    /<div id="root"><\/div>/,
    `<div id="root">${inner}</div>`,
  );
}

/** The sign-in runs on bizuply.com, where the host-only auth session lives; the query (lang, etc.) carries over. */
function whatsappLoginRedirect(request) {
  const target = new URL(WHATSAPP_LOGIN_APP_URL);
  target.search = new URL(request.url).search;
  return new Response(null, {
    status: 302,
    headers: { location: target.toString(), "cache-control": "no-store" },
  });
}

async function handleWhatsAppDocument(request) {
  if (!isDocumentNavigation(request)) return passThrough();

  try {
    const htmlRes = await fetch(new URL("/index.html", request.url), {
      headers: shellDocumentHeaders(),
    });
    if (!htmlRes.ok) return passThrough();
    const html = await htmlRes.text();
    if (!html || !/<html[\s>]/i.test(html)) return passThrough();
    const pathname = getPathname(request);
    let documentHtml = injectSeoHead(html, whatsappHeadHtml(pathname));
    const prerender = whatsappHomepagePrerender(pathname);
    if (prerender) {
      documentHtml = injectCrawlableDocument(documentHtml, prerender);
    }
    return new Response(documentHtml, {
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
      headers: shellDocumentHeaders(),
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

const SAAS_PRODUCT_ORIGINS = [
  {
    matches: (host) =>
      host.endsWith("-globalproperties.bizuply.com") ||
      host.endsWith(".globalproperties.bizuply.com"),
    origin: "https://web-production-923d7.up.railway.app",
  },
];

function isSaasProductHost(host) {
  return SAAS_PRODUCT_ORIGINS.some((product) => product.matches(host));
}

function isStaticAsset(pathname) {
  return (
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/api/") ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  );
}

async function proxySaasProduct(request, host) {
  const product = SAAS_PRODUCT_ORIGINS.find((item) => item.matches(host));
  const secret = String(process.env.BIZUPLY_INTEGRATION_SECRET || "");
  if (!product || !secret) {
    return new Response("This customer site is not routed yet.", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
  const incoming = new URL(request.url);
  const target = new URL(`${incoming.pathname}${incoming.search}`, product.origin);
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("x-forwarded-host");
  headers.delete("x-vercel-forwarded-host");
  headers.set("x-tenant-host", host);
  headers.set("x-bizuply-integration-key", secret);
  const response = await fetch(target, {
    method: request.method,
    headers,
    redirect: "manual",
    body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
  });
  const outgoing = new Headers(response.headers);
  outgoing.delete("content-encoding");
  outgoing.delete("content-length");
  return new Response(response.body, { status: response.status, headers: outgoing });
}

function isPlatformMarketingHost(host) {
  if (!host) return false;
  if (isBizuplyWhatsAppHost(host) || isBizuplyTravelHost(host)) return false;
  if (isCustomerSiteHost(host) || isSaasProductHost(host)) return false;
  return MARKETING_HOSTS.has(host) || host === "127.0.0.1" || host.endsWith(".vercel.app");
}

function marketingLegacyRedirect(request, host, pathname) {
  const dest = marketingPublicRedirect(pathname);
  if (!dest || !isPlatformMarketingHost(host)) return null;
  const location = dest.startsWith("http")
    ? dest
    : host === "localhost" || host === "127.0.0.1" || host.endsWith(".vercel.app")
      ? new URL(dest, request.url).toString()
      : `https://bizuply.com${dest}`;
  return new Response(null, {
    status: 301,
    headers: {
      location,
      "cache-control": "public, max-age=3600",
      "x-bizuply-seo-edge": "marketing-redirect",
    },
  });
}

async function handleMarketingDocument(request) {
  if (!isDocumentNavigation(request)) return passThrough();
  const pathname = getPathname(request);
  const headHtml = buildMarketingDocumentHead(pathname);
  if (!headHtml) {
    if (isUnknownMarketingPath(pathname)) {
      return new Response(buildNotFoundHtml(), {
        status: 404,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "public, max-age=0, must-revalidate",
          "x-robots-tag": "noindex, nofollow",
          "x-bizuply-seo-edge": "marketing-not-found",
        },
      });
    }
    return passThrough();
  }

  try {
    const htmlRes = await fetch(new URL("/index.html", request.url), {
      headers: shellDocumentHeaders(),
    });
    if (!htmlRes.ok) return passThrough();
    const html = await htmlRes.text();
    if (!html || !/<html[\s>]/i.test(html)) return passThrough();
    const noindex = headHtml.includes("noindex");
    let documentHtml = injectSeoHead(html, headHtml);
    const prerender = buildMarketingPrerender(pathname);
    const homePaint = buildHomeFirstPaint(pathname);
    const locale = splitMarketingLocale(pathname);
    if (locale.locale === "he") {
      documentHtml = documentHtml.replace(
        /<html\b[^>]*>/i,
        '<html lang="he" dir="rtl">',
      );
    }
    if (homePaint) {
      documentHtml = injectRootInner(documentHtml, homePaint.inner);
    } else if (prerender) {
      documentHtml = injectCrawlableDocument(documentHtml, prerender.inner);
    }
    return new Response(documentHtml, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=0, must-revalidate",
        "x-bizuply-seo-edge": "marketing",
        ...(noindex ? { "x-robots-tag": "noindex, nofollow" } : {}),
      },
    });
  } catch {
    return passThrough();
  }
}

export default async function middleware(request) {
  const host = getHost(request);
  if (isSaasProductHost(host)) return proxySaasProduct(request, host);
  const pathname = getPathname(request);
  if (
    isStaticAsset(pathname) &&
    !getGoogleHtmlVerificationFile(pathname) &&
    !isSeoDiscoveryPath(pathname)
  ) {
    return passThrough();
  }

  const legacyRedirect = marketingLegacyRedirect(request, host, pathname);
  if (legacyRedirect) return legacyRedirect;

  if (isBizuplyWhatsAppHost(host)) {
    if (pathname === "/sitemap.xml" || pathname === "/robots.txt") {
      return whatsappSeoFile(pathname);
    }
    if (pathname === "/login" || pathname === "/login/") {
      return whatsappLoginRedirect(request);
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

  if (isPlatformMarketingHost(host)) {
    return handleMarketingDocument(request);
  }

  return handleHtmlSeoInjection(request);
}
