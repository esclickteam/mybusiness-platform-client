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
  "/solutions/clinics",
  "/solutions/beauty",
  "/solutions/real-estate",
  "/solutions/restaurants",
  "/solutions/service-businesses",
  "/solutions/agencies",
  "/solutions/lead-based",
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
          expect(link.blurb).not.toMatch(/SEO|GEO|AEO|תשובה למנועי AI|already written|current addresses|existing catalog/i);
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
    expect(hrefs.filter((href) => href === "/automations")).toHaveLength(1);
    expect(marketingNav("en").find((group) => group.id === "products").columns.map((column) => column.id)).toEqual([
      "customers",
      "marketing",
      "build",
      "saas",
    ]);
    expect(marketingNav("en").find((group) => group.id === "support").columns[0].links.map((link) => link.to)).toEqual([
      "/faq",
      "/contact",
    ]);
  });

  it("keeps the industry addresses for the platform page", () => {
    const industries = industryNav("he");
    expect(industries.label).toBe("ענפים");
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
