import i18n from "./i18n";
import { coerceSupportedLanguage, isHebrewLanguage } from "./languages";

export type TranslateFn = (
  key: string,
  options?: { defaultValue?: string },
) => string;

export type CatalogCopyItem = {
  sku?: string;
  planKey?: string;
  nameHe?: string;
  nameEn?: string;
  descriptionHe?: string;
  descriptionEn?: string;
  displayNameHe?: string;
  taglineHe?: string;
  taglineEn?: string;
  includedHe?: string[];
  includedEn?: string[];
};

function langOf(language?: string) {
  return coerceSupportedLanguage(language || i18n.language);
}

function pickFallback(
  heValue: string | undefined,
  enValue: string | undefined,
  language?: string,
) {
  const he = String(heValue || "").trim();
  const en = String(enValue || "").trim();
  if (isHebrewLanguage(langOf(language))) return he || en;
  return en || he;
}

export function catalogProductName(
  t: TranslateFn,
  item?: CatalogCopyItem | null,
  language?: string,
) {
  const sku = String(item?.sku || "").trim();
  const fallback =
    pickFallback(
      item?.displayNameHe || item?.nameHe,
      item?.nameEn,
      language,
    ) || sku || "—";
  if (!sku) return fallback;
  return t(`partner.catalog.products.${sku}.name`, { defaultValue: fallback });
}

export function catalogProductDescription(
  t: TranslateFn,
  item?: CatalogCopyItem | null,
  language?: string,
) {
  const sku = String(item?.sku || "").trim();
  const fallback = pickFallback(
    item?.descriptionHe,
    item?.descriptionEn,
    language,
  );
  if (!sku) return fallback;
  if (!fallback && !sku) return "";
  const translated = t(`partner.catalog.products.${sku}.description`, {
    defaultValue: fallback || "",
  });
  return translated || fallback;
}

export function catalogProductTagline(
  t: TranslateFn,
  item?: CatalogCopyItem | null,
  language?: string,
) {
  const sku = String(item?.sku || "").trim();
  const fallback = pickFallback(item?.taglineHe, item?.taglineEn, language);
  if (!sku) return fallback;
  const translated = t(`partner.catalog.products.${sku}.tagline`, {
    defaultValue: fallback || "",
  });
  return (
    translated ||
    fallback ||
    catalogProductDescription(t, item, language)
  );
}

export function catalogProductIncluded(
  t: TranslateFn,
  item?: CatalogCopyItem | null,
  language?: string,
) {
  const sku = String(item?.sku || "").trim();
  const heRows = Array.isArray(item?.includedHe) ? item!.includedHe! : [];
  const enRows = Array.isArray(item?.includedEn) ? item!.includedEn! : [];
  const lang = langOf(language);
  const hebrew = isHebrewLanguage(lang);
  const rowCount = Math.max(heRows.length, enRows.length);

  if (!sku) {
    if (hebrew) return heRows.length ? heRows : enRows;
    return enRows.length ? enRows : [];
  }

  const out: string[] = [];
  for (let index = 0; index < rowCount; index += 1) {
    const he = String(heRows[index] || "").trim();
    const en = String(enRows[index] || "").trim();
    const translated = t(`partner.catalog.products.${sku}.included.${index}`, {
      defaultValue: "",
    });
    if (translated) {
      out.push(translated);
      continue;
    }
    if (hebrew) {
      if (he || en) out.push(he || en);
      continue;
    }
    // Non-Hebrew: prefer EN twin; never dump Hebrew-only rows blindly
    if (en) out.push(en);
  }
  return out;
}

export function catalogCategoryLabel(
  t: TranslateFn,
  categoryId?: string,
  fallback?: string,
) {
  const id = String(categoryId || "").trim();
  const label = String(fallback || "").trim();
  if (!id) return label;
  return t(`partner.catalog.categories.${id}`, { defaultValue: label || id });
}

export function partnerPlanDisplayName(
  t: TranslateFn,
  plan?: CatalogCopyItem | { planKey?: string; nameHe?: string; nameEn?: string } | null,
  language?: string,
) {
  const key = String(plan?.planKey || "").trim();
  const fallback =
    pickFallback(plan?.nameHe, plan?.nameEn, language) || key;
  if (!key) return fallback || "";
  return t(`partner.planNames.${key}`, { defaultValue: fallback || key });
}
