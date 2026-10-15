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
