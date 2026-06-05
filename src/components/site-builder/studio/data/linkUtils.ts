import type { StudioEditableLink, StudioSitePage } from "../types";

export function createSlugFromPageTitle(title: string) {
  const clean = title
    .trim()
    .toLowerCase()
    .replace(/[^\u0590-\u05FFa-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return clean || "page";
}

export function normalizePageSlug(
  title: string,
  pages: StudioSitePage[],
  currentPageId?: string
) {
  const base = createSlugFromPageTitle(title);
  let slug = base;
  let index = 2;

  while (pages.some((page) => page.slug === slug && page.id !== currentPageId)) {
    slug = `${base}-${index}`;
    index += 1;
  }

  return slug;
}

export function buildHrefFromEditableLink(
  link: StudioEditableLink,
  pages: StudioSitePage[]
) {
  if (!link || link.type === "none") return "#";

  if (link.type === "page") {
    const page = pages.find((item) => item.id === link.pageId);
    if (!page) return "#";

    return page.isHome ? "/" : `/${page.slug}`;
  }

  if (link.type === "section") {
    return link.sectionId ? `#${link.sectionId}` : "#";
  }

  if (link.type === "product") {
    return link.productId ? `/products/${link.productId}` : "#";
  }

  if (link.type === "category") {
    return link.categoryId ? `/store/category/${link.categoryId}` : "#";
  }

  if (link.type === "whatsapp") {
    const phone = String(link.value || "").replace(/\D/g, "");
    return phone ? `https://wa.me/${phone}` : "#";
  }

  if (link.type === "phone") {
    return link.value ? `tel:${link.value}` : "#";
  }

  if (link.type === "email") {
    return link.value ? `mailto:${link.value}` : "#";
  }

  if (link.type === "external") {
    const value = String(link.value || "").trim();

    if (!value) return "#";

    if (
      value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.startsWith("mailto:") ||
      value.startsWith("tel:")
    ) {
      return value;
    }

    return `https://${value}`;
  }

  return "#";
}

export function readEditableLinkFromAttributes(attrs: Record<string, any>) {
  return {
    type: (attrs["data-link-type"] || "none") as StudioEditableLink["type"],
    pageId: attrs["data-link-page-id"] || "",
    sectionId: attrs["data-link-section-id"] || "",
    productId: attrs["data-link-product-id"] || "",
    categoryId: attrs["data-link-category-id"] || "",
    value: attrs["data-link-value"] || "",
  };
}

export function writeEditableLinkAttributes(
  link: StudioEditableLink,
  pages: StudioSitePage[]
) {
  return {
    href: buildHrefFromEditableLink(link, pages),
    "data-editable-link": "true",
    "data-link-type": link.type,
    "data-link-page-id": link.pageId || "",
    "data-link-section-id": link.sectionId || "",
    "data-link-product-id": link.productId || "",
    "data-link-category-id": link.categoryId || "",
    "data-link-value": link.value || "",
  };
}
