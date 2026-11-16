import { describe, expect, it } from "vitest";
import { industryNav, marketingNav } from "./marketingNav.mjs";

const LOCALES = ["en", "he", "es", "pt-BR", "ar"] as const;

const LIVE = new Set([
  "/platform",
  "/how-it-works",
  "/features",
  "/automations",
  "/crm",
  "/whatsapp-api",
  "/meta-campaigns",
  "/website-builder",
  "/saas",
  "/solutions#solutions-needs",
  "/solutions#solutions-industries",
  "/solutions/clinics",
  "/solutions/beauty",
  "/solutions/real-estate",
  "/solutions/restaurants",
  "/solutions/service-businesses",
  "/solutions/agencies",
  "/solutions/lead-based",
  "/resources#start-here",
  "/faq",
  "/contact",
  "/resources",
  "/guides",
  "/templates",
  "/templates#calculators",
  "/glossary",
  "/compare",
  "/academy",
  "/pricing",
]);

describe("marketingNav", () => {
  it("uses six topics and keeps pricing as a direct link", () => {
    for (const locale of LOCALES) {
      const nav = marketingNav(locale);
      expect(nav.map((group) => group.id)).toEqual([
        "platform",
        "products",
        "solutions",
        "support",
        "resources",
        "pricing",
      ]);
      expect(nav[5].to).toBe("/pricing");
      expect(nav[5].columns).toBeUndefined();
      for (const group of nav) {
        expect(group.label.trim().length).toBeGreaterThan(1);
        const links = (group.columns || []).flatMap((column) => column.links);
        expect(new Set(links.map((link) => link.to)).size).toBe(links.length);
        for (const link of links) {
          expect(LIVE.has(link.to), link.to).toBe(true);
          expect(link.label.trim().length).toBeGreaterThan(1);
          expect(link.blurb).not.toMatch(/SEO|GEO|AEO|תשובה למנועי AI/i);
        }
      }
    }
  });

  it("does not link the donation page or a private integrations callback", () => {
    const hrefs = marketingNav("en").flatMap((group) =>
      (group.columns || []).flatMap((column) => column.links.map((link) => link.to)),
    );
    expect(hrefs).not.toContain("/support");
    expect(hrefs).not.toContain("/integrations");
    expect(hrefs).toContain("/solutions/agencies");
    expect(hrefs).toContain("/saas");
  });

  it("keeps the industry addresses for the platform page", () => {
    const industries = industryNav("he");
    expect(industries.label).toBe("לפי ענף");
    expect(industries.links.map((link) => link[0])).toEqual([
      "/solutions/clinics",
      "/solutions/beauty",
      "/solutions/real-estate",
      "/solutions/restaurants",
      "/solutions/service-businesses",
      "/solutions/agencies",
      "/solutions/lead-based",
    ]);
  });
});
