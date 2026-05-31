import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../images/logo_final.svg";
import { FaUser, FaGlobe } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import MobileMenu from "./MobileMenu";

const navLinks = [
  { to: "/features", label: "Features" },
  { to: "/solutions", label: "Solutions" },
  { to: "/how-it-works", label: "How it Works" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
];

const languages = [
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

  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const languageRef = useRef(null);

  const currentLangCode = i18n.language?.split("-")?.[0] || "en";
  const currentLanguage =
    languages.find((lang) => lang.code === currentLangCode) || languages[0];

  const isDashboard =
    location.pathname.includes("/dashboard") ||
    location.pathname.includes("/business/");

  useEffect(() => {
    function handleClickOutside(event) {
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setLanguageOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isDashboard) return null;

  const handleChangeLanguage = async (lng) => {
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
      console.error("❌ Logout failed:", err);
    } finally {
      setMenuOpen(false);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 flex h-20 w-full items-center justify-between border-b border-slate-100 bg-white/95 px-6 shadow-sm backdrop-blur-xl lg:px-14">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="inline-flex items-center">
            <img
              src={logo}
              alt="Bizuply Logo"
              className="h-11 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Navigation - Desktop */}
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

        {/* Desktop actions */}
        <div className="hidden items-center gap-5 lg:flex">
          <Link
            to="/contact"
            className="text-[15px] font-bold text-[#082f5f] underline underline-offset-4 transition hover:text-blue-600"
          >
            Contact Us
          </Link>

          {/* Language Switcher */}
          <div ref={languageRef} className="relative">
            <button
              type="button"
              onClick={() => setLanguageOpen((prev) => !prev)}
              className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#eaf4ff] text-[#0f7ee8] shadow-[0_10px_28px_rgba(15,126,232,0.14)] transition hover:-translate-y-0.5 hover:bg-[#dff0ff]"
              aria-label="Change language"
            >
              <FaGlobe className="text-[25px]" />
            </button>

            {languageOpen && (
              <div className="absolute right-1/2 top-[72px] z-[9999] w-[220px] translate-x-1/2 rounded-[18px] border border-slate-200 bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
                <div className="absolute -top-2.5 right-1/2 h-5 w-5 translate-x-1/2 rotate-45 border-l border-t border-slate-200 bg-white" />

                <div className="relative border-b border-slate-100 px-3 py-3 text-sm font-black text-slate-900">
                  Change language
                </div>

                <div className="relative pt-2">
                  {languages.map((lang) => {
                    const isActive = currentLanguage.code === lang.code;

                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleChangeLanguage(lang.code)}
                        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
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
                <span>Login</span>
              </Link>

              <Link
                to="/register"
                className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-7 text-[15px] font-black text-white shadow-[0_14px_34px_rgba(79,70,229,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(79,70,229,0.32)]"
              >
                Try it Free
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm font-bold text-slate-700">
                Hello, {user.name}
              </span>

              <Link
                to="/dashboard"
                className="text-[15px] font-black text-[#082f5f] transition hover:text-indigo-600"
              >
                My Account
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="text-[15px] font-black text-rose-600 transition hover:text-rose-700"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile actions */}
        <div className="ml-auto flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={() =>
              handleChangeLanguage(currentLanguage.code === "he" ? "en" : "he")
            }
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eaf4ff] text-[#0f7ee8] shadow-sm transition hover:bg-[#dff0ff]"
            aria-label="Change language"
          >
            <FaGlobe className="text-lg" />
          </button>

          {!user && (
            <Link
              to="/register"
              className="hidden rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-black text-white shadow-md sm:inline-flex"
            >
              Try it Free
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white shadow-sm"
            aria-label="Open menu"
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