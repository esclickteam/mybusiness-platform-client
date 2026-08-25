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
  assert.equal(src.includes("partnerFacingLogo"), true);
  assert.equal(src.includes("hidesBizuplyChrome"), true);
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
  assert.equal(src.includes("partnerFacingName"), true);
  assert.equal(src.includes("publicPackageLabel"), true);
  assert.equal(src.includes("publicProductCopy"), true);
  assert.equal(src.includes("BizuplyLoader"), false);
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
  assert.equal(src.includes("partnerPaysBizuply"), true);
  assert.equal(src.includes("partnerCommission"), true);
  assert.equal(src.includes("export function isCommissionSku"), true);
  assert.equal(src.includes("quotePreviewComponents"), true);
  assert.equal(src.includes("additionalMarkup"), false);
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

test("partner deal share links stay absolute on Premium hosts", () => {
  const wizard = readFileSync(join(ROOT, "pages/partner/PartnerClientWizard.tsx"), "utf8");
  assert.equal(wizard.includes("absoluteCustomerUrl"), true);
  const detail = readFileSync(join(ROOT, "pages/partner/PartnerDealDetail.tsx"), "utf8");
  assert.equal(detail.includes("absoluteCustomerUrl"), true);
  assert.equal(detail.includes("${window.location.origin}${deal.publicUrl"), false);
});

test("public partner deal is a summary, not a fake checkout", () => {
  const src = readFileSync(join(ROOT, "pages/partner/PartnerPublicDeal.tsx"), "utf8");
  assert.equal(src.includes("לתשלום עכשיו"), false);
  assert.equal(src.includes("סיכום ההצעה"), true);
  assert.equal(src.includes("התשלום והפעלת השירות מתבצעים מול"), true);
  assert.equal(src.includes("מול הפרטנר שלך"), false);
  assert.equal(src.includes("noindex"), true);
});

test("partner public plans page shows customer price only", () => {
  const src = readFileSync(join(ROOT, "pages/public/PartnerPublicPlans.tsx"), "utf8");
  assert.equal(src.includes("formatPublicCustomerPrice"), true);
  assert.equal(src.includes("publicPackageLabel"), true);
  assert.equal(src.includes("publicProductCopy"), true);
  assert.equal(src.includes("wholesale"), false);
  assert.equal(src.includes("partnerWholesalePrice"), false);
  assert.equal(src.includes("commission"), false);
  assert.equal(src.includes("CRMClient"), false);
});

test("login branding resolves from hostname helper, not scattered partner ifs", () => {
  const src = readFileSync(join(ROOT, "components/auth/AuthShell.tsx"), "utf8");
  assert.equal(src.includes("usePartnerHostBranding"), true);
  assert.equal(src.includes("hidesBizuplyChrome"), true);
  assert.equal(src.includes("hidesBizuplyChrome(branding, host)"), true);
  assert.equal(src.includes("partnerFacingName(branding, host)"), true);
  assert.equal(src.includes("CRMClient"), false);
  const login = readFileSync(join(ROOT, "pages/Login.tsx"), "utf8");
  assert.equal(login.includes("usePartnerHostBranding"), true);
  assert.equal(login.includes("isResolvedPartnerHost"), true);
  assert.equal(login.includes('? "/plans"'), true);
  const reset = readFileSync(join(ROOT, "pages/ResetPassword.jsx"), "utf8");
  assert.equal(reset.includes("AuthShell"), true);
  assert.equal(reset.includes("AuthCard"), true);
  assert.equal(reset.includes("forgot-password-overlay"), false);
  const shell = readFileSync(join(ROOT, "components/partner/PublicPartnerShell.tsx"), "utf8");
  assert.equal(shell.includes("hidesBizuplyChrome"), true);
  assert.equal(shell.includes("hidesBizuplyChrome(branding, host)"), true);
  assert.equal(shell.includes("partnerFacingName"), true);
  const plans = readFileSync(join(ROOT, "pages/public/PartnerPublicPlans.tsx"), "utf8");
  assert.equal(plans.includes("sales.branding"), true);
  assert.equal(plans.includes("partnerFacingName"), true);
  const branding = readFileSync(join(ROOT, "lib/partnerBranding.ts"), "utf8");
  assert.equal(branding.includes("whiteLabelEntitled"), true);
  assert.equal(branding.includes("hideBizuplyBranding"), true);
  assert.equal(branding.includes("isResolvedPartnerHost"), true);
  assert.equal(branding.includes("isPartnerWhiteLabelHostname"), false);
  assert.equal(branding.includes("absoluteCustomerUrl"), true);
  assert.equal(branding.includes("hidesBizuplyChrome(branding, hostname)"), true);
  assert.equal(branding.includes("whiteLabelEntitled"), true);
  assert.equal(branding.includes("stored?.brandName"), true);
  assert.equal(branding.includes("return Boolean(branding?.whiteLabelEnabled)"), false);
  const storefront = readFileSync(join(ROOT, "pages/public/PartnerStorefront.tsx"), "utf8");
  assert.equal(storefront.includes("PublicPartnerShell"), true);
  assert.equal(storefront.includes("publicPackageLabel"), true);
  assert.equal(storefront.includes("publicProductCopy"), true);
  assert.equal(storefront.includes("Powered by Bizuply"), false);
  assert.equal(storefront.includes("רכישה מתבצעת בעמוד החבילות"), true);
  assert.equal(storefront.includes("רכישה מתבצעת מול הפרטנר."), false);
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
  assert.equal(src.includes("fetchPublicPartnerBranding"), true);
  assert.equal(src.includes('href="/login"'), true);
  assert.equal(src.includes("checkoutSettled"), true);
  assert.equal(src.includes("requires_action"), true);
  assert.equal(src.includes("החשבון עדיין דורש טיפול"), true);
  assert.equal(src.includes("welcomeEmailSent"), true);
  assert.equal(src.includes("partnerFacingName"), true);
  assert.equal(src.includes("פנו לפרטנר"), false);
  assert.equal(src.includes("צוות הפרטנר"), false);
  assert.equal(src.includes("CRMClient"), false);
  assert.equal(src.includes("[slug, sessionId, resolving, error]"), false);
});

test("partner pipeline routes are registered in App", () => {
  const app = readFileSync(join(ROOT, "App.jsx"), "utf8");
  assert.equal(app.includes('path="page"'), true);
  assert.equal(app.includes('path="referrals"'), true);
  assert.equal(app.includes("/p/:slug/plans"), true);
  assert.equal(app.includes("/p/:slug/checkout/success"), true);
  assert.equal(app.includes('path="/checkout/success"'), true);
  assert.equal(app.includes("usePartnerHostBranding"), true);
  assert.equal(app.includes("partnerHostAllowsPath"), true);
  assert.equal(app.includes("isPartnerHostPublicChrome"), true);
  assert.equal(app.includes("RedirectIfPartnerHost"), true);
  assert.equal(app.includes("<Route index element={<PartnerDashboard />} />"), true);
  assert.equal(app.includes('location.pathname === "/checkout/success"'), true);
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
  assert.equal(src.includes("paymentStatus === \"paid\""), true);
  assert.equal(src.includes("CRMClient"), false);
  assert.equal(src.includes("/api/crm"), false);
});

test("my page warns when the sales page has no products", () => {
  const src = readFileSync(join(ROOT, "pages/partner/PartnerMyPage.tsx"), "utf8");
  assert.equal(src.includes("fetchPartnerPricebook"), true);
  assert.equal(src.includes("אין חבילות בעמוד המכירה"), true);
  assert.equal(src.includes("/partner/dashboard/pricing"), true);
  assert.equal(src.includes("קישור /p/slug"), true);
  assert.equal(src.includes("עדיין לא פעילה בסביבת הייצור — עד אז"), false);
});

test("bizuply.com /plans without a partner host falls back to pricing", () => {
  const src = readFileSync(join(ROOT, "pages/public/PartnerPublicPlans.tsx"), "utf8");
  assert.equal(src.includes('to="/pricing"'), true);
  assert.equal(src.includes("setFallbackToPricing"), true);
  assert.equal(src.includes("isPartnerWhiteLabelHostname"), true);
  assert.equal(src.includes("fetchPublicPartnerBranding"), true);
});

test("public partner plans page shows only final customer prices", () => {
  const src = readFileSync(join(ROOT, "pages/public/PartnerPublicPlans.tsx"), "utf8");
  assert.equal(src.includes("wholesale"), false);
  assert.equal(src.includes("partnerWholesalePrice"), false);
  assert.equal(src.includes("partnerShare"), false);
  assert.equal(src.includes("formatPublicCustomerPrice"), true);
  const pricing = readFileSync(join(ROOT, "pages/partner/PartnerPricing.tsx"), "utf8");
  assert.equal(pricing.includes("הוסף עמלה חד-פעמית"), true);
  assert.equal(pricing.includes("הוסף עמלה חודשית מתחדשת"), true);
  assert.equal(pricing.includes("הוסף עמלה שנתית מתחדשת"), true);
  assert.equal(pricing.includes("skuAllowsRecurringMarkup"), true);
  assert.equal(pricing.includes("מחיר Bizuply"), true);
  assert.equal(pricing.includes("{allowsRecurring ?"), true);
  assert.equal(pricing.includes("recurringIntervalLabel"), true);
  assert.equal(pricing.includes("מחיר בסיס"), true);
  const wizard = readFileSync(join(ROOT, "pages/partner/PartnerClientWizard.tsx"), "utf8");
  assert.equal(wizard.includes("fetchPartnerPricebook"), true);
  assert.equal(wizard.includes("עמלת עסקה כללית"), false);
  assert.equal(wizard.includes("עמלה חד-פעמית נוספת לעסקה זו"), false);
  assert.equal(wizard.includes("עמלה חודשית נוספת לעסקה זו"), false);
  assert.equal(wizard.includes("additionalMarkup"), false);
  assert.equal(wizard.includes("setMonthlyCommission"), false);
  assert.equal(wizard.includes("המחיר נבנה רק מהמוצרים שנבחרו"), true);
  const money = readFileSync(join(ROOT, "lib/partnerMoney.ts"), "utf8");
  assert.equal(money.includes("recurringIntervalLabel"), true);
  assert.equal(money.includes("catalogBillingLabel"), true);
  assert.equal(money.includes("skuAllowsRecurringMarkup"), true);
  assert.equal(money.includes('billing === "recurring_year" ? "לשנה"'), true);
});

test("catalog and settings prefer branded host URLs without changing dashboard home", () => {
  const store = readFileSync(join(ROOT, "pages/public/PartnerStorefront.tsx"), "utf8");
  assert.equal(store.includes("function plansHref"), true);
  assert.equal(store.includes("urls?.plansUrl"), true);
  const settings = readFileSync(join(ROOT, "pages/partner/PartnerStorefrontSettings.tsx"), "utf8");
  assert.equal(settings.includes("personalUrl"), true);
  assert.equal(settings.includes("CRMClient"), false);
  const app = readFileSync(join(ROOT, "App.jsx"), "utf8");
  assert.equal(app.includes("<Route index element={<PartnerDashboard />} />"), true);
});

test("white-label host home sends anonymous visitors to plans without changing partner dashboard", () => {
  const home = readFileSync(join(ROOT, "pages/public/PartnerHostHome.tsx"), "utf8");
  assert.equal(home.includes("usePartnerHostBranding"), true);
  assert.equal(home.includes("isResolvedPartnerHost"), true);
  assert.equal(home.includes('to="/plans"'), true);
  assert.equal(home.includes("/partner/dashboard"), false);
  assert.equal(home.includes("HomePage"), true);
  const app = readFileSync(join(ROOT, "App.jsx"), "utf8");
  assert.equal(app.includes("PartnerHostHome"), true);
  assert.equal(app.includes("partnerHostAllowsPath"), true);
  const dashboardAt = app.indexOf('path="/partner/dashboard"');
  const indexAt = app.indexOf("<Route index element={<PartnerDashboard />} />");
  assert.ok(dashboardAt > 0);
  assert.ok(indexAt > dashboardAt);
});

test("partner settings expose white-label branding fields and personal link actions", () => {
  const card = readFileSync(join(ROOT, "components/partner/PartnerBrandingCard.tsx"), "utf8");
  assert.equal(card.includes("מיתוג וכתובת אישית"), true);
  assert.equal(card.includes("Brand Name"), true);
  assert.equal(card.includes("Favicon (אופציונלי)"), true);
  assert.equal(card.includes("Subdomain"), true);
  assert.equal(card.includes("הקישור האישי שלי"), true);
  assert.equal(card.includes('"Copy"'), true);
  assert.equal(card.includes("Open"), true);
  assert.equal(card.includes("partnerPersonalUrl"), true);
  assert.equal(card.includes("partnerSiteSuffix"), true);
  assert.equal(card.includes("`https://${savedSubdomain}.bizuply.com`"), false);
  const brandingLib = readFileSync(join(ROOT, "lib/partnerBranding.ts"), "utf8");
  assert.equal(brandingLib.includes(".bizuply.com"), true);
  assert.equal(brandingLib.includes(".bizuply.co.il"), true);
  assert.equal(brandingLib.includes("partnerPersonalUrl"), true);
  const myPage = readFileSync(join(ROOT, "pages/partner/PartnerMyPage.tsx"), "utf8");
  assert.equal(myPage.includes("partnerPersonalUrl"), true);
  assert.equal(myPage.includes(".bizuply.com"), false);
  assert.equal(card.includes("עדיין לא מאומתת בייצור"), true);
  const settings = readFileSync(join(ROOT, "pages/partner/PartnerSettings.tsx"), "utf8");
  assert.equal(settings.includes("PartnerBrandingCard"), true);
  assert.equal(settings.includes("compliance.missing"), true);
  assert.equal(settings.includes("currentMissing"), true);
  assert.equal(settings.includes("עדיין חסר"), true);
  const withdrawals = readFileSync(join(ROOT, "pages/partner/PartnerWithdrawals.tsx"), "utf8");
  assert.equal(withdrawals.includes("reviewStatus"), true);
  assert.equal(withdrawals.includes("missing"), true);
  assert.equal(withdrawals.includes("kycMissingLabels"), true);
  const api = readFileSync(join(ROOT, "lib/partnerApi.ts"), "utf8");
  assert.equal(api.includes("fieldLabels"), true);
  assert.equal(api.includes("reviewStatus"), true);
  const dashboard = readFileSync(join(ROOT, "pages/partner/PartnerDashboard.tsx"), "utf8");
  assert.equal(dashboard.includes("הקישור האישי שלי"), true);
  assert.equal(dashboard.includes('"Copy"'), true);
  assert.equal(dashboard.includes("Open"), true);
  const hook = readFileSync(join(ROOT, "hooks/usePartnerHostBranding.ts"), "utf8");
  assert.equal(hook.includes("fetchPublicPartnerBranding"), true);
  assert.equal(hook.includes("whiteLabelEnabled"), true);
});
