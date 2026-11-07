import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getTextDirection } from "../../i18n/localeUtils";
import { readTrackingChoice, writeTrackingChoice } from "../../lib/trackingConsent";
import "./PlatformConsentBanner.css";

declare global {
  interface Window {
    __BIZUPLY_PUBLIC_SITE__?: boolean;
  }
}

export default function PlatformConsentBanner() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.__BIZUPLY_PUBLIC_SITE__) return;
    setOpen(readTrackingChoice() === "unknown");
    const reopen = () => setOpen(true);
    window.addEventListener("bizuply-open-cookie-settings", reopen);
    return () => window.removeEventListener("bizuply-open-cookie-settings", reopen);
  }, []);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  if (!open || window.__BIZUPLY_PUBLIC_SITE__) return null;

  function choose(choice: "essential" | "all") {
    writeTrackingChoice(choice);
    setOpen(false);
  }

  return (
    <div
      ref={panelRef}
      className="cookie-banner"
      dir={getTextDirection(i18n.language)}
      role="dialog"
      aria-labelledby="tracking-consent-title"
      tabIndex={-1}
    >
      <h2 id="tracking-consent-title">{t("trackingConsent.title")}</h2>
      <p>{t("trackingConsent.essentialBody")}</p>
      <p>{t("trackingConsent.measurementBody")}</p>
      <p>
        {t("trackingConsent.change")} {t("trackingConsent.more")}
        <Link to="/privacy">{t("trackingConsent.policy")}</Link>
        {t("trackingConsent.join")}
        <Link to="/privacy#section-8">{t("trackingConsent.cookiePolicy")}</Link>
      </p>
      <div className="cookie-banner__actions">
        <button type="button" className="cookie-banner__primary" onClick={() => choose("all")}>
          {t("trackingConsent.all")}
        </button>
        <button type="button" className="cookie-banner__secondary" onClick={() => choose("essential")}>
          {t("trackingConsent.essential")}
        </button>
      </div>
    </div>
  );
}
