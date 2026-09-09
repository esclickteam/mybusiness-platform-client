import { beforeAll, describe, expect, it } from "vitest";
import i18n from "./i18n";
import {
  catalogCategoryLabel,
  catalogProductDescription,
  catalogProductName,
  partnerPlanDisplayName,
} from "./partnerCatalogCopy";

const HEBREW = /[\u0590-\u05FF]/;
const monthlyHe = {
  sku: "monthly",
  nameHe: "חבילה עסקית חודשית",
  nameEn: "Business monthly",
  descriptionHe: "149₪ לחודש — חיוב חודשי מתחדש",
  descriptionEn: "Renewing monthly billing",
  displayNameHe: "רישיון שימוש במערכת",
};

describe("partnerCatalogCopy", () => {
  beforeAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("translates canonical SKU names instead of leftover Hebrew", async () => {
    await i18n.changeLanguage("en");
    const t = i18n.t.bind(i18n);
    expect(catalogProductName(t, monthlyHe)).not.toMatch(HEBREW);
    expect(catalogProductName(t, monthlyHe)).toMatch(/license|business|monthly/i);
    await i18n.changeLanguage("es");
    expect(catalogProductName(t, monthlyHe)).not.toMatch(HEBREW);
    await i18n.changeLanguage("pt-BR");
    expect(catalogProductName(t, monthlyHe)).not.toMatch(HEBREW);
    expect(catalogProductName(t, monthlyHe)).toMatch(/licen[cç]a|sistema/i);
    await i18n.changeLanguage("ar");
    expect(catalogProductName(t, monthlyHe)).not.toMatch(HEBREW);
    await i18n.changeLanguage("he");
    expect(catalogProductName(t, monthlyHe)).toMatch(HEBREW);
  });

  it("translates descriptions and category labels", async () => {
    await i18n.changeLanguage("en");
    const t = i18n.t.bind(i18n);
    expect(catalogProductDescription(t, monthlyHe)).not.toMatch(HEBREW);
    expect(catalogCategoryLabel(t, "website", "אתר ונוכחות דיגיטלית")).toMatch(
      /website|digital/i,
    );
    expect(partnerPlanDisplayName(t, { planKey: "partner_percent", nameHe: "אחוזים בלבד" })).not.toMatch(
      HEBREW,
    );
  });
});
