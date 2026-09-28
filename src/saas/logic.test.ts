import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  EXAMPLE_PLANS,
  REVENUE_DISCLAIMER,
  filterProducts,
  findTractionClaims,
  formatUsd,
  illustrativeMrr,
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

  it("does not link /saas from the main site, sitemap, or robots allow-list pages", () => {
    for (const file of files) {
      const source = readFileSync(resolve(root, file), "utf8");
      expect(source, file).not.toMatch(/["'`]\/saas(?:["'`/?]|$)/);
      expect(source, file).not.toContain("bizuply.com/saas");
    }
  });
});
