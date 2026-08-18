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
