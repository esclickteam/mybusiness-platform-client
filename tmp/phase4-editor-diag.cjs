const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const CREDS = JSON.parse(fs.readFileSync(process.env.CREDS_FILE || path.join(process.env.TEMP, "bizuply-phase4-staging-smoke-creds.json"), "utf8"));
const CLIENT = "https://mybusiness-platform-client-staging.vercel.app";
const wf = "6a7751c7f90b4206f09a176b";
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const navs = [];
  page.on("framenavigated", f => { if (f === page.mainFrame()) navs.push(f.url()); });
  page.on("console", m => { if (m.type()==="error") console.log("ERR", m.text()); });
  page.on("pageerror", e => console.log("PAGEERROR", e.message));
  await page.goto(CLIENT+"/login", { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.fill('input[name="email"]', CREDS.email);
  await page.fill('input[name="password"]', CREDS.password);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);
  console.log("after login", page.url());
  const url = CLIENT+"/business/"+CREDS.businessId+"/dashboard/automations/"+wf;
  const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
  console.log("goto status", resp && resp.status());
  for (let i=0;i<10;i++) {
    await page.waitForTimeout(1000);
    console.log("t"+i, page.url(), "builder", await page.locator(".af-builder").count(), "nodes", await page.locator(".react-flow__node").count());
  }
  console.log("navs", navs.slice(-10));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });