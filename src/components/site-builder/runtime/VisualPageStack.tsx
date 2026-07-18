import React from "react";

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
};

/**
 * Keep-alive page stack for visual-react templates.
 * Inactive pages stay in the DOM (hidden) so editor inserts / media
 * are not wiped on navigation. Same contract as Justora.
 */
export function VisualPageStack({
  activePageId,
  pages,
  includeInsertHost = true,
  className,
}: VisualPageStackProps) {
  return (
    <>
      <div
        data-visual-page-stack="true"
        className={className}
      >
        {pages.map((page) => {
          const visible =
            typeof page.visible === "boolean"
              ? page.visible
              : page.id === activePageId;

          return (
            <div
              key={page.id}
              data-visual-page-panel={page.id}
              hidden={!visible}
              aria-hidden={!visible}
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
