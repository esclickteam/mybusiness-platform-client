const https = require("https");
const { URL } = require("url");

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "user-agent": "bizuply-prod-smoke" } }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () =>
        resolve({
          status: res.statusCode,
          body: Buffer.concat(chunks).toString("utf8"),
          headers: res.headers,
        })
      );
    }).on("error", reject);
  });
}

(async () => {
  const origin = "https://bizuply.com";
  const html = await get(origin + "/login");
  const assetUrls = [...html.body.matchAll(/\/assets\/[^"']+\.js/g)].map((m) => m[0]);
  const unique = [...new Set(assetUrls)].slice(0, 40);
  let stagingHits = 0;
  let prodApiHits = 0;
  let railwayHits = 0;
  const samples = [];
  for (const path of unique) {
    const res = await get(origin + path);
    const body = res.body || "";
    const s = (body.match(/server-staging-15bb\.up\.railway\.app/g) || []).length;
    const p = (body.match(/api\.bizuply\.com/g) || []).length;
    const r = (body.match(/railway\.app/g) || []).length;
    stagingHits += s;
    prodApiHits += p;
    railwayHits += r;
    if (s || r) samples.push({ path, s, r, p });
  }
  // Also scan HTML
  const htmlStaging = (html.body.match(/server-staging-15bb|railway\.app/g) || []).length;
  const htmlProd = (html.body.match(/api\.bizuply\.com/g) || []).length;
  console.log(JSON.stringify({
    loginStatus: html.status,
    assetsScanned: unique.length,
    stagingHits,
    railwayHits,
    prodApiHits,
    htmlStaging,
    htmlProd,
    samples,
  }, null, 2));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});