import {
  readVisualContent,
  writeVisualContentItem,
} from "./visualData";

export type SitePageNavSource = {
  id?: string;
  title?: string;
  name?: string;
  slug?: string;
  isHome?: boolean;
};

export type TemplateNavItem = {
  page?: string;
  label?: string;
  [key: string]: any;
};

function normalizeKey(value: unknown) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");
}

export function findSitePageForNavItem(
  navItem: TemplateNavItem | null | undefined,
  sitePages: SitePageNavSource[] | null | undefined,
) {
  const pages = Array.isArray(sitePages) ? sitePages : [];
  if (!pages.length) return null;

  const pageKey = normalizeKey(navItem?.page);
  const isHomeKey =
    !pageKey || pageKey === "home" || pageKey === "index" || pageKey === "/";

  if (isHomeKey) {
    return (
      pages.find((page) => page.isHome || normalizeKey(page.id) === "home") ||
      null
    );
  }

  return (
    pages.find((page) => {
      const id = normalizeKey(page.id);
      const slug = normalizeKey(page.slug);
      return id === pageKey || slug === pageKey;
    }) || null
  );
}

export function resolveNavLabelFromSitePages(
  navItem: TemplateNavItem,
  sitePages: SitePageNavSource[] | null | undefined,
) {
  const matched = findSitePageForNavItem(navItem, sitePages);
  const title = String(matched?.title || matched?.name || "").trim();
  return title || String(navItem?.label || "").trim();
}

export function syncNavLabelsWithSitePages<T extends TemplateNavItem>(
  nav: T[] | null | undefined,
  sitePages: SitePageNavSource[] | null | undefined,
): T[] {
  const items = Array.isArray(nav) ? nav : [];
  if (!items.length) return items;

  return items.map((item) => {
    const nextLabel = resolveNavLabelFromSitePages(item, sitePages);
    if (!nextLabel || nextLabel === item.label) return item;
    return { ...item, label: nextLabel };
  });
}

function writeNavLabelsIntoContent(
  data: Record<string, any>,
  nav: TemplateNavItem[],
  prefix: string,
) {
  let next = data;
  const content = readVisualContent(next);

  nav.forEach((item, index) => {
    const label = String(item?.label || "").trim();
    if (!label) return;

    const elementId = `${prefix}.${index}`;
    const existing = content[elementId];
    if (existing && typeof existing === "object") {
      if (String((existing as any).text || "") === label) return;
      next = writeVisualContentItem(next, elementId, {
        ...(existing as Record<string, any>),
        text: label,
      });
      return;
    }

    next = writeVisualContentItem(next, elementId, { text: label });
  });

  return next;
}

/**
 * Keep template `nav[].label` and visual `__content` for header/footer nav
 * in sync with Site Pages titles (e.g. "ראשי" → "דף הבית").
 */
export function syncSitePageTitlesIntoVisualData(
  data: Record<string, any> | null | undefined,
  sitePages: SitePageNavSource[] | null | undefined,
  options?: { navContentPrefixes?: string[] },
) {
  const source = data && typeof data === "object" ? { ...data } : {};
  const pages = Array.isArray(sitePages) ? sitePages : [];
  if (!pages.length) {
    return {
      ...source,
      __sitePages: pages,
    };
  }

  const currentNav = Array.isArray(source.nav) ? source.nav : null;
  if (!currentNav?.length) {
    return {
      ...source,
      __sitePages: pages,
    };
  }

  const nextNav = syncNavLabelsWithSitePages(currentNav, pages);
  let next: Record<string, any> = {
    ...source,
    nav: nextNav,
    __sitePages: pages,
  };

  const prefixes = options?.navContentPrefixes || [
    "global.header.nav",
    "global.footer.nav",
  ];

  prefixes.forEach((prefix) => {
    next = writeNavLabelsIntoContent(next, nextNav, prefix);
  });

  return next;
}

export function didSitePageNavSyncChange(
  previous: Record<string, any> | null | undefined,
  next: Record<string, any> | null | undefined,
) {
  try {
    const prevNav = JSON.stringify((previous as any)?.nav || null);
    const nextNav = JSON.stringify((next as any)?.nav || null);
    if (prevNav !== nextNav) return true;

    const prevContent = ((previous as any)?.__content || {}) as Record<
      string,
      any
    >;
    const nextContent = ((next as any)?.__content || {}) as Record<string, any>;
    const keys = new Set([
      ...Object.keys(prevContent),
      ...Object.keys(nextContent),
    ]);

    for (const key of keys) {
      if (!key.includes(".nav.")) continue;
      if (
        String(prevContent[key]?.text || "") !==
        String(nextContent[key]?.text || "")
      ) {
        return true;
      }
    }

    return false;
  } catch {
    return true;
  }
}
