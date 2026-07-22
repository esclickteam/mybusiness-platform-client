import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGlobe, FaUser } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import logo from "../images/logo_final.svg";
import { useAuth } from "../context/AuthContext";
import MobileMenu from "./MobileMenu";
import { normalizeLanguage, setSessionLanguageOverride } from "../i18n/localeUtils";

type NavLink = {
  to: string;
  labelKey: string;
};

type Language = {
  code: string;
  label: string;
};

const navLinks: NavLink[] = [
  { to: "/features", labelKey: "nav.features" },
  { to: "/solutions", labelKey: "nav.solutions" },
  { to: "/how-it-works", labelKey: "nav.howItWorks" },
  { to: "/pricing", labelKey: "nav.pricing" },
  { to: "/about", labelKey: "nav.about" },
];

const languages: Language[] = [
  { code: "en", label: "English" },
  { code: "he", label: "עברית" },
];

export default function Header() {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [languageOpen, setLanguageOpen] = useState<boolean>(false);

  const languageRef = useRef<HTMLDivElement | null>(null);

  const currentLangCode = normalizeLanguage(i18n.language);

  const currentLanguage =
    languages.find((lang) => lang.code === currentLangCode) ?? languages[0];

  const isDashboard =
    location.pathname.includes("/dashboard") ||
    location.pathname.includes("/business/");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChangeLanguage = async (lng: string) => {
    if (normalizeLanguage(lng) === currentLangCode) {
      setLanguageOpen(false);
      return;
    }

    // Apply for this browsing session; the next full page load re-detects from location.
    setSessionLanguageOverride(lng);
    await i18n.changeLanguage(lng);
    setLanguageOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("❌ Logout failed:", err);
    } finally {
      setMenuOpen(false);
    }
  };

  if (isDashboard) return null;

  return (
    <>
      <nav className="sticky top-0 z-50 flex h-20 w-full items-center justify-between border-b border-slate-100 bg-white/95 px-5 shadow-sm backdrop-blur-xl sm:px-6 lg:px-14">
        <div className="flex items-center">
          <Link to="/" className="inline-flex items-center">
            <img
              src={logo}
              alt="Bizuply Logo"
              className="h-10 w-auto object-contain sm:h-11"
            />
          </Link>
        </div>

        <div className="hidden items-center gap-10 lg:flex">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`text-[15px] font-extrabold transition ${
                  isActive
                    ? "text-indigo-600"
                    : "text-slate-950 hover:text-indigo-600"
                }`}
              >
                {t(item.labelKey)}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-5 lg:flex">
          <Link
            to="/contact"
            className="text-[15px] font-bold text-[#082f5f] underline underline-offset-4 transition hover:text-blue-600"
          >
            {t("common.contactUs")}
          </Link>

          <div ref={languageRef} className="relative">
            <button
              type="button"
              onClick={() => setLanguageOpen((prev) => !prev)}
              className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#eaf4ff] text-[#0f7ee8] shadow-[0_10px_28px_rgba(15,126,232,0.14)] transition hover:-translate-y-0.5 hover:bg-[#dff0ff]"
              aria-label={t("common.changeLanguage")}
              aria-expanded={languageOpen}
            >
              <FaGlobe className="text-[25px]" />
            </button>

            {languageOpen && (
              <div className="absolute end-1/2 top-[72px] z-[9999] w-[220px] translate-x-1/2 rounded-[18px] border border-slate-200 bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.16)] rtl:-translate-x-1/2">
                <div className="absolute -top-2.5 end-1/2 h-5 w-5 translate-x-1/2 rotate-45 border-l border-t border-slate-200 bg-white rtl:-translate-x-1/2" />

                <div className="relative border-b border-slate-100 px-3 py-3 text-sm font-black text-slate-900">
                  {t("common.changeLanguage")}
                </div>

                <div className="relative pt-2">
                  {languages.map((lang) => {
                    const isActive = currentLanguage.code === lang.code;

                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleChangeLanguage(lang.code)}
                        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-start text-sm font-bold transition ${
                          isActive
                            ? "bg-[#eef6ff] text-[#0f7ee8]"
                            : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                        }`}
                      >
                        <span>{lang.label}</span>

                        {isActive && (
                          <span className="text-xs font-black">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {!user ? (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-[15px] font-black text-[#082f5f] transition hover:text-indigo-600"
            >
              <FaUser className="text-[16px]" />
              <span>{t("common.login")}</span>
            </Link>
          ) : (
            <>
              <span className="text-sm font-bold text-slate-700">
                {t("common.hello", { name: user.name })}
              </span>

              <Link
                to="/dashboard"
                className="text-[15px] font-black text-[#082f5f] transition hover:text-indigo-600"
              >
                {t("common.myAccount")}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="text-[15px] font-black text-rose-600 transition hover:text-rose-700"
              >
                {t("common.logout")}
              </button>
            </>
          )}
        </div>

        <div className="ms-auto flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={() =>
              handleChangeLanguage(currentLanguage.code === "he" ? "en" : "he")
            }
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eaf4ff] text-[#0f7ee8] shadow-sm transition hover:bg-[#dff0ff]"
            aria-label={t("common.changeLanguage")}
          >
            <FaGlobe className="text-lg" />
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50"
            aria-label={t("common.openMenu")}
            aria-expanded={menuOpen}
          >
            <span className="h-0.5 w-5 rounded-full bg-slate-900" />
            <span className="h-0.5 w-5 rounded-full bg-slate-900" />
            <span className="h-0.5 w-5 rounded-full bg-slate-900" />
          </button>
        </div>
      </nav>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={user}
        onLogout={handleLogout}
      />
    </>
  );
}
