import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildPartnersPaint, getPartnersPaintCopy } from "./partnersPaint.mjs";

describe("partners first-paint shell", () => {
  it("renders an English hero with rectangular CTAs and no typing markup", () => {
    const html = buildPartnersPaint("en");
    assert.match(html, /data-partners-paint="1"/);
    assert.match(html, /Build Your Business with Bizuply/);
    assert.match(html, /Become a Partner/);
    assert.match(html, /#apply/);
    assert.match(html, /Affiliate/);
    assert.match(html, /Business Partner/);
    assert.match(html, /\$499/);
    assert.match(html, /15%/);
    assert.equal(html.includes("typewriter"), false);
    assert.equal(html.includes("loader"), false);
    assert.match(html, /ip-btn-primary/);
    assert.match(html, /Up to 40% Recurring Commission/);
    assert.equal(html.includes("demo-media"), false);
    assert.equal(html.includes("border-radius:999"), false);
  });

  it("renders Hebrew RTL copy for /he/partners", () => {
    const copy = getPartnersPaintCopy("he");
    assert.equal(copy.dir, "rtl");
    const html = buildPartnersPaint("he");
    assert.match(html, /dir="rtl"/);
    assert.match(html, /בנו את העסק שלכם עם Bizuply/);
    assert.match(html, /הצטרפו כשותפים/);
    assert.match(html, /Affiliate/);
    assert.match(html, /Business Partner/);
    assert.match(html, /499\$/);
    assert.match(html, /עד 40% עמלה חוזרת/);
    assert.equal(html.includes("demo-media"), false);
  });
});
