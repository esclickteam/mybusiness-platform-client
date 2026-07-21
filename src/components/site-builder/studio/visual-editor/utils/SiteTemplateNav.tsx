import React from "react";

import {
  resolveNavLabelFromSitePages,
  type SitePageNavSource,
  type TemplateNavItem,
} from "./syncNavWithSitePages";

type SiteTemplateNavProps = {
  items: TemplateNavItem[] | null | undefined;
  sitePages?: SitePageNavSource[] | null;
  previousTitleById?: Record<string, string>;
  currentPage?: string;
  onNavigate?: (pageId: string) => void;
  className?: string;
  itemClassName?: string | ((item: TemplateNavItem, active: boolean) => string);
  getItemKey?: (item: TemplateNavItem, index: number) => string;
  getPageId?: (item: TemplateNavItem) => string;
  renderItem?: (args: {
    item: TemplateNavItem;
    index: number;
    label: string;
    pageId: string;
    active: boolean;
    hasSubpages: boolean;
  }) => React.ReactNode;
  visualEditIdPrefix?: string;
  as?: "button" | "a";
  getHref?: (item: TemplateNavItem, pageId: string) => string;
};

function defaultPageId(item: TemplateNavItem) {
  return String(
    item.page || item.pageId || item.id || item.__sitePageId || "",
  ).trim();
}

/**
 * Shared header nav that renders Site Menu sub-pages as a dropdown.
 * Templates can keep custom markup via `renderItem`, or use defaults.
 */
export function SiteTemplateNav({
  items,
  sitePages,
  previousTitleById,
  currentPage,
  onNavigate,
  className,
  itemClassName,
  getItemKey,
  getPageId = defaultPageId,
  renderItem,
  visualEditIdPrefix = "global.header.nav",
  as = "button",
  getHref,
}: SiteTemplateNavProps) {
  const list = Array.isArray(items) ? items : [];

  return (
    <nav className={className} aria-label="ניווט ראשי">
      {list.map((item, index) => {
        const pageId = getPageId(item) || "home";
        const active = Boolean(currentPage && currentPage === pageId);
        const label = resolveNavLabelFromSitePages(item, sitePages, {
          previousTitleById,
        });
        const subpages = Array.isArray(item.subpages) ? item.subpages : [];
        const hasSubpages = subpages.length > 0;
        const key = getItemKey?.(item, index) || `${pageId}-${index}`;
        const classNameValue =
          typeof itemClassName === "function"
            ? itemClassName(item, active)
            : itemClassName || "";

        if (renderItem) {
          return (
            <React.Fragment key={key}>
              {renderItem({
                item,
                index,
                label,
                pageId,
                active,
                hasSubpages,
              })}
            </React.Fragment>
          );
        }

        const href = getHref?.(item, pageId) || String(item.href || "").trim();

        const trigger =
          as === "a" ? (
            <a
              href={href || `#${pageId}`}
              className={classNameValue}
              aria-current={active ? "page" : undefined}
              aria-haspopup={hasSubpages ? "true" : undefined}
              onClick={(event) => {
                if (!onNavigate) return;
                event.preventDefault();
                onNavigate(pageId);
              }}
              data-editable="link"
              data-visual-edit-id={`${visualEditIdPrefix}.${index}`}
              data-site-page-id={String(item.__sitePageId || "")}
            >
              {label}
            </a>
          ) : (
            <button
              type="button"
              className={classNameValue}
              aria-current={active ? "page" : undefined}
              aria-haspopup={hasSubpages ? "true" : undefined}
              onClick={() => onNavigate?.(pageId)}
              data-editable="link"
              data-visual-edit-id={`${visualEditIdPrefix}.${index}`}
              data-site-page-id={String(item.__sitePageId || "")}
            >
              {label}
            </button>
          );

        if (!hasSubpages) {
          return <React.Fragment key={key}>{trigger}</React.Fragment>;
        }

        return (
          <div
            key={key}
            data-bizuply-nav-item="true"
            className="bizuply-nav-item-with-subpages"
          >
            {trigger}
            <div data-bizuply-nav-submenu="true" role="menu">
              {subpages.map((child, childIndex) => {
                const childPageId = getPageId(child) || `child-${childIndex}`;
                const childLabel = resolveNavLabelFromSitePages(
                  child,
                  sitePages,
                  { previousTitleById },
                );
                const childHref =
                  getHref?.(child, childPageId) ||
                  String(child.href || "").trim() ||
                  `/${childPageId}`;
                const childActive = Boolean(
                  currentPage && currentPage === childPageId,
                );

                return as === "a" || !onNavigate ? (
                  <a
                    key={`${childPageId}-${childIndex}`}
                    href={childHref}
                    role="menuitem"
                    aria-current={childActive ? "page" : undefined}
                    data-site-page-id={String(child.__sitePageId || "")}
                  >
                    {childLabel}
                  </a>
                ) : (
                  <button
                    key={`${childPageId}-${childIndex}`}
                    type="button"
                    role="menuitem"
                    aria-current={childActive ? "page" : undefined}
                    onClick={() => onNavigate(childPageId)}
                    data-site-page-id={String(child.__sitePageId || "")}
                  >
                    {childLabel}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
