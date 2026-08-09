const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const CLIENT = "https://mybusiness-platform-client-staging.vercel.app";
const CREDS = JSON.parse(
  fs.readFileSync(
    process.env.CREDS_FILE ||
      path.join(process.env.TEMP, "bizuply-phase4-staging-smoke-creds.json"),
    "utf8"
  )
);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const logs = [];
  page.on("console", (m) => logs.push(m.type() + ": " + m.text()));
  page.on("response", (r) => {
    if (
      r.url().includes("/auth/login") ||
      r.url().includes("/auth/me") ||
      r.url().includes("/auth/refresh")
    ) {
      logs.push("RESP " + r.status() + " " + r.url());
    }
  });

  await page.goto(CLIENT + "/login", { waitUntil: "networkidle", timeout: 90000 });
  await page.fill('input[name="email"]', CREDS.email);
  await page.fill('input[name="password"]', CREDS.password);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(8000);

  const pathname = new URL(page.url()).pathname;
  const token = await page.evaluate(() => localStorage.getItem("token"));
  const biz = await page.evaluate(() => localStorage.getItem("businessDetails"));
  const bodyText = await page.locator("body").innerText().catch(() => "");

  console.log(
    JSON.stringify(
      {
        pathname,
        hasToken: Boolean(token),
        tokenLen: token ? token.length : 0,
        hasBiz: Boolean(biz),
        bodySnippet: String(bodyText).replace(/\s+/g, " ").slice(0, 240),
        logs: logs.slice(0, 40),
      },
      null,
      2
    )
  );
  await browser.close();
})().catch((e) => {
  console.error(String(e && e.stack ? e.stack : e));
  process.exit(1);
});