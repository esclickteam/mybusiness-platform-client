import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("the builder exposes draft, preview, publish, restore, language, and automation", () => {
  const page = fs.readFileSync(new URL("../src/pages/business/dashboardPages/SaasBridgePage.jsx", import.meta.url), "utf8");
  for (const label of ["שמירת טיוטה", "תצוגה מקדימה", "פרסום למערכת", "שחזור גרסה", "יצירת אוטומציה", "English"]) {
    assert.match(page, new RegExp(label));
  }
  assert.match(page, /\/saas-bridge\/links\/\$\{selected\.id\}\/draft/);
  assert.match(page, /while \(used\.has\(key\)\)/);
  assert.match(page, /draftFailed/);
  assert.match(page, /wrongSystem/);
  assert.match(page, /entity is not in this system/);
  assert.doesNotMatch(page, /integrationSecret|JWT_SECRET|password/i);
});

test("my systems enter-system uses the product login helper, not the marketplace shell path", () => {
  const page = fs.readFileSync(new URL("../src/pages/business/dashboardPages/saas/MySaasSystems.tsx", import.meta.url), "utf8");
  assert.match(page, /enterSystemHref/);
  assert.doesNotMatch(page, /href=\{tenant\.accessPath\}/);
});

test("dinevo public and owner previews are not TableFlow", () => {
  const publicSite = fs.readFileSync(new URL("../src/pages/saas/SaasPublicSite.tsx", import.meta.url), "utf8");
  const owner = fs.readFileSync(new URL("../src/pages/business/dashboardPages/saas/SaasOwnerConsole.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(publicSite, /templateSlug === "dinevo"/);
  assert.match(publicSite, /ProductPublicLanding/);
  assert.match(publicSite, /isHostedShellProduct/);
  assert.doesNotMatch(owner, /templateSlug === "tableflow" \|\| templateSlug === "dinevo"/);
  assert.doesNotMatch(owner, /railway\.app/);
});
