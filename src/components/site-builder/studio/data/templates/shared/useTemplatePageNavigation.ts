import { useCallback, useEffect, useState } from "react";

export type TemplatePageNavProps = {
  page?: string | null;
  initialPage?: string | null;
  initialPageId?: string | null;
  activePageId?: string | null;
  currentPageId?: string | null;
  pageId?: string | null;
  onPageChange?: (pageId: string) => void;
  isPublic?: boolean;
  viewMode?: string | null;
  runtimeMode?: string | null;
};

function cleanPageId(value: unknown) {
  return String(value || "").trim();
}

/** Pick the studio/public controlled page id from the common prop aliases. */
export function resolveTemplatePageId(
  props: TemplatePageNavProps,
  allowedPages?: string[],
  fallback = "home",
) {
  const candidates = [
    props.activePageId,
    props.currentPageId,
    props.pageId,
    props.page,
    props.initialPageId,
    props.initialPage,
  ];

  for (const candidate of candidates) {
    const id = cleanPageId(candidate);
    if (!id) continue;
    if (!allowedPages?.length) return id;
    if (allowedPages.includes(id)) return id;
  }

  return fallback;
}

export function isPublicTemplateRuntime(props: TemplatePageNavProps) {
  if (props.isPublic) return true;
  const viewMode = cleanPageId(props.viewMode).toLowerCase();
  const runtimeMode = cleanPageId(props.runtimeMode).toLowerCase();
  return viewMode === "public" || runtimeMode === "public";
}

/**
 * Keeps template SPA page state in sync with the visual editor Site Pages panel
 * (activePageId) and notifies the studio when nav links change the page.
 */
export function useTemplatePageNavigation(
  props: TemplatePageNavProps,
  options?: {
    allowedPages?: string[];
    fallbackPage?: string;
    scrollOnNavigate?: boolean;
  },
) {
  const allowedPages = options?.allowedPages;
  const fallbackPage = options?.fallbackPage || "home";
  const scrollOnNavigate = options?.scrollOnNavigate !== false;

  const resolvedPage = resolveTemplatePageId(
    props,
    allowedPages,
    fallbackPage,
  );
  const [currentPage, setCurrentPage] = useState(resolvedPage);

  useEffect(() => {
    setCurrentPage((current) =>
      current === resolvedPage ? current : resolvedPage,
    );
  }, [resolvedPage]);

  const goTo = useCallback(
    (nextPage: string) => {
      const requested = cleanPageId(nextPage) || fallbackPage;
      const safe =
        !allowedPages?.length || allowedPages.includes(requested)
          ? requested
          : fallbackPage;

      setCurrentPage(safe);
      props.onPageChange?.(safe);

      if (scrollOnNavigate && typeof window !== "undefined") {
        window.requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      }
    },
    [allowedPages, fallbackPage, props.onPageChange, scrollOnNavigate],
  );

  return {
    currentPage,
    setCurrentPage,
    goTo,
    resolvedPage,
    isPublicRuntime: isPublicTemplateRuntime(props),
  };
}
