import test from "node:test";
import assert from "node:assert/strict";
import { isPartnerWhiteLabelHostname, partnerHostAllowsPath } from "./partnerHost.mjs";

test("partner white-label host helper matches Premium subdomains only", () => {
  assert.equal(isPartnerWhiteLabelHostname("acme.bizuply.com"), true);
  assert.equal(isPartnerWhiteLabelHostname("acme.bizuply.co.il"), true);
  assert.equal(isPartnerWhiteLabelHostname("www.bizuply.com"), false);
  assert.equal(isPartnerWhiteLabelHostname("app.bizuply.com"), false);
  assert.equal(isPartnerWhiteLabelHostname("api.bizuply.com"), false);
  assert.equal(isPartnerWhiteLabelHostname("shop.sites.bizuply.com"), false);
  assert.equal(isPartnerWhiteLabelHostname("demo.sites-staging.bizuply.com"), false);
  assert.equal(isPartnerWhiteLabelHostname("foo.bar.bizuply.com"), false);
  assert.equal(isPartnerWhiteLabelHostname("localhost"), false);
  assert.equal(isPartnerWhiteLabelHostname("127.0.0.1"), false);
  assert.equal(isPartnerWhiteLabelHostname("mybusiness-platform-client-staging.vercel.app"), false);
});

test("partner host keeps sales/login/app paths and sends marketing pages to /plans", () => {
  assert.equal(partnerHostAllowsPath("/"), true);
  assert.equal(partnerHostAllowsPath("/plans"), true);
  assert.equal(partnerHostAllowsPath("/plans/"), true);
  assert.equal(partnerHostAllowsPath("/checkout/success"), true);
  assert.equal(partnerHostAllowsPath("/p/acme"), true);
  assert.equal(partnerHostAllowsPath("/p/acme/plans"), true);
  assert.equal(partnerHostAllowsPath("/login"), true);
  assert.equal(partnerHostAllowsPath("/forgot-password"), true);
  assert.equal(partnerHostAllowsPath("/partner/dashboard"), true);
  assert.equal(partnerHostAllowsPath("/partner/deals/abc"), true);
  assert.equal(partnerHostAllowsPath("/business/xyz/dashboard"), true);
  assert.equal(partnerHostAllowsPath("/partner/register"), false);
  assert.equal(partnerHostAllowsPath("/about"), false);
  assert.equal(partnerHostAllowsPath("/pricing"), false);
  assert.equal(partnerHostAllowsPath("/how-it-works"), false);
  assert.equal(partnerHostAllowsPath("/register"), false);
  assert.equal(partnerHostAllowsPath("/checkout"), false);
  assert.equal(partnerHostAllowsPath("/faq"), false);
  assert.equal(partnerHostAllowsPath("/contact"), false);
});
