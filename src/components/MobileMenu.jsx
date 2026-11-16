import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteNavIcon from "./SiteNavIcon";
import { getTextDirection, normalizeLanguage } from "../i18n/localeUtils";
import { privacyFacts } from "./privacy/PrivacyFacts";
import { normalizeMarketingLocale } from "../lib/localePathCore.mjs";
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
  const [openGroup, setOpenGroup] = useState(null);

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
        <nav className="site-mobile__nav" aria-label={t("nav.mainAria", { defaultValue: "Main navigation" })}>
          {groups.map((group) => {
            if (!group.columns) {
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
            const expanded = openGroup === group.id;
            return (
              <div key={group.id} className={`site-mobile__group${expanded ? " is-open" : ""}`}>
                <button
                  type="button"
                  className="site-mobile__summary"
                  aria-expanded={expanded}
                  onClick={() => setOpenGroup(expanded ? null : group.id)}
                >
                  {group.label}
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {expanded ? (
                  <div className="site-mobile__subs">
                    {group.columns.map((column) => (
                      <div key={column.id}>
                        <p className="site-mobile__kicker">{column.title}</p>
                        {column.links.map((link) => (
                          <Link key={link.to} to={link.to} onClick={onClose} className="site-mobile__sub">
                            <SiteNavIcon name={link.icon} />
                            <span>
                              {link.label}
                              {link.blurb ? <small>{link.blurb}</small> : null}
                            </span>
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
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
              <Link to="/privacy#privacy-request" onClick={onClose} className="site-mobile__cta site-mobile__cta--ghost">
                {privacyFacts(i18n.language).link}
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
