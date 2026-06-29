import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGlobe, FaUser } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import logo from "../images/logo_final.svg";
import { useAuth } from "../context/AuthContext";
import MobileMenu from "./MobileMenu";

type NavLink = {
  to: string;
  label: string;
};

type Language = {
  code: string;
  label: string;
};

const navLinks: NavLink[] = [
  { to: "/features", label: "פיצ׳רים" },
  { to: "/solutions", label: "פתרונות" },
  { to: "/how-it-works", label: "איך זה עובד" },
  { to: "/pricing", label: "מחירים" },
  { to: "/about", label: "עלינו" },
];

const languages: Language[] = [
  { code: "en", label: "English" },
  { code: "he", label: "עברית" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
  { code: "nl", label: "Nederlands" },
  { code: "it", label: "Italiano" },
];

export default function Header() {
  const { user, logout } = useAuth();
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [languageOpen, setLanguageOpen] = useState<boolean>(false);

  const languageRef = useRef<HTMLDivElement | null>(null);

  const currentLangCode = i18n.language?.split("-")?.[0] || "he";

  const currentLanguage =
    languages.find((lang) => lang.code === currentLangCode) ?? languages[1];

  const isDashboard =
    location.pathname.includes("/dashboard") ||
    location.pathname.includes("/business/");

  useEffect(() => {
    document.documentElement.lang = currentLangCode;
    document.documentElement.dir = currentLangCode === "he" ? "rtl" : "ltr";
  }, [currentLangCode]);

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
    await i18n.changeLanguage(lng);

    localStorage.setItem("i18nextLng", lng);
    document.documentElement.lang = lng;
    document.documentElement.dir = lng === "he" ? "rtl" : "ltr";

    setLanguageOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("❌ ההתנתקות נכשלה:", err);
    } finally {
      setMenuOpen(false);
    }
  };

  if (isDashboard) return null;

  return (
    <>
      <nav
        dir="rtl"
        className="sticky top-0 z-50 flex h-20 w-full items-center justify-between border-b border-slate-100 bg-white/95 px-5 text-right shadow-sm backdrop-blur-xl sm:px-6 lg:px-14"
      >
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="inline-flex items-center">
            <img
              src={logo}
              alt="לוגו Bizuply"
              className="h-10 w-auto object-contain sm:h-11"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
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
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-5 lg:flex">
          <Link
            to="/contact"
            className="text-[15px] font-bold text-[#082f5f] underline underline-offset-4 transition hover:text-blue-600"
          >
            יצירת קשר
          </Link>

          {/* Language Switcher */}
          <div ref={languageRef} className="relative">
            <button
              type="button"
              onClick={() => setLanguageOpen((prev) => !prev)}
              className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#eaf4ff] text-[#0f7ee8] shadow-[0_10px_28px_rgba(15,126,232,0.14)] transition hover:-translate-y-0.5 hover:bg-[#dff0ff]"
              aria-label="שינוי שפה"
              aria-expanded={languageOpen}
            >
              <FaGlobe className="text-[25px]" />
            </button>

            {languageOpen && (
              <div className="absolute right-1/2 top-[72px] z-[9999] w-[220px] translate-x-1/2 rounded-[18px] border border-slate-200 bg-white p-2 text-right shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
                <div className="absolute -top-2.5 right-1/2 h-5 w-5 translate-x-1/2 rotate-45 border-l border-t border-slate-200 bg-white" />

                <div className="relative border-b border-slate-100 px-3 py-3 text-sm font-black text-slate-900">
                  שינוי שפה
                </div>

                <div className="relative pt-2">
                  {languages.map((lang) => {
                    const isActive = currentLanguage.code === lang.code;

                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleChangeLanguage(lang.code)}
                        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-right text-sm font-bold transition ${
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
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-[15px] font-black text-[#082f5f] transition hover:text-indigo-600"
              >
                <FaUser className="text-[16px]" />
                <span>התחברות</span>
              </Link>

              <Link
                to="/register"
                className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-7 text-[15px] font-black text-white shadow-[0_14px_34px_rgba(79,70,229,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(79,70,229,0.32)]"
              >
                התחלה בחינם
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm font-bold text-slate-700">
                שלום, {user.name}
              </span>

              <Link
                to="/dashboard"
                className="text-[15px] font-black text-[#082f5f] transition hover:text-indigo-600"
              >
                החשבון שלי
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="text-[15px] font-black text-rose-600 transition hover:text-rose-700"
              >
                התנתקות
              </button>
            </>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="mr-auto flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={() =>
              handleChangeLanguage(currentLanguage.code === "he" ? "en" : "he")
            }
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eaf4ff] text-[#0f7ee8] shadow-sm transition hover:bg-[#dff0ff]"
            aria-label="שינוי שפה"
          >
            <FaGlobe className="text-lg" />
          </button>

          {!user && (
            <Link
              to="/register"
              className="hidden rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-black text-white shadow-md sm:inline-flex"
            >
              התחלה בחינם
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50"
            aria-label="פתיחת תפריט"
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