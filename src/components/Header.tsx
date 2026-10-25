import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import { useAuth } from "../context/AuthContext";
import MobileMenu from "./MobileMenu";
import LanguageSwitcher from "./LanguageSwitcher";
import { getTextDirection } from "../i18n/localeUtils";
import { normalizeMarketingLocale } from "../lib/localePath.mjs";
import { marketingNav } from "../lib/marketingNav.mjs";
import { businessNoAccessPath } from "../utils/whatsappApiPortal";
import "../styles/SiteHeader.css";

export default function Header() {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const groups = marketingNav(normalizeMarketingLocale(i18n.language));

  const headerDir = getTextDirection(i18n.language);
  const accountPath =
    user?.role === "partner"
      ? "/partner/dashboard"
      : user?.role === "business" && !user?.hasAccess
        ? businessNoAccessPath(user)
        : "/dashboard";

  const isDashboard =
    location.pathname.includes("/dashboard") ||
    location.pathname.includes("/business/");

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

  useEffect(() => {
    setOpenGroup(null);
  }, [location.pathname]);

  if (isDashboard) return null;

  return (
    <>
      <header className="site-header" dir={headerDir}>
        <nav className="site-header__bar" aria-label={t("nav.mainAria", { defaultValue: "Main navigation" })}>
          <Link to="/" className="site-header__logo" aria-label="BizUply">
            <img src="/logo-mark.svg" alt="BizUply" width="176" height="52" />
          </Link>

          <div className="site-header__nav">
            {groups.map((group) => {
              if (!group.links) {
                const isActive = location.pathname === group.to;
                return (
                  <Link
                    key={group.id}
                    to={group.to}
                    className={`site-header__link${isActive ? " is-active" : ""}`}
                  >
                    {group.label}
                  </Link>
                );
              }
              const open = openGroup === group.id;
              return (
                <div
                  key={group.id}
                  className={`site-nav__item${open ? " is-open" : ""}`}
                  onMouseEnter={() => setOpenGroup(group.id)}
                  onMouseLeave={() => setOpenGroup(null)}
                >
                  <button
                    type="button"
                    className="site-header__link site-nav__button"
                    aria-expanded={open}
                    onClick={() => setOpenGroup(open ? null : group.id)}
                  >
                    {group.label}
                  </button>
                  <div className="site-nav__panel" hidden={!open}>
                    {group.links.map(([to, label]) => (
                      <Link key={to} to={to} onClick={() => setOpenGroup(null)}>
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="site-header__actions">
            <LanguageSwitcher />

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
            <LanguageSwitcher />

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
