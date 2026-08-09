const https = require("https");

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "user-agent": "bizuply-prod-smoke" } }, (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () =>
          resolve({
            status: res.statusCode,
            body: Buffer.concat(chunks).toString("utf8"),
          })
        );
      })
      .on("error", reject);
  });
}

(async () => {
  const origin = "https://bizuply.com";
  const html = (await get(origin + "/")).body;
  const fromHtml = [
    ...html.matchAll(/(?:src|href)=["'](\/assets\/[^"']+\.js)["']/g),
  ].map((m) => m[1]);
  const all = [...new Set(fromHtml)];
  let staging = 0;
  let railway = 0;
  let prod = 0;
  const hits = [];

  for (let i = 0; i < all.length && i < 60; i += 1) {
    const path = all[i];
    const body = (await get(origin + path)).body;
    const s = (body.match(/server-staging-15bb\.up\.railway\.app/g) || []).length;
    const r = (body.match(/railway\.app/g) || []).length;
    const a = (body.match(/api\.bizuply\.com/g) || []).length;
    staging += s;
    railway += r;
    prod += a;
    if (s || r) hits.push({ path, s, r, a });

    const nested = [
      ...body.matchAll(/["'](\/assets\/[^"']+\.js)["']/g),
    ].map((m) => m[1]);
    for (const n of nested) {
      if (!all.includes(n)) all.push(n);
    }
  }

  console.log(
    JSON.stringify(
      {
        scanned: Math.min(all.length, 60),
        discovered: all.length,
        staging,
        railway,
        prod,
        hits,
      },
      null,
      2
    )
  );
})().catch((err) => {
  console.error(err);
  process.exit(1);
});