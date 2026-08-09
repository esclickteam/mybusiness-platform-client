const https = require("https");
const { chromium } = require("playwright");

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

async function scanBundleForMarkers() {
  const origin = "https://bizuply.com";
  const html = (await get(origin + "/login")).body;
  const assets = [
    ...new Set(
      [...html.matchAll(/(?:src|href)=["'](\/assets\/[^"']+\.js)["']/g)].map(
        (m) => m[1]
      )
    ),
  ];
  let markers = {
    SESSION_REVOKED: 0,
    AUTH_VERSION_MISMATCH: 0,
    sessionInvalid: 0,
    stagingHost: 0,
    prodApi: 0,
  };
  for (let i = 0; i < Math.min(assets.length, 40); i += 1) {
    const path = assets[i];
    const body = (await get(origin + path)).body;
    markers.SESSION_REVOKED += (body.match(/SESSION_REVOKED/g) || []).length;
    markers.AUTH_VERSION_MISMATCH += (
      body.match(/AUTH_VERSION_MISMATCH/g) || []
    ).length;
    markers.sessionInvalid += (
      body.match(/bizuply:session-invalid|sessionInvalidatedAt/g) || []
    ).length;
    markers.stagingHost += (
      body.match(/server-staging-15bb\.up\.railway\.app/g) || []
    ).length;
    markers.prodApi += (body.match(/api\.bizuply\.com/g) || []).length;
    const nested = [...body.matchAll(/["'](\/assets\/[^"']+\.js)["']/g)].map(
      (m) => m[1]
    );
    for (const n of nested) {
      if (!assets.includes(n)) assets.push(n);
    }
  }
  return { assetsConsidered: Math.min(assets.length, 40), markers };
}

async function main() {
  const results = [];
  const record = (id, status, note = "") => {
    results.push({ id, status, note });
    console.log(`[${status}] ${id}${note ? " — " + note : ""}`);
  };

  const bundle = await scanBundleForMarkers();
  if (bundle.markers.stagingHost === 0) {
    record("no_staging_url_in_bundle", "PASS", JSON.stringify(bundle.markers));
  } else {
    record("no_staging_url_in_bundle", "FAIL", JSON.stringify(bundle));
  }
  if (bundle.markers.prodApi > 0) {
    record("prod_api_target_present", "PASS", `hits=${bundle.markers.prodApi}`);
  } else {
    record("prod_api_target_present", "FAIL", "api.bizuply.com missing");
  }
  if (
    bundle.markers.SESSION_REVOKED > 0 &&
    bundle.markers.AUTH_VERSION_MISMATCH > 0
  ) {
    record("session_invalid_code_in_bundle", "PASS");
  } else {
    record(
      "session_invalid_code_in_bundle",
      "FAIL",
      JSON.stringify(bundle.markers)
    );
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const apiHosts = new Map();
  const statusCounts = {};
  const consoleErrors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text().slice(0, 200));
  });
  page.on("response", (res) => {
    try {
      const u = new URL(res.url());
      if (
        u.hostname.includes("bizuply") ||
        u.hostname.includes("railway") ||
        u.pathname.startsWith("/api")
      ) {
        apiHosts.set(u.hostname, (apiHosts.get(u.hostname) || 0) + 1);
        const st = String(res.status());
        statusCounts[st] = (statusCounts[st] || 0) + 1;
      }
    } catch {}
  });

  await page.goto("https://bizuply.com/login", {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  record(
    "login_page_loads",
    /\/login/.test(page.url()) ? "PASS" : "FAIL",
    page.url()
  );

  const hosts = [...apiHosts.keys()];
  const hasStaging = hosts.some(
    (h) => h.includes("staging") || h.includes("railway")
  );
  const hasProdApi = hosts.includes("api.bizuply.com");
  if ((hasProdApi || hosts.length === 0) && !hasStaging) {
    record("network_api_host", "PASS", hosts.join(",") || "none");
  } else {
    record("network_api_host", "FAIL", hosts.join(","));
  }

  const me = await page.evaluate(async () => {
    try {
      const res = await fetch("https://api.bizuply.com/api/auth/me", {
        credentials: "include",
      });
      return { status: res.status };
    } catch (err) {
      return { status: 0, error: String(err.message || err) };
    }
  });
  record(
    "unauth_me_rejected",
    me.status === 401 || me.status === 403 ? "PASS" : "FAIL",
    JSON.stringify(me)
  );

  await page.waitForTimeout(1500);
  record(
    "stays_on_login_after_unauth_me",
    /\/login/.test(page.url()) ? "PASS" : "FAIL",
    page.url()
  );

  const storage = await page.evaluate(() => ({
    token: localStorage.getItem("token"),
    businessDetails: localStorage.getItem("businessDetails"),
  }));
  record(
    "no_zombie_user_on_login",
    !storage.token && !storage.businessDetails ? "PASS" : "FAIL",
    JSON.stringify(storage)
  );

  const flood401 = statusCounts["401"] || 0;
  record(
    "no_401_flood",
    flood401 <= 3 ? "PASS" : "FAIL",
    `401s=${flood401} statuses=${JSON.stringify(statusCounts)}`
  );
  record(
    "console_errors_bounded",
    consoleErrors.length <= 5 ? "PASS" : "FAIL",
    `count=${consoleErrors.length}`
  );

  await browser.close();
  const failed = results.filter((r) => r.status === "FAIL");
  console.log(
    "\n=== SUMMARY ===\n" +
      JSON.stringify(
        {
          authenticatedSmoke: "BLOCKED_NO_SAFE_PROD_CREDS",
          results,
          failed: failed.length,
          apiHosts: hosts,
          statusCounts,
        },
        null,
        2
      )
  );
  process.exit(failed.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});