/**
 * Serves the SPA HTML shell with Google Search Console verification meta
 * injected for customer site hosts.
 *
 * CommonJS on purpose — reliable with @vercel/node + legacy builds.
 */

const SEO_HEAD_URL =
  "https://api.bizuply.com/api/site-builder/public/by-host/seo-head";

function escapeHtmlAttr(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getHost(req) {
  const raw = String(
    req.headers["x-forwarded-host"] || req.headers.host || "",
  )
    .split(",")[0]
    .trim()
    .toLowerCase();

  return raw.split(":")[0];
}

function getProto(req) {
  const forwarded = String(req.headers["x-forwarded-proto"] || "")
    .split(",")[0]
    .trim();
  return forwarded || "https";
}

async function fetchSeoHead(host) {
  try {
    const res = await fetch(
      `${SEO_HEAD_URL}?host=${encodeURIComponent(host)}&_t=${Date.now()}`,
      { headers: { accept: "application/json" } },
    );
    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    if (!data || data.success === false) return null;
    return data;
  } catch {
    return null;
  }
}

function injectSeo(html, seo) {
  const verification = String(seo?.googleSiteVerification || "").trim();
  const faviconUrl = String(seo?.faviconUrl || "").trim();
  const title = String(seo?.title || "").trim();

  if (!verification && !faviconUrl && !title) return html;

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

  let next = html;

  if (tags.length) {
    if (next.includes("</head>")) {
      next = next.replace("</head>", `    ${tags.join("\n    ")}\n  </head>`);
    } else if (next.includes("<head>")) {
      next = next.replace("<head>", `<head>\n    ${tags.join("\n    ")}`);
    }
  }

  if (title && /<title>[^<]*<\/title>/i.test(next)) {
    next = next.replace(
      /<title>[^<]*<\/title>/i,
      `<title>${escapeHtmlAttr(title)}</title>`,
    );
  }

  return next;
}

module.exports = async function handler(req, res) {
  if (req.method && req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405;
    res.end("Method Not Allowed");
    return;
  }

  const host = getHost(req);
  const proto = getProto(req);

  let html = "";
  try {
    /*
      Load the built shell from /assets (real static file). Avoid `/` and
      `/index.html` which cleanUrls / SPA routes can send back into this function.
    */
    const indexRes = await fetch(
      `${proto}://${host}/assets/bizuply-spa-shell.html`,
      { headers: { accept: "text/html" } },
    );
    html = await indexRes.text();
    if (!indexRes.ok || !html.includes("<html")) {
      throw new Error(`spa shell status ${indexRes.status}`);
    }
  } catch (error) {
    res.statusCode = 502;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.setHeader("x-bizuply-seo-inject", "error");
    res.end("Failed to load site HTML shell");
    return;
  }

  const seo = host ? await fetchSeoHead(host) : null;
  html = injectSeo(html, seo);

  res.statusCode = 200;
  res.setHeader("content-type", "text/html; charset=utf-8");
  res.setHeader("cache-control", "public, max-age=0, must-revalidate");
  res.setHeader(
    "x-bizuply-seo-inject",
    String(seo?.googleSiteVerification || "").trim() ? "1" : "0",
  );
  if (req.method === "HEAD") {
    res.end();
    return;
  }
  res.end(html);
};
