import test from "node:test";
import assert from "node:assert/strict";
import { isPartnerWhiteLabelHostname } from "./partnerHost.mjs";

test("partner white-label host helper matches Premium subdomains only", () => {
  assert.equal(isPartnerWhiteLabelHostname("acme.bizuply.com"), true);
  assert.equal(isPartnerWhiteLabelHostname("acme.bizuply.co.il"), true);
  assert.equal(isPartnerWhiteLabelHostname("www.bizuply.com"), false);
  assert.equal(isPartnerWhiteLabelHostname("app.bizuply.com"), false);
  assert.equal(isPartnerWhiteLabelHostname("api.bizuply.com"), false);
  assert.equal(isPartnerWhiteLabelHostname("shop.sites.bizuply.com"), false);
  assert.equal(isPartnerWhiteLabelHostname("demo.sites-staging.bizuply.com"), false);
  assert.equal(isPartnerWhiteLabelHostname("localhost"), false);
  assert.equal(isPartnerWhiteLabelHostname("127.0.0.1"), false);
  assert.equal(isPartnerWhiteLabelHostname("mybusiness-platform-client-staging.vercel.app"), false);
});
