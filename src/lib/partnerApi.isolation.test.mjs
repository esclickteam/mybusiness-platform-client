import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function listFiles(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) listFiles(full, acc);
    else acc.push(full);
  }
  return acc;
}

test("Partner API uses /partner/* and never Direct CRMClient as a data source", () => {
  const api = readFileSync(join(ROOT, "lib/partnerApi.ts"), "utf8");
  assert.equal(api.includes('API.get("/partner/clients"'), true);
  assert.equal(api.includes('API.get("/partner/dashboard"'), true);
  assert.equal(api.includes("/partner/compliance"), true);
  assert.equal(api.includes("/api/crm/"), false);
  assert.equal(api.includes("/crm-clients"), false);
  assert.equal(api.includes("CRMClient"), false);
  assert.equal(api.includes("crmClients"), false);
});

test("Partner pages do not fetch Direct Business CRM", () => {
  const files = listFiles(join(ROOT, "pages/partner")).filter((file) =>
    /\.(tsx|ts|jsx|js)$/.test(file)
  );
  assert.ok(files.length > 5);
  for (const file of files) {
    const src = readFileSync(file, "utf8");
    assert.equal(src.includes("/api/crm"), false, file);
    assert.equal(src.includes("/crm-clients"), false, file);
    assert.equal(src.includes("CRMClient"), false, file);
    assert.equal(src.includes("crmClients"), false, file);
  }
});

test("shared Business layout uses Partner managed context, not impersonation", () => {
  const src = readFileSync(
    join(ROOT, "pages/business/BusinessDashboardLayout.tsx"),
    "utf8"
  );
  assert.equal(src.includes('impersonatorRole === "marketer"'), true);
  assert.equal(src.includes("/admin/exit-impersonation"), true);
  assert.equal(src.includes("/marketer/exit-impersonation"), true);
  assert.equal(src.includes("/partner/managed-context/exit"), true);
  assert.equal(src.includes('impersonatorRole === "partner"'), false);
  assert.equal(src.includes("layout.partnerImpersonationText"), true);
  assert.equal(src.includes("layout.backToPartner"), true);
  assert.equal(src.includes("layout.partnerManagedPartnerLine"), true);
  assert.equal(src.includes("CRMClient"), false);
  assert.equal(src.includes("/crm-clients"), false);

  const he = readFileSync(join(ROOT, "i18n/locales/he.json"), "utf8");
  assert.equal(he.includes("אתה מנהל כרגע את: {{name}}"), true);
  assert.equal(he.includes("חזרה ללוח הפרטנר"), true);
  assert.equal(he.includes("Partner: {{name}}"), true);
});

test("DashboardPage allows Partner managed context without switching role", () => {
  const src = readFileSync(
    join(ROOT, "pages/business/dashboardPages/DashboardPage.tsx"),
    "utf8"
  );
  assert.equal(src.includes("canOperateManagedBusiness"), true);
  assert.equal(src.includes("isPartnerManaged"), true);
});

test("AuthContext decodes JWT as UTF-8 instead of raw atob", () => {
  const auth = readFileSync(join(ROOT, "context/AuthContext.jsx"), "utf8");
  assert.equal(auth.includes("JSON.parse(atob"), false);
  assert.equal(auth.includes("decodeJwtPayload"), true);
});

test("public partner deal page shows products without line prices", () => {
  const src = readFileSync(join(ROOT, "pages/partner/PartnerPublicDeal.tsx"), "utf8");
  assert.equal(src.includes("wholesale"), false);
  assert.equal(src.includes("commission"), false);
  assert.equal(src.toLowerCase().includes("sku"), false);
  assert.equal(src.includes("Bizuply share"), false);
  assert.equal(src.includes("Bizuply Business"), false);
  assert.equal(src.includes("partnerWholesalePrice"), false);
  assert.equal(src.includes("CRMClient"), false);
  assert.equal(src.includes("/api/crm"), false);
  assert.equal(src.includes("setupAmount"), false);
  assert.equal(src.includes("customerFinalPrice"), false);
  assert.equal(src.includes("פירוט מוצרים"), true);
});

test("public partner deal link hides footer and support bot", () => {
  const app = readFileSync(join(ROOT, "App.jsx"), "utf8");
  assert.equal(app.includes("isPublicPartnerDeal"), true);
  const footerAt = app.indexOf("<Footer />");
  const botAt = app.indexOf("<SupportChatWidget />");
  const footerWindow = app.slice(Math.max(0, footerAt - 400), footerAt);
  const botWindow = app.slice(Math.max(0, botAt - 500), botAt);
  assert.equal(footerWindow.includes("isPublicPartnerDeal"), true);
  assert.equal(botWindow.includes("isPublicPartnerDeal"), true);
});

test("partner deal math keeps wholesale + markup split", () => {
  const src = readFileSync(join(ROOT, "lib/partnerDealMath.ts"), "utf8");
  assert.equal(src.includes("monthlyCommission"), true);
  assert.equal(src.includes("partnerPaysBizuply"), true);
  assert.equal(src.includes("partnerCommission"), true);
  assert.equal(src.includes("export function isCommissionSku"), true);
});

test("partnerApiError reads interceptor Error.message when response is missing", () => {
  const api = readFileSync(join(ROOT, "lib/partnerApi.ts"), "utf8");
  assert.equal(api.includes("err instanceof Error"), true);
  assert.equal(api.includes("err.message"), true);
  const fnStart = api.indexOf("export function partnerApiError");
  const fn = api.slice(fnStart, fnStart + 900);
  assert.equal(fn.includes("response?.error || response?.message || fallback"), false);
  assert.equal(fn.includes("data?.error"), true);
});

test("logged-in partner is not dropped on the public homepage", () => {
  const app = readFileSync(join(ROOT, "App.jsx"), "utf8");
  assert.equal(app.includes('user.role === "partner"'), true);
  assert.equal(app.includes('to="/partner/dashboard"'), true);
  assert.equal(app.includes('path="/partner/dashboard"'), true);
  assert.equal(app.includes('roles={["partner"]}'), true);
  const catchAllAt = app.lastIndexOf('path="*"');
  const partnerRouteAt = app.indexOf('path="/partner/dashboard"');
  assert.ok(partnerRouteAt > 0);
  assert.ok(catchAllAt > partnerRouteAt);

  const auth = readFileSync(join(ROOT, "context/AuthContext.jsx"), "utf8");
  assert.equal(auth.includes('freshUser.role === "partner"'), true);
  assert.equal(auth.includes('navigate("/partner/dashboard", { replace: true })'), true);
  assert.equal(auth.includes("isCompatibleRedirect"), true);
  assert.equal(auth.includes("clearManagedBusinessContext"), true);

  const login = readFileSync(join(ROOT, "pages/Login.tsx"), "utf8");
  assert.equal(login.includes("isCompatibleRedirect"), true);
  assert.equal(login.includes("resolvePostLoginDestination"), true);

  const header = readFileSync(join(ROOT, "components/Header.tsx"), "utf8");
  assert.equal(header.includes('user?.role === "partner"'), true);
  assert.equal(header.includes('"/partner/dashboard"'), true);

  const guard = readFileSync(join(ROOT, "components/ProtectedRoute.tsx"), "utf8");
  assert.equal(guard.includes('role === "partner"'), true);
  assert.equal(guard.includes('to="/partner/dashboard"'), true);
});

test("Partner shell uses sidebar + pill navigation without Direct CRM", () => {
  const layout = readFileSync(join(ROOT, "pages/partner/PartnerLayout.tsx"), "utf8");
  assert.equal(layout.includes("sticky"), true);
  assert.equal(layout.includes("לוח פרטנר"), true);
  assert.equal(layout.includes("/partner/dashboard/crm"), true);
  assert.equal(layout.includes("/partner/dashboard/tasks"), true);
  assert.equal(layout.includes("/partner/dashboard/reminders"), true);
  assert.equal(layout.includes("/partner/dashboard/withdrawals"), true);
  assert.equal(layout.includes("/partner/dashboard/page"), true);
  assert.equal(layout.includes("/partner/dashboard/referrals"), true);
  assert.equal(layout.includes("/partner/dashboard/team"), true);
  assert.equal(layout.includes("CRMClient"), false);
  assert.equal(layout.includes("/api/crm"), false);

  const app = readFileSync(join(ROOT, "App.jsx"), "utf8");
  assert.equal(app.includes('path="tasks"'), true);
  assert.equal(app.includes('path="reminders"'), true);
  const catchAllAt = app.lastIndexOf('path="*"');
  const tasksAt = app.indexOf('path="tasks"');
  assert.ok(tasksAt > 0);
  assert.ok(catchAllAt > tasksAt);
});

test("partner work helpers stay on PartnerClient tasks", () => {
  const src = readFileSync(join(ROOT, "lib/partnerWork.ts"), "utf8");
  assert.equal(src.includes("PartnerClient"), true);
  assert.equal(src.includes("CRMClient"), false);
  assert.equal(src.includes("/api/crm"), false);
});

test("public partner deal is a summary, not a fake checkout", () => {
  const src = readFileSync(join(ROOT, "pages/partner/PartnerPublicDeal.tsx"), "utf8");
  assert.equal(src.includes("לתשלום עכשיו"), false);
  assert.equal(src.includes("סיכום ההצעה"), true);
  assert.equal(src.includes("התשלום והפעלת השירות מתבצעים מול הפרטנר שלך"), true);
  assert.equal(src.includes("noindex"), true);
});

test("partner public plans page shows customer price only", () => {
  const src = readFileSync(join(ROOT, "pages/public/PartnerPublicPlans.tsx"), "utf8");
  assert.equal(src.includes("customerFinalPrice"), true);
  assert.equal(src.includes("wholesale"), false);
  assert.equal(src.includes("partnerWholesalePrice"), false);
  assert.equal(src.includes("commission"), false);
  assert.equal(src.includes("CRMClient"), false);
});

test("login branding resolves from hostname helper, not scattered partner ifs", () => {
  const src = readFileSync(join(ROOT, "components/auth/AuthShell.tsx"), "utf8");
  assert.equal(src.includes("fetchPublicPartnerBranding"), true);
  assert.equal(src.includes("whiteLabelEnabled"), true);
  assert.equal(src.includes("CRMClient"), false);
});

test("public checkout client sends sku and contact, never a customer price", () => {
  const api = readFileSync(join(ROOT, "lib/partnerApi.ts"), "utf8");
  const start = api.indexOf("export async function startPublicPartnerCheckout");
  const fn = api.slice(start, api.indexOf("export async function fetchPublicCheckoutStatus"));
  assert.ok(start > 0);
  assert.equal(fn.includes("customerPrice"), false);
  assert.equal(fn.includes("wholesale"), false);
  assert.equal(fn.includes("/public/p/"), true);
});

test("self-serve success page polls until payment and activation settle", () => {
  const src = readFileSync(join(ROOT, "pages/public/PartnerCheckoutSuccess.tsx"), "utf8");
  assert.equal(src.includes("fetchPublicCheckoutStatus"), true);
  assert.equal(src.includes("checkoutSettled"), true);
  assert.equal(src.includes("requires_action"), true);
  assert.equal(src.includes("החשבון עדיין דורש טיפול"), true);
  assert.equal(src.includes("CRMClient"), false);
});

test("partner pipeline routes are registered in App", () => {
  const app = readFileSync(join(ROOT, "App.jsx"), "utf8");
  assert.equal(app.includes('path="page"'), true);
  assert.equal(app.includes('path="referrals"'), true);
  assert.equal(app.includes("/p/:slug/plans"), true);
  assert.equal(app.includes("/p/:slug/checkout/success"), true);
  assert.equal(app.includes("/admin/partners/referrals"), true);
  assert.equal(app.includes("/admin/partners/attention"), true);
});

test("partner CRM shows self-serve vs manual source column", () => {
  const src = readFileSync(join(ROOT, "pages/partner/PartnerClients.tsx"), "utf8");
  assert.equal(src.includes("מקור"), true);
  assert.equal(src.includes("row.source"), true);
  assert.equal(src.includes("partnerStatusLabel(row.source)"), true);
  assert.equal(src.includes("colSpan={9}"), true);
});

test("paid deal copy does not treat payment as withdrawable commission", () => {
  const src = readFileSync(join(ROOT, "pages/partner/PartnerDealDetail.tsx"), "utf8");
  assert.equal(src.includes("תשלום שולם אינו זמין למשיכה"), true);
  assert.equal(src.includes("needsAttention"), true);
  assert.equal(src.includes("retryPartnerDealActivation"), true);
  assert.equal(src.includes("מאשרים את התשלום מול Stripe"), true);
  assert.equal(src.includes("paidReturn"), true);
  assert.equal(src.includes("activationSettled"), true);
});

test("referrals page lists 40-day pending rewards above the intake form", () => {
  const src = readFileSync(join(ROOT, "pages/partner/PartnerReferrals.tsx"), "utf8");
  const tableAt = src.indexOf("מעקב הפניות");
  const formAt = src.indexOf("טופס צירוף");
  assert.ok(tableAt > 0);
  assert.ok(formAt > tableAt);
  assert.equal(src.includes("qualificationStartDate"), true);
  assert.equal(src.includes("daysActive"), true);
  assert.equal(src.includes("ממתינה לזכאות"), true);
  assert.equal(src.includes("מעקב 40 יום"), true);
  assert.equal(src.includes("/partner/dashboard"), false);
  assert.equal(src.includes("CRMClient"), false);
});

test("dashboard surfaces paid-unactivated deals without changing home routing", () => {
  const src = readFileSync(join(ROOT, "pages/partner/PartnerDashboard.tsx"), "utf8");
  assert.equal(src.includes("attentionDeals"), true);
  assert.equal(src.includes("/partner/dashboard/deals/"), true);
  assert.equal(src.includes("data.referrals?.qualifying"), true);
  assert.equal(src.includes("/partner/dashboard/referrals"), true);
  assert.equal(src.includes("pendingCommission"), true);
  assert.equal(src.includes("eligibleCommission"), true);
  const app = readFileSync(join(ROOT, "App.jsx"), "utf8");
  const dashboardAt = app.indexOf('path="/partner/dashboard"');
  const indexAt = app.indexOf("<Route index element={<PartnerDashboard />} />");
  assert.ok(dashboardAt > 0);
  assert.ok(indexAt > dashboardAt);
});

test("transactions page links deals and separates pending from eligible commission", () => {
  const src = readFileSync(join(ROOT, "pages/partner/PartnerTransactions.tsx"), "utf8");
  assert.equal(src.includes('from "../../components/partner/partnerUi"'), true);
  assert.equal(src.includes("/partner/dashboard/deals/"), true);
  assert.equal(src.includes("eligibleCommission"), true);
  assert.equal(src.includes("זמינה למשיכה"), true);
  assert.equal(src.includes("colSpan={11}"), true);
  assert.equal(src.includes("CRMClient"), false);
});

test("CRM dossier retries paid-deal activation without using Direct CRM", () => {
  const src = readFileSync(join(ROOT, "pages/partner/PartnerClientDossier.tsx"), "utf8");
  assert.equal(src.includes("activatePartnerClient"), true);
  assert.equal(src.includes("/partner/dashboard/deals/"), true);
  assert.equal(src.includes("הפעלת חשבון אחרי תשלום"), true);
  assert.equal(src.includes("CRMClient"), false);
  assert.equal(src.includes("/api/crm"), false);
});

test("my page warns when the sales page has no products", () => {
  const src = readFileSync(join(ROOT, "pages/partner/PartnerMyPage.tsx"), "utf8");
  assert.equal(src.includes("fetchPartnerPricebook"), true);
  assert.equal(src.includes("אין חבילות בעמוד המכירה"), true);
  assert.equal(src.includes("/partner/dashboard/pricing"), true);
});

test("bizuply.com /plans without a partner host falls back to pricing", () => {
  const src = readFileSync(join(ROOT, "pages/public/PartnerPublicPlans.tsx"), "utf8");
  assert.equal(src.includes('to="/pricing"'), true);
  assert.equal(src.includes("setFallbackToPricing"), true);
  assert.equal(src.includes("fetchPublicPartnerBranding"), true);
});

test("white-label host home sends anonymous visitors to plans without changing partner dashboard", () => {
  const home = readFileSync(join(ROOT, "pages/public/PartnerHostHome.tsx"), "utf8");
  assert.equal(home.includes("fetchPublicPartnerBranding"), true);
  assert.equal(home.includes("whiteLabelEnabled"), true);
  assert.equal(home.includes('to="/plans"'), true);
  assert.equal(home.includes("/partner/dashboard"), false);
  const app = readFileSync(join(ROOT, "App.jsx"), "utf8");
  assert.equal(app.includes("PartnerHostHome"), true);
  const dashboardAt = app.indexOf('path="/partner/dashboard"');
  const indexAt = app.indexOf("<Route index element={<PartnerDashboard />} />");
  assert.ok(dashboardAt > 0);
  assert.ok(indexAt > dashboardAt);
});
