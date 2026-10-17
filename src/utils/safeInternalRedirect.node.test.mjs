import test from "node:test";
import assert from "node:assert/strict";
import {
  alignRedirectBusinessId,
  isCompatibleRedirect,
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
      queryRedirect: "/",
      storedRedirect: "/client/dashboard",
    }),
    "/partner/dashboard"
  );
  assert.equal(isCompatibleRedirect("partner", "/"), false);
  assert.equal(isCompatibleRedirect("partner", "/dashboard"), false);
  assert.equal(isCompatibleRedirect("partner", "/client/dashboard"), false);
  assert.equal(isCompatibleRedirect("partner", "/partner/dashboard"), true);
  assert.equal(isCompatibleRedirect("business", "/admin/dashboard"), false);
  assert.equal(
    resolvePostLoginDestination({
      role: "business",
      businessId: "507f1f77bcf86cd799439011",
      hasAccess: false,
      accountKind: "saas_only",
      queryRedirect: "/admin/dashboard",
    }),
    "/business/507f1f77bcf86cd799439011/dashboard/saas"
  );
  assert.equal(
    resolvePostLoginDestination({
      role: "business",
      businessId: "507f1f77bcf86cd799439011",
      hasAccess: true,
      accountKind: "saas_only",
      storedRedirect: "/admin/dashboard",
      queryRedirect: "/business/507f1f77bcf86cd799439011/dashboard",
    }),
    "/business/507f1f77bcf86cd799439011/dashboard/saas"
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

test("a foreign SaaS tenant id is not carried onto the signed-in business", () => {
  const mine = "507f1f77bcf86cd799439011";
  const other = "aaaaaaaaaaaaaaaaaaaaaaaa";
  const foreignTenant = "bbbbbbbbbbbbbbbbbbbbbbbb";
  assert.equal(
    alignRedirectBusinessId(
      `/business/${other}/dashboard/saas/${foreignTenant}/builder?probe=1`,
      mine
    ),
    `/business/${mine}/dashboard/saas?probe=1`
  );
  assert.equal(
    alignRedirectBusinessId(`/business/${mine}/dashboard/saas/${foreignTenant}`, mine),
    `/business/${mine}/dashboard/saas/${foreignTenant}`
  );
});
