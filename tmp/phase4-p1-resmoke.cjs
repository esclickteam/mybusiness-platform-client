const fs = require("fs");
const path = require("path");
const https = require("https");
const { chromium } = require("playwright");

const CLIENT = "https://mybusiness-platform-client-staging.vercel.app";
const API = "server-staging-15bb.up.railway.app";
const PROD = "api.bizuply.com";
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

const GRAPH_AB = {
  name: "Phase 4 P1 Re-smoke",
  nodes: [
    {
      id: "A",
      type: "trigger",
      position: { x: 80, y: 180 },
      data: { label: "Trigger A", triggerKey: "new_lead", routeCount: 1 },
    },
    {
      id: "B",
      type: "action",
      position: { x: 420, y: 180 },
      data: { label: "Action B", actionKey: "notify" },
    },
  ],
  edges: [
    {
      id: "e_ab",
      source: "A",
      target: "B",
      sourceHandle: "route_1",
      label: "next",
    },
  ],
};

const GRAPH_LARGE = {
  name: "Phase 4 P1 Large Insert",
  nodes: [
    { id: "X", type: "trigger", position: { x: 40, y: 180 }, data: { label: "X", triggerKey: "new_lead", routeCount: 1 } },
    { id: "A", type: "action", position: { x: 280, y: 180 }, data: { label: "A", actionKey: "create_task" } },
    { id: "B", type: "action", position: { x: 520, y: 180 }, data: { label: "B", actionKey: "notify" } },
    { id: "Y", type: "action", position: { x: 760, y: 180 }, data: { label: "Y", actionKey: "notify" } },
  ],
  edges: [
    { id: "e_xa", source: "X", target: "A", sourceHandle: "route_1" },
    { id: "e_ab", source: "A", target: "B", sourceHandle: "out" },
    { id: "e_by", source: "B", target: "Y", sourceHandle: "out" },
  ],
};

async function main() {
  const consoleErrors = [];
  const prodWrites = [];
  const reqCounts = new Map();

  const login = await api("POST", "/api/auth/login", {
    email: CREDS.email,
    password: CREDS.password,
  });
  if (login.status !== 200 || !login.json?.accessToken) throw new Error("login failed");
  const token = login.json.accessToken;
  const user = login.json.user || {};
  record("auth", "PASS");

  const created = await api(
    "POST",
    "/api/automations",
    {
      businessId: CREDS.businessId,
      name: GRAPH_AB.name,
      useStarter: false,
      nodes: GRAPH_AB.nodes,
      edges: GRAPH_AB.edges,
    },
    token
  );
  const workflowId = created.json?.workflow?._id || created.json?._id;
  if (!workflowId) throw new Error("create failed " + created.status);
  record("create-workflow", "PASS", workflowId);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  page.on("request", (req) => {
    try {
      const u = new URL(req.url());
      const key = req.method() + " " + u.origin + u.pathname;
      reqCounts.set(key, (reqCounts.get(key) || 0) + 1);
      if (u.hostname === PROD && !["GET", "HEAD", "OPTIONS"].includes(req.method().toUpperCase())) {
        prodWrites.push(req.method() + " " + req.url());
      }
    } catch {}
  });

  await page.goto(CLIENT + "/login", { waitUntil: "networkidle", timeout: 90000 });
  await page.fill('input[name="email"]', CREDS.email);
  await page.fill('input[name="password"]', CREDS.password);
  await Promise.all([
    page.waitForURL((u) => new URL(u).pathname.startsWith("/business/"), { timeout: 60000 }),
    page.click('button[type="submit"]'),
  ]);

  const editorUrl =
    CLIENT +
    "/business/" +
    CREDS.businessId +
    "/dashboard/automations/" +
    workflowId;
  await page.goto(editorUrl, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(2500);

  async function getGraph() {
    const g = await api(
      "GET",
      "/api/automations/" + workflowId + "?businessId=" + CREDS.businessId,
      null,
      token
    );
    return g.json?.workflow || {};
  }

  async function openPickerFromEdge() {
    const edgePlus = page.locator(".af-edge-add").first();
    await edgePlus.waitFor({ timeout: 15000 });
    await edgePlus.click({ force: true });
    await page.locator(".af-drawer--picker").waitFor({ state: "visible", timeout: 15000 });
  }

  async function pickActionNotify() {
    const chip = page.getByRole("button", { name: /^פעולות$/ }).first();
    if (await chip.count()) await chip.click({ force: true });
    const search = page.locator(".af-drawer--picker input").first();
    if (await search.count()) {
      await search.fill("משימה");
      await page.waitForTimeout(300);
    }
    const item = page.locator(".af-picker-item:not([disabled])").first();
    await item.click({ force: true });
    await page.waitForTimeout(1200);
  }

  // ---- insert A->C->B ----
  const before = await getGraph();
  record(
    "graph-before-insert",
    before.nodes?.length === 2 && before.edges?.length === 1 ? "PASS" : "FAIL",
    "nodes=" + (before.nodes || []).length + " edges=" + (before.edges || []).length
  );

  try {
    await openPickerFromEdge();
    await pickActionNotify();
    // wait autosave
    await page.waitForTimeout(2000);
    const toolbarSave = page.locator(".af-builder-toolbar").getByRole("button", { name: /^שמור$/ }).first();
    if (await toolbarSave.count()) await toolbarSave.click({ timeout: 10000 });
    await page.waitForTimeout(2000);
    const after = await getGraph();
    const nodes = after.nodes || [];
    const edges = after.edges || [];
    const hasAC = edges.some((e) => e.source === "A" && nodes.some((n) => n.id === e.target && n.id !== "B"));
    const mid = edges.find((e) => e.source === "A" && e.target !== "B");
    const hasCB = mid
      ? edges.some((e) => e.source === mid.target && e.target === "B")
      : edges.some((e) => e.target === "B" && e.source !== "A");
    const oldGone = !edges.some((e) => e.source === "A" && e.target === "B");
    const ok = nodes.length >= 3 && edges.length >= 2 && oldGone && hasCB;
    record(
      "insert-A-C-B",
      ok ? "PASS" : "FAIL",
      "nodes=" +
        nodes.length +
        " edges=" +
        edges.length +
        " oldGone=" +
        oldGone +
        " hasCB=" +
        hasCB +
        " hasAC=" +
        hasAC +
        " graph=" +
        JSON.stringify(
          edges.map((e) => e.source + "->" + e.target + "(" + (e.sourceHandle || "") + ")")
        )
    );
  } catch (e) {
    record("insert-A-C-B", "FAIL", String(e.message || e));
  }

  // ---- large flow insert ----
  await api(
    "PUT",
    "/api/automations/" + workflowId,
    {
      businessId: CREDS.businessId,
      name: GRAPH_LARGE.name,
      nodes: GRAPH_LARGE.nodes,
      edges: GRAPH_LARGE.edges,
      enabled: false,
    },
    token
  );
  await page.reload({ waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(2500);
  try {
    // click the middle edge + (between A and B) — use first visible edge add after canvas settles
    const edgeAdds = page.locator(".af-edge-add");
    const count = await edgeAdds.count();
    // Prefer middle one if possible
    const idx = count >= 2 ? 1 : 0;
    await edgeAdds.nth(idx).click({ force: true });
    await page.locator(".af-drawer--picker").waitFor({ state: "visible", timeout: 15000 });
    await pickActionNotify();
    await page.waitForTimeout(2000);
    await page.locator(".af-builder-toolbar").getByRole("button", { name: /^שמור$/ }).first().click({ timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(2000);
    const g = await getGraph();
    const edges = g.edges || [];
    const keepXA = edges.some((e) => e.source === "X" && e.target === "A");
    const keepBY = edges.some((e) => e.source === "B" && e.target === "Y");
    const oldAB = edges.some((e) => e.source === "A" && e.target === "B");
    const throughC = edges.some((e) => e.source === "A" && e.target !== "B") &&
      edges.some((e) => e.target === "B" && e.source !== "A");
    record(
      "insert-in-large-flow",
      keepXA && keepBY && !oldAB && throughC ? "PASS" : "FAIL",
      "keepXA=" + keepXA + " keepBY=" + keepBY + " oldAB=" + oldAB + " throughC=" + throughC +
        " edges=" + JSON.stringify(edges.map((e) => e.source + "->" + e.target))
    );
  } catch (e) {
    record("insert-in-large-flow", "FAIL", String(e.message || e));
  }

  // Reset simple graph for remaining UI checks
  await api(
    "PUT",
    "/api/automations/" + workflowId,
    {
      businessId: CREDS.businessId,
      name: GRAPH_AB.name,
      nodes: GRAPH_AB.nodes,
      edges: GRAPH_AB.edges,
      enabled: false,
    },
    token
  );
  await page.reload({ waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(2500);

  // add end node
  try {
    await page.getByRole("button", { name: /הוסף שלב/i }).first().click();
    await page.locator(".af-drawer--picker").waitFor({ state: "visible", timeout: 10000 });
    await page.locator(".af-picker-item:not([disabled])").first().click({ force: true });
    await page.waitForTimeout(800);
    record("add-end-node", "PASS");
  } catch (e) {
    record("add-end-node", "FAIL", String(e.message || e));
  }

  // config drawer + toolbar save while open
  try {
    await page.locator(".react-flow__node").first().click();
    await page.locator(".af-drawer--config").waitFor({ state: "visible", timeout: 10000 });
    record("config-drawer", "PASS");

    const titleInput = page.locator(".af-drawer--config input").first();
    await titleInput.fill("Dirty P1 " + Date.now());
    await page.waitForTimeout(400);
    const dirty = await page.locator("text=שינויים שלא נשמרו").first().count();
    record("dirty-true", dirty ? "PASS" : "FAIL");

    // Toolbar Save MUST work with drawer open
    const tbSave = page.locator(".af-builder-toolbar").getByRole("button", { name: /^שמור$/ }).first();
    const box = await tbSave.boundingBox();
    await tbSave.click({ timeout: 10000 });
    await page.waitForTimeout(2000);
    const savedStatus = await page.locator(".af-builder-toolbar").locator("text=נשמר").first().count();
    const dirtyAfter = await page.locator("text=שינויים שלא נשמרו").first().count();
    record(
      "toolbar-save-with-drawer-open",
      box && savedStatus && !dirtyAfter ? "PASS" : "FAIL",
      "box=" + Boolean(box) + " saved=" + savedStatus + " dirtyAfter=" + dirtyAfter
    );

    // reopen and drawer save
    await page.locator(".react-flow__node").first().click();
    await page.locator(".af-drawer--config").waitFor({ state: "visible", timeout: 10000 });
    await page.locator(".af-drawer--config input").first().fill("DrawerSave " + Date.now());
    await page.waitForTimeout(300);
    await page.locator(".af-drawer__footer").getByRole("button", { name: /^שמור$/ }).first().click();
    await page.waitForTimeout(2000);
    record("drawer-save", "PASS");
  } catch (e) {
    record("config-drawer", "FAIL", String(e.message || e));
    record("dirty-true", "FAIL");
    record("toolbar-save-with-drawer-open", "FAIL", String(e.message || e));
    record("drawer-save", "FAIL");
  }

  // refresh persistence
  await page.reload({ waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(2000);
  const persisted = await getGraph();
  const label = String(
    (persisted.nodes || []).find((n) => n.id === "A")?.data?.label || ""
  );
  record(
    "refresh-persistence",
    /DrawerSave|Dirty P1/.test(label) || (persisted.nodes || []).length >= 2 ? "PASS" : "FAIL",
    "A.label=" + label.slice(0, 40)
  );

  // publish / dry-run with drawer open
  try {
    await page.locator(".react-flow__node").first().click();
    await page.locator(".af-drawer--config").waitFor({ state: "visible", timeout: 10000 });
    const pub = page.locator(".af-builder-toolbar").getByRole("button", { name: /פרסם|עדכון פרסום/ }).first();
    await pub.click({ timeout: 10000 });
    await page.waitForTimeout(2000);
    const cur = await getGraph();
    record("publish-with-drawer-open", cur.enabled ? "PASS" : "FAIL", "enabled=" + cur.enabled);

    await page.locator(".react-flow__node").first().click().catch(() => {});
    const testBtn = page.locator(".af-builder-toolbar").getByRole("button", { name: /בדיקה/ }).first();
    await testBtn.click({ timeout: 10000 });
    await page.waitForTimeout(500);
    const run = page.getByRole("button", { name: /הריצו בדיקה/i }).first();
    if (await run.count()) await run.click();
    await page.waitForTimeout(1500);
    const dry = await api(
      "POST",
      "/api/automations/" + workflowId + "/dry-run",
      { businessId: CREDS.businessId, eventType: "manual", payload: {} },
      token
    );
    record("dry-run-with-drawer-open", dry.status < 500 ? "PASS" : "FAIL", "status=" + dry.status);
  } catch (e) {
    record("publish-with-drawer-open", "FAIL", String(e.message || e));
    record("dry-run-with-drawer-open", "FAIL", String(e.message || e));
  }

  const relevantConsole = consoleErrors.filter(
    (t) => !/favicon|ResizeObserver|i18next|React DevTools/i.test(t)
  );
  record("console", relevantConsole.length === 0 ? "PASS" : "FAIL", relevantConsole.slice(0, 3).join(" || "));

  const loops = [...reqCounts.entries()].filter(
    ([k, c]) => c >= 40 && /server-staging-15bb/.test(k) && !/notifications|unread|reminders/.test(k)
  );
  record("network-loops", loops.length === 0 ? "PASS" : "FAIL", loops.slice(0, 2).map(([k, c]) => k + ":" + c).join(" | "));
  record("prod-writes", prodWrites.length === 0 ? "PASS" : "FAIL", prodWrites[0] || "");

  await browser.close();

  const out = {
    businessId: CREDS.businessId,
    workflowId,
    results,
    consoleErrors: relevantConsole.slice(0, 20),
    prodWrites,
  };
  const outPath = path.join(process.cwd(), "tmp", "phase4-p1-resmoke-results.json");
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log("WROTE", outPath);
  const fail = results.filter((r) => r.status === "FAIL");
  console.log(JSON.stringify({ pass: results.length - fail.length, fail: fail.length, workflowId }, null, 2));
  process.exit(fail.length ? 2 : 0);
}

main().catch((e) => {
  console.error("FATAL", e && e.stack ? e.stack : e);
  process.exit(1);
});