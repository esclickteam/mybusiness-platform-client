import { describe, expect, it } from "vitest";
import en from "./locales/en.json";
import he from "./locales/he.json";
import es from "./locales/es.json";
import ptBR from "./locales/pt-BR.json";
import ar from "./locales/ar.json";

const catalogs = { en, he, es, "pt-BR": ptBR, ar } as const;

describe("pricing package locales", () => {
  it("has translated feature lists for every product language", () => {
    for (const locale of Object.keys(catalogs) as Array<keyof typeof catalogs>) {
      const website = catalogs[locale].pricing.packages.website.features;
      const monthly = catalogs[locale].pricing.packages.monthly.features;
      const yearly = catalogs[locale].pricing.packages.yearly.features;
      expect(Object.keys(website)).toHaveLength(10);
      expect(Object.keys(monthly)).toHaveLength(12);
      expect(Object.keys(yearly)).toHaveLength(8);
      expect(website[0]).toBeTruthy();
    }

    expect(es.pricing.packages.website.features[0]).not.toBe(
      en.pricing.packages.website.features[0]
    );
    expect(ptBR.pricing.packages.monthly.features[1]).not.toBe(
      en.pricing.packages.monthly.features[1]
    );
    expect(ar.pricing.packages.yearly.features[0]).toMatch(/[\u0600-\u06FF]/);
    expect(he.pricing.packages.website.features[0]).toMatch(/[\u0590-\u05FF]/);
  });

  it("keeps contact and addon copy market-agnostic via interpolation", () => {
    expect(en.pricing.websiteContactMessage).toContain("{{price}}");
    expect(es.pricing.websiteContactMessage).toContain("{{price}}");
    expect(en.pricing.websiteAddon.label).toContain("{{price}}");
    expect(es.pricing.websiteAddon.label).not.toContain("₪550");
    expect(en.pricing.packages.yearly.note).toContain("{{savings}}");
  });
});
