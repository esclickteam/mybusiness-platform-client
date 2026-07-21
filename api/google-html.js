/**
 * Proxies Google Search Console verification files for customer site hosts.
 * Kept tiny and isolated so homepage stays on static SPA routing.
 */

const API =
  "https://api.bizuply.com/api/site-builder/public/by-host/google-html";

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

function normalizeFile(value) {
  let file = String(value || "")
    .trim()
    .replace(/^\/+/, "")
    .toLowerCase();
  if (/^google[a-z0-9]+$/i.test(file)) file = `${file}.html`;
  if (!/^google[a-z0-9]+\.html$/i.test(file)) return "";
  return file;
}

module.exports = async function handler(req, res) {
  if (req.method && req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405;
    res.end("Method Not Allowed");
    return;
  }

  const host = getHost(req);
  const file = normalizeFile(
    (req.query && req.query.file) ||
      (req.url && String(req.url).split("file=")[1]) ||
      "",
  );

  if (!host || !file) {
    res.statusCode = 404;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.end("Not found");
    return;
  }

  try {
    const apiUrl = `${API}?host=${encodeURIComponent(host)}&file=${encodeURIComponent(file)}&_t=${Date.now()}`;
    const apiRes = await fetch(apiUrl, {
      headers: { accept: "text/html,text/plain" },
    });
    const body = await apiRes.text();

    res.statusCode = apiRes.status;
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.setHeader("cache-control", "public, max-age=0, must-revalidate");
    res.setHeader("x-bizuply-google-html", apiRes.ok ? "1" : "0");
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    res.end(body);
  } catch (error) {
    res.statusCode = 502;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.end("Verification file unavailable");
  }
};
