#!/usr/bin/env node
/**
 * Staging-only static UI + /api reverse proxy to Railway Staging.
 * Never proxies to Production.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..", "dist");
const port = Number(process.env.PORT || 4173);
const STAGING_API = "https://server-staging-15bb.up.railway.app";

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json",
};

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    "Content-Type": mime[ext] || "application/octet-stream",
    "Cache-Control": ext === ".html" ? "no-store" : "public, max-age=60",
  });
  fs.createReadStream(filePath).pipe(res);
}

function proxyApi(req, res) {
  const target = new URL(req.url, STAGING_API);
  if (!target.hostname.endsWith("server-staging-15bb.up.railway.app")) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "refusing non-staging proxy target" }));
    return;
  }
  const headers = { ...req.headers, host: target.host };
  delete headers["content-length"];
  const upstream = http.request(
    {
      protocol: "https:",
      hostname: target.hostname,
      port: 443,
      path: target.pathname + target.search,
      method: req.method,
      headers,
    },
    (up) => {
      res.writeHead(up.statusCode || 502, up.headers);
      up.pipe(res);
    }
  );
  upstream.on("error", (err) => {
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "staging proxy failed", message: err.message }));
  });
  req.pipe(upstream);
}

// Use https via undici-less native https
import https from "node:https";
function proxyApiHttps(req, res) {
  const target = new URL(req.url, STAGING_API);
  const headers = { ...req.headers, host: target.host };
  delete headers["content-length"];
  const upstream = https.request(
    {
      hostname: target.hostname,
      port: 443,
      path: target.pathname + target.search,
      method: req.method,
      headers,
    },
    (up) => {
      res.writeHead(up.statusCode || 502, up.headers);
      up.pipe(res);
    }
  );
  upstream.on("error", (err) => {
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "staging proxy failed", message: err.message }));
  });
  req.pipe(upstream);
}

const server = http.createServer((req, res) => {
  if (req.url?.startsWith("/api/") || req.url === "/api") {
    return proxyApiHttps(req, res);
  }
  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  const safe = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
  let filePath = path.join(root, safe);
  if (safe.endsWith("/") || !path.extname(safe)) {
    const asFile = path.join(root, safe);
    if (fs.existsSync(asFile) && fs.statSync(asFile).isFile()) {
      filePath = asFile;
    } else {
      filePath = path.join(root, "index.html");
    }
  }
  if (!filePath.startsWith(root)) {
    res.writeHead(403).end("forbidden");
    return;
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(root, "index.html");
  }
  sendFile(res, filePath);
});

server.listen(port, "0.0.0.0", () => {
  console.log(
    JSON.stringify({
      ok: true,
      port,
      appEnv: "staging-ui-proxy",
      apiProxy: STAGING_API,
      note: "Staging only — refuses Production API",
    })
  );
});
