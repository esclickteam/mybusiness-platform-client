import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteNavIcon from "./SiteNavIcon";
import LanguageSwitcher from "./LanguageSwitcher";
import { getTextDirection, normalizeLanguage } from "../i18n/localeUtils";
import { privacyFacts } from "./privacy/PrivacyFacts";
import { normalizeMarketingLocale, splitMarketingLocale } from "../lib/localePathCore.mjs";
import { marketingNav } from "../lib/marketingNav.mjs";
import { businessNoAccessPath } from "../utils/whatsappApiPortal";
import "./MobileMenu.css";

function Chevron({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function pathOf(pathname) {
  return splitMarketingLocale(pathname).path || "/";
}

export default function MobileMenu({ open, onClose, user, onLogout }) {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const menuDir = getTextDirection(normalizeLanguage(i18n.language));
  const accountPath =
    user?.role === "business" && !user?.hasAccess ? businessNoAccessPath(user) : "/dashboard";
  const groups = marketingNav(normalizeMarketingLocale(i18n.language));
  const here = pathOf(location.pathname);
  const logoAlt = i18n.language === "he" ? "ביזאפלי (BizUply)" : "BizUply";

  const [screen, setScreen] = useState(null);
  const [held, setHeld] = useState(null);
  const [seenOpen, setSeenOpen] = useState(open);
  if (open !== seenOpen) {
    setSeenOpen(open);
    if (!open) setScreen(null);
  }
  if (screen && screen !== held) setHeld(screen);

  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const backRef = useRef(null);
  const entered = useRef(false);

  const shown = groups.find((group) => group.id === (screen || held));

  useEffect(() => {
    if (!open) return undefined;
    const y = window.scrollY;
    const prev = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };
    const root = document.getElementById("root");
    const rootWasInert = root?.hasAttribute("inert");
    if (root && !rootWasInert) root.setAttribute("inert", "");
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.width = "100%";

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const nodes = [...panelRef.current.querySelectorAll("a[href], button:not([disabled])")].filter(
        (node) => !node.closest("[inert]"),
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev.overflow;
      document.body.style.position = prev.position;
      document.body.style.top = prev.top;
      document.body.style.width = prev.width;
      if (root && !rootWasInert) root.removeAttribute("inert");
      window.scrollTo(0, y);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  useLayoutEffect(() => {
    if (!open) {
      entered.current = false;
      return;
    }
    if (screen) {
      backRef.current?.focus({ preventScroll: true });
      return;
    }
    if (!entered.current) {
      entered.current = true;
      closeRef.current?.focus({ preventScroll: true });
      return;
    }
    if (held) document.getElementById(`site-mobile-${held}`)?.focus({ preventScroll: true });
  }, [open, screen, held]);

  if (!open) return null;

  const childActive = (group) =>
    Boolean(group.columns?.some((column) => column.links.some((link) => pathOf(link.to) === here)));

  return createPortal(
    <div className="site-mobile" role="dialog" aria-modal="true" dir={menuDir} aria-labelledby={screen ? "site-mobile-title" : undefined} aria-label={screen ? undefined : t("nav.mainAria", { defaultValue: "Main navigation" })}>
      <div className="site-mobile__panel" ref={panelRef}>
        <div className="site-mobile__top">
          {screen ? (
            <button ref={backRef} type="button" className="site-mobile__back" aria-label={t("common.back")} onClick={() => setScreen(null)}>
              <Chevron />
            </button>
          ) : (
            <Link to="/" onClick={onClose} className="site-mobile__brand" aria-label={logoAlt}>
              <img src="/brand/logo.png" alt="" width="1166" height="398" />
            </Link>
          )}
          {screen ? (
            <h2 id="site-mobile-title" className="site-mobile__title">{shown?.label}</h2>
          ) : (
            <div className="site-mobile__lang">
              <LanguageSwitcher />
            </div>
          )}
          <button ref={closeRef} type="button" className="site-mobile__close" aria-label={t("common.closeMenu")} onClick={onClose}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className={`site-mobile__stage${screen ? " is-sub" : ""}`}>
          <nav className="site-mobile__pane site-mobile__pane--root" aria-label={t("nav.mainAria", { defaultValue: "Main navigation" })} inert={screen ? true : undefined}>
            {groups.map((group) => {
              if (!group.columns) {
                const active = pathOf(group.to) === here;
                return (
                  <Link key={group.id} to={group.to} onClick={onClose} className={`site-mobile__row${active ? " is-active" : ""}`} aria-current={active ? "page" : undefined}>
                    {group.label}
                  </Link>
                );
              }
              const active = childActive(group);
              return (
                <button
                  key={group.id}
                  id={`site-mobile-${group.id}`}
                  type="button"
                  className={`site-mobile__row${active ? " is-active" : ""}`}
                  onClick={() => setScreen(group.id)}
                >
                  {group.label}
                  <Chevron className="site-mobile__chevron" />
                </button>
              );
            })}
          </nav>

          <div className="site-mobile__pane site-mobile__pane--sub" inert={screen ? undefined : true}>
            {shown?.columns?.map((column) => {
              const showKicker = shown.columns.length > 1 || column.title !== shown.label;
              return (
                <section key={column.id} className="site-mobile__section">
                  {showKicker ? <h3 className="site-mobile__kicker">{column.title}</h3> : null}
                  {column.links.map((link) => {
                    const active = pathOf(link.to) === here;
                    return (
                      <Link key={link.to} to={link.to} onClick={onClose} className={`site-mobile__sub${active ? " is-active" : ""}`} aria-current={active ? "page" : undefined}>
                        <SiteNavIcon name={link.icon} />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </section>
              );
            })}
          </div>
        </div>

        <div className="site-mobile__footer">
          {!user ? (
            <>
              <Link to="/pricing" onClick={onClose} className="site-mobile__cta">
                {t("nav.cta")}
              </Link>
              <Link to="/login" onClick={onClose} className="site-mobile__login">
                {t("common.login")}
              </Link>
            </>
          ) : (
            <>
              <Link to={accountPath} onClick={onClose} className="site-mobile__cta">
                {t("common.myAccount")}
              </Link>
              <Link to="/privacy#privacy-request" onClick={onClose} className="site-mobile__login">
                {privacyFacts(i18n.language).link}
              </Link>
              <button
                type="button"
                onClick={() => {
                  onLogout?.();
                  onClose();
                }}
                className="site-mobile__login site-mobile__login--danger"
              >
                {t("common.logout")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
