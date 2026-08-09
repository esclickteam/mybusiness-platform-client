const fs = require("fs");
const path = require("path");
const https = require("https");
const { chromium } = require("playwright");
const CREDS = JSON.parse(
  fs.readFileSync(
    process.env.CREDS_FILE ||
      path.join(process.env.TEMP, "bizuply-phase4-staging-smoke-creds.json"),
    "utf8"
  )
);
const CLIENT = "https://mybusiness-platform-client-staging.vercel.app";
const API = "server-staging-15bb.up.railway.app";

function api(method, p, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const headers = { accept: "application/json", "x-business-id": CREDS.businessId };
    if (token) headers.authorization = "Bearer " + token;
    if (data) {
      headers["content-type"] = "application/json";
      headers["content-length"] = Buffer.byteLength(data);
    }
    const r = https.request({ hostname: API, path: p, method, headers }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        const text = Buffer.concat(chunks).toString("utf8");
        let json = null;
        try { json = JSON.parse(text); } catch {}
        resolve({ status: res.statusCode, json, text });
      });
    });
    r.on("error", reject);
    if (data) r.write(data);
    r.end();
  });
}

(async () => {
  const login = await api("POST", "/api/auth/login", { email: CREDS.email, password: CREDS.password });
  const token = login.json.accessToken;
  const created = await api(
    "POST",
    "/api/automations",
    {
      businessId: CREDS.businessId,
      name: "P1 Nav Probe",
      useStarter: false,
      nodes: [
        { id: "A", type: "trigger", position: { x: 80, y: 180 }, data: { label: "A", triggerKey: "new_lead", routeCount: 1 } },
        { id: "B", type: "action", position: { x: 420, y: 180 }, data: { label: "B", actionKey: "notify" } },
      ],
      edges: [{ id: "e_ab", source: "A", target: "B", sourceHandle: "route_1" }],
    },
    token
  );
  const wf = created.json?.workflow?._id || created.json?._id;
  console.log("created", created.status, wf);
  const got = await api("GET", "/api/automations/" + wf + "?businessId=" + CREDS.businessId, null, token);
  console.log("get", got.status, "nodes", (got.json?.workflow?.nodes || []).length);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on("console", (m) => {
    if (m.type() === "error") console.log("ERR", m.text().slice(0, 250));
  });
  page.on("pageerror", (e) => console.log("PAGE", String(e.message || e).slice(0, 250)));
  page.on("response", (r) => {
    if (r.url().includes("AutomationsEditor") || r.url().includes("AutomationFlow") || (r.status() >= 400 && r.url().includes("/assets/"))) {
      console.log("RESP", r.status(), r.url().split("/").pop());
    }
  });

  await page.goto(CLIENT + "/login", { waitUntil: "networkidle", timeout: 90000 });
  await page.fill('input[name="email"]', CREDS.email);
  await page.fill('input[name="password"]', CREDS.password);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3500);

  await page.goto(CLIENT + "/business/" + CREDS.businessId + "/dashboard/automations", {
    waitUntil: "networkidle",
    timeout: 90000,
  });
  await page.waitForTimeout(2000);
  // click card/button for this workflow
  const row = page.locator(`text=P1 Nav Probe`).first();
  console.log("row", await row.count());
  if (await row.count()) await row.click();
  await page.waitForTimeout(5000);
  console.log("url", page.url());
  console.log(
    "ui",
    await page.locator(".af-builder").count(),
    await page.locator(".react-flow__node").count(),
    await page.locator(".af-edge-add").count()
  );
  console.log("body", (await page.locator("body").innerText()).replace(/\s+/g, " ").slice(0, 280));
  await browser.close();
})().catch((e) => {
  console.error(String(e && e.stack ? e.stack : e));
  process.exit(1);
});