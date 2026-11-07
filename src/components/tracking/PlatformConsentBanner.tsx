import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getTextDirection } from "../../i18n/localeUtils";
import { readTrackingChoice, writeTrackingChoice } from "../../lib/trackingConsent";

declare global {
  interface Window {
    __BIZUPLY_PUBLIC_SITE__?: boolean;
    __bizuplyCookieManage?: boolean;
    __bizuplyCookieMarketing?: boolean;
  }
}

export default function PlatformConsentBanner() {
  const { t, i18n } = useTranslation();
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(
    () => !window.__BIZUPLY_PUBLIC_SITE__ && readTrackingChoice() === "unknown",
  );
  const [view, setView] = useState<"summary" | "preferences">("summary");
  const [marketing, setMarketing] = useState(() => readTrackingChoice() === "all");

  useLayoutEffect(() => {
    if (window.__bizuplyCookieManage) {
      window.__bizuplyCookieManage = false;
      setMarketing(
        typeof window.__bizuplyCookieMarketing === "boolean"
          ? window.__bizuplyCookieMarketing
          : readTrackingChoice() === "all",
      );
      setView("preferences");
      setOpen(true);
    }
    document.getElementById("bizuply-cookie-paint")?.remove();
  }, []);

  useEffect(() => {
    const reopen = () => {
      setMarketing(readTrackingChoice() === "all");
      setView("summary");
      setOpen(true);
    };
    window.addEventListener("bizuply-open-cookie-settings", reopen);
    return () => window.removeEventListener("bizuply-open-cookie-settings", reopen);
  }, []);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open, view]);

  if (!open || window.__BIZUPLY_PUBLIC_SITE__) return null;

  function choose(choice: "essential" | "all") {
    writeTrackingChoice(choice);
    setOpen(false);
  }

  const dir = getTextDirection(i18n.language);

  return (
    <div
      ref={panelRef}
      className="cookie-banner"
      dir={dir}
      role="dialog"
      aria-labelledby="tracking-consent-title"
      tabIndex={-1}
    >
      <h2 id="tracking-consent-title">
        {view === "summary" ? t("trackingConsent.title") : t("trackingConsent.preferencesTitle")}
      </h2>
      {view === "summary" ? (
        <>
          <p>{t("trackingConsent.essentialBody")}</p>
          <p>{t("trackingConsent.measurementBody")}</p>
          <p>
            {t("trackingConsent.change")} {t("trackingConsent.more")}
            <Link to="/privacy">{t("trackingConsent.policy")}</Link>
            {t("trackingConsent.join")}
            <Link to="/privacy#section-8">{t("trackingConsent.cookiePolicy")}</Link>
            {t("trackingConsent.termsJoin")}
            <Link to="/terms">{t("trackingConsent.terms")}</Link>
          </p>
          <div className="cookie-banner__actions">
            <button type="button" className="cookie-banner__primary" onClick={() => choose("all")}>
              {t("trackingConsent.all")}
            </button>
            <button type="button" className="cookie-banner__secondary" onClick={() => choose("essential")}>
              {t("trackingConsent.essential")}
            </button>
            <button type="button" className="cookie-banner__secondary" onClick={() => setView("preferences")}>
              {t("trackingConsent.manage")}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="cookie-banner__row">
            <div>
              <h3>{t("trackingConsent.essentialTitle")}</h3>
              <p>{t("trackingConsent.essentialDetail")}</p>
            </div>
            <button type="button" className="cookie-banner__switch" role="switch" aria-checked="true" disabled>
              {t("trackingConsent.alwaysOn")}
            </button>
          </div>
          <div className="cookie-banner__row">
            <div>
              <h3>{t("trackingConsent.marketingTitle")}</h3>
              <p>{t("trackingConsent.marketingDetail")}</p>
            </div>
            <button
              type="button"
              className="cookie-banner__switch"
              role="switch"
              aria-checked={marketing}
              onClick={() => setMarketing((value) => !value)}
            >
              {marketing ? t("trackingConsent.on") : t("trackingConsent.off")}
            </button>
          </div>
          <div className="cookie-banner__actions">
            <button type="button" className="cookie-banner__primary" onClick={() => choose(marketing ? "all" : "essential")}>
              {t("trackingConsent.save")}
            </button>
            <button type="button" className="cookie-banner__secondary" onClick={() => setView("summary")}>
              {t("trackingConsent.back")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
