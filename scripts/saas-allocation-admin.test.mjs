import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const page = fs.readFileSync(new URL("../src/pages/admin/AdminSaasTenants.tsx", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");

test("the admin screen separates payment from allocation and confirms before retry", () => {
  assert.match(page, /שולם – ההקצאה נכשלה/);
  assert.match(page, /נסה להקצות מחדש/);
  assert.match(page, /עסקאות ששולמו וממתינות לסוג עסקה/);
  assert.match(page, /תשלום:/);
  assert.match(page, /הקצאה:/);
  assert.match(page, /רישיון אופה/);
  assert.match(page, /White Label/);
  const retry = page.slice(page.indexOf("async function retryAllocation"), page.indexOf("async function confirmClarification"));
  const confirm = page.slice(page.indexOf("async function confirmClarification"), page.indexOf("useEffect(() =>"));
  assert.ok(retry.indexOf("יש לבחור סוג עסקה לפני ההקצאה") < retry.indexOf("window.confirm"));
  assert.ok(retry.indexOf("window.confirm") < retry.indexOf("allocation-retry"));
  assert.ok(confirm.indexOf("window.confirm") < confirm.indexOf("confirm-deal"));
  assert.equal(page.includes("onChange={(event) => setDealChoice"), true);
  assert.doesNotMatch(page, /onChange=\{[^}]*API\.post/);
  assert.doesNotMatch(page, /integrationSecret|BIZUPLY_BRIDGE_/);
  const adminStart = app.indexOf('path="/admin"');
  const route = app.indexOf('path="saas-tenants"');
  assert.ok(adminStart !== -1 && adminStart < route);
  assert.match(app.slice(adminStart, route), /roles=\{\["admin"\]\}/);
});
