/**
 * Staging smoke: revoked-session UX
 * Seeds a zombie logged-in state, forces SESSION_REVOKED on API calls,
 * asserts atomic redirect to /login + cleared persisted auth.
 */
const { chromium } = require("playwright");

const CLIENT = process.env.STAGING_CLIENT || "https://mybusiness-platform-client-staging.vercel.app";
const FAKE_BUSINESS_ID = "000000000000000000000001";

function makeFakeJwt(expSecondsFromNow = 3600) {
  const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      userId: "0000000000000000000000aa",
      businessId: FAKE_BUSINESS_ID,
      role: "business",
      authVersion: 0,
      exp: Math.floor(Date.now() / 1000) + expSecondsFromNow,
    })
  ).toString("base64url");
  return `${header}.${payload}.sig`;
}

async function main() {
  const results = [];
  const record = (id, status, note = "") => {
    results.push({ id, status, note });
    console.log(`[${status}] ${id}${note ? " — " + note : ""}`);
  };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let revokedHits = 0;
  let refreshHits = 0;

  await page.route("**/*", async (route) => {
    const req = route.request();
    const url = req.url();
    const isApi =
      url.includes("/api/") ||
      url.includes("server-staging-15bb.up.railway.app");

    if (!isApi) return route.continue();

    if (url.includes("/auth/refresh-token")) {
      refreshHits += 1;
      return route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          code: "REFRESH_TOKEN_INVALID",
          message: "Invalid or expired refresh token",
        }),
      });
    }

    if (url.includes("/auth/logout")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "ok" }),
      });
    }

    revokedHits += 1;
    return route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({
        code: "SESSION_REVOKED",
        error: "הפגישה בוטלה, אנא התחבר מחדש",
      }),
    });
  });

  // Seed zombie auth on origin
  await page.goto(`${CLIENT}/login`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.evaluate(
    ({ token, businessId }) => {
      localStorage.setItem("token", token);
      localStorage.setItem(
        "businessDetails",
        JSON.stringify({
          _id: "0000000000000000000000aa",
          name: "Smoke User",
          email: "smoke@example.com",
          role: "business",
          businessId,
          hasPaid: true,
          hasAccess: true,
        })
      );
      localStorage.setItem("dashboardStats", JSON.stringify({ appointments: [] }));
      sessionStorage.removeItem("bizuply:refreshDead");
    },
    { token: makeFakeJwt(), businessId: FAKE_BUSINESS_ID }
  );

  const dashUrl = `${CLIENT}/business/${FAKE_BUSINESS_ID}/dashboard`;
  await page.goto(dashUrl, { waitUntil: "domcontentloaded", timeout: 60000 });

  // Wait for redirect to login (hard replace)
  try {
    await page.waitForURL(/\/login(?:\/|$|\?)/, { timeout: 15000 });
    record("redirect_to_login", "PASS", page.url());
  } catch (err) {
    record("redirect_to_login", "FAIL", `url=${page.url()} err=${err.message}`);
  }

  const storage = await page.evaluate(() => ({
    token: localStorage.getItem("token"),
    businessDetails: localStorage.getItem("businessDetails"),
    dashboardStats: localStorage.getItem("dashboardStats"),
    refreshDead: sessionStorage.getItem("bizuply:refreshDead"),
  }));

  if (!storage.token && !storage.businessDetails) {
    record("cleared_persisted_auth", "PASS");
  } else {
    record(
      "cleared_persisted_auth",
      "FAIL",
      JSON.stringify(storage)
    );
  }

  if (storage.refreshDead === "1") {
    record("refresh_dead_marked", "PASS");
  } else {
    record("refresh_dead_marked", "FAIL", `refreshDead=${storage.refreshDead}`);
  }

  // No refresh loop: at most a small number of refresh attempts before atomic logout
  if (refreshHits <= 2) {
    record("no_refresh_loop", "PASS", `refreshHits=${refreshHits} revokedHits=${revokedHits}`);
  } else {
    record("no_refresh_loop", "FAIL", `refreshHits=${refreshHits} revokedHits=${revokedHits}`);
  }

  // Second navigation while already invalidated should stay on login (no loop)
  await page.goto(dashUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2000);
  if (/\/login/.test(page.url())) {
    record("no_redirect_loop", "PASS", page.url());
  } else {
    record("no_redirect_loop", "FAIL", page.url());
  }

  await browser.close();

  const failed = results.filter((r) => r.status === "FAIL");
  console.log("\n=== SUMMARY ===");
  console.log(JSON.stringify({ client: CLIENT, results, failed: failed.length }, null, 2));
  process.exit(failed.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});