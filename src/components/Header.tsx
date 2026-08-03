import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGlobe, FaUser } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import logo from "../images/logo_final.svg";
import { useAuth } from "../context/AuthContext";
import MobileMenu from "./MobileMenu";
import {
  getTextDirection,
  normalizeLanguage,
  setSessionLanguageOverride,
} from "../i18n/localeUtils";
import "../styles/SiteHeader.css";

type NavLink = {
  to: string;
  labelKey: string;
};

/** Flat SaaS nav — no dropdowns. RTL visual: logo right → links → actions left. */
const navLinks: NavLink[] = [
  { to: "/about", labelKey: "nav.about" },
  { to: "/website-builder", labelKey: "nav.website" },
  { to: "/crm", labelKey: "nav.crm" },
  { to: "/automations", labelKey: "nav.automations" },
  { to: "/agents", labelKey: "nav.agents" },
  { to: "/collaborations", labelKey: "nav.collaborations" },
  { to: "/pricing", labelKey: "nav.pricing" },
];

export default function Header() {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const currentLangCode = normalizeLanguage(i18n.language);
  const headerDir = getTextDirection(currentLangCode);
  const accountPath =
    user?.role === "business" && !user?.hasAccess ? "/pricing" : "/dashboard";

  const isDashboard =
    location.pathname.includes("/dashboard") ||
    location.pathname.includes("/business/");

  const handleToggleLanguage = async () => {
    const next = currentLangCode === "he" ? "en" : "he";
    setSessionLanguageOverride(next);
    await i18n.changeLanguage(next);
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
      <header className="site-header" dir={headerDir}>
        <nav className="site-header__bar" aria-label={t("nav.mainAria", { defaultValue: "Main navigation" })}>
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

          <div className="site-header__actions">
            <button
              type="button"
              onClick={handleToggleLanguage}
              className="site-header__icon-btn"
              aria-label={t("common.changeLanguage")}
              title={currentLangCode === "he" ? "English" : "עברית"}
            >
              <FaGlobe size={16} />
              <span className="site-header__lang-code">
                {currentLangCode === "he" ? "EN" : "HE"}
              </span>
            </button>

            {!user ? (
              <>
                <Link to="/login" className="site-header__signin">
                  {t("common.login")}
                </Link>
                <Link to="/pricing" className="site-header__cta">
                  {t("nav.cta")}
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={accountPath}
                  className="site-header__icon-btn"
                  aria-label={t("common.myAccount")}
                  title={t("common.myAccount")}
                >
                  <FaUser size={15} />
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="site-header__logout"
                >
                  {t("common.logout")}
                </button>
              </>
            )}
          </div>

          <div className="site-header__mobile">
            <button
              type="button"
              onClick={handleToggleLanguage}
              className="site-header__icon-btn"
              aria-label={t("common.changeLanguage")}
            >
              <FaGlobe size={15} />
            </button>

            {!user ? (
              <Link
                to="/login"
                className="site-header__icon-btn"
                aria-label={t("common.login")}
                title={t("common.login")}
              >
                <FaUser size={14} />
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
