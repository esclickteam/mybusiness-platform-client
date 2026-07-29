import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import logo from "../images/logo_final.svg";
import "./MobileMenu.css";

export default function MobileMenu({ open, onClose, user, onLogout }) {
  const location = useLocation();
  const { t } = useTranslation();

  const navLinks = [
    { to: "/about", label: t("nav.about") },
    { to: "/website-builder", label: t("nav.website") },
    { to: "/crm", label: t("nav.crm") },
    { to: "/automations", label: t("nav.automations") },
    { to: "/agents", label: t("nav.agents") },
    { to: "/collaborations", label: t("nav.collaborations") },
    { to: "/pricing", label: t("nav.pricing") },
  ];

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
    <div className="site-mobile" role="dialog" aria-modal="true" dir="rtl">
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
          {navLinks.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`site-mobile__link${active ? " is-active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="site-mobile__footer">
          {!user ? (
            <>
              <Link to="/login" onClick={onClose} className="site-mobile__cta">
                {t("common.login")}
              </Link>
              <Link to="/pricing" onClick={onClose} className="site-mobile__cta site-mobile__cta--ghost">
                {t("nav.pricing")}
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" onClick={onClose} className="site-mobile__cta">
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
