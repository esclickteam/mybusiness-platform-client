import React, { createContext, useContext, useMemo } from "react";

export const VISUAL_LIBRARY_STACK_ID = "__library__";

/** Built-in template page ids — never treat these as library/blank canvas mode. */
const COMMON_TEMPLATE_PAGE_IDS = new Set([
  "home",
  "index",
  "about",
  "services",
  "service",
  "projects",
  "project",
  "contact",
  "pricing",
  "gallery",
  "blog",
  "shop",
  "store",
  "team",
  "faq",
  "testimonials",
  "journal",
  "collection",
  "cart",
  "product",
  "products",
  "practice",
  "cases",
  "work",
  "process",
]);

export type VisualLibraryPageState = {
  /** Raw site page id from studio/public (may be page_* or custom slug). */
  rawPageId: string;
  /** True when this is a library/blank/custom Site Page, not a template built-in. */
  isLibraryPage: boolean;
  /** Visual data flags used for detection / DOM apply. */
  data: Record<string, unknown> | null;
};

const VisualLibraryPageContext = createContext<VisualLibraryPageState | null>(
  null,
);

export function asVisualDataRecord(
  value: unknown,
): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

export function isCommonTemplatePageId(pageId?: string | null) {
  const id = String(pageId || "")
    .trim()
    .toLowerCase();
  if (!id) return false;
  return COMMON_TEMPLATE_PAGE_IDS.has(id);
}

export function isStudioGeneratedPageId(pageId?: string | null) {
  return /^page[_-]/i.test(String(pageId || "").trim());
}

/**
 * Detect Site Pages that are not part of a template's built-in page set
 * (library templates, blank pages, studio uid pages, unknown slugs).
 *
 * Important: data flags like `__libraryPage` alone must NOT blank a built-in
 * template page (home/about/…). After save, contaminated flags on home were
 * emptying the Spalcio canvas to header+footer only.
 */
export function isVisualLibraryPage(input: {
  pageId?: string | null;
  data?: Record<string, unknown> | null;
  knownPageIds?: Iterable<string> | null;
}): boolean {
  const rawPageId = String(input.pageId || "").trim();
  const data = input.data || null;

  if (!rawPageId || rawPageId === VISUAL_LIBRARY_STACK_ID) return false;

  if (isStudioGeneratedPageId(rawPageId)) return true;

  const known = input.knownPageIds
    ? new Set(
        Array.from(input.knownPageIds, (id) => String(id || "").trim()).filter(
          Boolean,
        ),
      )
    : null;

  if (known?.has(rawPageId) || isCommonTemplatePageId(rawPageId)) {
    return false;
  }

  if (
    data?.__blankVisualPage === true ||
    data?.__libraryPage === true ||
    Boolean(data?.__libraryPageTemplateId)
  ) {
    return true;
  }

  if (known && known.size > 0 && !known.has(rawPageId)) return true;

  return false;
}

export function resolveVisualLibraryStackPageId(input: {
  activePageId?: string | null;
  data?: Record<string, unknown> | null;
  knownPageIds?: Iterable<string> | null;
  rawPageId?: string | null;
}): string {
  const activePageId = String(input.activePageId || "").trim();
  const rawPageId = String(input.rawPageId || input.activePageId || "").trim();

  if (
    isVisualLibraryPage({
      pageId: rawPageId,
      data: input.data,
      knownPageIds: input.knownPageIds,
    })
  ) {
    return VISUAL_LIBRARY_STACK_ID;
  }

  return activePageId || "home";
}

/**
 * DOM blank-mode gate: never hide template bodies for built-in pages even if
 * visual data still carries leftover library flags after save/page switch.
 */
export function shouldApplyLibraryBlankMode(
  data: Record<string, any> | null | undefined,
  root?: HTMLElement | null,
) {
  const source = data && typeof data === "object" ? data : {};
  const pageId = String(
    source.__activePageId ||
      root?.getAttribute?.("data-visual-page-id") ||
      root?.getAttribute?.("data-active-page-id") ||
      root?.getAttribute?.("data-template-page-id") ||
      "",
  ).trim();

  if (isStudioGeneratedPageId(pageId)) return true;

  if (isCommonTemplatePageId(pageId)) return false;

  return (
    source.__blankVisualPage === true ||
    source.__libraryPage === true ||
    Boolean(source.__libraryPageTemplateId)
  );
}

export function VisualLibraryPageProvider({
  pageId,
  data,
  knownPageIds,
  children,
}: {
  pageId?: string | null;
  data?: unknown;
  knownPageIds?: Iterable<string> | null;
  children: React.ReactNode;
}) {
  const value = useMemo<VisualLibraryPageState>(() => {
    const rawPageId = String(pageId || "").trim();
    const visualData = asVisualDataRecord(data);
    return {
      rawPageId,
      data: visualData,
      isLibraryPage: isVisualLibraryPage({
        pageId: rawPageId,
        data: visualData,
        knownPageIds,
      }),
    };
  }, [pageId, data, knownPageIds]);

  return (
    <VisualLibraryPageContext.Provider value={value}>
      {children}
    </VisualLibraryPageContext.Provider>
  );
}

export function useVisualLibraryPage() {
  return useContext(VisualLibraryPageContext);
}
