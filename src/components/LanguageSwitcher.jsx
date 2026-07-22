// src/components/LanguageSwitcher.jsx
import React, { useEffect, useRef, useState } from "react";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { setSessionLanguageOverride } from "../i18n/localeUtils";

const languages = [
  { code: "en", label: "English" },
  { code: "he", label: "עברית" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
  { code: "nl", label: "Nederlands" },
  { code: "it", label: "Italiano" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const currentLangCode = i18n.language?.split("-")?.[0] || "en";

  const currentLanguage =
    languages.find((lang) => lang.code === currentLangCode) || languages[0];

  const changeLanguage = async (lng) => {
    setSessionLanguageOverride(lng);
    await i18n.changeLanguage(lng);
    setOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-[58px] w-[58px] items-center justify-center rounded-2xl shadow-[0_12px_30px_rgba(79,70,229,0.22)] transition hover:-translate-y-0.5 ${
          open
            ? "bg-gradient-to-br from-indigo-600 to-violet-700 text-white"
            : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
        }`}
        aria-label="Change language"
        title={currentLanguage.label}
      >
        <Globe className="h-7 w-7" strokeWidth={2.4} />
      </button>

      {open && (
        <div className="absolute right-1/2 top-[74px] z-[9999] w-[260px] translate-x-1/2 rounded-[1.7rem] border border-slate-200 bg-white p-3 shadow-[0_28px_80px_rgba(15,23,42,0.18)]">
          <div className="absolute -top-2.5 right-1/2 h-5 w-5 translate-x-1/2 rotate-45 border-l border-t border-slate-200 bg-white" />

          <div className="relative border-b border-slate-100 px-4 pb-4 pt-3 text-lg font-black text-slate-800">
            Change language
          </div>

          <div className="relative mt-3 space-y-2">
            {languages.map((lang) => {
              const isActive = currentLangCode === lang.code;

              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left text-base font-black transition ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-violet-700 text-white shadow-lg shadow-indigo-200"
                      : "bg-white text-slate-700 hover:bg-slate-50 hover:text-indigo-700"
                  }`}
                >
                  <span>{lang.label}</span>

                  {isActive && (
                    <span className="text-lg font-black leading-none">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}