import assert from "node:assert/strict";
import test from "node:test";
import {
  isDashboardPathAllowed,
  isWhatsappOnlyPackage,
} from "./moduleAccess.js";

const businessId = "6abcdba96130a8de386dfc86";

test("WhatsApp-only package is dashboard plus whatsapp", () => {
  assert.equal(isWhatsappOnlyPackage(["dashboard", "whatsapp"]), true);
  assert.equal(isWhatsappOnlyPackage(["whatsapp"]), true);
  assert.equal(isWhatsappOnlyPackage(["dashboard", "whatsapp", "billing"]), true);
  assert.equal(isWhatsappOnlyPackage(["dashboard", "whatsapp", "crm"]), false);
  assert.equal(isWhatsappOnlyPackage(["crm"]), false);
  assert.equal(isWhatsappOnlyPackage(null), false);
  assert.equal(isWhatsappOnlyPackage([]), false);
});

test("WhatsApp-only accounts cannot open the club route", () => {
  const club = `/business/${businessId}/dashboard/global-club`;
  const help = `/business/${businessId}/dashboard/help-center`;
  const whatsapp = `/business/${businessId}/dashboard/whatsapp`;
  const crm = `/business/${businessId}/dashboard/crm`;
  const modules = ["dashboard", "whatsapp"];

  assert.equal(isDashboardPathAllowed(club, modules), false);
  assert.equal(isDashboardPathAllowed(help, modules), true);
  assert.equal(isDashboardPathAllowed(whatsapp, modules), true);
  assert.equal(isDashboardPathAllowed(crm, modules), false);
});

test("other limited packages can still open the club", () => {
  const club = `/business/${businessId}/dashboard/global-club`;
  assert.equal(isDashboardPathAllowed(club, ["crm"]), true);
  assert.equal(isDashboardPathAllowed(club, null), true);
  assert.equal(isDashboardPathAllowed(club, ["dashboard", "meta-campaigns"]), true);
});
