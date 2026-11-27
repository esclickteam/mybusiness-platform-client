import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaGlobe } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { LANGUAGE_META } from "../i18n/languages";
import { coerceSupportedLanguage, getTextDirection } from "../i18n/localeUtils";
import { readGuidedDemoLocaleLock } from "../guidedDemo/sessionStore";
import { splitMarketingLocale, withMarketingLocale } from "../lib/localePathCore.mjs";
import { isPublicCustomerSiteHost } from "../utils/publicSiteHost";

const MENU_WIDTH = 240;
const VIEWPORT_MARGIN = 8;
const GAP = 8;

function placeMenu(trigger, menu) {
  if (!trigger || !menu) return;
  const rect = trigger.getBoundingClientRect();
  // Hidden/display:none triggers report an empty box — skip rather than pin to 0,0.
  if (rect.width < 1 || rect.height < 1) return;
  const viewportW = document.documentElement.clientWidth || window.innerWidth;
  const viewportH = document.documentElement.clientHeight || window.innerHeight;
  const width = Math.min(MENU_WIDTH, Math.max(160, viewportW - VIEWPORT_MARGIN * 2));

  let left = rect.right - width;
  if (left < VIEWPORT_MARGIN) left = VIEWPORT_MARGIN;
  if (left + width > viewportW - VIEWPORT_MARGIN) {
    left = Math.max(VIEWPORT_MARGIN, viewportW - VIEWPORT_MARGIN - width);
  }

  const spaceBelow = viewportH - rect.bottom - VIEWPORT_MARGIN;
  const spaceAbove = rect.top - VIEWPORT_MARGIN;
  const preferBelow = spaceBelow >= 220 || spaceBelow >= spaceAbove;
  const maxHeight = Math.max(160, preferBelow ? spaceBelow - GAP : spaceAbove - GAP);

  menu.style.width = `${width}px`;
  menu.style.maxHeight = `${maxHeight}px`;
  menu.style.left = `${left}px`;
  menu.style.right = "auto";

  if (preferBelow) {
    menu.style.top = `${rect.bottom + GAP}px`;
    menu.style.bottom = "auto";
  } else {
    menu.style.top = "auto";
    menu.style.bottom = `${viewportH - rect.top + GAP}px`;
  }
}

export default function LanguageSwitcher({
  compact = true,
  className = "",
  align = "end",
} = {}) {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const menuId = useId();
  const currentLang = coerceSupportedLanguage(i18n.language);
  const dir = getTextDirection(currentLang);

  const changeLanguage = async (lng) => {
    const host = window.location.hostname;
    const onMarketingHost =
      !isPublicCustomerSiteHost() &&
      (host === "bizuply.com" ||
        host === "www.bizuply.com" ||
        host === "localhost" ||
        host === "127.0.0.1" ||
        host.endsWith(".vercel.app"));
    const bare = splitMarketingLocale(window.location.pathname).path;

    const softOrAssign = async (next) => {
      if (next === window.location.pathname) return false;
      const { softMarketingLocaleNavigate } = await import("../lib/softMarketingLocaleNavigate");
      if (softMarketingLocaleNavigate(next, lng)) {
        setOpen(false);
        return true;
      }
      window.location.assign(next);
      return true;
    };

    if (bare === "/") {
      const { changeAppLanguage } = await import("../i18n/persistLanguage");
      await changeAppLanguage(lng);
      const next = withMarketingLocale("/", lng);
      if (onMarketingHost && (await softOrAssign(next))) return;
      setOpen(false);
      return;
    }
    const [{ findMarketingPage }, { hasLocalizedMarketingPage }, { changeAppLanguage }] = await Promise.all([
      import("../lib/marketingSeo.mjs"),
      import("../lib/localePath.mjs"),
      import("../i18n/persistLanguage"),
    ]);
    const canMove = Boolean(findMarketingPage(bare) || bare === "/whatsapp-api" || bare.startsWith("/guides/"));
    const targetReady = lng === "en" || hasLocalizedMarketingPage(bare, lng);
    if (onMarketingHost && canMove && targetReady) {
      const next = withMarketingLocale(bare, lng);
      if (next !== window.location.pathname) {
        await changeAppLanguage(lng);
        if (await softOrAssign(next)) return;
      }
    }
    await changeAppLanguage(lng);
    setOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      const target = event.target;
      if (wrapperRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    }

    function handleKey(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  useLayoutEffect(() => {
    const menu = menuRef.current;
    const trigger = triggerRef.current;
    if (!open || !menu || !trigger) return undefined;

    const fit = () => placeMenu(trigger, menu);
    fit();
    window.addEventListener("resize", fit);
    window.addEventListener("scroll", fit, true);
    return () => {
      window.removeEventListener("resize", fit);
      window.removeEventListener("scroll", fit, true);
    };
  }, [open]);

  if (readGuidedDemoLocaleLock()) return null;

  const menu = open
    ? createPortal(
        <div
          ref={menuRef}
          id={menuId}
          role="listbox"
          aria-label={t("common.changeLanguage")}
          dir={dir}
          data-align={align}
          className="site-lang-menu fixed z-[99999] overflow-y-auto overscroll-contain"
          style={{ width: MENU_WIDTH, maxWidth: `calc(100vw - ${VIEWPORT_MARGIN * 2}px)` }}
        >
          {LANGUAGE_META.map((lang) => {
            const isActive = currentLang === lang.code;

            return (
              <button
                key={lang.code}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => changeLanguage(lang.code)}
                className={`site-lang-menu__option${isActive ? " is-active" : ""}`}
              >
                <span className="min-w-0 flex-1">{lang.code === "pt-BR" ? "Português" : lang.nativeLabel}</span>
                {isActive ? (
                  <span className="site-lang-menu__mark" aria-hidden="true">
                    ✓
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>,
        document.body,
      )
    : null;

  return (
    <div ref={wrapperRef} className={`relative ${className}`} dir={dir}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="site-header__lang"
        aria-label={t("common.changeLanguage")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        title={t("common.changeLanguage")}
      >
        <FaGlobe size={22} aria-hidden="true" />
        <svg className="site-header__lang-caret" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {menu}
    </div>
  );
}
