/**
 * Proxies Google Search Console verification files for customer site hosts.
 */

const https = require("https");
const { URL } = require("url");

const API_BASE =
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

function readQueryFile(req) {
  try {
    const u = new URL(req.url || "/", "http://localhost");
    return u.searchParams.get("file") || "";
  } catch {
    return "";
  }
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          resolve({
            status: res.statusCode || 500,
            body: Buffer.concat(chunks).toString("utf8"),
          });
        });
      })
      .on("error", reject);
  });
}

module.exports = async function handler(req, res) {
  try {
    if (req.method && req.method !== "GET" && req.method !== "HEAD") {
      res.statusCode = 405;
      res.end("Method Not Allowed");
      return;
    }

    const host = getHost(req);
    const file = normalizeFile(readQueryFile(req));

    if (!host || !file) {
      res.statusCode = 404;
      res.setHeader("content-type", "text/plain; charset=utf-8");
      res.end("Not found");
      return;
    }

    const apiUrl =
      `${API_BASE}?host=${encodeURIComponent(host)}` +
      `&file=${encodeURIComponent(file)}&_t=${Date.now()}`;

    const apiRes = await fetchText(apiUrl);

    res.statusCode = apiRes.status;
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.setHeader("cache-control", "public, max-age=0, must-revalidate");
    res.setHeader("x-bizuply-google-html", apiRes.status === 200 ? "1" : "0");
    res.setHeader("x-bizuply-google-host", host);
    res.setHeader("x-bizuply-google-file", file);

    if (req.method === "HEAD") {
      res.end();
      return;
    }

    res.end(apiRes.body);
  } catch (error) {
    res.statusCode = 502;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.end(
      `Verification file unavailable: ${
        error && error.message ? error.message : "unknown"
      }`,
    );
  }
};
