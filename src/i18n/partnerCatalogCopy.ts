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
  includedHe?: string[];
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
  const fallback = String(item?.taglineHe || "").trim();
  if (!sku) return fallback;
  const translated = t(`partner.catalog.products.${sku}.tagline`, {
    defaultValue: fallback,
  });
  return translated || fallback || catalogProductDescription(t, item, language);
}

export function catalogProductIncluded(
  t: TranslateFn,
  item?: CatalogCopyItem | null,
) {
  const sku = String(item?.sku || "").trim();
  const rows = Array.isArray(item?.includedHe) ? item!.includedHe! : [];
  return rows.map((row, index) =>
    sku
      ? t(`partner.catalog.products.${sku}.included.${index}`, {
          defaultValue: row,
        })
      : row,
  );
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
