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

test("shared Business layout only changes impersonation when role is partner", () => {
  const src = readFileSync(
    join(ROOT, "pages/business/BusinessDashboardLayout.tsx"),
    "utf8"
  );
  assert.equal(src.includes('impersonatorRole === "partner"'), true);
  assert.equal(src.includes('impersonatorRole === "marketer"'), true);
  assert.equal(src.includes("/admin/exit-impersonation"), true);
  assert.equal(src.includes("/marketer/exit-impersonation"), true);
  assert.equal(src.includes("/partner/exit-impersonation"), true);
  assert.equal(src.includes("CRMClient"), false);
  assert.equal(src.includes("/crm-clients"), false);
});
