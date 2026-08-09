const https = require("https");
const fs = require("fs");
const base = "https://mybusiness-platform-client-staging.vercel.app";
const chunks = [
  "/assets/index-cgS3GA-R.js",
  "/assets/App-Cyfjk5HI.js",
  "/assets/AutomationsMain-BoICCfCH.js",
  "/assets/WebsiteStudioPage-CAx5BtoT.js",
  "/assets/BusinessDashboardRoutes-Bn7eqd3J.js",
  "/assets/CRMLeadsTab-C-ENYPk_.js",
  "/assets/CRMClientsTab-D2gu6rcf.js",
  "/assets/SiteManagementPanelPage-DNtvZjff.js",
  "/assets/AdminSoftphone-BETU5ReG.js",
  "/assets/CollabMessagesTab-BWIa8E_v.js",
];
function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunksBuf = [];
      res.on("data", (d) => chunksBuf.push(d));
      res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunksBuf).toString("utf8") }));
    }).on("error", reject);
  });
}
(async () => {
  let prod = 0, staging = 0;
  const details = [];
  for (const a of chunks) {
    const js = await get(base + a);
    const p = (js.body.match(/api\.bizuply\.com/g) || []).length;
    const s = (js.body.match(/server-staging-15bb\.up\.railway\.app/g) || []).length;
    prod += p; staging += s;
    details.push({ a, status: js.status, len: js.body.length, prod: p, staging: s });
  }
  const out = { BUNDLE_PROD_API_HITS: prod, STAGING_URL_HITS: staging, details };
  console.log(JSON.stringify(out, null, 2));
  fs.writeFileSync("tmp/staging-bundle-scan-chunks.json", JSON.stringify(out, null, 2));
})().catch((e) => { console.error(e); process.exit(1); });
