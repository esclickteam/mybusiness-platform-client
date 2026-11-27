import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import MobileMenu from "./MobileMenu";
import LanguageSwitcher from "./LanguageSwitcher";
import SiteNavIcon from "./SiteNavIcon";
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
  const [surface, setSurface] = useState<"paper" | "ink" | "pink" | "yellow" | "navy">(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("bizuply-home")
      ? "ink"
      : "paper",
  );
  const [navPath, setNavPath] = useState(location.pathname);
  if (navPath !== location.pathname) {
    setNavPath(location.pathname);
    setOpenGroup(null);
    setMenuOpen(false);
  }
  const closeTimer = useRef<number | null>(null);
  const hoverNav = useRef(false);
  const surfaceRef = useRef(surface);
  surfaceRef.current = surface;
  const groups = marketingNav(normalizeMarketingLocale(i18n.language));

  const headerDir = getTextDirection(i18n.language);
  const accountPath =
    user?.role === "partner"
      ? "/partner/dashboard"
      : user?.role === "compliance_customer"
        ? "/compliance/account"
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
    if (!openGroup) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenGroup(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openGroup]);

  useEffect(() => {
    hoverNav.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  const holdGroup = (id: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpenGroup(id);
  };

  const releaseGroup = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenGroup(null), 180);
  };

  useEffect(() => {
    const read = () => {
      const area = document.querySelector(".app-scroll-area");
      const nested = area instanceof HTMLElement ? area.scrollTop : 0;
      setScrolled((window.scrollY || nested) > 4);
      const header = document.querySelector(".site-header");
      if (!(header instanceof HTMLElement) || typeof document.elementFromPoint !== "function") return;
      const y = Math.min(window.innerHeight - 2, header.getBoundingClientRect().bottom + 2);
      const x = Math.min(window.innerWidth - 2, Math.max(8, window.innerWidth * 0.5));
      const hit = document.elementFromPoint(x, y);
      const zone = hit instanceof Element ? hit.closest("[data-bz-tone]") : null;
      const tone = zone?.getAttribute("data-bz-tone");
      const next =
        tone === "ink" || tone === "pink" || tone === "yellow" || tone === "navy" || tone === "paper"
          ? tone
          : document.querySelector(".hx-hero")?.getBoundingClientRect().bottom > y
            ? "ink"
            : "paper";
      if (next !== surfaceRef.current) setSurface(next);
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    const area = document.querySelector(".app-scroll-area");
    area?.addEventListener("scroll", read, { passive: true });
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
      area?.removeEventListener("scroll", read);
    };
  }, [location.pathname]);

  if (isDashboard) return null;

  return (
    <>
      <header
        className={`site-header${scrolled ? " is-scrolled" : ""}${surface === "ink" || surface === "navy" ? " is-on-dark" : ""}`}
        data-tone={surface}
        dir={headerDir}
      >
        <nav className="site-header__bar" aria-label={t("nav.mainAria", { defaultValue: "Main navigation" })}>
          <Link to="/" className="site-header__logo" aria-label={i18n.language === "he" ? "ביזאפלי (Bizuply)" : "Bizuply"}>
            <img className="site-header__logo-img site-header__logo-img--light" src="/brand/logo.png" alt="" width="1534" height="540" decoding="async" />
          </Link>

          <div className="site-header__nav">
            {groups.map((group) => {
              if (!group.columns) {
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
                  onMouseEnter={() => {
                    if (hoverNav.current) holdGroup(group.id);
                  }}
                  onMouseLeave={() => {
                    if (hoverNav.current) releaseGroup();
                  }}
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
                    aria-controls={`site-nav-${group.id}`}
                    aria-haspopup="true"
                    onClick={() => {
                      if (closeTimer.current) window.clearTimeout(closeTimer.current);
                      setOpenGroup(open ? null : group.id);
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== "ArrowDown") return;
                      event.preventDefault();
                      holdGroup(group.id);
                      const menuId = group.id;
                      window.setTimeout(() => {
                        const link = document.getElementById(`site-nav-${menuId}`)?.querySelector("a");
                        if (link instanceof HTMLAnchorElement) link.focus();
                      }, 0);
                    }}
                  >
                    {group.label}
                    <svg className="site-nav__chevron" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  <div
                    id={`site-nav-${group.id}`}
                    className="site-nav__panel site-nav__mega"
                    data-cols={Math.max(group.columns.length, ...group.columns.map((column) => column.layout || 1))}
                    hidden={!open}
                    role="region"
                    aria-label={group.label}
                  >
                    <div
                      className="site-nav__sheet"
                      style={{ gridTemplateColumns: `repeat(${group.columns.length}, minmax(0, 1fr))` }}
                    >
                      {group.columns.map((column) => (
                        <div
                          key={column.id}
                          className="site-nav__col"
                          style={column.layout > 1 ? { gridTemplateColumns: `repeat(${column.layout}, minmax(0, 1fr))` } : undefined}
                        >
                          <p className="site-nav__kicker">{column.title}</p>
                          {column.links.map((link) => (
                            <Link key={link.to} to={link.to} onClick={() => setOpenGroup(null)}>
                              <SiteNavIcon name={link.icon} />
                              <span>
                                <strong>{link.label}</strong>
                                {link.blurb ? <small>{link.blurb}</small> : null}
                              </span>
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
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
                  <Link to="/register" className="site-header__cta">
                    <span>{t("nav.cta")}</span>
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
                onClick={() => setMenuOpen((open) => !open)}
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
