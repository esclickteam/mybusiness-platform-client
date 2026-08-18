import test from "node:test";
import assert from "node:assert/strict";
import {
  resolvePostLoginDestination,
  roleHomePath,
} from "./safeInternalRedirect.js";

test("partner login home is /partner/dashboard for every partner role", () => {
  assert.equal(roleHomePath("partner"), "/partner/dashboard");
  assert.equal(resolvePostLoginDestination({ role: "partner" }), "/partner/dashboard");
  assert.equal(
    resolvePostLoginDestination({ role: "partner", storedRedirect: "/" }),
    "/partner/dashboard"
  );
  assert.equal(
    resolvePostLoginDestination({ role: "partner", storedRedirect: "/dashboard" }),
    "/partner/dashboard"
  );
  assert.equal(
    resolvePostLoginDestination({
      role: "partner",
      storedRedirect: "/client/dashboard",
    }),
    "/partner/dashboard"
  );
  assert.equal(
    resolvePostLoginDestination({
      role: "partner",
      queryRedirect: "/partner/dashboard/crm",
    }),
    "/partner/dashboard/crm"
  );
});

test("other role homes stay unchanged", () => {
  assert.equal(roleHomePath("admin"), "/admin/dashboard");
  assert.equal(roleHomePath("affiliate"), "/affiliate/dashboard");
  assert.equal(roleHomePath("marketer"), "/marketer/dashboard");
  assert.equal(
    resolvePostLoginDestination({
      role: "business",
      businessId: "507f1f77bcf86cd799439011",
      hasAccess: true,
    }),
    "/business/507f1f77bcf86cd799439011/dashboard"
  );
});
