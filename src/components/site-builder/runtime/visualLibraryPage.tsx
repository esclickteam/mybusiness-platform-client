import React, { createContext, useContext, useMemo } from "react";

export const VISUAL_LIBRARY_STACK_ID = "__library__";

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

/**
 * Detect Site Pages that are not part of a template's built-in page set
 * (library templates, blank pages, studio uid pages, unknown slugs).
 */
export function isVisualLibraryPage(input: {
  pageId?: string | null;
  data?: Record<string, unknown> | null;
  knownPageIds?: Iterable<string> | null;
}): boolean {
  const rawPageId = String(input.pageId || "").trim();
  const data = input.data || null;

  if (
    data?.__blankVisualPage === true ||
    data?.__libraryPage === true ||
    Boolean(data?.__libraryPageTemplateId)
  ) {
    return true;
  }

  if (!rawPageId || rawPageId === VISUAL_LIBRARY_STACK_ID) return false;

  if (/^page[_-]/i.test(rawPageId)) return true;

  if (input.knownPageIds) {
    const known = new Set(
      Array.from(input.knownPageIds, (id) => String(id || "").trim()).filter(
        Boolean,
      ),
    );
    if (known.size > 0 && !known.has(rawPageId)) return true;
  }

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
