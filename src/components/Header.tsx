import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGlobe, FaUser } from "react-icons/fa";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

import logo from "../images/logo_final.svg";
import { useAuth } from "../context/AuthContext";
import MobileMenu from "./MobileMenu";
import { normalizeLanguage, setSessionLanguageOverride } from "../i18n/localeUtils";
import "../styles/SiteHeader.css";

type NavChild = {
  to: string;
  labelKey: string;
};

type NavLink = {
  to: string;
  labelKey: string;
  children?: NavChild[];
};

type Language = {
  code: string;
  label: string;
};

/**
 * Visual RTL order (right → left):
 * Logo · About · Website · CRM(+Automations) · Agents · Collaborations · Pricing · Lang · Login
 */
const navLinks: NavLink[] = [
  { to: "/about", labelKey: "nav.about" },
  { to: "/website-builder", labelKey: "nav.website" },
  {
    to: "/crm",
    labelKey: "nav.crm",
    children: [
      { to: "/crm", labelKey: "nav.crm" },
      { to: "/crm#automations", labelKey: "nav.automations" },
    ],
  },
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

  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [crmOpen, setCrmOpen] = useState(false);

  const languageRef = useRef<HTMLDivElement | null>(null);
  const crmRef = useRef<HTMLDivElement | null>(null);

  const currentLangCode = normalizeLanguage(i18n.language);
  const currentLanguage =
    languages.find((lang) => lang.code === currentLangCode) ?? languages[0];

  const isDashboard =
    location.pathname.includes("/dashboard") ||
    location.pathname.includes("/business/");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (languageRef.current && !languageRef.current.contains(target)) {
        setLanguageOpen(false);
      }
      if (crmRef.current && !crmRef.current.contains(target)) {
        setCrmOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setCrmOpen(false);
    setLanguageOpen(false);
  }, [location.pathname, location.hash]);

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

  const crmActive =
    location.pathname === "/crm" || location.pathname === "/automations";

  return (
    <>
      <header className="site-header" dir="rtl">
        <nav className="site-header__bar" aria-label="ניווט ראשי">
          {/* Right side in RTL */}
          <Link to="/" className="site-header__logo" aria-label="BizUply">
            <img src={logo} alt="BizUply" />
          </Link>

          <div className="site-header__nav">
            {navLinks.map((item) => {
              if (item.children?.length) {
                return (
                  <div
                    key={item.to}
                    ref={crmRef}
                    className={`site-header__dropdown${crmOpen ? " is-open" : ""}`}
                  >
                    <button
                      type="button"
                      className={`site-header__link site-header__link--btn${
                        crmActive ? " is-active" : ""
                      }`}
                      aria-expanded={crmOpen}
                      aria-haspopup="menu"
                      onClick={() => setCrmOpen((prev) => !prev)}
                    >
                      {t(item.labelKey)}
                      <ChevronDown
                        size={14}
                        className="site-header__chevron"
                        aria-hidden="true"
                      />
                    </button>

                    {crmOpen ? (
                      <div className="site-header__menu" role="menu">
                        {item.children.map((child) => {
                          const isHash = child.to.includes("#");
                          const childActive =
                            child.to === "/crm#automations"
                              ? location.pathname === "/crm" &&
                                location.hash === "#automations"
                              : location.pathname === child.to &&
                                !location.hash;

                          return (
                            <Link
                              key={child.to}
                              to={child.to}
                              role="menuitem"
                              className={`site-header__menu-item${
                                childActive ? " is-active" : ""
                              }`}
                              onClick={() => {
                                setCrmOpen(false);
                                if (isHash && location.pathname === "/crm") {
                                  requestAnimationFrame(() => {
                                    document
                                      .getElementById("automations")
                                      ?.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start",
                                      });
                                  });
                                }
                              }}
                            >
                              {t(child.labelKey)}
                            </Link>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              }

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

          {/* Left side in RTL */}
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
