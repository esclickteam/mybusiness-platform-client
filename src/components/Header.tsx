import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGlobe, FaUser } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import logo from "../images/logo_final.svg";
import { useAuth } from "../context/AuthContext";
import MobileMenu from "./MobileMenu";
import { normalizeLanguage, setSessionLanguageOverride } from "../i18n/localeUtils";
import "../styles/SiteHeader.css";

type NavLink = {
  to: string;
  labelKey: string;
};

type Language = {
  code: string;
  label: string;
};

/** RTL order: About on the right, then product pages, pricing on the left. */
const navLinks: NavLink[] = [
  { to: "/about", labelKey: "nav.about" },
  { to: "/website-builder", labelKey: "nav.website" },
  { to: "/crm", labelKey: "nav.crm" },
  { to: "/agents", labelKey: "nav.agents" },
  { to: "/collaborations", labelKey: "nav.collaborations" },
  { to: "/pricing", labelKey: "nav.pricing" },
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
      <header className="site-header">
        <nav className="site-header__bar" aria-label="ניווט ראשי">
          {/* RTL: first = right → big logo */}
          <Link to="/" className="site-header__logo" aria-label="BizUply">
            <img src={logo} alt="BizUply" />
          </Link>

          <div className="site-header__nav">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`site-header__link${isActive ? " is-active" : ""}`}
                >
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </div>

          {/* RTL: last = left → language + login */}
          <div className="site-header__actions">
            <div ref={languageRef} className="site-header__lang">
              <button
                type="button"
                onClick={() => setLanguageOpen((prev) => !prev)}
                className="site-header__icon-btn site-header__icon-btn--lang"
                aria-label={t("common.changeLanguage")}
                aria-expanded={languageOpen}
              >
                <FaGlobe size={18} />
              </button>

              {languageOpen ? (
                <div className="site-header__lang-menu" role="menu">
                  <div className="site-header__lang-title">
                    {t("common.changeLanguage")}
                  </div>
                  {languages.map((lang) => {
                    const isActive = currentLanguage.code === lang.code;

                    return (
                      <button
                        key={lang.code}
                        type="button"
                        role="menuitem"
                        onClick={() => handleChangeLanguage(lang.code)}
                        className={`site-header__lang-option${
                          isActive ? " is-active" : ""
                        }`}
                      >
                        <span>{lang.label}</span>
                        {isActive ? <span>✓</span> : null}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>

            {!user ? (
              <Link
                to="/login"
                className="site-header__icon-btn site-header__icon-btn--login"
                aria-label={t("common.login")}
                title={t("common.login")}
              >
                <FaUser size={16} />
              </Link>
            ) : (
              <div className="site-header__user">
                <span className="site-header__user-name">
                  {t("common.hello", { name: user.name })}
                </span>
                <Link
                  to="/dashboard"
                  className="site-header__icon-btn site-header__icon-btn--login"
                  aria-label={t("common.myAccount")}
                  title={t("common.myAccount")}
                >
                  <FaUser size={16} />
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="site-header__text-btn site-header__text-btn--danger"
                >
                  {t("common.logout")}
                </button>
              </div>
            )}
          </div>

          <div className="site-header__mobile">
            <button
              type="button"
              onClick={() =>
                handleChangeLanguage(
                  currentLanguage.code === "he" ? "en" : "he"
                )
              }
              className="site-header__icon-btn site-header__icon-btn--lang"
              aria-label={t("common.changeLanguage")}
            >
              <FaGlobe size={16} />
            </button>

            {!user ? (
              <Link
                to="/login"
                className="site-header__icon-btn site-header__icon-btn--login"
                aria-label={t("common.login")}
                title={t("common.login")}
              >
                <FaUser size={15} />
              </Link>
            ) : null}

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="site-header__burger"
              aria-label={t("common.openMenu")}
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={user}
        onLogout={handleLogout}
      />
    </>
  );
}
