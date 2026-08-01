import catalogJson from "./templateCatalog.generated.json";

export type TemplateCatalogEntry = {
  id: string;
  folder: string;
  name: string;
  category: string;
  categoryLabel?: string;
  description?: string;
  badge?: string;
  priceLabel?: string;
  image?: string;
  previewImage?: string;
};

/** Light gallery catalog — no React pages / defaultData imports. */
export const templateCatalog = catalogJson as TemplateCatalogEntry[];

export function getTemplateCatalogEntry(id: string | null | undefined) {
  const key = String(id || "")
    .trim()
    .toLowerCase();
  if (!key) return null;
  return templateCatalog.find((entry) => entry.id === key) || null;
}

export function getTemplateCatalogIds() {
  return templateCatalog.map((entry) => entry.id);
}
