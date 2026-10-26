import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.PREVIEW_URL || "http://127.0.0.1:4177";
const OUT = process.env.SCREENSHOT_DIR || "/opt/cursor/artifacts/screenshots";
const INVISTIMO_ID = "6a8df4e95c704a03773a9966";
const OTHER_ID = "64f000000000000000000099";
const HUB = (id) => `${BASE}/business/${id}/dashboard/whatsapp`;

fs.mkdirSync(OUT, { recursive: true });

async function shot(page, name) {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log("shot", file);
}

async function login(page, email, password) {
  const data = await page.evaluate(
    async ({ email: em, password: pw }) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: em, password: pw }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(json));
      localStorage.setItem("token", json.accessToken);
      localStorage.setItem("businessDetails", JSON.stringify(json.user));
      return json;
    },
    { email, password }
  );
  await page.goto(
    `${HUB(data.user.businessId)}/overview`,
    { waitUntil: "domcontentloaded", timeout: 60000 }
  );
}

const browser = await chromium.launch({
  executablePath: "/usr/local/bin/google-chrome",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

await page.goto(`${BASE}/whatsapp-api/login`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.getByRole("heading", { name: /log in to your whatsapp api account/i }).waitFor({ timeout: 30000 });
if (await page.getByTestId("wa-oauth-completing").count()) {
  throw new Error("infinite login spinner on default login");
}
await shot(page, "invistimo_preview_login");

await login(page, "support@invistimo.com", "InvistimoPreview-Only-2026");
await page.goto(`${HUB(INVISTIMO_ID)}/overview`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.getByText(/Invistimo RSVP|WhatsApp via Meta|סקירה/i).first().waitFor({ timeout: 30000 });
await shot(page, "invistimo_hub_overview");

const tabs = [
  ["inbox", "invistimo_inbox"],
  ["templates", "invistimo_templates"],
  ["contacts", "invistimo_contacts"],
  ["automations", "invistimo_automations"],
  ["agents", "invistimo_agents"],
  ["scheduled", "invistimo_scheduled"],
  ["insights", "invistimo_reports"],
  ["billing", "invistimo_billing"],
  ["connection", "invistimo_connection"],
];
for (const [seg, name] of tabs) {
  await page.goto(`${HUB(INVISTIMO_ID)}/${seg}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(800);
  await shot(page, name);
}

await page.goto(`${HUB(INVISTIMO_ID)}/contacts`, { waitUntil: "domcontentloaded" });
await page.getByPlaceholder(/search guests|חיפוש מוזמנים/i).fill("Dana");
await page.getByRole("button", { name: /search|חיפוש/i }).click();
await page.waitForTimeout(400);
await shot(page, "invistimo_contacts_search");

await page.goto(`${HUB(INVISTIMO_ID)}/agents`, { waitUntil: "domcontentloaded" });
const inputs = page.locator("input");
await inputs.nth(0).fill("Acceptance Agent");
await inputs.nth(1).fill("agent.accept@invistimo.com");
await page.getByRole("button", { name: /invite agent|הזמנת נציג/i }).click();
await page.waitForTimeout(600);
await shot(page, "invistimo_agents_saved");

await page.goto(`${HUB(INVISTIMO_ID)}/scheduled`, { waitUntil: "domcontentloaded" });
const future = new Date(Date.now() + 3600_000).toISOString().slice(0, 16);
await page.locator('input[type="datetime-local"]').fill(future);
await page.getByRole("checkbox").check();
await page.getByRole("button", { name: /save scheduled|שמירת טיוטה/i }).click();
await page.waitForTimeout(600);
await shot(page, "invistimo_scheduled_saved");

await page.goto(`${HUB(INVISTIMO_ID)}/inbox`, { waitUntil: "domcontentloaded" });
await page.getByText("כן, מגיעים").first().waitFor({ timeout: 30000 });
await shot(page, "invistimo_inbox_first_load");
await page.reload({ waitUntil: "domcontentloaded" });
await page.getByText("כן, מגיעים").first().waitFor({ timeout: 30000 });
await shot(page, "invistimo_inbox_after_refresh");
await page.getByText(/Noam RSVP/i).first().click();
await page.getByText(/menu\.pdf|תפריט מצורף/i).first().waitFor({ timeout: 15000 });
await shot(page, "invistimo_inbox_files");
const reply = page.locator("textarea, input[type='text']").last();
if (await reply.count()) {
  await reply.fill("תודה, נרשם. Preview only.");
  const send = page.getByRole("button", { name: /send|שלח/i }).first();
  if (await send.count()) await send.click();
  await page.waitForTimeout(800);
}
await page.getByText("Dana Guest").first().click();
await page.getByText("תודה, נרשם. Preview only.").first().waitFor({ timeout: 15000 });
await shot(page, "invistimo_inbox_reply");

await page.goto(`${BASE}/whatsapp-api/login`, { waitUntil: "domcontentloaded" });
await page.evaluate(() => localStorage.clear());
await login(page, "other.cafe@example.test", "OtherTenantPreview-Only-2026");
await page.goto(`${HUB(OTHER_ID)}/overview`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(800);
const extras = await page.getByRole("link", { name: /automations|contacts|agents|scheduled|אוטומציות|נציגים|מוזמנים|מתוזמנות/i }).count();
await shot(page, "other_tenant_hub_no_extras");
if (extras > 0) throw new Error(`other tenant saw extra nav items: ${extras}`);

await browser.close();
console.log("acceptance screenshots done");
