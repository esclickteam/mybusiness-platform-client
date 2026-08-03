import React from "react";

import { SiteTemplateNav } from "../../../visual-editor/utils/SiteTemplateNav";
import type { SitePageNavSource, TemplateNavItem } from "../../../visual-editor/utils/syncNavWithSitePages";

type BeautyHeaderNavProps = {
  data?: Record<string, any> | null;
  currentPage?: string;
  goTo?: (pageId: string) => void;
  className?: string;
  itemClassName?: string | ((item: TemplateNavItem, active: boolean) => string);
};

const DEFAULT_NAV: Array<{
  page: string;
  navKey: string;
  fallback: string;
}> = [
  { page: "home", navKey: "navHome", fallback: "בית" },
  { page: "about", navKey: "navAbout", fallback: "אודות" },
  { page: "services", navKey: "navServices", fallback: "שירותים" },
  { page: "booking", navKey: "navBooking", fallback: "תורים" },
];

/**
 * Global header menu for beauty templates.
 * Labels follow Site Menu page titles, with stable visual-edit ids so renames
 * persist across every page (Wix-like shared chrome).
 */
export function BeautyHeaderNav({
  data,
  currentPage,
  goTo,
  className,
  itemClassName,
}: BeautyHeaderNavProps) {
  const sitePages = (Array.isArray(data?.__sitePages)
    ? data?.__sitePages
    : []) as SitePageNavSource[];
  const previousTitleById =
    data?.__previousSitePageTitles &&
    typeof data.__previousSitePageTitles === "object"
      ? (data.__previousSitePageTitles as Record<string, string>)
      : {};

  const items: TemplateNavItem[] = DEFAULT_NAV.map((entry) => ({
    page: entry.page,
    __sitePageId: entry.page,
    label: String(data?.[entry.navKey] || entry.fallback),
  }));

  return (
    <SiteTemplateNav
      items={items}
      sitePages={sitePages}
      previousTitleById={previousTitleById}
      currentPage={currentPage}
      onNavigate={goTo}
      className={className}
      itemClassName={itemClassName}
      visualEditIdPrefix="global.header.nav"
    />
  );
}