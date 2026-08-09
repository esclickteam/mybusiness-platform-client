const https = require("https");
const fs = require("fs");
const base = "https://mybusiness-platform-client-staging.vercel.app";
function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on("data", (d) => chunks.push(d));
      res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString("utf8") }));
    }).on("error", reject);
  });
}
(async () => {
  const html = await get(base + "/");
  const assets = [...html.body.matchAll(/\/assets\/[^"'?]+\.js/g)].map((m) => m[0]);
  const uniq = [...new Set(assets)];
  let prod = 0, prodUrl = 0, staging = 0;
  const filesWithProd = [];
  const stagingFiles = [];
  for (const a of uniq) {
    const js = await get(base + a);
    const p = (js.body.match(/api\.bizuply\.com/g) || []).length;
    const pu = (js.body.match(/https:\/\/api\.bizuply\.com/g) || []).length;
    const s = (js.body.match(/server-staging-15bb\.up\.railway\.app/g) || []).length;
    prod += p; prodUrl += pu; staging += s;
    if (p > 0) filesWithProd.push(a + ":" + p);
    if (s > 0) stagingFiles.push(a);
  }
  const out = {
    assets: uniq.length,
    BUNDLE_PROD_API_HITS: prod,
    PROD_URL_HITS: prodUrl,
    STAGING_URL_HITS: staging,
    filesWithProd,
    stagingFilesSample: stagingFiles.slice(0, 8),
    htmlProd: (html.body.match(/api\.bizuply\.com/g) || []).length,
    htmlStaging: (html.body.match(/server-staging-15bb/g) || []).length,
  };
  console.log(JSON.stringify(out, null, 2));
  fs.writeFileSync("tmp/staging-bundle-scan-results.json", JSON.stringify(out, null, 2));
})().catch((e) => { console.error(e); process.exit(1); });
