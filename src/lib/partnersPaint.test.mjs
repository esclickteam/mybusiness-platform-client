import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildPartnersPaint, getPartnersPaintCopy } from "./partnersPaint.mjs";

describe("partners first-paint shell", () => {
  it("renders an English hero with rectangular CTAs and no typing markup", () => {
    const html = buildPartnersPaint("en");
    assert.match(html, /data-partners-paint="1"/);
    assert.match(html, /Build businesses\. Expand opportunities\. Earn together\./);
    assert.match(html, /Apply for partnership/);
    assert.match(html, /#apply/);
    assert.match(html, /Affiliate/);
    assert.match(html, /Business Partner/);
    assert.match(html, /\$499/);
    assert.match(html, /15%/);
    assert.equal(html.includes("typewriter"), false);
    assert.equal(html.includes("loader"), false);
    assert.match(html, /ip-paint__btn-primary/);
  });

  it("renders Hebrew RTL copy for /he/partners", () => {
    const copy = getPartnersPaintCopy("he");
    assert.equal(copy.dir, "rtl");
    const html = buildPartnersPaint("he");
    assert.match(html, /dir="rtl"/);
    assert.match(html, /בונים עסק/);
    assert.match(html, /הגישו מועמדות/);
    assert.match(html, /Affiliate/);
    assert.match(html, /Business Partner/);
    assert.match(html, /499\$/);
  });
});
