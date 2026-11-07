import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getTextDirection } from "../../i18n/localeUtils";
import { readConsent, writeAdvertisementConsent } from "../../lib/trackingConsent";

declare global {
  interface Window {
    __BIZUPLY_PUBLIC_SITE__?: boolean;
    __bizuplyCookieManage?: boolean;
    __bizuplyCookieMarketing?: boolean;
  }
}

type Row = { name: string; provider: string; purpose: string; duration: string };

function Category({
  id,
  title,
  detail,
  control,
  rows,
  headers,
  empty,
}: {
  id: string;
  title: string;
  detail: string;
  control: ReactNode;
  rows?: Row[];
  headers?: Row;
  empty?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <section className="cookie-banner__cat">
      <div className="cookie-banner__row">
        <h3>
          <button
            type="button"
            className="cookie-banner__disclose"
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="cookie-banner__chevron" aria-hidden="true" />
            {title}
          </button>
        </h3>
        {control}
      </div>
      <p>{detail}</p>
      {open ? (
        <div className="cookie-banner__details" id={id}>
          {rows && rows.length ? (
            <table className="cookie-banner__table">
              <thead>
                <tr>
                  <th>{headers?.name}</th>
                  <th>{headers?.provider}</th>
                  <th>{headers?.purpose}</th>
                  <th>{headers?.duration}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td>{row.provider}</td>
                    <td>{row.purpose}</td>
                    <td>{row.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="cookie-banner__note">{empty}</p>
          )}
        </div>
      ) : null}
    </section>
  );
}

export default function PlatformConsentBanner() {
  const { t, i18n } = useTranslation();
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(
    () => !window.__BIZUPLY_PUBLIC_SITE__ && !readConsent().decided,
  );
  const [advertisement, setAdvertisement] = useState(() => readConsent().advertisement);
  const [saveFailed, setSaveFailed] = useState(false);

  useLayoutEffect(() => {
    if (window.__bizuplyCookieManage) {
      window.__bizuplyCookieManage = false;
      setAdvertisement(
        typeof window.__bizuplyCookieMarketing === "boolean"
          ? window.__bizuplyCookieMarketing
          : readConsent().advertisement,
      );
      setOpen(true);
    }
    document.getElementById("bizuply-cookie-paint")?.remove();
  }, []);

  useEffect(() => {
    const reopen = () => {
      setAdvertisement(readConsent().advertisement);
      setSaveFailed(false);
      setOpen(true);
    };
    window.addEventListener("bizuply-open-cookie-settings", reopen);
    return () => window.removeEventListener("bizuply-open-cookie-settings", reopen);
  }, []);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  if (!open || window.__BIZUPLY_PUBLIC_SITE__) return null;

  function persist(next: boolean) {
    const saved = writeAdvertisementConsent(next);
    if (!saved) {
      setSaveFailed(true);
      setOpen(true);
      return;
    }
    setAdvertisement(next);
    setSaveFailed(false);
    setOpen(false);
  }

  const text = (key: string) => t(`trackingConsent.${key}`);
  const headers: Row = {
    name: text("name"),
    provider: text("provider"),
    purpose: text("purpose"),
    duration: text("duration"),
  };
  const necessaryRows: Row[] = [
    { name: "bizuply_lang", provider: text("bizuply"), purpose: text("langPurpose"), duration: text("langDuration") },
    { name: "bizuply_tracking", provider: text("bizuply"), purpose: text("choicePurpose"), duration: text("choiceDuration") },
    { name: "bizuply_session", provider: text("bizuply"), purpose: text("sessionPurpose"), duration: text("sessionDuration") },
    { name: "refreshToken", provider: text("bizuply"), purpose: text("refreshPurpose"), duration: text("refreshDuration") },
  ];
  const advertisementRows: Row[] = [
    { name: "fbevents.js", provider: text("meta"), purpose: text("pixelPurpose"), duration: text("metaDuration") },
    { name: "_fbp", provider: text("meta"), purpose: text("fbpPurpose"), duration: text("metaDuration") },
    { name: "_fbc", provider: text("meta"), purpose: text("fbcPurpose"), duration: text("metaDuration") },
  ];

  return (
    <div
      ref={panelRef}
      className="cookie-banner"
      dir={getTextDirection(i18n.language)}
      role="dialog"
      aria-labelledby="tracking-consent-title"
      tabIndex={-1}
    >
      <div className="cookie-banner__scroll">
        <h2 id="tracking-consent-title">{text("title")}</h2>
        <p>{text("intro")}</p>
        <p>
          {text("change")} {text("more")}
          <Link to="/privacy">{text("policy")}</Link>
          {text("join")}
          <Link to="/privacy#section-8">{text("cookiePolicy")}</Link>
          {text("termsJoin")}
          <Link to="/terms">{text("terms")}</Link>
        </p>
        <Category
          id="cookie-necessary"
          title={text("necessaryTitle")}
          detail={text("necessaryDetail")}
          headers={headers}
          rows={necessaryRows}
          control={
            <button type="button" className="cookie-banner__switch" role="switch" aria-checked="true" disabled>
              {text("alwaysOn")}
            </button>
          }
        />
        <Category
          id="cookie-analytics"
          title={text("analyticsTitle")}
          detail={text("analyticsDetail")}
          empty={text("noneFound")}
          control={<span className="cookie-banner__unused">{text("unused")}</span>}
        />
        <Category
          id="cookie-advertisement"
          title={text("advertisementTitle")}
          detail={text("advertisementDetail")}
          headers={headers}
          rows={advertisementRows}
          control={
            <button
              type="button"
              className="cookie-banner__switch"
              role="switch"
              aria-checked={advertisement}
              onClick={() => {
                setAdvertisement((value) => !value);
                setSaveFailed(false);
              }}
            >
              {advertisement ? text("on") : text("off")}
            </button>
          }
        />
        <Category
          id="cookie-functionality"
          title={text("functionalityTitle")}
          detail={text("functionalityDetail")}
          empty={text("noneFound")}
          control={<span className="cookie-banner__unused">{text("unused")}</span>}
        />
        {saveFailed ? <p className="cookie-banner__error" role="alert">{text("saveFailed")}</p> : null}
      </div>
      <div className="cookie-banner__actions">
        <button type="button" className="cookie-banner__primary" onClick={() => persist(true)}>
          {text("acceptAll")}
        </button>
        <button type="button" className="cookie-banner__secondary" onClick={() => persist(false)}>
          {text("rejectAll")}
        </button>
        <button type="button" className="cookie-banner__secondary" onClick={() => persist(advertisement)}>
          {text("save")}
        </button>
      </div>
    </div>
  );
}
