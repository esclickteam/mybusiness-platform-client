function safeString(value) {
  if (value == null) return "";
  return String(value);
}

function asPlainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

export function normalizePublicPath(value) {
  const clean = safeString(value)
    .split("?")[0]
    .split("#")[0]
    .trim();

  if (!clean || clean === "/") return "";

  return clean.replace(/^\/+/, "").replace(/\/+$/, "");
}

export function getCurrentPathname(pathname) {
  if (typeof pathname === "string") return pathname;

  if (typeof window !== "undefined") {
    return window.location.pathname || "/";
  }

  return "/";
}

export function getPagePath(page) {
  const source = asPlainObject(page);

  if (source.isHome || source.id === "home") return "";

  return normalizePublicPath(
    safeString(source.slug) ||
      safeString(source.path) ||
      safeString(source.id),
  );
}

/**
 * Resolve template SPA page id from the public URL.
 * Matches ASCII ids (/shop) and localized slugs.
 */
export function resolveTemplatePageIdFromPath(renderer, pathname) {
  const pages = Array.isArray(renderer?.pages) ? renderer.pages : [];
  if (!pages.length) return "";

  const currentPath = normalizePublicPath(getCurrentPathname(pathname));
  if (!currentPath) return "home";

  for (const page of pages) {
    const source = asPlainObject(page);
    const id = normalizePublicPath(source.id);
    const slug = normalizePublicPath(source.slug);
    const path = normalizePublicPath(source.path);
    const name = normalizePublicPath(source.name);

    if (
      id === currentPath ||
      slug === currentPath ||
      path === currentPath ||
      name === currentPath
    ) {
      return safeString(source.id) || "home";
    }
  }

  return "";
}

export function getFallbackPageId(activePage, pathname, renderer) {
  const fromTemplate = resolveTemplatePageIdFromPath(renderer, pathname);
  if (fromTemplate) return fromTemplate;

  const page = asPlainObject(activePage);
  if (safeString(page.id)) return safeString(page.id);

  return (
    normalizePublicPath(getCurrentPathname(pathname)) ||
    "home"
  );
}

/** Map a template/site page id to a public pathname for SPA nav buttons. */
export function resolvePublicPathForPageId(site, renderer, pageId) {
  const nextId = safeString(pageId).trim();
  if (!nextId || nextId === "home" || nextId === "index") return "/";

  const sitePages = Array.isArray(asPlainObject(site).pages)
    ? asPlainObject(site).pages
    : [];
  const rendererPages = Array.isArray(renderer?.pages) ? renderer.pages : [];

  const siteMatch = sitePages.find((page) => {
    const source = asPlainObject(page);
    return (
      safeString(source.id) === nextId ||
      normalizePublicPath(source.slug) === normalizePublicPath(nextId) ||
      normalizePublicPath(source.path) === normalizePublicPath(nextId)
    );
  });

  if (siteMatch) {
    const path = getPagePath(siteMatch);
    return path ? `/${path}` : "/";
  }

  const templateMatch = rendererPages.find(
    (page) => safeString(asPlainObject(page).id) === nextId,
  );

  if (templateMatch) {
    const source = asPlainObject(templateMatch);
    if (source.id === "home" || source.isHome) return "/";
    // Prefer stable ASCII ids (shop/cart/...) so shell hrefs and SPA routing match.
    const idPath = normalizePublicPath(safeString(source.id));
    if (idPath && /^[a-z0-9_-]+$/i.test(idPath)) {
      return `/${idPath}`;
    }
    const path = normalizePublicPath(
      safeString(source.slug) || safeString(source.path) || safeString(source.id),
    );
    return path ? `/${path}` : "/";
  }

  return `/${normalizePublicPath(nextId)}`;
}