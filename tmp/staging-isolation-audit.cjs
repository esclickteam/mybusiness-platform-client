const fs = require("fs");
const path = require("path");
const https = require("https");
const { chromium } = require("playwright");

const CLIENT = "https://mybusiness-platform-client-staging.vercel.app";
const STAGING_API = "server-staging-15bb.up.railway.app";
const PROD_API = "api.bizuply.com";
const CREDS = JSON.parse(
  fs.readFileSync(path.join(process.env.TEMP, "bizuply-phase4-staging-smoke-creds.json"), "utf8")
);

const results = [];
const prodReqs = [];
const stagingReqs = [];
function record(id, status, note = "") {
  results.push({ id, status, note });
  console.log(`[${status}] ${id}${note ? " — " + note : ""}`);
}

function api(method, p, body, token, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const headers = {
      accept: "application/json",
      origin: CLIENT,
      "x-business-id": String(CREDS.businessId || ""),
      ...extraHeaders,
    };
    if (data) {
      headers["content-type"] = "application/json";
      headers["content-length"] = Buffer.byteLength(data);
    }
    if (token) headers.authorization = "Bearer " + token;
    const r = https.request(
      { hostname: STAGING_API, path: p, method, headers },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          let json = null;
          try { json = JSON.parse(text); } catch {}
          resolve({ status: res.statusCode, json, text });
        });
      }
    );
    r.on("error", reject);
    if (data) r.write(data);
    r.end();
  });
}

function classify(url) {
  try {
    const u = new URL(url);
    if (u.hostname === PROD_API) return "prod";
    if (u.hostname === STAGING_API) return "staging";
    return "other";
  } catch { return "other"; }
}

(async () => {
  const login = await api("POST", "/api/auth/login", {
    email: CREDS.email,
    password: CREDS.password,
  });
  if (login.status !== 200 || !login.json?.accessToken) {
    throw new Error("login failed: " + login.status + " " + String(login.text).slice(0, 200));
  }
  const token = login.json.accessToken;
  const user = login.json.user || {};
  record("login-api", "PASS", "accessToken issued on staging");

  const refresh = await api("POST", "/api/auth/refresh-token", null, null, {
    cookie: (login.json && "") || "",
  });
  // refresh may use cookie; try with Authorization too
  const refresh2 = await api("POST", "/api/auth/refresh-token", { refreshToken: login.json.refreshToken }, token);
  record(
    "auth-refresh-api",
    refresh2.status < 400 || refresh.status < 400 ? "PASS" : "WARN",
    "refresh=" + refresh.status + " refreshAuth=" + refresh2.status
  );

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on("request", (req) => {
    const c = classify(req.url());
    const entry = req.method() + " " + req.url();
    if (c === "prod") prodReqs.push(entry);
    if (c === "staging") stagingReqs.push(entry);
  });

  // Login UI
  await page.goto(CLIENT + "/login", { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.fill('input[name="email"]', CREDS.email);
  await page.fill('input[name="password"]', CREDS.password);
  await Promise.all([
    page.waitForURL((u) => /\/(business|dashboard|admin)/.test(u.pathname), { timeout: 60000 }).catch(() => null),
    page.click('button[type="submit"]'),
  ]);
  await page.waitForTimeout(2500);
  const loginOk = Boolean(await page.evaluate(() => localStorage.getItem("token")));
  record("login-ui", loginOk ? "PASS" : "FAIL", page.url());

  // Auth refresh via reload
  await page.reload({ waitUntil: "networkidle", timeout: 90000 }).catch(() => null);
  await page.waitForTimeout(2000);
  let still = Boolean(await page.evaluate(() => localStorage.getItem("token")));
  if (!still) {
    await page.evaluate(
      ({ token, user }) => {
        localStorage.setItem("token", token);
        localStorage.setItem("businessDetails", JSON.stringify(user));
      },
      { token, user }
    );
    record("auth-refresh-ui", "WARN", "cookie refresh miss; reseeded staging token");
  } else {
    record("auth-refresh-ui", "PASS", "session survived reload");
  }

  // Ensure auth for subsequent routes
  await page.evaluate(
    ({ token, user }) => {
      localStorage.setItem("token", token);
      localStorage.setItem("businessDetails", JSON.stringify(user));
    },
    { token, user }
  );

  const biz = CREDS.businessId;
  const routes = [
    ["dashboard", `/business/${biz}/dashboard`],
    ["crm", `/business/${biz}/dashboard/crm`],
    ["automations", `/business/${biz}/dashboard/automations`],
    ["website-builder", `/business/${biz}/dashboard/website`],
  ];

  for (const [name, route] of routes) {
    const beforeProd = prodReqs.length;
    const beforeStaging = stagingReqs.length;
    await page.goto(CLIENT + route, { waitUntil: "networkidle", timeout: 120000 }).catch(() => null);
    await page.waitForTimeout(2500);
    const pathOk = !page.url().includes("/login");
    const staged = stagingReqs.length > beforeStaging;
    const noNewProd = prodReqs.length === beforeProd;
    record(
      name,
      pathOk && noNewProd ? "PASS" : "FAIL",
      `url=${page.url()} stagingDelta=${stagingReqs.length - beforeStaging} prodDelta=${prodReqs.length - beforeProd} staged=${staged}`
    );
  }

  // Admin (if user is admin)
  const beforeAdminProd = prodReqs.length;
  await page.goto(CLIENT + "/admin", { waitUntil: "networkidle", timeout: 90000 }).catch(() => null);
  await page.waitForTimeout(2000);
  const adminUrl = page.url();
  const adminOk = /admin/.test(adminUrl) || /dashboard|business/.test(adminUrl);
  record(
    "admin",
    prodReqs.length === beforeAdminProd ? (adminOk ? "PASS" : "WARN") : "FAIL",
    adminUrl + " prodDelta=" + (prodReqs.length - beforeAdminProd)
  );

  // Impersonation endpoint probe (staging API only)
  if (CREDS.impersonateBusinessId || CREDS.businessId) {
    const imp = await api(
      "POST",
      "/api/admin/impersonate",
      { businessId: CREDS.impersonateBusinessId || CREDS.businessId },
      token
    );
    record(
      "business-impersonation",
      imp.status === 200 || imp.status === 403 || imp.status === 401 ? "PASS" : "WARN",
      "status=" + imp.status + " (staging host only)"
    );
  } else {
    record("business-impersonation", "WARN", "no impersonation target in creds");
  }

  // Socket.IO handshake against staging
  const socketProbe = await new Promise((resolve) => {
    const req = https.get(
      {
        hostname: STAGING_API,
        path: "/socket.io/?EIO=4&transport=polling",
        headers: { origin: CLIENT },
      },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () =>
          resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString("utf8").slice(0, 120) })
        );
      }
    );
    req.on("error", (e) => resolve({ status: 0, body: String(e) }));
  });
  record(
    "socket.io",
    socketProbe.status === 200 && !/api\.bizuply\.com/.test(socketProbe.body) ? "PASS" : "FAIL",
    "status=" + socketProbe.status + " body=" + socketProbe.body
  );

  // Browser socket attempts while on dashboard
  const socketStaging = stagingReqs.filter((u) => /socket\.io/i.test(u)).length;
  const socketProd = prodReqs.filter((u) => /socket\.io/i.test(u)).length;
  record(
    "socket.io-browser",
    socketProd === 0 ? "PASS" : "FAIL",
    `stagingSocketReqs=${socketStaging} prodSocketReqs=${socketProd}`
  );

  await browser.close();

  const summary = {
    STAGING_FRONTEND_ISOLATION:
      prodReqs.length === 0 && results.every((r) => r.status !== "FAIL") ? "PASS" : "FAIL",
    productionRequestsObserved: prodReqs.length,
    stagingRequestsObserved: stagingReqs.length,
    prodSample: prodReqs.slice(0, 10),
    stagingSample: stagingReqs.slice(0, 15),
    results,
  };
  console.log(JSON.stringify(summary, null, 2));
  fs.writeFileSync("tmp/staging-isolation-audit-results.json", JSON.stringify(summary, null, 2));
  if (summary.STAGING_FRONTEND_ISOLATION !== "PASS") process.exit(2);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

