import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  MARKETING_PAGES,
  buildMarketingDocumentHead,
  buildMarketingPrerender,
  buildMarketingRobotsTxt,
  buildMarketingSitemapXml,
  findMarketingPage,
  isMarketingNoindexPath,
  isSeoDiscoveryPath,
  isUnknownMarketingPath,
  marketingLegacyRedirectPath,
} from "./marketingSeo.mjs";

const root = path.resolve(import.meta.dirname, "../..");

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

describe("marketing crawl files", () => {
  it("keeps robots and sitemap discovery out of the static-asset bypass", () => {
    expect(isSeoDiscoveryPath("/robots.txt")).toBe(true);
    expect(isSeoDiscoveryPath("/sitemap.xml")).toBe(true);
    expect(isSeoDiscoveryPath("/crm")).toBe(false);
    const middleware = readFileSync(path.join(root, "middleware.js"), "utf8");
    expect(middleware).toContain("!isSeoDiscoveryPath(pathname)");
    expect(middleware).toMatch(
      /isStaticAsset\(pathname\)[\s\S]{0,180}!isSeoDiscoveryPath\(pathname\)/,
    );
  });

  it("lists every live product route and leaves the SaaS marketplace unlisted", () => {
    const sitemap = buildMarketingSitemapXml();
    for (const page of ["/crm", "/appointments", "/automations", "/agents", "/website-builder", "/collaborations", "/business"]) {
      expect(sitemap).toContain(`<loc>https://bizuply.com${page}</loc>`);
    }
    expect(sitemap).not.toContain("bizuply.com/saas");
    expect(sitemap).not.toContain("bizuply.com/join");
    expect(sitemap).not.toContain("privacy-policy");
    expect(buildMarketingRobotsTxt()).toContain("Sitemap: https://bizuply.com/sitemap.xml");
    expect(buildMarketingRobotsTxt()).toContain("Disallow: /api/");
  });

  it("gives each indexable page a unique title, description, and canonical", () => {
    const titles = MARKETING_PAGES.map((page) => page.title);
    expect(new Set(titles).size).toBe(titles.length);
    for (const page of MARKETING_PAGES) {
      const head = buildMarketingDocumentHead(page.path) || "";
      expect(head).toContain(`<title>${escapeHtml(page.title)}</title>`);
      expect(head).toContain(`content="${escapeHtml(page.description)}"`);
      expect(head).toContain('content="index, follow"');
      expect(head).toContain('"@type":"Organization"');
      expect(head).toContain('"name":"Bizuply"');
      expect(head).not.toContain("aggregateRating");
    }
  });

  it("canonicalizes the privacy alias and redirects duplicate legacy paths", () => {
    const head = buildMarketingDocumentHead("/privacy-policy") || "";
    expect(head).toContain('href="https://bizuply.com/privacy"');
    expect(findMarketingPage("/privacy-policy")?.canonicalPath).toBe("/privacy");
    expect(marketingLegacyRedirectPath("/join")).toBe("/business");
    expect(marketingLegacyRedirectPath("/Pricing/")).toBe("/pricing");
    expect(marketingLegacyRedirectPath("/pricing")).toBe("");
  });

  it("marks private app routes noindex and leaves dynamic public routes untouched", () => {
    expect(buildMarketingDocumentHead("/login")).toContain("noindex, nofollow");
    expect(buildMarketingDocumentHead("/admin/dashboard")).toContain("noindex, nofollow");
    expect(buildMarketingDocumentHead("/business/123/dashboard")).toContain("noindex, nofollow");
    expect(isMarketingNoindexPath("/business")).toBe(false);
    expect(buildMarketingDocumentHead("/book/abc")).toBeNull();
    expect(buildMarketingDocumentHead("/") || "").toContain('"alternateName":["ביזאפלי","BizUply"]');
    expect(buildMarketingDocumentHead("/") || "").toContain("ביזאפלי");
    expect(buildMarketingDocumentHead("/he/") || "").toContain("<title>ביזאפלי (Bizuply)");
    for (const page of MARKETING_PAGES) {
      expect(page.title).not.toContain("BizUply");
      expect(page.description).not.toContain("BizUply");
    }
    expect(isUnknownMarketingPath("/this-page-does-not-exist-xyz")).toBe(true);
    expect(isUnknownMarketingPath("/crm")).toBe(false);
    expect(isUnknownMarketingPath("/login")).toBe(false);
    expect(isUnknownMarketingPath("/book/abc")).toBe(false);
    expect(isUnknownMarketingPath("/business/123/dashboard")).toBe(false);
    const hebrew = buildMarketingDocumentHead("/he/crm") || "";
    expect(hebrew).toContain("<title>מערכת CRM לניהול לקוחות ולידים | ביזאפלי</title>");
    expect(hebrew).toContain('hreflang="he" href="https://bizuply.com/he/crm"');
    expect(hebrew).toContain('hreflang="en" href="https://bizuply.com/crm"');
    expect(hebrew).toContain('hreflang="x-default" href="https://bizuply.com/crm"');
    expect(hebrew).toContain('"inLanguage":"he"');
    const english = buildMarketingDocumentHead("/crm") || "";
    expect(english).toContain('hreflang="he" href="https://bizuply.com/he/crm"');
    expect(buildMarketingDocumentHead("/about") || "").toContain('hreflang="he" href="https://bizuply.com/he/about"');
    expect(buildMarketingSitemapXml()).toContain("<loc>https://bizuply.com/he/crm</loc>");
    expect(buildMarketingSitemapXml()).toContain("<loc>https://bizuply.com/he/whatsapp-api</loc>");
    expect(buildMarketingSitemapXml()).toContain("<loc>https://bizuply.com/he/about</loc>");
    expect(buildMarketingSitemapXml()).not.toContain("<loc>https://bizuply.com/he/terms</loc>");
    expect(buildMarketingPrerender("/crm")?.inner).toContain("CRM only is $49 per month");
    expect(buildMarketingPrerender("/crm")?.inner).toContain("<h1>Every lead, every client, every appointment in one place</h1>");
    expect(buildMarketingPrerender("/he/crm")?.inner).toContain("49 דולר");
    expect(buildMarketingDocumentHead("/he/whatsapp-api") || "").toContain("מה כוללים 29 הדולר?");
    expect(buildMarketingDocumentHead("/crm") || "").toContain("What does the CRM cost?");
    expect(buildMarketingPrerender("/he/about")?.inner).toContain("Meta Tech Provider");
    expect(buildMarketingPrerender("/he/terms")).toBeNull();
    const spanish = buildMarketingDocumentHead("/es/crm") || "";
    expect(spanish).toContain('hreflang="es" href="https://bizuply.com/es/crm"');
    expect(spanish).toContain('hreflang="pt-BR" href="https://bizuply.com/pt-br/crm"');
    expect(spanish).toContain('hreflang="ar" href="https://bizuply.com/ar/crm"');
    expect(spanish).toContain("49 dólares");
    expect(buildMarketingPrerender("/ar/crm")?.dir).toBe("rtl");
    expect(buildMarketingPrerender("/pt-br/whatsapp-api")?.inner).toContain("29 dólares");
    expect(buildMarketingDocumentHead("/meta-campaigns") || "").toContain("Meta Campaign Management");
    expect(buildMarketingSitemapXml()).toContain("<loc>https://bizuply.com/guides/what-is-a-crm</loc>");
    expect(buildMarketingSitemapXml()).toContain("<loc>https://bizuply.com/he/guides/whatsapp-cloud-api-cost</loc>");
    expect(buildMarketingDocumentHead("/es/terms") || "").toContain("noindex");
    expect(buildMarketingDocumentHead("/p/acme")).toBeNull();
    expect(buildMarketingDocumentHead("/s/northwind")).toBeNull();
  });
});
