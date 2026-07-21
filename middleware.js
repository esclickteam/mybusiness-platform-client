/**
 * Inject Google Search Console verification (and favicon) into the raw HTML
 * shell for published customer sites. GSC's HTML-tag checker reads the first
 * HTML response and does not wait for React Helmet.
 */

const API_SEO_HEAD_BASE =
  "https://api.bizuply.com/api/site-builder/public/by-host/seo-head";

export const config = {
  // Only homepage document requests. Fetch `/index.html` inside without re-entry.
  matcher: ["/"],
};

function escapeHtmlAttr(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function isDocumentRequest(request) {
  const accept = String(request.headers.get("accept") || "").toLowerCase();
  if (!accept || accept.includes("*/*")) return true;
  return accept.includes("text/html");
}

async function fetchSeoHead(host) {
  try {
    const url = `${API_SEO_HEAD_BASE}?host=${encodeURIComponent(host)}&_t=${Date.now()}`;
    const res = await fetch(url, {
      headers: { accept: "application/json" },
      // Edge fetch — keep it short so homepage stays fast if API is slow.
      cf: undefined,
    });

    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    if (!data || data.success === false) return null;
    return data;
  } catch {
    return null;
  }
}

export default async function middleware(request) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return;
  }

  if (!isDocumentRequest(request)) {
    return;
  }

  const host = String(request.headers.get("host") || "")
    .split(":")[0]
    .toLowerCase()
    .trim();

  if (!host) return;

  const seoPromise = fetchSeoHead(host);

  /*
    Fetch the static shell without re-entering this matcher (`/` only).
    `/index.html` is the built Vite asset.
  */
  const indexUrl = new URL("/index.html", request.url);
  const indexRes = await fetch(indexUrl, {
    headers: {
      accept: "text/html",
    },
  });

  if (!indexRes.ok) {
    return indexRes;
  }

  const seo = await seoPromise;
  const verification = String(seo?.googleSiteVerification || "").trim();
  const faviconUrl = String(seo?.faviconUrl || "").trim();
  const title = String(seo?.title || "").trim();

  if (!verification && !faviconUrl && !title) {
    return indexRes;
  }

  let html = await indexRes.text();
  const tags = [];

  if (verification) {
    tags.push(
      `<meta name="google-site-verification" content="${escapeHtmlAttr(verification)}" />`,
    );
  }

  if (faviconUrl) {
    tags.push(`<link rel="icon" href="${escapeHtmlAttr(faviconUrl)}" />`);
    tags.push(
      `<link rel="apple-touch-icon" href="${escapeHtmlAttr(faviconUrl)}" />`,
    );
  }

  if (tags.length) {
    if (html.includes("</head>")) {
      html = html.replace("</head>", `    ${tags.join("\n    ")}\n  </head>`);
    } else if (html.includes("<head>")) {
      html = html.replace("<head>", `<head>\n    ${tags.join("\n    ")}`);
    }
  }

  if (title && /<title>[^<]*<\/title>/i.test(html)) {
    html = html.replace(
      /<title>[^<]*<\/title>/i,
      `<title>${escapeHtmlAttr(title)}</title>`,
    );
  }

  const headers = new Headers(indexRes.headers);
  headers.set("content-type", "text/html; charset=utf-8");
  headers.set("cache-control", "public, max-age=0, must-revalidate");
  headers.delete("content-length");

  return new Response(html, {
    status: indexRes.status,
    headers,
  });
}
