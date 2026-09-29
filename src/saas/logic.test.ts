import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { saasMarketCopy } from "../i18n/saasMarketplace";
import {
  EXAMPLE_PLANS,
  REVENUE_DISCLAIMER,
  filterProducts,
  findTractionClaims,
  formatUsd,
  illustrativeMrr,
  partnerEntryUsd,
  cardFilm,
  isInAppDemo,
  templateDemoLinks,
  templateExperienceHref,
  templateShots,
  whatsappHref,
} from "./logic";

describe("marketplace filters and calculator", () => {
  const products = [
    { slug: "serviceflow", category: "home_services" },
    { slug: "reviewpilot", category: "sales_marketing" },
    { slug: "salonflow", category: "beauty_wellness" },
  ];

  it("filters by category and returns every system for All", () => {
    expect(filterProducts(products, "all")).toHaveLength(3);
    expect(filterProducts(products, "beauty_wellness").map((item) => item.slug)).toEqual([
      "salonflow",
    ]);
    expect(filterProducts(products, "restaurants")).toEqual([]);
  });

  it("calculates illustrative MRR and keeps the disclaimer", () => {
    expect(illustrativeMrr(50, 99)).toBe(4950);
    expect(illustrativeMrr(100, 99)).toBe(9900);
    expect(formatUsd(4950)).toBe("$4,950");
    expect(EXAMPLE_PLANS.map((plan) => plan.price)).toEqual([49, 99, 199]);
    expect(REVENUE_DISCLAIMER).toBe(
      "Revenue examples are illustrative only and are not guarantees of future earnings."
    );
  });

  it("uses half the reference price as the partner entry", () => {
    expect(partnerEntryUsd(14900)).toBe(7450);
    expect(partnerEntryUsd(8900)).toBe(4450);
  });

  it("builds a WhatsApp link with the prefilled message", () => {
    const href = whatsappHref(
      "+972 50-000-0000",
      "Hi, I'm interested in ServiceFlow – the ready-to-launch Field Service SaaS platform."
    );
    expect(href.startsWith("https://wa.me/972500000000?text=")).toBe(true);
    expect(decodeURIComponent(href.split("text=")[1])).toContain("ServiceFlow");
    expect(whatsappHref("", "Hi")).toBe("");
  });

  it("does not describe the platforms as an operating business", () => {
    expect(findTractionClaims("Ready-to-launch SaaS platform")).toEqual([]);
    expect(findTractionClaims("existing customers and current MRR")).not.toEqual([]);
  });
});

describe("marketplace translations", () => {
  function paths(value: unknown, prefix = ""): string[] {
    if (Array.isArray(value)) return value.flatMap((item, index) => paths(item, `${prefix}.${index}`));
    if (value && typeof value === "object") {
      return Object.keys(value)
        .sort()
        .flatMap((key) => paths((value as Record<string, unknown>)[key], `${prefix}.${key}`));
    }
    return [prefix];
  }

  it("keeps the same keys in every language", () => {
    const base = paths(saasMarketCopy.en);
    for (const lang of ["he", "es", "pt-BR", "ar"] as const) {
      expect(paths(saasMarketCopy[lang]), lang).toEqual(base);
      expect(saasMarketCopy[lang].hero.title).not.toBe(saasMarketCopy.en.hero.title);
      expect(findTractionClaims(JSON.stringify(saasMarketCopy[lang]))).toEqual([]);
    }
  });
});

describe("marketplace stays unlisted", () => {
  const root = resolve(__dirname, "../..");
  const files = [
    "src/components/Header.tsx",
    "src/components/Footer.tsx",
    "src/pages/Home.tsx",
    "src/pages/business/Pricing.jsx",
    "src/pages/Login.tsx",
    "src/pages/Register.tsx",
    "src/components/dashboard/DashboardNav.jsx",
    "generate-sitemap.js",
    "public/marketing-sitemap.xml",
    "public/marketing-robots.txt",
  ];

  it("does not offer checkout from the public marketplace UI", () => {
    const ui = [
      "src/pages/saas/SaasMarketplacePage.tsx",
      "src/pages/saas/SaasProductPage.tsx",
      "src/saas/sections.tsx",
      "src/saas/chrome.tsx",
      "src/saas/SaasWidgets.tsx",
    ];
    for (const file of ui) {
      const source = readFileSync(resolve(root, file), "utf8");
      expect(source, file).not.toMatch(/Buy Now|startSaasCheckout|Purchase directly/);
    }
  });

  it("builds template demo links from the published fields", () => {
    expect(
      templateDemoLinks({
        supportsAdminDemo: true,
        supportsCustomerDemo: false,
        adminDemoUrl: "https://demo.example/admin",
        customerDemoUrl: "https://demo.example/customer",
        demoSelectorUrl: "https://demo.example/explore",
      }).map((link) => link.id)
    ).toEqual(["admin", "explore"]);
    expect(
      templateDemoLinks({
        supportsAdminDemo: true,
        adminDemoUrl: "javascript:alert(1)",
        demoSelectorUrl: "/relative",
      })
    ).toEqual([]);
    expect(templateDemoLinks({
      supportsAdminDemo: true,
      adminDemoUrl: "/saas/northwind-desk/demo?mode=admin",
    }).map((link) => link.href)).toEqual(["/saas/northwind-desk/demo?mode=admin"]);
    expect(templateExperienceHref("northwind-desk", "customer")).toBe("/saas/northwind-desk/demo?mode=customer");
    expect(isInAppDemo("/saas/northwind-desk/demo?mode=full")).toBe(true);
    expect(isInAppDemo("https://demo.example/admin")).toBe(false);
    expect(cardFilm({ screenshots: [{ key: "dashboard", label: "Dashboard", imageUrl: "/saas-media/a.png" }] })).toHaveLength(1);
    expect(templateShots({ screenshots: [{ key: "x", label: "X" }] })).toEqual([]);
  });

  it("does not hardcode control-center template names in the marketplace UI", () => {
    const ui = [
      "src/pages/saas/SaasMarketplacePage.tsx",
      "src/pages/saas/SaasProductPage.tsx",
      "src/saas/stage.tsx",
      "src/saas/sections.tsx",
      "src/saas/templateShowcase.tsx",
      "src/pages/saas/SaasTemplateProductPage.tsx",
      "src/pages/saas/SaasTemplateDemoPage.tsx",
    ];
    for (const file of ui) {
      const source = readFileSync(resolve(root, file), "utf8");
      expect(source, file).not.toMatch(/BeautyFlow|Global Properties/);
    }
  });

  it("does not link /saas from the main site, sitemap, or robots allow-list pages", () => {
    for (const file of files) {
      const source = readFileSync(resolve(root, file), "utf8");
      expect(source, file).not.toMatch(/["'`]\/saas(?:["'`/?]|$)/);
      expect(source, file).not.toContain("bizuply.com/saas");
    }
  });
});
