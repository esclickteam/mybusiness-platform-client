import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  MARKETING_PAGES,
  buildMarketingDocumentHead,
  buildMarketingRobotsTxt,
  buildMarketingSitemapXml,
  findMarketingPage,
  isMarketingNoindexPath,
  isSeoDiscoveryPath,
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
    expect(buildMarketingDocumentHead("/p/acme")).toBeNull();
    expect(buildMarketingDocumentHead("/s/northwind")).toBeNull();
  });
});
