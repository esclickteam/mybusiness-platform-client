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

test("Website plans can open AI Studio and stay out of CRM", () => {
  const base = `/business/${businessId}/dashboard`;
  const modules = ["website", "billing"];
  assert.equal(isDashboardPathAllowed(`${base}/ai-studio`, modules), true);
  assert.equal(isDashboardPathAllowed(`${base}/website`, modules), true);
  assert.equal(isDashboardPathAllowed(`${base}/crm`, modules), false);
  assert.equal(isDashboardPathAllowed(`${base}/ai-studio`, ["dashboard", "whatsapp"]), false);
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

test("WhatsApp plus Meta campaigns stays off the club and other modules", () => {
  const modules = ["dashboard", "whatsapp", "meta-campaigns"];
  const base = `/business/${businessId}/dashboard`;
  assert.equal(isWhatsappOnlyPackage(modules), true);
  assert.equal(isDashboardPathAllowed(`${base}/global-club`, modules), false);
  assert.equal(isDashboardPathAllowed(`${base}/meta-campaigns/overview`, modules), true);
  assert.equal(isDashboardPathAllowed(`${base}/meta-campaigns/campaigns`, modules), true);
  assert.equal(isDashboardPathAllowed(`${base}/meta-campaigns/settings`, modules), true);
  assert.equal(isDashboardPathAllowed(`${base}/whatsapp`, modules), true);
  assert.equal(isDashboardPathAllowed(`${base}/crm`, modules), false);
  assert.equal(isDashboardPathAllowed(`${base}/automations`, modules), false);
});

test("other limited packages can still open the club", () => {
  const club = `/business/${businessId}/dashboard/global-club`;
  assert.equal(isDashboardPathAllowed(club, ["crm"]), true);
  assert.equal(isDashboardPathAllowed(club, null), true);
  assert.equal(isDashboardPathAllowed(club, ["dashboard", "meta-campaigns"]), true);
  assert.equal(isWhatsappOnlyPackage(["dashboard", "meta-campaigns"]), false);
});
