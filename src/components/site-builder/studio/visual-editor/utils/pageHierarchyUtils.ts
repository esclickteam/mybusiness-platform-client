export type PageHierarchyItem = {
  id: string;
  title?: string;
  slug?: string;
  isHome?: boolean;
  hiddenFromMenu?: boolean;
  parentPageId?: string;
  menuOrder?: number;
};

export type PageTreeRow = {
  page: PageHierarchyItem;
  depth: number;
};

export type PageTreeMovePlacement = "before" | "after" | "inside";

export type PageLinkTarget = {
  id: string;
  label: string;
  href: string;
  depth: number;
  parentPageId?: string;
  isHome?: boolean;
};

function safeString(value: unknown) {
  return String(value ?? "").trim();
}

function siblingKey(parentPageId?: string) {
  return safeString(parentPageId) || "__root__";
}

function indexById(pages: PageHierarchyItem[]) {
  return new Map(pages.map((page, index) => [page.id, index]));
}

function getChildrenMap(pages: PageHierarchyItem[]) {
  const byParent = new Map<string, PageHierarchyItem[]>();

  pages.forEach((page) => {
    const parentId = safeString(page.parentPageId);
    const parentExists =
      parentId && pages.some((item) => item.id === parentId);
    const key = parentExists ? parentId : "__root__";

    const list = byParent.get(key) || [];
    list.push(page);
    byParent.set(key, list);
  });

  byParent.forEach((list, key) => {
    list.sort((a, b) => {
      const orderA =
        typeof a.menuOrder === "number"
          ? a.menuOrder
          : indexById(pages).get(a.id) ?? 0;
      const orderB =
        typeof b.menuOrder === "number"
          ? b.menuOrder
          : indexById(pages).get(b.id) ?? 0;
      if (orderA !== orderB) return orderA - orderB;

      return String(a.title || "").localeCompare(String(b.title || ""), "he");
    });
    byParent.set(key, list);
  });

  return byParent;
}

export function wouldCreatePageCycle(
  pages: PageHierarchyItem[],
  pageId: string,
  newParentId: string,
) {
  const cleanPageId = safeString(pageId);
  const cleanParentId = safeString(newParentId);
  if (!cleanPageId || !cleanParentId) return false;
  if (cleanPageId === cleanParentId) return true;

  const byId = new Map(pages.map((page) => [page.id, page]));
  let cursor = cleanParentId;
  const guard = new Set<string>();

  while (cursor && !guard.has(cursor)) {
    if (cursor === cleanPageId) return true;
    guard.add(cursor);
    cursor = safeString(byId.get(cursor)?.parentPageId);
  }

  return false;
}

export function normalizePageMenuOrders(
  pages: PageHierarchyItem[],
): PageHierarchyItem[] {
  const byParent = getChildrenMap(pages);
  const nextById = new Map<string, PageHierarchyItem>();

  pages.forEach((page) => {
    nextById.set(page.id, { ...page });
  });

  byParent.forEach((siblings) => {
    siblings.forEach((page, index) => {
      const current = nextById.get(page.id);
      if (!current) return;
      nextById.set(page.id, {
        ...current,
        menuOrder:
          typeof current.menuOrder === "number" ? current.menuOrder : index,
      });
    });
  });

  return pages.map((page) => nextById.get(page.id) || page);
}

export function buildPageTreeRows(
  pages: PageHierarchyItem[] | null | undefined,
): PageTreeRow[] {
  const list = Array.isArray(pages) ? pages : [];
  if (!list.length) return [];

  const normalized = normalizePageMenuOrders(list);
  const byParent = getChildrenMap(normalized);
  const rows: PageTreeRow[] = [];

  const walk = (page: PageHierarchyItem, depth: number) => {
    rows.push({ page, depth });
    const children = byParent.get(page.id) || [];
    children.forEach((child) => walk(child, depth + 1));
  };

  const roots = byParent.get("__root__") || [];
  roots.forEach((page) => walk(page, 0));
  return rows;
}

export function flattenPagesInTreeOrder(
  pages: PageHierarchyItem[],
): PageHierarchyItem[] {
  return buildPageTreeRows(pages).map((row) => row.page);
}

function getSiblings(
  pages: PageHierarchyItem[],
  parentPageId?: string,
) {
  const parentId = safeString(parentPageId);
  return pages.filter((page) => {
    const pageParent = safeString(page.parentPageId);
    if (!parentId) return !pageParent || !pages.some((item) => item.id === pageParent);
    return pageParent === parentId;
  });
}

function reindexSiblings(
  pages: PageHierarchyItem[],
  parentPageId?: string,
) {
  const parentId = safeString(parentPageId);
  const siblings = getSiblings(pages, parentId || undefined).sort((a, b) => {
    const orderA = typeof a.menuOrder === "number" ? a.menuOrder : 0;
    const orderB = typeof b.menuOrder === "number" ? b.menuOrder : 0;
    return orderA - orderB;
  });

  const orderById = new Map<string, number>();
  siblings.forEach((page, index) => {
    orderById.set(page.id, index);
  });

  return pages.map((page) => {
    const pageParent = safeString(page.parentPageId);
    const sameGroup = parentId
      ? pageParent === parentId
      : !pageParent || !pages.some((item) => item.id === pageParent);

    if (!sameGroup) return page;

    const nextOrder = orderById.get(page.id);
    if (typeof nextOrder !== "number") return page;

    return {
      ...page,
      menuOrder: nextOrder,
    };
  });
}

export function applyPageTreeMove(
  pages: PageHierarchyItem[],
  moveId: string,
  targetId: string,
  placement: PageTreeMovePlacement,
): PageHierarchyItem[] | null {
  const moved = applyPageTreeMoveInternal(pages, moveId, targetId, placement);
  if (moved) return moved;

  if (placement === "inside") return null;

  const alternate: PageTreeMovePlacement =
    placement === "before" ? "after" : "before";
  return applyPageTreeMoveInternal(pages, moveId, targetId, alternate);
}

function effectiveParentId(
  pages: PageHierarchyItem[],
  page: PageHierarchyItem | undefined,
) {
  const parentId = safeString(page?.parentPageId);
  if (!parentId) return undefined;
  return pages.some((item) => item.id === parentId) ? parentId : undefined;
}

export function commitPageOrderFromDrag(
  pages: PageHierarchyItem[],
  orderedIds: string[],
  moveId: string,
  targetId: string,
  placement: PageTreeMovePlacement,
): PageHierarchyItem[] | null {
  const cleanMoveId = safeString(moveId);
  const cleanTargetId = safeString(targetId);
  if (!cleanMoveId || !cleanTargetId || cleanMoveId === cleanTargetId) {
    return null;
  }

  const movingPage = pages.find((page) => page.id === cleanMoveId);
  const targetPage = pages.find((page) => page.id === cleanTargetId);
  if (!movingPage || !targetPage || movingPage.isHome) return null;

  let newParentId = effectiveParentId(pages, movingPage);

  if (placement === "inside") {
    if (wouldCreatePageCycle(pages, cleanMoveId, cleanTargetId)) return null;
    newParentId = cleanTargetId;
  } else {
    newParentId = effectiveParentId(pages, targetPage);
    if (
      newParentId &&
      wouldCreatePageCycle(pages, cleanMoveId, newParentId)
    ) {
      return null;
    }
  }

  let nextPages = pages.map((page) =>
    page.id === cleanMoveId
      ? {
          ...page,
          parentPageId: newParentId,
        }
      : page,
  );

  const siblingIds = orderedIds.filter((id) => {
    const page = nextPages.find((item) => item.id === id);
    if (!page) return false;
    if (page.isHome) return !newParentId;
    return effectiveParentId(nextPages, page) === newParentId;
  });

  if (!siblingIds.includes(cleanMoveId)) {
    return applyPageTreeMove(pages, cleanMoveId, cleanTargetId, placement);
  }

  if (!newParentId) {
    const homeId = nextPages.find((page) => page.isHome)?.id;
    if (homeId) {
      const withoutHome = siblingIds.filter((id) => id !== homeId);
      siblingIds.splice(0, siblingIds.length, homeId, ...withoutHome);
    }
  }

  nextPages = nextPages.map((page) => {
    const siblingIndex = siblingIds.indexOf(page.id);
    if (siblingIndex < 0) return page;
    if (effectiveParentId(nextPages, page) !== newParentId) return page;

    return {
      ...page,
      parentPageId: newParentId,
      menuOrder: siblingIndex,
    };
  });

  return reindexSiblings(nextPages, newParentId);
}

function applyPageTreeMoveInternal(
  pages: PageHierarchyItem[],
  moveId: string,
  targetId: string,
  placement: PageTreeMovePlacement,
): PageHierarchyItem[] | null {
  const cleanMoveId = safeString(moveId);
  const cleanTargetId = safeString(targetId);
  if (!cleanMoveId || !cleanTargetId || cleanMoveId === cleanTargetId) {
    return null;
  }

  const movingPage = pages.find((page) => page.id === cleanMoveId);
  const targetPage = pages.find((page) => page.id === cleanTargetId);
  if (!movingPage || !targetPage) return null;
  if (movingPage.isHome) return null;

  let nextParentId = safeString(movingPage.parentPageId) || undefined;

  if (placement === "inside") {
    if (wouldCreatePageCycle(pages, cleanMoveId, cleanTargetId)) return null;
    nextParentId = cleanTargetId;
  } else {
    nextParentId = safeString(targetPage.parentPageId) || undefined;
    if (
      nextParentId &&
      wouldCreatePageCycle(pages, cleanMoveId, nextParentId)
    ) {
      return null;
    }
  }

  let nextPages = pages.map((page) => {
    if (page.id !== cleanMoveId) return page;

    return {
      ...page,
      parentPageId: nextParentId,
    };
  });

  const siblings = getSiblings(nextPages, nextParentId).filter(
    (page) => page.id !== cleanMoveId,
  );

  let insertIndex = siblings.length;
  if (placement !== "inside") {
    const targetIndex = siblings.findIndex((page) => page.id === cleanTargetId);
    if (targetIndex >= 0) {
      insertIndex = placement === "before" ? targetIndex : targetIndex + 1;
    }
  }

  const orderedSiblingIds = siblings.map((page) => page.id);
  orderedSiblingIds.splice(insertIndex, 0, cleanMoveId);

  nextPages = nextPages.map((page) => {
    const siblingIndex = orderedSiblingIds.indexOf(page.id);
    if (siblingIndex < 0) return page;

    const pageParent = safeString(page.parentPageId);
    const parentMatches = nextParentId
      ? pageParent === nextParentId
      : !pageParent || !nextPages.some((item) => item.id === pageParent);

    if (!parentMatches) return page;

    return {
      ...page,
      menuOrder: siblingIndex,
    };
  });

  return reindexSiblings(nextPages, nextParentId);
}

export function buildHierarchicalLinkTargets(
  pages: PageHierarchyItem[],
  hrefForPage?: (page: PageHierarchyItem) => string,
): PageLinkTarget[] {
  const resolveHref =
    hrefForPage ||
    ((page: PageHierarchyItem) => {
      const id = safeString(page.id);
      const isHome = Boolean(page.isHome) || id === "home";
      if (isHome) return "/";
      const slug = safeString(page.slug || id)
        .replace(/^\/+|\/+$/g, "");
      return slug ? `/${slug}` : "/";
    });

  return buildPageTreeRows(pages).map(({ page, depth }) => ({
    id: page.id,
    label: String(page.title || page.id || "עמוד").trim(),
    href: resolveHref(page),
    depth,
    parentPageId: safeString(page.parentPageId) || undefined,
    isHome: Boolean(page.isHome),
  }));
}

export function resolveLinkTargetFromHref(
  pages: PageHierarchyItem[],
  href: string,
  sitePageId?: string,
) {
  const cleanHref = safeString(href);
  const cleanSitePageId = safeString(sitePageId);

  if (cleanSitePageId) {
    const byId = pages.find((page) => page.id === cleanSitePageId);
    if (byId) return byId.id;
  }

  const normalizedHref =
    cleanHref === "/" || cleanHref === ""
      ? "/"
      : cleanHref.replace(/\/+$/, "") || "/";

  const matched = pages.find((page) => {
    const isHome = Boolean(page.isHome) || page.id === "home";
    const pageHref = isHome
      ? "/"
      : `/${safeString(page.slug || page.id).replace(/^\/+|\/+$/g, "")}`;
    return pageHref === normalizedHref;
  });

  return matched?.id || "";
}
