#!/usr/bin/env node
/**
 * Read-only Invistimo WhatsApp acceptance runner.
 *
 * The operator logs in once in a local headed browser. Auth state stays on
 * their machine under .auth/ (gitignored). This script never prints cookies,
 * tokens, or passwords, and it never attaches to the Cursor Browser panel.
 *
 * Mutating WhatsApp API calls are blocked after login. The runner does not
 * auto-reconnect, switch accounts, or bypass access limits.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const AUTH_DIR = path.join(here, ".auth");
const RESULTS_DIR = path.join(here, "results");
const SHOT_DIR = path.join(RESULTS_DIR, "screenshots");
const STATE_FILE = path.join(AUTH_DIR, "invistimo.storage.json");

const INVISTIMO_BUSINESS_ID =
  process.env.INVISTIMO_BUSINESS_ID || "6a8df4e95c704a03773a9966";
const OTHER_BUSINESS_ID = process.env.INVISTIMO_OTHER_BUSINESS_ID || "";
const LOGIN_URL =
  process.env.INVISTIMO_LOGIN_URL || "https://bizuply.com/whatsapp-api/login";

function readSessionOrigin() {
  try {
    if (!fs.existsSync(STATE_FILE)) return "";
    const data = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
    const origins = (data.origins || []).map((o) => String(o.origin || "")).filter(Boolean);
    return (
      origins.find((o) => /^https:\/\/(whatsapp\.)?bizuply\.com$/i.test(o)) || ""
    );
  } catch {
    return "";
  }
}

const ORIGIN =
  process.env.INVISTIMO_ORIGIN ||
  readSessionOrigin() ||
  "https://whatsapp.bizuply.com";
const HUB = `${ORIGIN}/business/${INVISTIMO_BUSINESS_ID}/dashboard/whatsapp`;

const BLOCKED_WRITE = /\/api\/whatsapp(\/|$)/i;
const BLOCKED_PATH = /cutover|migrate|send-test|campaigns\/send|history-import|webhook/i;
const DANGER_CLICK =
  /send|שלח|cutover|migrate|העבר|disconnect|נתק|webhook|meta register/i;
const SECRET_TEXT =
  /Bearer\s+[A-Za-z0-9._~+/=-]+|eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9._-]+|(?:password|passwd|pwd|token|cookie|authorization|secret|api[_-]?key)[=:]\s*[^&\s,;]+/gi;

const MODULES = [
  {
    id: "dashboard",
    title: "Dashboard",
    path: "/overview",
    expectPath: "/dashboard/whatsapp/overview",
    marker: "[data-demo-target='whatsapp-overview'], [data-testid='whatsapp-module-dashboard']",
  },
  {
    id: "inbox",
    title: "Inbox",
    path: "/inbox",
    expectPath: "/dashboard/whatsapp/inbox",
    marker: "",
  },
  {
    id: "templates",
    title: "Templates",
    path: "/templates",
    expectPath: "/dashboard/whatsapp/templates",
    marker: "",
  },
  {
    id: "contacts",
    title: "Contacts / Guests",
    path: "/contacts",
    expectPath: "/dashboard/whatsapp/contacts",
    marker: "",
  },
  {
    id: "automations",
    title: "Automations",
    path: "/automations",
    expectPath: "/dashboard/whatsapp/automations",
    marker: "",
  },
  {
    id: "agents",
    title: "Agents",
    path: "/agents",
    expectPath: "/dashboard/whatsapp/agents",
    marker: "",
  },
  {
    id: "scheduled",
    title: "Scheduled Messages",
    path: "/scheduled",
    expectPath: "/dashboard/whatsapp/scheduled",
    marker: "",
  },
  {
    id: "reports",
    title: "Reports / Performance",
    path: "/insights",
    expectPath: "/dashboard/whatsapp/insights",
    marker: "",
  },
  {
    id: "billing",
    title: "Billing",
    path: "/billing",
    expectPath: "/dashboard/whatsapp/billing",
    marker: "",
  },
  {
    id: "connection",
    title: "Connection",
    path: "/connection",
    expectPath: "/dashboard/whatsapp/connection",
    marker: "#whatsapp-connection-settings, [data-testid='whatsapp-module-connection']",
  },
];

function ensureDirs() {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
  fs.mkdirSync(SHOT_DIR, { recursive: true });
}

function redact(value) {
  return String(value ?? "").replace(SECRET_TEXT, "[redacted]");
}

function apiPath(url) {
  try {
    return new URL(url).pathname;
  } catch {
    return "[url]";
  }
}

function extractBusinessIds(url) {
  const ids = [];
  try {
    const parsed = new URL(url);
    const fromPath = parsed.pathname.match(/\/business\/([^/]+)/i);
    if (fromPath?.[1]) ids.push(fromPath[1]);
    const fromQuery = parsed.searchParams.get("businessId");
    if (fromQuery) ids.push(fromQuery);
  } catch {
    return [];
  }
  return [...new Set(ids.map((id) => String(id).trim()).filter(Boolean))];
}

function looksOnInvistimoTenant(url) {
  return String(url || "").includes(`/business/${INVISTIMO_BUSINESS_ID}/`);
}

function looksOnWhatsAppHub(url) {
  const u = String(url || "");
  return looksOnInvistimoTenant(u) && u.includes("/dashboard/whatsapp");
}

function sanitizeApiRow(row) {
  return {
    status: row.status,
    method: row.method,
    path: apiPath(row.path.startsWith("http") ? row.path : `https://local.invalid${row.path}`),
  };
}

async function attachGuards(page, findings) {
  page.on("pageerror", (err) => {
    findings.jsErrors.push(redact(err?.message || err));
  });
  page.on("console", (msg) => {
    if (msg.type() === "error") findings.consoleErrors.push(redact(msg.text()));
  });
  page.on("response", (res) => {
    const url = res.url();
    if (!url.includes("/api/whatsapp")) return;
    const businessIds = extractBusinessIds(url);
    findings.api.push({
      status: res.status(),
      method: res.request().method(),
      path: apiPath(url),
      businessIds,
    });
    if (businessIds.some((id) => id !== INVISTIMO_BUSINESS_ID)) {
      findings.notes.push("FAIL: WhatsApp API targeted a non-Invistimo businessId");
    }
  });
  await page.route("**/*", async (route) => {
    const req = route.request();
    const url = req.url();
    const method = req.method();
    const write = !["GET", "HEAD", "OPTIONS"].includes(method);
    if (write && (BLOCKED_WRITE.test(url) || BLOCKED_PATH.test(url))) {
      findings.blockedWrites.push(`${method} ${apiPath(url)}`);
      return route.abort("blockedbyclient");
    }
    return route.continue();
  });
}

async function screenshotSafe(page, dest) {
  const mask = page.locator(
    'input[type="password"], input[name*="password" i], input[name*="token" i], input[autocomplete="current-password"], input[autocomplete="one-time-code"]'
  );
  await page.screenshot({
    path: dest,
    fullPage: true,
    animations: "disabled",
    mask: (await mask.count()) ? [mask] : [],
  });
}

async function loginIfNeeded(browser) {
  if (fs.existsSync(STATE_FILE)) {
    return { reused: true };
  }
  if (!process.stdin.isTTY) {
    throw new Error(
      "No saved local Invistimo login. Run `npm run test:invistimo-accept` in a terminal and sign in as support@invistimo.com when Chromium opens. The runner will not log in automatically or bypass access. Do not commit e2e/invistimo-whatsapp-acceptance/.auth/"
    );
  }
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(LOGIN_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  process.stderr.write(
    `\nSign in as support@invistimo.com in the opened window.\nWaiting for the Invistimo WhatsApp hub …\n`
  );
  const deadline = Date.now() + 10 * 60 * 1000;
  while (Date.now() < deadline) {
    if (looksOnInvistimoTenant(page.url())) {
      await context.storageState({ path: STATE_FILE });
      await context.close();
      return { reused: false };
    }
    await page.waitForTimeout(1000);
  }
  await context.close();
  throw new Error(
    "Login timed out. The operator must finish sign-in in the headed browser. The runner will not retry or bypass login."
  );
}

async function assertInvistimoSession(context) {
  const page = await context.newPage();
  try {
    await page.goto(HUB, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(1500);
    const url = page.url();
    if (/\/login|whatsapp-api\/login/i.test(url)) {
      throw new Error(
        "Saved session is not signed in as Invistimo. Delete e2e/invistimo-whatsapp-acceptance/.auth/ and run again in a terminal to sign in yourself. The runner will not log in automatically."
      );
    }
    if (!looksOnWhatsAppHub(url)) {
      throw new Error(
        "Connected session is not the Invistimo WhatsApp hub. Tests were not started. The runner will not switch accounts or bypass access."
      );
    }
    const identity = await page.evaluate((expectedId) => {
      const tokenPresent = Boolean(window.localStorage.getItem("token"));
      const managed = String(window.localStorage.getItem("managedBusinessId") || "").trim();
      const body = String(document.body?.innerText || "");
      return {
        tokenPresent,
        managedIsInvistimo: !managed || managed === expectedId,
        hasInvistimoLabel: /Invistimo/i.test(body),
        onHub: location.pathname.includes(`/business/${expectedId}/dashboard/whatsapp`),
      };
    }, INVISTIMO_BUSINESS_ID);
    if (!identity.tokenPresent || !identity.onHub || !identity.managedIsInvistimo) {
      throw new Error(
        "Connected account is not Invistimo. Tests were not started. The runner will not reconnect or bypass access."
      );
    }
    process.stderr.write("Invistimo session confirmed. Starting module checks…\n");
    return { confirmed: true, hasInvistimoLabel: identity.hasInvistimoLabel };
  } finally {
    await page.close();
  }
}

function moduleResult(id, title) {
  return {
    id,
    title,
    status: "FAIL",
    url: "",
    notes: [],
    jsErrors: [],
    consoleErrors: [],
    api: [],
    blockedWrites: [],
    screenshot: "",
  };
}

function decideStatus(row) {
  const fatal =
    row.notes.some((n) => n.startsWith("FAIL:")) ||
    row.jsErrors.length > 0 ||
    row.api.some((a) => a.status >= 500);
  const blocked = row.notes.some((n) => n.startsWith("BLOCKED:"));
  const authDenied = row.api.some((a) => a.status === 401 || a.status === 403);
  if (fatal) return "FAIL";
  if (blocked) return "BLOCKED";
  if (authDenied && !row.notes.some((n) => n.includes("loaded"))) return "FAIL";
  return "PASS";
}

async function runModule(context, mod) {
  const findings = moduleResult(mod.id, mod.title);
  const page = await context.newPage();
  await attachGuards(page, findings);
  const url = `${HUB}${mod.path}`;
  findings.url = url;
  try {
    const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    if (res && res.status() >= 400) {
      findings.notes.push(`FAIL: document HTTP ${res.status()}`);
    }
    await page.waitForTimeout(2500);
    const finalUrl = page.url();
    findings.url = finalUrl.split("?")[0];
    if (finalUrl.includes("/whatsapp-api/login") || finalUrl.includes("/login")) {
      findings.notes.push("FAIL: redirected to login");
    }
    if (!finalUrl.includes(`/business/${INVISTIMO_BUSINESS_ID}/`)) {
      findings.notes.push("FAIL: left Invistimo tenant");
    }
    const onExpectedPath = finalUrl.includes(mod.expectPath);
    const onConnection = /\/dashboard\/whatsapp\/connection(\/|$|\?)/.test(finalUrl);
    if (mod.id !== "connection" && onConnection) {
      findings.notes.push(
        "BLOCKED: redirected to Connection instead of the requested module"
      );
    } else if (!onExpectedPath) {
      findings.notes.push(`FAIL: expected path ${mod.expectPath}`);
    } else if (mod.marker) {
      const mark = page.locator(mod.marker);
      if (!(await mark.count())) {
        findings.notes.push("FAIL: expected module content was not rendered");
      }
    }
    const spinner = page.locator('[data-testid="whatsapp-tab-suspense"]');
    if ((await spinner.count()) && (await spinner.first().isVisible())) {
      await spinner.first().waitFor({ state: "hidden", timeout: 15000 }).catch(() => {
        findings.notes.push("FAIL: tab spinner still visible");
      });
    }
    const bodyText = ((await page.locator("body").innerText().catch(() => "")) || "").slice(0, 4000);
    if (/application error|chunkloaderror|cannot get \//i.test(bodyText)) {
      findings.notes.push("FAIL: error page");
    }
    const danger = page.getByRole("button", { name: DANGER_CLICK });
    const dangerCount = await danger.count();
    if (dangerCount) {
      findings.notes.push(`INFO: ${dangerCount} send/cutover-like buttons visible (not clicked)`);
    }
    const shot = path.join(SHOT_DIR, `${mod.id}.png`);
    await screenshotSafe(page, shot);
    findings.screenshot = path.relative(here, shot);
    if (
      !findings.notes.some((n) => n.startsWith("FAIL:") || n.startsWith("BLOCKED:"))
    ) {
      findings.notes.push("loaded");
    }
  } catch (err) {
    findings.notes.push(`FAIL: ${redact(err.message)}`);
  } finally {
    await page.close();
  }
  findings.status = decideStatus(findings);
  return findings;
}

async function runIsolation(context) {
  const findings = moduleResult("isolation", "Other-tenant isolation");
  if (!OTHER_BUSINESS_ID) {
    findings.status = "SKIP";
    findings.notes.push(
      "SKIP: set INVISTIMO_OTHER_BUSINESS_ID to an authorized non-Invistimo business to run this check"
    );
    return findings;
  }
  const page = await context.newPage();
  await attachGuards(page, findings);
  const url = `${ORIGIN}/business/${OTHER_BUSINESS_ID}/dashboard/whatsapp/automations`;
  findings.url = url;
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(2000);
    findings.url = page.url().split("?")[0];
    const hrefs = await page.$$eval('a[href*="/dashboard/whatsapp/"]', (els) =>
      els.map((a) => a.getAttribute("href") || "")
    );
    const leaked = hrefs.filter((h) =>
      /\/(automations|contacts|agents|scheduled)(\/|$)/.test(h)
    );
    if (leaked.length) {
      findings.notes.push(`FAIL: Invistimo-only links visible: ${leaked.slice(0, 5).join(", ")}`);
    } else {
      findings.notes.push("no Invistimo-only WhatsApp nav links");
    }
    const shot = path.join(SHOT_DIR, "isolation.png");
    await screenshotSafe(page, shot);
    findings.screenshot = path.relative(here, shot);
  } catch (err) {
    findings.notes.push(`FAIL: ${redact(err.message)}`);
  } finally {
    await page.close();
  }
  findings.status = findings.notes.some((n) => n.startsWith("FAIL:")) ? "FAIL" : "PASS";
  return findings;
}

function writeReport(rows) {
  const summary = {
    generatedAt: new Date().toISOString(),
    origin: ORIGIN,
    businessId: INVISTIMO_BUSINESS_ID,
    modules: rows.map((r) => ({
      id: r.id,
      title: r.title,
      status: r.status,
      url: String(r.url || "").split("?")[0],
      notes: r.notes.map(redact),
      jsErrors: (r.jsErrors || []).map(redact),
      screenshot: r.screenshot,
      apiSample: (r.api || []).slice(0, 12).map(sanitizeApiRow),
      blockedWrites: r.blockedWrites,
    })),
  };
  const jsonPath = path.join(RESULTS_DIR, "report.json");
  fs.writeFileSync(jsonPath, JSON.stringify(summary, null, 2));
  const lines = [
    "# Invistimo WhatsApp acceptance",
    "",
    `Generated: ${summary.generatedAt}`,
    `Origin: ${ORIGIN}`,
    `Business: ${INVISTIMO_BUSINESS_ID}`,
    "",
    "| Module | Status | Notes |",
    "|---|---|---|",
    ...rows.map(
      (r) =>
        `| ${r.title} | **${r.status}** | ${r.notes.map(redact).join("; ").replace(/\|/g, "/")} |`
    ),
    "",
    "Auth state was not printed. Cookies, tokens, and passwords were not written to this report.",
    "Mutating WhatsApp API calls were blocked. One module failure does not stop the rest.",
  ];
  fs.writeFileSync(path.join(RESULTS_DIR, "report.md"), `${lines.join("\n")}\n`);
  return summary;
}

async function main() {
  ensureDirs();
  const browser = await chromium.launch({
    headless: false,
    args: ["--disable-dev-shm-usage"],
  });
  try {
    await loginIfNeeded(browser);
    const context = await browser.newContext({ storageState: STATE_FILE });
    await assertInvistimoSession(context);
    const rows = [];
    for (const mod of MODULES) {
      process.stderr.write(`Checking ${mod.title}…\n`);
      try {
        rows.push(await runModule(context, mod));
      } catch (err) {
        const row = moduleResult(mod.id, mod.title);
        row.notes.push(`FAIL: ${redact(err.message)}`);
        row.status = "FAIL";
        rows.push(row);
      }
    }
    try {
      rows.push(await runIsolation(context));
    } catch (err) {
      const row = moduleResult("isolation", "Other-tenant isolation");
      row.notes.push(`FAIL: ${redact(err.message)}`);
      row.status = "FAIL";
      rows.push(row);
    }
    await context.close();
    const summary = writeReport(rows);
    const failed = rows.filter((r) => r.status === "FAIL" || r.status === "BLOCKED").length;
    process.stderr.write(
      `\nWrote ${path.join(RESULTS_DIR, "report.md")} (${failed} FAIL/BLOCKED)\n`
    );
    console.log(
      JSON.stringify(
        {
          failed,
          results: path.relative(process.cwd(), RESULTS_DIR),
          modules: summary.modules.map((m) => ({ id: m.id, status: m.status })),
        },
        null,
        2
      )
    );
    process.exitCode = failed ? 1 : 0;
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(redact(err.message || err));
  process.exit(2);
});
