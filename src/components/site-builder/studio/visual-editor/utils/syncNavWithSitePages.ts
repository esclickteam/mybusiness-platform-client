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
  hiddenFromMenu?: boolean;
};

export type TemplateNavItem = {
  page?: string;
  pageId?: string;
  id?: string;
  label?: string;
  href?: string;
  /** Stable link to a Site Page after the first successful sync. */
  __sitePageId?: string;
  [key: string]: any;
};

const NAV_CONTENT_PREFIXES = [
  "global.header.nav",
  "global.footer.nav",
  "header.nav",
  "footer.nav",
  "nav",
];

function normalizeKey(value: unknown) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/^\/+|\/+$/g, "")
    .replace(/\.html?$/i, "");
}

function pageTitle(page: SitePageNavSource | null | undefined) {
  return String(page?.title || page?.name || "").trim();
}

/** Runtime-only page descriptors — never embed full page visual/html payloads. */
export function slimSitePageNavSources(
  sitePages: SitePageNavSource[] | null | undefined,
): SitePageNavSource[] {
  return (Array.isArray(sitePages) ? sitePages : [])
    .map((page) => ({
      id: String(page?.id || "").trim(),
      title: String(page?.title || page?.name || "").trim(),
      name: String(page?.name || page?.title || "").trim(),
      slug: String(page?.slug || "").trim(),
      isHome: Boolean(page?.isHome),
      hiddenFromMenu: Boolean(page?.hiddenFromMenu),
    }))
    .filter((page) => page.id);
}

function isHomePage(page: SitePageNavSource) {
  const id = normalizeKey(page.id);
  return Boolean(page.isHome) || id === "home" || id === "index";
}

function isHomeKey(key: string) {
  return !key || key === "home" || key === "index" || key === "/" || key === "#";
}

function navItemPageKey(navItem: TemplateNavItem | null | undefined) {
  return normalizeKey(
    navItem?.__sitePageId ||
      navItem?.page ||
      navItem?.pageId ||
      navItem?.id ||
      "",
  );
}

function isNavContentElementId(elementId: string) {
  const id = String(elementId || "").trim();
  if (!id) return false;
  if (/\.nav\.\d+$/i.test(id)) return true;
  if (/^nav\.\d+/i.test(id)) return true;
  if (/^header\.nav\./i.test(id) || /^footer\.nav\./i.test(id)) return true;
  return NAV_CONTENT_PREFIXES.some(
    (prefix) => id === prefix || id.startsWith(`${prefix}.`),
  );
}

function hrefFromContentItem(item: Record<string, any> | null | undefined) {
  if (!item || typeof item !== "object") return "";
  return String(
    item.href ||
      item.url ||
      item.to ||
      item.link ||
      item.pageHref ||
      "",
  ).trim();
}

export function findSitePageByHref(
  href: unknown,
  sitePages: SitePageNavSource[] | null | undefined,
) {
  const pages = Array.isArray(sitePages) ? sitePages : [];
  if (!pages.length) return null;

  const key = normalizeKey(href);
  if (isHomeKey(key)) {
    return pages.find((page) => isHomePage(page)) || null;
  }

  const exact =
    pages.find((page) => {
      const id = normalizeKey(page.id);
      const slug = normalizeKey(page.slug);
      return id === key || slug === key;
    }) || null;

  if (exact) return exact;

  const fuzzy = pages.filter((page) => {
    const id = normalizeKey(page.id);
    const slug = normalizeKey(page.slug);
    if (!id && !slug) return false;
    return (
      (slug && (slug.startsWith(key) || key.startsWith(slug))) ||
      (id && (id.startsWith(key) || key.startsWith(id)))
    );
  });

  return fuzzy.length === 1 ? fuzzy[0] : null;
}

type FindNavPageOptions = {
  href?: string;
  /** pageId → previous title, used while a rename is in flight */
  previousTitleById?: Record<string, string>;
};

export function findSitePageForNavItem(
  navItem: TemplateNavItem | null | undefined,
  sitePages: SitePageNavSource[] | null | undefined,
  options?: FindNavPageOptions,
) {
  const pages = Array.isArray(sitePages) ? sitePages : [];
  if (!pages.length) return null;

  const previousTitleById = options?.previousTitleById || {};

  const boundId = normalizeKey(navItem?.__sitePageId);
  if (boundId) {
    const bound =
      pages.find((page) => normalizeKey(page.id) === boundId) || null;
    if (bound) return bound;
  }

  const href = String(options?.href || navItem?.href || "").trim();
  if (href) {
    const byHref = findSitePageByHref(href, pages);
    if (byHref) return byHref;
  }

  const pageKey = navItemPageKey(navItem);
  if (isHomeKey(pageKey)) {
    /*
      Only treat as home when the item actually points at home.
      Missing keys without an href are unresolved — not home.
    */
    if (!pageKey && !href) return null;
    return pages.find((page) => isHomePage(page)) || null;
  }

  const exact =
    pages.find((page) => {
      const id = normalizeKey(page.id);
      const slug = normalizeKey(page.slug);
      return id === pageKey || slug === pageKey;
    }) || null;

  if (exact) return exact;

  const label = String(navItem?.label || "").trim();
  if (label) {
    const byTitle = pages.filter((page) => {
      const id = String(page.id || "");
      return (
        pageTitle(page) === label ||
        String(previousTitleById[id] || "") === label
      );
    });
    if (byTitle.length === 1) return byTitle[0];
  }

  const fuzzy = pages.filter((page) => {
    const id = normalizeKey(page.id);
    const slug = normalizeKey(page.slug);
    if (!id && !slug) return false;
    return (
      (slug && (slug.startsWith(pageKey) || pageKey.startsWith(slug))) ||
      (id && (id.startsWith(pageKey) || pageKey.startsWith(id)))
    );
  });

  return fuzzy.length === 1 ? fuzzy[0] : null;
}

function sitePageHref(page: SitePageNavSource) {
  if (isHomePage(page)) return "/";
  const slug = normalizeKey(page.slug || page.id);
  return slug ? `/${slug}` : "/";
}

export function resolveNavLabelFromSitePages(
  navItem: TemplateNavItem,
  sitePages: SitePageNavSource[] | null | undefined,
  options?: FindNavPageOptions,
) {
  const matched = findSitePageForNavItem(navItem, sitePages, options);
  const title = pageTitle(matched);
  return title || String(navItem?.label || "").trim();
}

export function syncNavLabelsWithSitePages<T extends TemplateNavItem>(
  nav: T[] | null | undefined,
  sitePages: SitePageNavSource[] | null | undefined,
  options?: {
    hrefByIndex?: Array<string | undefined>;
    previousTitleById?: Record<string, string>;
  },
): T[] {
  const items = Array.isArray(nav) ? nav : [];
  if (!items.length) return items;

  return items.map((item, index) => {
    const href = options?.hrefByIndex?.[index];
    const matched = findSitePageForNavItem(item, sitePages, {
      href,
      previousTitleById: options?.previousTitleById,
    });
    const nextLabel =
      pageTitle(matched) || String(item?.label || "").trim();
    const nextPageId = String(matched?.id || item.__sitePageId || "").trim();
    const nextHref =
      String(href || item.href || "").trim() ||
      (matched ? sitePageHref(matched) : "");

    const labelChanged = Boolean(nextLabel && nextLabel !== item.label);
    const bindingChanged =
      Boolean(nextPageId) && nextPageId !== String(item.__sitePageId || "");
    const hrefChanged =
      Boolean(nextHref) && nextHref !== String(item.href || "");

    if (!labelChanged && !bindingChanged && !hrefChanged) return item;

    return {
      ...item,
      ...(nextLabel ? { label: nextLabel } : {}),
      ...(nextPageId ? { __sitePageId: nextPageId } : {}),
      ...(nextHref ? { href: nextHref } : {}),
    };
  });
}

function readHrefByNavIndex(
  data: Record<string, any>,
  prefix: string,
  index: number,
) {
  const content = readVisualContent(data);
  const item = content[`${prefix}.${index}`];
  return hrefFromContentItem(item as Record<string, any>);
}

function collectHrefByIndex(
  data: Record<string, any>,
  prefixes: string[],
  length: number,
) {
  return Array.from({ length }, (_, index) => {
    for (const prefix of prefixes) {
      const href = readHrefByNavIndex(data, prefix, index);
      if (href) return href;
    }
    return undefined;
  });
}

const ALWAYS_WRITE_NAV_PREFIXES = new Set([
  "global.header.nav",
  "global.footer.nav",
]);

function writeNavLabelsIntoContent(
  data: Record<string, any>,
  nav: TemplateNavItem[],
  prefix: string,
  sitePages: SitePageNavSource[],
  previousTitleById?: Record<string, string>,
) {
  let next = data;
  const alwaysWrite = ALWAYS_WRITE_NAV_PREFIXES.has(prefix);

  nav.forEach((item, index) => {
    const elementId = `${prefix}.${index}`;
    const content = readVisualContent(next);
    const existing = (content[elementId] || {}) as Record<string, any>;
    const hasExisting = Boolean(
      existing && typeof existing === "object" && Object.keys(existing).length,
    );

    if (!hasExisting && !alwaysWrite) return;

    const href = hrefFromContentItem(existing) || String(item.href || "");
    const matched = findSitePageForNavItem(item, sitePages, {
      href,
      previousTitleById,
    });
    const label =
      pageTitle(matched) ||
      resolveNavLabelFromSitePages(item, sitePages, {
        href,
        previousTitleById,
      });
    if (!label) return;

    const nextHref = href || (matched ? sitePageHref(matched) : "");
    const patch = {
      ...existing,
      text: label,
      ...(nextHref ? { href: nextHref } : {}),
      ...(matched?.id ? { sitePageId: String(matched.id) } : {}),
    };

    if (hasExisting) {
      if (
        String(existing.text || "") === label &&
        hrefFromContentItem(existing) === nextHref
      ) {
        return;
      }
      next = writeVisualContentItem(next, elementId, patch);
      return;
    }

    next = writeVisualContentItem(next, elementId, patch);
  });

  return next;
}

function syncAllNavLikeContent(
  data: Record<string, any>,
  sitePages: SitePageNavSource[],
  previousTitleById?: Record<string, string>,
) {
  let next = data;
  const content = readVisualContent(next);

  Object.entries(content).forEach(([elementId, rawItem]) => {
    if (!isNavContentElementId(elementId)) return;
    const item = (rawItem || {}) as Record<string, any>;
    const href = hrefFromContentItem(item);
    const boundId = normalizeKey(item.sitePageId || item.__sitePageId);

    let matched = boundId
      ? sitePages.find((page) => normalizeKey(page.id) === boundId) || null
      : null;

    if (!matched && href) {
      matched = findSitePageByHref(href, sitePages);
    }

    if (!matched) {
      const indexMatch = elementId.match(/\.(\d+)$/);
      const index = indexMatch ? Number(indexMatch[1]) : -1;
      const nav = Array.isArray(next.nav)
        ? next.nav
        : Array.isArray(next.navigation)
          ? next.navigation
          : [];
      if (index >= 0 && nav[index]) {
        matched = findSitePageForNavItem(nav[index], sitePages, {
          href,
          previousTitleById,
        });
      }
    }

    if (!matched) {
      const label = String(item.text || "").trim();
      if (label) {
        const byTitle = sitePages.filter((page) => {
          const id = String(page.id || "");
          return (
            pageTitle(page) === label ||
            String(previousTitleById?.[id] || "") === label
          );
        });
        if (byTitle.length === 1) matched = byTitle[0];
      }
    }

    // header.nav.home / header.nav.services style ids
    if (!matched) {
      const token = normalizeKey(elementId.split(".").pop());
      if (token && !/^\d+$/.test(token)) {
        matched = findSitePageForNavItem({ page: token }, sitePages, {
          previousTitleById,
        });
      }
    }

    const title = pageTitle(matched);
    if (!title || String(item.text || "") === title) return;

    next = writeVisualContentItem(next, elementId, {
      ...item,
      text: title,
      ...(matched?.id ? { sitePageId: String(matched.id) } : {}),
      ...(href || matched ? { href: href || sitePageHref(matched!) } : {}),
    });
  });

  return next;
}

function syncLinkedPageNameContent(
  data: Record<string, any>,
  sitePages: SitePageNavSource[],
  previousTitleById?: Record<string, string>,
) {
  let next = data;
  const content = readVisualContent(next);
  const titles = new Set(
    sitePages.map((page) => pageTitle(page)).filter(Boolean),
  );
  Object.values(previousTitleById || {}).forEach((title) => {
    if (title) titles.add(title);
  });

  Object.entries(content).forEach(([elementId, rawItem]) => {
    if (isNavContentElementId(elementId)) return;

    const item = (rawItem || {}) as Record<string, any>;
    const href = hrefFromContentItem(item);
    const boundId = normalizeKey(item.sitePageId || item.__sitePageId);
    const matched = boundId
      ? sitePages.find((page) => normalizeKey(page.id) === boundId) || null
      : href
        ? findSitePageByHref(href, sitePages)
        : null;
    const title = pageTitle(matched);
    if (!title) return;

    const current = String(item.text || "").trim();
    /*
      Only rewrite non-nav link labels that already look like a page name
      (current/previous page title), so CTAs like "לקביעת ביקור" stay intact.
    */
    if (current && current !== title && !titles.has(current)) return;
    if (current === title) return;

    next = writeVisualContentItem(next, elementId, {
      ...item,
      text: title,
      ...(matched?.id ? { sitePageId: String(matched.id) } : {}),
    });
  });

  return next;
}

function syncNavStringFields(
  data: Record<string, any>,
  sitePages: SitePageNavSource[],
) {
  const next = { ...data };

  sitePages.forEach((page) => {
    const title = pageTitle(page);
    if (!title) return;

    const id = normalizeKey(page.id);
    const candidates = new Set<string>();

    if (isHomePage(page) || id === "home") {
      candidates.add("navHome");
    }

    if (id) {
      const camel = `nav${id.charAt(0).toUpperCase()}${id.slice(1)}`;
      candidates.add(camel);
    }

    candidates.forEach((field) => {
      if (typeof next[field] === "string" && next[field] !== title) {
        next[field] = title;
      }
    });
  });

  return next;
}

/**
 * Keep template nav labels and visual `__content` in sync with Site Pages titles.
 */
export function syncSitePageTitlesIntoVisualData(
  data: Record<string, any> | null | undefined,
  sitePages: SitePageNavSource[] | null | undefined,
  options?: {
    navContentPrefixes?: string[];
    previousTitleById?: Record<string, string>;
  },
) {
  const source = data && typeof data === "object" ? { ...data } : {};
  const pages = slimSitePageNavSources(sitePages);
  /*
    Never persist full studio page objects (html/data/payloads) inside visual data.
    Those caused PayloadTooLargeError on save.
  */
  delete (source as any).__sitePages;
  delete (source as any).__previousSitePageTitles;

  if (!pages.length) {
    return source;
  }

  const prefixes = options?.navContentPrefixes || NAV_CONTENT_PREFIXES;
  const previousTitleById = options?.previousTitleById || {};
  const currentNav = Array.isArray(source.nav) ? source.nav : null;
  const currentNavigation = Array.isArray(source.navigation)
    ? source.navigation
    : null;

  let next: Record<string, any> = {
    ...source,
    /* Slim descriptors only — safe for runtime, stripped again on API save. */
    __sitePages: pages,
  };

  if (currentNav?.length) {
    const hrefByIndex = collectHrefByIndex(next, prefixes, currentNav.length);
    next = {
      ...next,
      nav: syncNavLabelsWithSitePages(currentNav, pages, {
        hrefByIndex,
        previousTitleById,
      }),
    };
  }

  if (currentNavigation?.length) {
    const hrefByIndex = collectHrefByIndex(
      next,
      prefixes,
      currentNavigation.length,
    );
    next = {
      ...next,
      navigation: syncNavLabelsWithSitePages(currentNavigation, pages, {
        hrefByIndex,
        previousTitleById,
      }),
    };
  }

  next = syncNavStringFields(next, pages);

  const navForContent = Array.isArray(next.nav)
    ? next.nav
    : Array.isArray(next.navigation)
      ? next.navigation
      : [];

  if (navForContent.length) {
    prefixes.forEach((prefix) => {
      next = writeNavLabelsIntoContent(
        next,
        navForContent,
        prefix,
        pages,
        previousTitleById,
      );
    });
  }

  next = syncAllNavLikeContent(next, pages, previousTitleById);
  next = syncLinkedPageNameContent(next, pages, previousTitleById);

  return next;
}

export function didSitePageNavSyncChange(
  previous: Record<string, any> | null | undefined,
  next: Record<string, any> | null | undefined,
) {
  try {
    const prevNav = JSON.stringify({
      nav: (previous as any)?.nav || null,
      navigation: (previous as any)?.navigation || null,
    });
    const nextNav = JSON.stringify({
      nav: (next as any)?.nav || null,
      navigation: (next as any)?.navigation || null,
    });
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
      const prevText = String(prevContent[key]?.text || "");
      const nextText = String(nextContent[key]?.text || "");
      if (prevText === nextText) continue;

      if (
        isNavContentElementId(key) ||
        hrefFromContentItem(prevContent[key]) ||
        hrefFromContentItem(nextContent[key])
      ) {
        return true;
      }
    }

    const stringFields = [
      ...Object.keys(previous || {}),
      ...Object.keys(next || {}),
    ].filter((key) => /^nav[A-Z]/.test(key));

    for (const field of stringFields) {
      if (String((previous as any)?.[field] || "") !== String((next as any)?.[field] || "")) {
        return true;
      }
    }

    return false;
  } catch {
    return true;
  }
}
