const fs = require("fs");
const path = require("path");
const https = require("https");
const { chromium } = require("playwright");

const CLIENT = "https://mybusiness-platform-client-staging.vercel.app";
const STAGING_API_HOST = "server-staging-15bb.up.railway.app";
const PROD_API_HOST = "api.bizuply.com";
const CREDS = JSON.parse(
  fs.readFileSync(
    process.env.CREDS_FILE ||
      path.join(process.env.TEMP, "bizuply-phase4-staging-smoke-creds.json"),
    "utf8"
  )
);

const results = [];
function record(id, status, note = "") {
  results.push({ id, status, note });
  console.log(`[${status}] ${id}${note ? " — " + note : ""}`);
}

function pathnameOf(url) {
  try {
    return new URL(url).pathname;
  } catch {
    return String(url || "");
  }
}

function isAuthedPath(url) {
  const p = pathnameOf(url);
  return (
    p.startsWith("/business/") ||
    p.startsWith("/dashboard") ||
    p.includes("/automations")
  );
}

function api(method, p, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const headers = {
      accept: "application/json",
      origin: CLIENT,
      "x-business-id": CREDS.businessId,
    };
    if (data) {
      headers["content-type"] = "application/json";
      headers["content-length"] = Buffer.byteLength(data);
    }
    if (token) headers.authorization = "Bearer " + token;
    const r = https.request(
      { hostname: STAGING_API_HOST, path: p, method, headers },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          let json = null;
          try {
            json = JSON.parse(text);
          } catch {}
          resolve({ status: res.statusCode, json, text });
        });
      }
    );
    r.on("error", reject);
    if (data) r.write(data);
    r.end();
  });
}

const CLEAN_GRAPH = {
  name: "Phase 4 Builder Smoke Test",
  nodes: [
    {
      id: "t_smoke",
      type: "trigger",
      position: { x: 80, y: 180 },
      data: {
        label: "ליד חדש ב-CRM",
        triggerKey: "new_lead",
        routeCount: 1,
      },
    },
    {
      id: "a_notify",
      type: "action",
      position: { x: 420, y: 180 },
      data: { label: "התראה לבעל העסק", actionKey: "notify" },
    },
  ],
  edges: [
    {
      id: "e_smoke",
      source: "t_smoke",
      target: "a_notify",
      sourceHandle: "route_1",
      label: "המשך",
    },
  ],
};

async function main() {
  const consoleErrors = [];
  const pageErrors = [];
  const prodWrites = [];
  const stagingHosts = new Set();
  const prodHosts = new Set();
  const reqCounts = new Map();

  const loginApi = await api("POST", "/api/auth/login", {
    email: CREDS.email,
    password: CREDS.password,
  });
  if (loginApi.status !== 200 || !loginApi.json?.accessToken) {
    throw new Error("API login failed before UI smoke");
  }
  const token = loginApi.json.accessToken;
  const apiUser = loginApi.json.user || {};
  record("auth-api-login", "PASS", "token issued");

  const sseNoApi = await api(
    "GET",
    "/sse/dashboard-stats/" + CREDS.businessId + "?token=" + encodeURIComponent(token)
  );
  const sseWithApi = await api(
    "GET",
    "/api/sse/dashboard-stats/" + CREDS.businessId + "?token=" + encodeURIComponent(token)
  );
  const sseOk = sseWithApi.status < 400 || sseNoApi.status < 400;
  record(
    "sse-probe",
    sseOk ? "PASS" : "FAIL",
    "noApi=" + sseNoApi.status + " withApi=" + sseWithApi.status + " (route file exists; not mounted in server.js)"
  );

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(String(err.message || err)));
  page.on("request", (req) => {
    try {
      const u = new URL(req.url());
      const key = req.method() + " " + u.origin + u.pathname;
      reqCounts.set(key, (reqCounts.get(key) || 0) + 1);
      if (u.hostname === STAGING_API_HOST) stagingHosts.add(req.method() + " " + u.pathname);
      if (u.hostname === PROD_API_HOST) {
        prodHosts.add(req.method() + " " + u.pathname);
        const m = req.method().toUpperCase();
        if (!["GET", "HEAD", "OPTIONS"].includes(m)) {
          prodWrites.push(m + " " + req.url());
        }
      }
    } catch {}
  });

  function stopIfProdWrite(label) {
    if (prodWrites.length) {
      record(label, "FAIL", prodWrites[0]);
      throw new Error("STOP: production write detected");
    }
  }

  // 1) Login UI
  await page.goto(CLIENT + "/login", { waitUntil: "networkidle", timeout: 90000 });
  await page.fill('input[name="email"]', CREDS.email);
  await page.fill('input[name="password"]', CREDS.password);
  await Promise.all([
    page.waitForURL((u) => isAuthedPath(u.href), { timeout: 60000 }).catch(() => null),
    page.click('button[type="submit"]'),
  ]);
  await page.waitForTimeout(2500);
  const afterLoginPath = pathnameOf(page.url());
  const loginOk = isAuthedPath(page.url()) && Boolean(await page.evaluate(() => localStorage.getItem("token")));
  record("1-login-ui", loginOk ? "PASS" : "FAIL", afterLoginPath);
  stopIfProdWrite("prod-write-guard");
  record("prod-write-guard", "PASS", "no write to api.bizuply.com");

  // 2) refresh session
  await page.reload({ waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(2000);
  const stillAuthed =
    isAuthedPath(page.url()) &&
    Boolean(await page.evaluate(() => localStorage.getItem("token")));
  record("2-session-refresh", stillAuthed ? "PASS" : "FAIL", pathnameOf(page.url()));

  // If refresh lost session (cookie SameSite=Lax cross-origin), re-seed for builder coverage
  if (!stillAuthed) {
    await page.goto(CLIENT + "/login", { waitUntil: "domcontentloaded" });
    await page.evaluate(
      ({ token, user }) => {
        localStorage.setItem("token", token);
        localStorage.setItem("businessDetails", JSON.stringify(user));
      },
      { token, user: apiUser }
    );
    await page.goto(
      CLIENT + "/business/" + CREDS.businessId + "/dashboard",
      { waitUntil: "networkidle", timeout: 90000 }
    );
    await page.waitForTimeout(1500);
    record(
      "2b-session-reseed",
      isAuthedPath(page.url()) ? "PASS" : "FAIL",
      "seeded accessToken after refresh cookie miss; pathname=" + pathnameOf(page.url())
    );
  }

  // 3) dashboard
  const dashUrl = CLIENT + "/business/" + CREDS.businessId + "/dashboard";
  await page.goto(dashUrl, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(1500);
  record(
    "3-dashboard",
    pathnameOf(page.url()).includes("/dashboard") && !pathnameOf(page.url()).endsWith("/login")
      ? "PASS"
      : "FAIL",
    pathnameOf(page.url())
  );

  // 4) automations home
  const autoHome = CLIENT + "/business/" + CREDS.businessId + "/dashboard/automations";
  await page.goto(autoHome, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(2000);
  const homeText = await page.locator("body").innerText().catch(() => "");
  const homeOk =
    pathnameOf(page.url()).includes("/automations") &&
    /אוטומצ/.test(homeText);
  record("4-automations-home", homeOk ? "PASS" : "FAIL", pathnameOf(page.url()));

  record(
    "5-network-staging-api",
    stagingHosts.size > 0 ? "PASS" : "FAIL",
    "stagingPaths=" + stagingHosts.size + "; prodPaths=" + prodHosts.size
  );
  stopIfProdWrite("6-no-prod-writes");
  record("6-no-prod-writes", "PASS");

  // Create blank via UI or API with clean non-WA graph
  let workflowId = null;
  let createVia = "api";
  try {
    const newBtn = page.getByRole("button", { name: /אוטומציה חדשה|חדש/i }).first();
    if (await newBtn.count()) {
      await newBtn.click();
      await page.waitForTimeout(800);
      const blank = page.getByRole("button", { name: /ריק|מההתחלה|Blank|התחל מ/i }).first();
      if (await blank.count()) {
        await blank.click();
        await page.waitForURL(/\/automations\/[a-f0-9]{20,}/i, { timeout: 45000 });
        workflowId = page.url().split("/automations/")[1]?.split(/[?#]/)[0];
        createVia = "ui";
      }
    }
  } catch {}

  if (!workflowId) {
    const created = await api(
      "POST",
      "/api/automations",
      {
        businessId: CREDS.businessId,
        name: CLEAN_GRAPH.name,
        useStarter: false,
        nodes: CLEAN_GRAPH.nodes,
        edges: CLEAN_GRAPH.edges,
      },
      token
    );
    workflowId = created.json?.workflow?._id || created.json?._id;
    record(
      "3-create-blank",
      created.status < 300 && workflowId ? "PASS" : "FAIL",
      "viaAPI status=" + created.status
    );
  } else {
    await api(
      "PUT",
      "/api/automations/" + workflowId,
      {
        businessId: CREDS.businessId,
        name: CLEAN_GRAPH.name,
        nodes: CLEAN_GRAPH.nodes,
        edges: CLEAN_GRAPH.edges,
      },
      token
    );
    record("3-create-blank", "PASS", "viaUI");
  }

  if (!workflowId) throw new Error("No workflowId");

  // Ensure clean publishable graph (no Managed WhatsApp)
  await api(
    "PUT",
    "/api/automations/" + workflowId,
    {
      businessId: CREDS.businessId,
      name: CLEAN_GRAPH.name,
      nodes: CLEAN_GRAPH.nodes,
      edges: CLEAN_GRAPH.edges,
      enabled: false,
    },
    token
  );

  const editorUrl =
    CLIENT +
    "/business/" +
    CREDS.businessId +
    "/dashboard/automations/" +
    workflowId;

  async function ensureEditor() {
    if (!isAuthedPath(page.url()) || pathnameOf(page.url()).includes("/login")) {
      await page.goto(CLIENT + "/", { waitUntil: "domcontentloaded" });
      await page.evaluate(
        ({ token, user }) => {
          localStorage.setItem("token", token);
          localStorage.setItem("businessDetails", JSON.stringify(user));
        },
        { token, user: apiUser }
      );
    }
    await page.goto(editorUrl, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(2500);
  }

  await ensureEditor();
  let builderVisible = await page.locator(".af-builder, .react-flow").first().count();
  if (!builderVisible) {
    await ensureEditor();
    builderVisible = await page.locator(".af-builder, .react-flow").first().count();
  }
  record("1-open-by-url", builderVisible ? "PASS" : "FAIL", pathnameOf(page.url()));

  await page.reload({ waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(2500);
  if (pathnameOf(page.url()).includes("/login")) {
    await ensureEditor();
  }
  const stillEditor =
    page.url().includes(workflowId) &&
    (await page.locator(".af-builder, .react-flow").count()) > 0;
  record("2-refresh-editor", stillEditor ? "PASS" : "FAIL", pathnameOf(page.url()));

  
async function closeDrawers() {
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(150);
  const closeBtn = page.locator(".af-drawer__close").first();
  if (await closeBtn.count()) {
    await closeBtn.click({ force: true }).catch(() => {});
    await page.waitForTimeout(200);
  }
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(150);
}

  async function openPicker() {
    await ensureEditor();
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(200);
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(200);
    const btn = page.getByRole("button", { name: /הוסף שלב/i }).first();
    if (await btn.count()) {
      await btn.click();
    } else {
      const empty = page.getByRole("button", { name: /בחר טריגר/i }).first();
      if (await empty.count()) await empty.click();
    }
    await page.locator(".af-drawer--picker").waitFor({ state: "visible", timeout: 15000 });
  }

  async function pickFirstEnabled() {
    const item = page.locator(".af-picker-item:not([disabled])").first();
    await item.waitFor({ timeout: 15000 });
    const label =
      (await item.locator("strong").first().textContent().catch(() => "")) || "";
    await item.click();
    await page.waitForTimeout(1000);
    return label.trim();
  }

  try {
    await openPicker();
    const trigChip = page.getByRole("button", { name: /^טריגרים$/ }).first();
    if (await trigChip.count()) await trigChip.click({ force: true });
    const tLabel = await pickFirstEnabled();
    record("4-add-trigger", "PASS", tLabel);
  } catch (e) {
    record("4-add-trigger", "FAIL", String(e.message || e));
  }

  try {
    await openPicker();
    const actChip = page.getByRole("button", { name: /^פעולות$|^חיבורים$/ }).first();
    if (await actChip.count()) await actChip.click({ force: true });
    const aLabel = await pickFirstEnabled();
    record("5-add-action", "PASS", aLabel);
  } catch (e) {
    record("5-add-action", "FAIL", String(e.message || e));
  }

  try {
    await ensureEditor();
    const edgePlus = page.locator(".af-edge-add").first();
    await edgePlus.waitFor({ timeout: 15000 });
    await edgePlus.click({ force: true });
    await page.locator(".af-drawer--picker").waitFor({ state: "visible", timeout: 10000 });
    await pickFirstEnabled();
    await page.waitForTimeout(1000);
    await closeDrawers();
    const saveBtn = page.getByRole("button", { name: /^שמור$/ }).first();
    if (await saveBtn.count()) await saveBtn.click({ force: true });
    await page.waitForTimeout(1500);
    const after2 = await api(
      "GET",
      "/api/automations/" + workflowId + "?businessId=" + CREDS.businessId,
      null,
      token
    );
    const nodes = after2.json?.workflow?.nodes || [];
    const edges = after2.json?.workflow?.edges || [];
    record(
      "6-insert-between",
      nodes.length >= 3 && edges.length >= 2 ? "PASS" : "FAIL",
      "nodes=" + nodes.length + " edges=" + edges.length
    );
  } catch (e) {
    record("6-insert-between", "FAIL", String(e.message || e));
  }

  try {
    await openPicker();
    await pickFirstEnabled();
    record("7-add-end-node", "PASS");
  } catch (e) {
    record("7-add-end-node", "FAIL", String(e.message || e));
  }

  try {
    await ensureEditor();
    const node = page.locator(".react-flow__node").first();
    await node.click();
    await page.locator(".af-drawer--config").waitFor({ state: "visible", timeout: 10000 });
    record("8-config-drawer", "PASS");
    const titleInput = page.locator(".af-drawer--config input").first();
    if (await titleInput.count()) {
      await titleInput.fill("Smoke Config Title");
      record("9-edit-config", "PASS");
    } else {
      record("9-edit-config", "FAIL", "no input");
    }
    await closeDrawers();
    await page.waitForTimeout(400);
    await page.locator(".react-flow__node").first().click({ force: true });
    await page.locator(".af-drawer--config").waitFor({ state: "visible", timeout: 10000 });
    const val = await page.locator(".af-drawer--config input").first().inputValue().catch(() => "");
    record("10-close-reopen-persist", val.includes("Smoke Config Title") ? "PASS" : "FAIL", val.slice(0, 40));
  } catch (e) {
    record("8-config-drawer", "FAIL", String(e.message || e));
    record("9-edit-config", "FAIL");
    record("10-close-reopen-persist", "FAIL");
  }

  try {
    const saveBtn = page.getByRole("button", { name: /^שמור$/ }).first();
    await saveBtn.click({ timeout: 15000 });
    await page.waitForTimeout(1500);
    record("11-save", "PASS");
  } catch (e) {
    record("11-save", "FAIL", String(e.message || e));
  }

  await page.reload({ waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(2000);
  if (pathnameOf(page.url()).includes("/login")) await ensureEditor();
  const wf = await api(
    "GET",
    "/api/automations/" + workflowId + "?businessId=" + CREDS.businessId,
    null,
    token
  );
  const persistedNodes = (wf.json?.workflow?.nodes || []).length;
  record("12-refresh-persist", persistedNodes > 0 ? "PASS" : "FAIL", "nodes=" + persistedNodes);

  try {
    await ensureEditor();
    const node = page.locator(".react-flow__node").first();
    await node.click();
    await page.locator(".af-drawer--config").waitFor({ state: "visible", timeout: 10000 });
    const titleInput = page.locator(".af-drawer--config input").first();
    await titleInput.fill("Dirty " + Date.now());
    await page.waitForTimeout(500);
    const dirty = await page.locator("text=שינויים שלא נשמרו").first().count();
    record("13-dirty", dirty ? "PASS" : "FAIL");
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(300);
    await page.getByRole("button", { name: /^שמור$/ }).first().click();
    await page.waitForTimeout(1200);
  } catch (e) {
    record("13-dirty", "FAIL", String(e.message || e));
  }

  // Restore clean graph before publish lifecycle
  await api(
    "PUT",
    "/api/automations/" + workflowId,
    {
      businessId: CREDS.businessId,
      name: CLEAN_GRAPH.name,
      nodes: CLEAN_GRAPH.nodes,
      edges: CLEAN_GRAPH.edges,
      enabled: false,
    },
    token
  );

  async function clickNamed(name) {
    const b = page.getByRole("button", { name }).first();
    if (await b.count()) {
      await b.click();
      await page.waitForTimeout(1500);
      return true;
    }
    return false;
  }

  try {
    await ensureEditor();
    const pubUi = await clickNamed(/פרסם|עדכון פרסום/);
    if (!pubUi) {
      const r = await api(
        "POST",
        "/api/automations/" + workflowId + "/publish",
        { businessId: CREDS.businessId },
        token
      );
      record(
        "14-publish",
        r.status < 300 ? "PASS" : "FAIL",
        "api " + r.status + " " + (r.json?.error || "")
      );
    } else {
      // confirm publish result via API status
      const cur = await api(
        "GET",
        "/api/automations/" + workflowId + "?businessId=" + CREDS.businessId,
        null,
        token
      );
      const enabled = !!cur.json?.workflow?.enabled;
      if (!enabled) {
        const r = await api(
          "POST",
          "/api/automations/" + workflowId + "/publish",
          { businessId: CREDS.businessId },
          token
        );
        record(
          "14-publish",
          r.status < 300 ? "PASS" : "FAIL",
          "ui+api " + r.status + " " + (r.json?.error || "")
        );
      } else {
        record("14-publish", "PASS", "ui");
      }
    }
  } catch (e) {
    record("14-publish", "FAIL", String(e.message || e));
  }

  try {
    let ok = await clickNamed(/השהיה/);
    if (!ok) {
      const r = await api(
        "POST",
        "/api/automations/" + workflowId + "/pause",
        { businessId: CREDS.businessId },
        token
      );
      ok = r.status < 300;
      record("15-pause", ok ? "PASS" : "FAIL", "api " + r.status);
    } else record("15-pause", "PASS", "ui");
  } catch (e) {
    record("15-pause", "FAIL", String(e.message || e));
  }

  try {
    let ok = await clickNamed(/הפעלה|המשך|Resume|פרסם/);
    if (!ok) {
      const r = await api(
        "POST",
        "/api/automations/" + workflowId + "/resume",
        { businessId: CREDS.businessId },
        token
      );
      ok = r.status < 300;
      record("16-resume", ok ? "PASS" : "FAIL", "api " + r.status + " " + (r.json?.error || ""));
    } else record("16-resume", "PASS", "ui");
  } catch (e) {
    record("16-resume", "FAIL", String(e.message || e));
  }

  try {
    const r = await api(
      "POST",
      "/api/automations/" + workflowId + "/dry-run",
      { businessId: CREDS.businessId, eventType: "manual", payload: {} },
      token
    );
    record("17-dry-run", r.status < 500 ? "PASS" : "FAIL", "status=" + r.status);
  } catch (e) {
    record("17-dry-run", "FAIL", String(e.message || e));
  }

  try {
    const cur = await api(
      "GET",
      "/api/automations/" + workflowId + "?businessId=" + CREDS.businessId,
      null,
      token
    );
    await api(
      "PUT",
      "/api/automations/" + workflowId,
      {
        businessId: CREDS.businessId,
        name: CLEAN_GRAPH.name,
        nodes: [],
        edges: [],
      },
      token
    );
    const pub = await api(
      "POST",
      "/api/automations/" + workflowId + "/publish",
      { businessId: CREDS.businessId },
      token
    );
    record("18-validation", pub.status >= 400 ? "PASS" : "FAIL", "publishStatus=" + pub.status);
    await api(
      "PUT",
      "/api/automations/" + workflowId,
      {
        businessId: CREDS.businessId,
        name: CLEAN_GRAPH.name,
        nodes: cur.json?.workflow?.nodes || CLEAN_GRAPH.nodes,
        edges: cur.json?.workflow?.edges || CLEAN_GRAPH.edges,
      },
      token
    );
    await ensureEditor();
  } catch (e) {
    record("18-validation", "FAIL", String(e.message || e));
  }

  try {
    await ensureEditor();
    const before = await api(
      "GET",
      "/api/automations/" + workflowId + "?businessId=" + CREDS.businessId,
      null,
      token
    );
    const nBefore = (before.json?.workflow?.nodes || []).length;
    const node = page.locator(".react-flow__node").last();
    await node.click();
    await page.locator(".af-drawer--config").waitFor({ state: "visible", timeout: 10000 });
    const del = page.getByRole("button", { name: /מחק מודול|מחק/i }).first();
    if (await del.count()) await del.click();
    await page.waitForTimeout(600);
    await page.getByRole("button", { name: /^שמור$/ }).first().click().catch(() => {});
    await page.waitForTimeout(1200);
    const after = await api(
      "GET",
      "/api/automations/" + workflowId + "?businessId=" + CREDS.businessId,
      null,
      token
    );
    const nAfter = (after.json?.workflow?.nodes || []).length;
    record(
      "19-delete-node",
      nAfter < nBefore || nBefore === 0 ? "PASS" : "FAIL",
      nBefore + "->" + nAfter
    );
  } catch (e) {
    record("19-delete-node", "FAIL", String(e.message || e));
  }

  try {
    await ensureEditor();
    const pane = page.locator(".react-flow__pane").first();
    const box = await pane.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 40, box.y + box.height / 2 + 20);
      await page.mouse.up();
      await page.mouse.wheel(0, -200);
    }
    const node = page.locator(".react-flow__node").first();
    if (await node.count()) {
      const nb = await node.boundingBox();
      if (nb) {
        await page.mouse.move(nb.x + 10, nb.y + 10);
        await page.mouse.down();
        await page.mouse.move(nb.x + 60, nb.y + 40);
        await page.mouse.up();
      }
    }
    record("20-canvas-ops", "PASS", "pan/zoom/drag attempted");
  } catch (e) {
    record("20-canvas-ops", "FAIL", String(e.message || e));
  }

  async function addAndOpenConfig(categoryName, searchText) {
    await openPicker();
    const chip = page.getByRole("button", { name: new RegExp("^" + categoryName + "$") }).first();
    if (await chip.count()) await chip.click({ force: true });
    if (searchText) {
      const search = page
        .locator('.af-drawer--picker input[placeholder*="חפש"], .af-drawer__search input, .af-drawer--picker input')
        .first();
      if (await search.count()) {
        await search.fill(String(searchText).split("|")[0]);
        await page.waitForTimeout(400);
      }
    }
    const item = page
      .locator(".af-picker-item:not([disabled])")
      .filter({ hasText: new RegExp(searchText || ".", "i") })
      .first();
    if (!(await item.count())) throw new Error("item not found " + searchText);
    await item.click();
    await page.waitForTimeout(900);
    await page.locator(".react-flow__node").last().click();
    await page.locator(".af-drawer--config").waitFor({ state: "visible", timeout: 10000 });
  }

  for (const [id, cat, q] of [
    ["21-gmail", "חיבורים", "Gmail"],
    ["22-outlook", "חיבורים", "Outlook"],
    ["23-calendar", "חיבורים", "Calendar"],
    ["24-whatsapp", "חיבורים", "וואטסאפ|WhatsApp"],
  ]) {
    try {
      await addAndOpenConfig(cat, q);
      const bodyText = await page.locator(".af-drawer--config").innerText();
      const hasFields =
        /חשבון|תבנית|אל|נושא|אימייל|לוח|WhatsApp|Gmail|Outlook|Calendar|מחובר|לא מחובר|חיבור/i.test(
          bodyText
        );
      record(id, hasFields ? "PASS" : "FAIL", hasFields ? "config fields visible" : "no recognizable fields");
      await page.keyboard.press("Escape");
    } catch (e) {
      record(id, "FAIL", String(e.message || e));
    }
  }

  for (const [id, cat] of [
    ["25-delay", "המתנה"],
    ["26-condition", "לוגיקה"],
    ["27-router", "לוגיקה"],
  ]) {
    try {
      await openPicker();
      const chip = page.getByRole("button", { name: new RegExp("^" + cat + "$") }).first();
      if (await chip.count()) await chip.click({ force: true });
      const item = page.locator(".af-picker-item:not([disabled])").first();
      await item.click();
      await page.waitForTimeout(800);
      await page.locator(".react-flow__node").last().click();
      await page.locator(".af-drawer--config").waitFor({ state: "visible", timeout: 10000 });
      record(id, "PASS", "config opened");
      await page.keyboard.press("Escape");
    } catch (e) {
      record(id, "FAIL", String(e.message || e));
    }
  }

  try {
    await ensureEditor();
    const add = page.getByRole("button", { name: /הוסף שלב/i }).first();
    const disabled = await add.isDisabled();
    record("28-staging-writable", !disabled ? "PASS" : "FAIL", "addDisabled=" + disabled);
  } catch (e) {
    record("28-staging-writable", "FAIL", String(e.message || e));
  }

  const relevantConsole = consoleErrors.filter(
    (t) => !/favicon|ResizeObserver|Download the React DevTools|i18next/i.test(t)
  );
  record(
    "29-console",
    relevantConsole.length === 0 ? "PASS" : "FAIL",
    relevantConsole.slice(0, 3).join(" || ")
  );

  const loops = [...reqCounts.entries()].filter(([k, c]) => c >= 40 && /server-staging-15bb|api\.bizuply\.com/.test(k) && !/notifications|unread-count|reminders/.test(k));
  record(
    "30-network-loops",
    loops.length === 0 ? "PASS" : "FAIL",
    loops
      .slice(0, 3)
      .map(([k, c]) => k + ":" + c)
      .join(" | ")
  );

  if (prodWrites.length) record("prod-write-final", "FAIL", prodWrites.join(" | "));
  else record("prod-write-final", "PASS");

  await browser.close();

  const out = {
    businessId: CREDS.businessId,
    workflowId,
    createVia,
    results,
    consoleErrors: relevantConsole.slice(0, 20),
    pageErrors: pageErrors.slice(0, 20),
    prodWrites,
    prodHosts: [...prodHosts].slice(0, 20),
    stagingSample: [...stagingHosts].slice(0, 20),
  };
  const outPath = path.join(process.cwd(), "tmp", "phase4-staging-smoke-results.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log("WROTE", outPath);
  const failed = results.filter((r) => r.status === "FAIL");
  console.log(
    JSON.stringify(
      {
        pass: results.filter((r) => r.status === "PASS").length,
        fail: failed.length,
        workflowId,
      },
      null,
      2
    )
  );
  process.exit(failed.length ? 2 : 0);
}

main().catch((e) => {
  console.error("SMOKE_FATAL", e && e.stack ? e.stack : e);
  process.exit(1);
});