import React from "react";

import {
  resolveVisualLibraryStackPageId,
  useVisualLibraryPage,
  VISUAL_LIBRARY_STACK_ID,
} from "./visualLibraryPage";

export type VisualPagePanel = {
  id: string;
  content: React.ReactNode;
  /**
   * When false, panel stays mounted but hidden.
   * Defaults to comparing id === activePageId.
   */
  visible?: boolean;
};

type VisualPageStackProps = {
  activePageId: string;
  pages: VisualPagePanel[];
  /** When false, skip auto insert-host (template already declares one). */
  includeInsertHost?: boolean;
  className?: string;
  /**
   * Optional visual data — when provided (or via VisualLibraryPageProvider),
   * custom/library Site Pages force `__library__` so template bodies stay hidden.
   */
  data?: Record<string, unknown> | null;
};

/**
 * Keep-alive page stack for visual-react templates.
 * Inactive pages stay in the DOM (hidden) so editor inserts / media
 * are not wiped on navigation. Same contract as Justora.
 *
 * Library / blank / custom Site Pages resolve to `__library__` so no built-in
 * template panel paints — inserted sections mount on the insert host instead.
 */
export function VisualPageStack({
  activePageId,
  pages,
  includeInsertHost = true,
  className,
  data,
}: VisualPageStackProps) {
  const libraryContext = useVisualLibraryPage();
  const knownPageIds = pages.map((page) => page.id);
  const effectiveActivePageId = resolveVisualLibraryStackPageId({
    activePageId,
    rawPageId: libraryContext?.rawPageId || activePageId,
    data: data || libraryContext?.data || null,
    knownPageIds,
  });

  const forceLibrary =
    effectiveActivePageId === VISUAL_LIBRARY_STACK_ID ||
    libraryContext?.isLibraryPage === true;

  return (
    <>
      <div
        data-visual-page-stack="true"
        data-visual-library-stack={forceLibrary ? "true" : undefined}
        className={className}
      >
        {pages.map((page) => {
          const visible =
            typeof page.visible === "boolean"
              ? page.visible
              : !forceLibrary && page.id === effectiveActivePageId;

          return (
            <div
              key={page.id}
              data-visual-page-panel={page.id}
              data-visual-page-visible={visible ? "true" : "false"}
              hidden={!visible}
              aria-hidden={!visible}
              // Explicit display ensures inactive pages never paint in editor
              // thumbnails or keep-alive stacks (some hosts ignore `hidden` alone).
              style={visible ? undefined : { display: "none" }}
            >
              {page.content}
            </div>
          );
        })}
      </div>

      {includeInsertHost ? (
        <div
          data-visual-insert-host="true"
          data-visual-runtime-host="true"
        />
      ) : null}
    </>
  );
}
