// src/components/LanguageSwitcher.jsx
import React, { useEffect, useRef, useState } from "react";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", label: "English" },
  { code: "he", label: "עברית" }
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language?.split("-")[0]) ||
    languages[0];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
    document.documentElement.lang = lng;
    document.documentElement.dir = lng === "he" ? "rtl" : "ltr";
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
        className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 text-sky-600 shadow-sm transition hover:bg-sky-100"
        aria-label="Change language"
      >
        <Globe className="h-7 w-7" strokeWidth={2.2} />
      </button>

      {open && (
        <div className="absolute right-0 top-[72px] z-50 min-w-[180px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="border-b border-slate-100 px-4 py-3 text-sm font-bold text-slate-700">
            Select language
          </div>

          <div className="p-2">
            {languages.map((lang) => {
              const isActive =
                i18n.language?.split("-")[0] === lang.code;

              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-sky-50 text-sky-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{lang.label}</span>
                  {isActive && <span className="text-xs">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}