import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
const logo = "/logo-mark.svg";
import { getTextDirection, normalizeLanguage } from "../i18n/localeUtils";
import { normalizeMarketingLocale } from "../lib/localePath.mjs";
import { marketingNav } from "../lib/marketingNav.mjs";
import { businessNoAccessPath } from "../utils/whatsappApiPortal";
import "./MobileMenu.css";

export default function MobileMenu({ open, onClose, user, onLogout }) {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const menuDir = getTextDirection(normalizeLanguage(i18n.language));
  const accountPath =
    user?.role === "business" && !user?.hasAccess ? businessNoAccessPath(user) : "/dashboard";

  const groups = marketingNav(normalizeMarketingLocale(i18n.language));

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow || "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="site-mobile" role="dialog" aria-modal="true" dir={menuDir}>
      <button
        type="button"
        aria-label={t("common.closeMenu")}
        onClick={onClose}
        className="site-mobile__backdrop"
      />

      <div className="site-mobile__panel">
        <div className="site-mobile__top">
          <Link to="/" onClick={onClose} className="site-mobile__brand" aria-label="BizUply">
            <img src={logo} alt="BizUply" />
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("common.closeMenu")}
            className="site-mobile__close"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="site-mobile__nav">
          {groups.map((group) => {
            if (!group.links) {
              const active = location.pathname === group.to;
              return (
                <Link
                  key={group.id}
                  to={group.to}
                  onClick={onClose}
                  className={`site-mobile__link${active ? " is-active" : ""}`}
                >
                  {group.label}
                </Link>
              );
            }
            return (
              <details key={group.id} className="site-mobile__group">
                <summary>{group.label}</summary>
                {group.links.map(([to, label]) => (
                  <Link key={to} to={to} onClick={onClose} className="site-mobile__sub">
                    {label}
                  </Link>
                ))}
              </details>
            );
          })}
        </nav>

        <div className="site-mobile__footer">
          {!user ? (
            <>
              <Link to="/pricing" onClick={onClose} className="site-mobile__cta">
                {t("nav.cta")}
              </Link>
              <Link to="/login" onClick={onClose} className="site-mobile__cta site-mobile__cta--ghost">
                {t("common.login")}
              </Link>
            </>
          ) : (
            <>
              <Link to={accountPath} onClick={onClose} className="site-mobile__cta">
                {t("common.myAccount")}
              </Link>
              <button
                type="button"
                onClick={() => {
                  onLogout?.();
                  onClose();
                }}
                className="site-mobile__cta site-mobile__cta--danger"
              >
                {t("common.logout")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
