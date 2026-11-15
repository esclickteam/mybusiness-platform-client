import { describe, expect, it } from "vitest";
import { GUIDE_SLUGS, getGuide } from "./guidesMarketing.mjs";
import { buildMarketingSitemapXml } from "./marketingSeo.mjs";
import { knowledgePublicBlob } from "./knowledgeHub.mjs";
import { KNOWLEDGE_DRAFTS } from "./knowledgeDrafts.mjs";

const LOCALES = ["en", "he", "es", "pt-BR", "ar"];

describe("guide practice", () => {
  it("adds a practical section, a review date and matching depth in every language", () => {
    expect(GUIDE_SLUGS).toHaveLength(13);
    for (const slug of GUIDE_SLUGS) {
      const pages = LOCALES.map((locale) => getGuide(slug, locale));
      for (const page of pages) {
        expect(page.sections.some((section) => section.id === "practice")).toBe(true);
        expect(page.review).toContain("2026");
        expect(page.sources?.length).toBeGreaterThan(0);
        expect(page.products?.length).toBeGreaterThan(0);
        expect(page.updated).toBe("2026-11-15");
      }
      expect(pages[1].sections.length).toBe(pages[0].sections.length);
      expect(pages[1].faq.length).toBe(pages[0].faq.length);
    }
  });

  it("keeps Meta rates off the page and cites the pricing document", () => {
    const page = getGuide("whatsapp-cloud-api-cost", "en");
    const text = JSON.stringify(page);
    expect(text).toContain("https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/");
    expect(text).toContain("30 September 2026");
    expect(text).toContain("1,000");
    expect(text).not.toMatch(/\$0\.\d+/);
    expect(text).not.toMatch(/\bSEO\b|\bGEO\b|\bAEO\b/);
  });
});

describe("editorial drafts", () => {
  it("keeps ten drafts out of the public site", () => {
    expect(KNOWLEDGE_DRAFTS).toHaveLength(10);
    const sitemap = buildMarketingSitemapXml();
    const blob = knowledgePublicBlob();
    for (const draft of KNOWLEDGE_DRAFTS) {
      expect(draft.status).toBe("draft");
      expect(draft.aiAssisted).toBe(true);
      expect(Object.keys(draft.locales).sort()).toEqual([...LOCALES].sort());
      expect(sitemap).not.toContain(draft.slug);
      expect(blob).not.toContain(draft.locales.en.h1);
      expect(draft.locales.he.sections.length).toBe(draft.locales.en.sections.length);
    }
  });
});
