import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import MobileMenu from "./MobileMenu";
import LanguageSwitcher from "./LanguageSwitcher";
import { getTextDirection } from "../i18n/localeUtils";
import { normalizeMarketingLocale } from "../lib/localePathCore.mjs";
import { marketingNav } from "../lib/marketingNav.mjs";
import { businessNoAccessPath } from "../utils/whatsappApiPortal";
import { PrivacyRequestLink } from "./privacy/PrivacyFacts";
import "../styles/SiteHeader.css";

type HeaderUser = {
  role?: string;
  hasAccess?: boolean;
} | null;

export default function HeaderView({
  user = null,
  onLogout,
}: {
  user?: HeaderUser;
  onLogout?: () => Promise<void> | void;
}) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
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
      await onLogout?.();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    setOpenGroup(null);
  }, [location.pathname]);

  useEffect(() => {
    const read = () => {
      const area = document.querySelector(".app-scroll-area");
      const nested = area instanceof HTMLElement ? area.scrollTop : 0;
      setScrolled((window.scrollY || nested) > 4);
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    const area = document.querySelector(".app-scroll-area");
    area?.addEventListener("scroll", read, { passive: true });
    return () => {
      window.removeEventListener("scroll", read);
      area?.removeEventListener("scroll", read);
    };
  }, []);

  if (isDashboard) return null;

  return (
    <>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`} dir={headerDir}>
        <nav className="site-header__bar" aria-label={t("nav.mainAria", { defaultValue: "Main navigation" })}>
          <Link to="/" className="site-header__logo" aria-label={i18n.language === "he" ? "ביזאפלי (BizUply)" : "BizUply"}>
            <img src="/logo-mark.svg" alt={i18n.language === "he" ? "ביזאפלי (BizUply)" : "BizUply"} width="176" height="52" fetchPriority="low" decoding="async" />
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
                  onBlur={(event) => {
                    const next = event.relatedTarget;
                    if (!(next instanceof Node) || !event.currentTarget.contains(next)) setOpenGroup(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key !== "Escape") return;
                    setOpenGroup(null);
                    event.currentTarget.querySelector("button")?.focus();
                  }}
                >
                  <button
                    type="button"
                    className="site-header__link site-nav__button"
                    aria-expanded={open}
                    aria-haspopup="true"
                    onClick={() => setOpenGroup(open ? null : group.id)}
                    onKeyDown={(event) => {
                      if (event.key !== "ArrowDown") return;
                      event.preventDefault();
                      setOpenGroup(group.id);
                      const panel = event.currentTarget.nextElementSibling;
                      requestAnimationFrame(() => {
                        const link = panel?.querySelector("a");
                        if (link instanceof HTMLAnchorElement) link.focus();
                      });
                    }}
                  >
                    {group.label}
                  </button>
                  <div
                    className={`site-nav__panel${group.id === "industries" ? " site-nav__mega" : ""}${group.links.length > 5 ? " is-wide" : ""}`}
                    hidden={!open}
                  >
                    {group.links.map(([to, label, blurb]) => (
                      <Link key={to} to={to} onClick={() => setOpenGroup(null)}>
                        {group.id === "industries" ? <IndustryMark path={to} /> : null}
                        <span>
                          <strong>{label}</strong>
                          {blurb ? <small>{blurb}</small> : null}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* One language control for mobile + desktop so the fixed portal menu
              always anchors to a visible trigger (duplicate instances broke placement). */}
          <div className="site-header__end">
            <LanguageSwitcher />

            <div className="site-header__actions">
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
                  <PrivacyRequestLink className="site-header__signin" />
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

function IndustryMark({ path }: { path: string }) {
  const paths: Record<string, string> = {
    "/solutions/clinics": "M8 4h8v4h4v12H4V8h4V4zm2 2v2h4V6h-4zm-4 6h12",
    "/solutions/beauty": "M12 3l1.6 4.2L18 9l-4.4 1.8L12 15l-1.6-4.2L6 9l4.4-1.8L12 3zM6 15l.8 2.2L9 18l-2.2.8L6 21l-.8-2.2L3 18l2.2-.8L6 15z",
    "/solutions/real-estate": "M4 20V9l8-5 8 5v11H4zm5-2h2v-4H9v4zm4 0h2v-6h-2v6z",
    "/solutions/restaurants": "M7 3v8a3 3 0 0 0 2 2.8V21h2v-7.2A3 3 0 0 0 13 11V3h-2v6H9V3H7zm10 0v8h2a3 3 0 0 1-3 3v7h-2V3h3z",
    "/solutions/service-businesses": "M14 6l4 4-8 8H6v-4l8-8zm1.5-1.5l2 2",
    "/solutions/agencies": "M4 16l8-10 8 10H4zm4.2-2h7.6L12 9.2 8.2 14zM4 18h16v2H4v-2z",
    "/solutions/lead-based": "M5 12h8m0 0l-3-3m3 3l-3 3M13 7h6v4h-6M13 13h6v4h-6",
  };
  return (
    <svg className="site-nav__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[path] || "M5 12h14"} />
    </svg>
  );
}
