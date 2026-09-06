import React, { useEffect, useId, useRef, useState } from "react";
import { FaGlobe } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { LANGUAGE_META, getShortLanguageLabel } from "../i18n/languages";
import { coerceSupportedLanguage, getTextDirection } from "../i18n/localeUtils";
import { changeAppLanguage } from "../i18n/persistLanguage";

export default function LanguageSwitcher({
  compact = true,
  className = "",
  align = "end",
} = {}) {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const menuId = useId();
  const currentLang = coerceSupportedLanguage(i18n.language);
  const shortLabel = getShortLanguageLabel(currentLang);
  const dir = getTextDirection(currentLang);

  const changeLanguage = async (lng) => {
    await changeAppLanguage(lng);
    setOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
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

  const menuAlign =
    align === "start"
      ? "inset-inline-start-0"
      : "inset-inline-end-0";

  return (
    <div ref={wrapperRef} className={`relative ${className}`} dir={dir}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={
          compact
            ? "site-header__icon-btn"
            : `flex h-[58px] w-[58px] items-center justify-center rounded-2xl shadow-[0_12px_30px_rgba(79,70,229,0.22)] transition hover:-translate-y-0.5 ${
                open
                  ? "bg-gradient-to-br from-indigo-600 to-violet-700 text-white"
                  : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              }`
        }
        aria-label={t("common.changeLanguage")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        title={t("common.changeLanguage")}
      >
        <span className="site-header__lang-code">{shortLabel}</span>
        <FaGlobe size={compact ? 16 : 22} aria-hidden="true" />
      </button>

      {open && (
        <div
          id={menuId}
          role="listbox"
          aria-label={t("common.changeLanguage")}
          className={`absolute top-[calc(100%+0.45rem)] z-[9999] w-[240px] ${menuAlign} rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_50px_rgba(15,23,42,0.16)]`}
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
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm font-bold transition ${
                  isActive
                    ? "bg-violet-50 text-violet-800"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="text-base leading-none" aria-hidden="true">
                  {lang.flag}
                </span>
                <span className="min-w-0 flex-1">{lang.nativeLabel}</span>
                {isActive ? (
                  <span className="text-violet-700" aria-hidden="true">
                    ✓
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
