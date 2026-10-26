#!/usr/bin/env node
/**
 * Read-only Invistimo WhatsApp acceptance runner.
 *
 * The operator logs in once in a local headed browser. Auth state stays on
 * their machine under .auth/ (gitignored). This script never prints cookies,
 * tokens, or passwords, and it never attaches to the Cursor Browser panel.
 *
 * Mutating WhatsApp API calls are blocked after login.
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
const ORIGIN = process.env.INVISTIMO_ORIGIN || "https://whatsapp.bizuply.com";
const LOGIN_URL =
  process.env.INVISTIMO_LOGIN_URL || "https://bizuply.com/whatsapp-api/login";
const HUB = `${ORIGIN}/business/${INVISTIMO_BUSINESS_ID}/dashboard/whatsapp`;

const BLOCKED_WRITE = /\/api\/whatsapp(\/|$)/i;
const BLOCKED_PATH = /cutover|migrate|send-test|campaigns\/send|history-import|webhook/i;
const DANGER_CLICK =
  /send|שלח|cutover|migrate|העבר|disconnect|נתק|webhook|meta register/i;

const MODULES = [
  { id: "dashboard", title: "Dashboard", path: "/overview" },
  { id: "inbox", title: "Inbox", path: "/inbox" },
  { id: "templates", title: "Templates", path: "/templates" },
  { id: "contacts", title: "Contacts / Guests", path: "/contacts" },
  { id: "automations", title: "Automations", path: "/automations" },
  { id: "agents", title: "Agents", path: "/agents" },
  { id: "scheduled", title: "Scheduled Messages", path: "/scheduled" },
  { id: "reports", title: "Reports / Performance", path: "/insights" },
  { id: "billing", title: "Billing", path: "/billing" },
  { id: "connection", title: "Connection", path: "/connection" },
];

function ensureDirs() {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
  fs.mkdirSync(SHOT_DIR, { recursive: true });
}

function looksLoggedIn(url) {
  const u = String(url || "");
  return (
    u.includes(`/business/${INVISTIMO_BUSINESS_ID}/`) &&
    u.includes("/dashboard/whatsapp")
  );
}

async function attachGuards(page, findings) {
  page.on("pageerror", (err) => {
    findings.jsErrors.push(String(err?.message || err));
  });
  page.on("console", (msg) => {
    if (msg.type() === "error") findings.consoleErrors.push(msg.text());
  });
  page.on("response", (res) => {
    const url = res.url();
    if (!url.includes("/api/whatsapp")) return;
    findings.api.push({
      status: res.status(),
      method: res.request().method(),
      path: new URL(url).pathname,
    });
  });
  await page.route("**/*", async (route) => {
    const req = route.request();
    const url = req.url();
    const method = req.method();
    const write = !["GET", "HEAD", "OPTIONS"].includes(method);
    if (write && (BLOCKED_WRITE.test(url) || BLOCKED_PATH.test(url))) {
      findings.blockedWrites.push(`${method} ${new URL(url).pathname}`);
      return route.abort("blockedbyclient");
    }
    return route.continue();
  });
}

async function loginIfNeeded(browser) {
  if (fs.existsSync(STATE_FILE)) {
    return { reused: true };
  }
  if (!process.stdin.isTTY && process.env.INVISTIMO_ALLOW_HEADLESS_LOGIN !== "1") {
    throw new Error(
      "No saved local login. Run this in a terminal and sign in as support@invistimo.com when Chromium opens. Do not commit e2e/invistimo-whatsapp-acceptance/.auth/"
    );
  }
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(LOGIN_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  process.stderr.write(
    `\nSign in as support@invistimo.com in the opened window.\nWaiting for ${HUB} …\n`
  );
  const deadline = Date.now() + 10 * 60 * 1000;
  while (Date.now() < deadline) {
    if (looksLoggedIn(page.url())) {
      await context.storageState({ path: STATE_FILE });
      await context.close();
      return { reused: false };
    }
    await page.waitForTimeout(1000);
  }
  await context.close();
  throw new Error("Login timed out. The operator must finish sign-in in the headed browser.");
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
  const authDenied = row.api.some((a) => a.status === 401 || a.status === 403);
  if (fatal) return "FAIL";
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
    findings.url = finalUrl;
    if (finalUrl.includes("/whatsapp-api/login") || finalUrl.includes("/login")) {
      findings.notes.push("FAIL: redirected to login");
    }
    if (!finalUrl.includes(`/business/${INVISTIMO_BUSINESS_ID}/`)) {
      findings.notes.push("FAIL: left Invistimo tenant");
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
    await page.screenshot({ path: shot, fullPage: true });
    findings.screenshot = path.relative(here, shot);
    if (!findings.notes.some((n) => n.startsWith("FAIL:"))) {
      findings.notes.push("loaded");
    }
  } catch (err) {
    findings.notes.push(`FAIL: ${err.message}`);
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
    findings.url = page.url();
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
    await page.screenshot({ path: shot, fullPage: true });
    findings.screenshot = path.relative(here, shot);
  } catch (err) {
    findings.notes.push(`FAIL: ${err.message}`);
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
      url: r.url,
      notes: r.notes,
      jsErrors: r.jsErrors,
      screenshot: r.screenshot,
      apiSample: r.api.slice(0, 12),
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
    ...rows.map((r) => `| ${r.title} | **${r.status}** | ${r.notes.join("; ").replace(/\|/g, "/")} |`),
    "",
    "Auth state was not printed. Mutating WhatsApp API calls were blocked.",
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
    const rows = [];
    for (const mod of MODULES) {
      process.stderr.write(`Checking ${mod.title}…\n`);
      rows.push(await runModule(context, mod));
    }
    rows.push(await runIsolation(context));
    await context.close();
    const summary = writeReport(rows);
    const failed = rows.filter((r) => r.status === "FAIL").length;
    process.stderr.write(
      `\nWrote ${path.join(RESULTS_DIR, "report.md")} (${failed} FAIL)\n`
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
  console.error(err.message || err);
  process.exit(2);
});
