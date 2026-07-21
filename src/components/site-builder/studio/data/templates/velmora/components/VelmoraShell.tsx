import React from "react";
import { Menu, ShoppingBag } from "lucide-react";

import type { VelmoraPageId } from "../pages";

type VelmoraNavItem = {
  id?: VelmoraPageId;
  pageId?: VelmoraPageId;
  label: string;
};

type VelmoraShellData = {
  header?: {
    logoTitle?: string;
    logoSubtitle?: string;
    cartLabel?: string;
    leftNav?: VelmoraNavItem[];
    rightNav?: VelmoraNavItem[];
  };
  footer?: {
    logoTitle?: string;
    logoSubtitle?: string;
    text?: string;
    serviceTitle?: string;
    infoTitle?: string;
    quickNavTitle?: string;
    copyright?: string;
  };
};

type Props = {
  activePage: VelmoraPageId;
  onPageChange: (page: VelmoraPageId) => void;
  children: React.ReactNode;
  cartCount?: number;
  templateData?: VelmoraShellData;
  data?: VelmoraShellData;
  studioData?: VelmoraShellData;
  isVisualEditor?: boolean;
};

const defaultLeftNavItems: VelmoraNavItem[] = [
  { id: "about", label: "אודות" },
  { id: "shop", label: "חנות" },
  { id: "projects", label: "קולקציות" },
];

const defaultRightNavItems: VelmoraNavItem[] = [
  { id: "custom", label: "סטיילינג" },
  { id: "contact", label: "צור קשר" },
];

const footerNavItems: Array<{ id: VelmoraPageId; label: string }> = [
  { id: "home", label: "בית" },
  { id: "about", label: "אודות" },
  { id: "shop", label: "חנות" },
  { id: "projects", label: "קולקציות" },
  { id: "custom", label: "סטיילינג" },
  { id: "contact", label: "צור קשר" },
];

const footerInfoItems: Array<{ id: VelmoraPageId; label: string }> = [
  { id: "terms", label: "תקנון אתר" },
  { id: "privacy", label: "מדיניות פרטיות" },
  { id: "accessibility", label: "נגישות" },
];

const footerServiceItems: Array<{ id: VelmoraPageId; label: string }> = [
  { id: "faq", label: "שאלות נפוצות" },
  { id: "shipping", label: "משלוחים והחזרות" },
  { id: "orders", label: "שירות והזמנות" },
];

function getMergedTemplateData({
  templateData,
  data,
  studioData,
}: {
  templateData?: VelmoraShellData;
  data?: VelmoraShellData;
  studioData?: VelmoraShellData;
}): VelmoraShellData {
  return {
    ...(studioData || {}),
    ...(data || {}),
    ...(templateData || {}),
    header: {
      ...(studioData?.header || {}),
      ...(data?.header || {}),
      ...(templateData?.header || {}),
    },
    footer: {
      ...(studioData?.footer || {}),
      ...(data?.footer || {}),
      ...(templateData?.footer || {}),
    },
  };
}

function normalizeNavItem(item: VelmoraNavItem): {
  id: VelmoraPageId;
  label: string;
} {
  return {
    id: (item.pageId || item.id || "home") as VelmoraPageId,
    label: String(item.label || ""),
  };
}


function getVelmoraPageHref(pageId: VelmoraPageId) {
  if (pageId === "home") return "/";

  return `/${pageId}`;
}

function handleVelmoraNavClick(
  event: React.MouseEvent<HTMLAnchorElement>,
  pageId: VelmoraPageId,
  onPageChange: (page: VelmoraPageId) => void,
) {
  event.preventDefault();
  event.stopPropagation();
  onPageChange(pageId);
}

function NavButton({
  id,
  label,
  activePage,
  onPageChange,
}: {
  id: VelmoraPageId;
  label: string;
  activePage: VelmoraPageId;
  onPageChange: (page: VelmoraPageId) => void;
}) {
  const active = activePage === id;

  return (
    <a
      href={getVelmoraPageHref(id)}
      data-velmora-page-link="true"
      data-page-id={id}
      data-visual-link-href={getVelmoraPageHref(id)}
      data-link-url={getVelmoraPageHref(id)}
      onClick={(event) => handleVelmoraNavClick(event, id, onPageChange)}
      className={[
        "relative text-[13px] font-medium transition duration-300 hover:text-black",
        active ? "text-black" : "text-black/55",
      ].join(" ")}
    >
      {label}

      <span
        className={[
          "absolute -bottom-2 right-0 h-px bg-black transition-all duration-300",
          active ? "w-full" : "w-0",
        ].join(" ")}
      />
    </a>
  );
}

export default function VelmoraShell({
  activePage,
  onPageChange,
  children,
  cartCount = 0,
  templateData,
  data,
  studioData,
  isVisualEditor = false,
}: Props) {
  const mergedData = getMergedTemplateData({
    templateData,
    data,
    studioData,
  });

  const header = mergedData.header || {};
  const footer = mergedData.footer || {};

  const logoTitle = header.logoTitle || "ATELIER NOA";
  const logoSubtitle = header.logoSubtitle || "בוטיק";
  const cartLabel = header.cartLabel || "סל קניות";

  const leftNavItems = Array.isArray(header.leftNav) && header.leftNav.length
    ? header.leftNav.map(normalizeNavItem)
    : defaultLeftNavItems.map(normalizeNavItem);

  const rightNavItems =
    Array.isArray(header.rightNav) && header.rightNav.length
      ? header.rightNav.map(normalizeNavItem)
      : defaultRightNavItems.map(normalizeNavItem);

  const footerLogoTitle = footer.logoTitle || logoTitle;
  const footerLogoSubtitle = footer.logoSubtitle || logoSubtitle;
  const footerText =
    footer.text ||
    "אופנה מדויקת, סגנון אישי וחוויית רכישה נקייה שמתאימה לכל לקוח ולקוחה.";

  const copyright =
    footer.copyright || `© 2026 ${footerLogoTitle}. כל הזכויות שמורות.`;

  return (
    <div
      dir="rtl"
      data-studio-page="true"
      data-bizuply-site="true"
      data-template-id="velmora"
      data-visual-editor={isVisualEditor ? "true" : "false"}
      className="min-h-screen bg-[#f6f2ea] text-[#27231f] [font-family:Inter,Arial,sans-serif]"
    >
      {/* FLOATING HEADER */}
      <header data-visual-flow-lock="true" data-template-section-type="header" data-section-kind="header"
        data-section-kind="header"
        data-section-title="Header"
        data-template-section-id="header"
        data-bizuply-editor-section="true"
        className="sticky top-4 z-50 mx-auto mt-4 w-[min(1120px,calc(100%-32px))] rounded-[10px] border border-black/10 bg-white/88 shadow-[0_18px_55px_rgba(0,0,0,0.12)] backdrop-blur-xl"
      >
        <div className="grid h-[58px] grid-cols-[1fr_auto_1fr] items-center px-5">
          <nav className="hidden items-center justify-start gap-9 lg:flex">
            {leftNavItems.map((item) => (
              <NavButton
                key={`${item.id}-${item.label}`}
                id={item.id}
                label={item.label}
                activePage={activePage}
                onPageChange={onPageChange}
              />
            ))}
          </nav>

          <a
            href={getVelmoraPageHref("home")}
            data-velmora-page-link="true"
            data-page-id="home"
            data-visual-link-href={getVelmoraPageHref("home")}
            data-link-url={getVelmoraPageHref("home")}
            onClick={(event) => handleVelmoraNavClick(event, "home", onPageChange)}
            className="text-center transition duration-300 active:scale-95"
            aria-label="חזרה לדף הבית"
          >
            <p className="[font-family:Georgia,serif] text-[25px] font-normal uppercase leading-none tracking-[0.08em] text-[#27231f]">
              {logoTitle}
            </p>

            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/50">
              {logoSubtitle}
            </p>
          </a>

          <nav className="hidden items-center justify-end gap-9 lg:flex">
            {rightNavItems.map((item) => (
              <NavButton
                key={`${item.id}-${item.label}`}
                id={item.id}
                label={item.label}
                activePage={activePage}
                onPageChange={onPageChange}
              />
            ))}

            <a
              href={getVelmoraPageHref("cart")}
              data-velmora-page-link="true"
              data-page-id="cart"
              data-visual-link-href={getVelmoraPageHref("cart")}
              data-link-url={getVelmoraPageHref("cart")}
              onClick={(event) => handleVelmoraNavClick(event, "cart", onPageChange)}
              className={[
                "relative flex h-11 items-center gap-2 rounded-[5px] px-5 text-[13px] font-black text-[#292318] transition duration-300 hover:-translate-y-0.5 hover:bg-[#b98f58] active:scale-95",
                activePage === "cart" ? "bg-[#b98f58]" : "bg-[#caa36d]",
              ].join(" ")}
            >
              {cartLabel}
              <ShoppingBag className="h-4 w-4" />

              {cartCount > 0 && (
                <span className="absolute -left-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b68a55] px-1.5 text-[11px] font-black leading-none text-white shadow-lg">
                  {cartCount}
                </span>
              )}
            </a>
          </nav>

          <div className="flex justify-start lg:hidden">
            <a
              href={getVelmoraPageHref("cart")}
              data-velmora-page-link="true"
              data-page-id="cart"
              data-visual-link-href={getVelmoraPageHref("cart")}
              data-link-url={getVelmoraPageHref("cart")}
              onClick={(event) => handleVelmoraNavClick(event, "cart", onPageChange)}
              className="relative flex h-10 w-10 items-center justify-center rounded-md border border-[#caa36d]/40 bg-[#caa36d] text-[#292318]"
              aria-label="פתיחת סל קניות"
            >
              <ShoppingBag className="h-5 w-5" />

              {cartCount > 0 && (
                <span className="absolute -left-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b68a55] px-1.5 text-[11px] font-black leading-none text-white">
                  {cartCount}
                </span>
              )}
            </a>

            <button
              type="button"
              className="mr-2 flex h-10 w-10 items-center justify-center rounded-md border border-black/10 bg-white"
              aria-label="פתיחת תפריט"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {children}

      {/* FOOTER */}
      <footer
        data-section-kind="footer"
        data-section-title="Footer"
        data-template-section-id="footer"
        data-bizuply-editor-section="true"
        className="border-t border-black/10 bg-[#e8dfcf]"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[1.1fr_1fr_1fr_1fr]">
          <div>
            <a
              href={getVelmoraPageHref("home")}
              data-velmora-page-link="true"
              data-page-id="home"
              data-visual-link-href={getVelmoraPageHref("home")}
              data-link-url={getVelmoraPageHref("home")}
              onClick={(event) => handleVelmoraNavClick(event, "home", onPageChange)}
              className="block text-right transition active:scale-[0.98]"
            >
              <p className="[font-family:Georgia,serif] text-3xl uppercase tracking-[0.08em]">
                {footerLogoTitle}
              </p>

              <p className="mt-1 text-xs font-black uppercase tracking-[0.28em] text-black/40">
                {footerLogoSubtitle}
              </p>
            </a>

            <p className="mt-3 max-w-sm text-sm leading-7 text-black/55">
              {footerText}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold">
              {footer.serviceTitle || "שירות לקוחות"}
            </h3>

            <div className="mt-4 grid gap-2 text-sm text-black/60">
              {footerServiceItems.map((item) => (
                <a
                  key={item.id}
                  href={getVelmoraPageHref(item.id)}
                  data-velmora-page-link="true"
                  data-page-id={item.id}
                  data-visual-link-href={getVelmoraPageHref(item.id)}
                  data-link-url={getVelmoraPageHref(item.id)}
                  onClick={(event) => handleVelmoraNavClick(event, item.id, onPageChange)}
                  className="text-right hover:text-black"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold">
              {footer.infoTitle || "מידע"}
            </h3>

            <div className="mt-4 grid gap-2 text-sm text-black/60">
              {footerInfoItems.map((item) => (
                <a
                  key={item.id}
                  href={getVelmoraPageHref(item.id)}
                  data-velmora-page-link="true"
                  data-page-id={item.id}
                  data-visual-link-href={getVelmoraPageHref(item.id)}
                  data-link-url={getVelmoraPageHref(item.id)}
                  onClick={(event) => handleVelmoraNavClick(event, item.id, onPageChange)}
                  className="text-right hover:text-black"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold">
              {footer.quickNavTitle || "ניווט מהיר"}
            </h3>

            <div className="mt-4 grid gap-2 text-sm text-black/60">
              {footerNavItems.map((item) => (
                <a
                  key={item.id}
                  href={getVelmoraPageHref(item.id)}
                  data-velmora-page-link="true"
                  data-page-id={item.id}
                  data-visual-link-href={getVelmoraPageHref(item.id)}
                  data-link-url={getVelmoraPageHref(item.id)}
                  onClick={(event) => handleVelmoraNavClick(event, item.id, onPageChange)}
                  className={[
                    "text-right hover:text-black",
                    activePage === item.id ? "font-black text-black" : "",
                  ].join(" ")}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-black/10 px-5 py-5">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-xs text-black/45 md:flex-row md:items-center">
            <p>{copyright}</p>

            <div className="flex flex-wrap gap-5">
              {footerInfoItems.map((item) => (
                <a
                  key={item.id}
                  href={getVelmoraPageHref(item.id)}
                  data-velmora-page-link="true"
                  data-page-id={item.id}
                  data-visual-link-href={getVelmoraPageHref(item.id)}
                  data-link-url={getVelmoraPageHref(item.id)}
                  onClick={(event) => handleVelmoraNavClick(event, item.id, onPageChange)}
                  className="hover:text-black"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}