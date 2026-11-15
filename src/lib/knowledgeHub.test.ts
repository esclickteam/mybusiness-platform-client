import { describe, expect, it } from "vitest";
import {
  buildMarketingDocumentHead,
  buildMarketingPrerender,
  buildMarketingSitemapXml,
  isUnknownMarketingPath,
  marketingLegacyRedirectPath,
} from "./marketingSeo.mjs";
import { knowledgePublicBlob, renderKnowledgeInner } from "./knowledgeHub.mjs";
import { glossaryPage } from "./glossaryContent.mjs";

describe("knowledge library", () => {
  it("keeps the new library in the sitemap and gives Hebrew its own canonical", () => {
    const sitemap = buildMarketingSitemapXml();
    expect(sitemap).toContain("<loc>https://bizuply.com/resources</loc>");
    expect(sitemap).toContain("<loc>https://bizuply.com/he/resources</loc>");
    expect(sitemap).toContain("<loc>https://bizuply.com/compare/crm-or-spreadsheet</loc>");
    expect(sitemap).not.toContain("<loc>https://bizuply.com/blog</loc>");
    expect(marketingLegacyRedirectPath("/blog")).toBe("/guides");
    expect(marketingLegacyRedirectPath("/industries")).toBe("/solutions");
    expect(isUnknownMarketingPath("/resources")).toBe(false);
    const head = buildMarketingDocumentHead("/he/glossary") || "";
    expect(head).toContain('rel="canonical" href="https://bizuply.com/he/glossary"');
    expect(head).toContain("hreflang=\"en\" href=\"https://bizuply.com/glossary\"");
    expect(head).not.toContain("noindex");
  });

  it("puts the glossary and the calculators in the first HTML", () => {
    const hebrew = renderKnowledgeInner("/glossary", "he");
    expect(hebrew).toContain("מילון לעבודה עצמה");
    expect(hebrew).toContain("dir=\"rtl\"");
    expect(hebrew).toContain("CAC");
    const tools = buildMarketingPrerender("/templates")?.inner || "";
    expect(tools).toContain("Divide the number of conversions");
    expect(tools).toContain("/downloads/bizuply-lead-tracker.xlsx");
    const compare = buildMarketingPrerender("/he/compare/whatsapp-app-or-api")?.inner || "";
    expect(compare).toContain("30 בספטמבר 2026");
    expect(compare).toContain("https://developers.facebook.com/docs/whatsapp/pricing");
    const guide = buildMarketingPrerender("/he/guides/what-is-a-crm")?.inner || "";
    expect(guide).toContain("מה עושים אחר כך");
    expect(guide).toContain("/he/compare/crm-or-spreadsheet");
    expect(guide).not.toMatch(/SEO|GEO|AEO|AI Optimized/);
  });

  it("does not print internal discovery labels", () => {
    const blob = knowledgePublicBlob();
    expect(blob).not.toMatch(/\bSEO\b|\bGEO\b|\bAEO\b|AI Optimized/);
    expect(glossaryPage("en")?.terms.length).toBeGreaterThan(8);
    expect(glossaryPage("he")?.terms.length).toBe(glossaryPage("en")?.terms.length);
  });
});
