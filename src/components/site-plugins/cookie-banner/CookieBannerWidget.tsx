import React, { useEffect, useState } from "react";

import {
  cookieConsentKey,
  mergeCookieBannerSettings,
  type CookieBannerSettings,
} from "./cookieBannerUtils";

type CookieBannerWidgetProps = {
  siteKey?: string;
  settings?: Partial<CookieBannerSettings> | null;
  mode?: "live" | "editor";
};

export default function CookieBannerWidget({
  siteKey = "site",
  settings,
  mode = "live",
}: CookieBannerWidgetProps) {
  const cfg = mergeCookieBannerSettings(settings);
  const [hidden, setHidden] = useState(mode !== "editor");

  useEffect(() => {
    if (mode === "editor") {
      setHidden(false);
      return;
    }
    try {
      setHidden(Boolean(localStorage.getItem(cookieConsentKey(siteKey))));
    } catch {
      setHidden(false);
    }
  }, [mode, siteKey]);

  if (cfg.isActive === false || hidden) return null;

  const message = String(cfg.message || "").trim();
  if (!message) return null;

  function choose(value: "accepted" | "declined") {
    setHidden(true);
    if (mode === "live") {
      try {
        localStorage.setItem(cookieConsentKey(siteKey), value);
      } catch {
        // ignore
      }
    }
  }

  const positionStyle =
    cfg.position === "top"
      ? { top: 16, bottom: "auto" as const }
      : { bottom: 16, top: "auto" as const };

  return (
    <div
      dir="rtl"
      data-bizuply-widget="cookie-banner"
      className="fixed inset-x-0 z-[2147483100] px-3 sm:px-4"
      style={positionStyle}
    >
      <div
        className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl px-4 py-3 shadow-xl sm:flex-row sm:items-center sm:justify-between"
        style={{
          background: cfg.backgroundColor || "#0F172A",
          color: cfg.textColor || "#FFFFFF",
        }}
      >
        <p className="m-0 text-sm leading-relaxed">
          {message}{" "}
          {cfg.policyUrl ? (
            <a
              href={cfg.policyUrl}
              className="underline underline-offset-2 opacity-90 hover:opacity-100"
              style={{ color: "inherit" }}
            >
              {cfg.policyLabel || "מדיניות פרטיות"}
            </a>
          ) : null}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => choose("declined")}
            className="rounded-lg border border-white/25 px-3 py-2 text-xs font-semibold transition hover:bg-white/10"
          >
            {cfg.declineLabel || "דחייה"}
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="rounded-lg px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90"
            style={{ background: cfg.accentColor || "#0F766E" }}
          >
            {cfg.acceptLabel || "אני מסכים/ה"}
          </button>
        </div>
      </div>
    </div>
  );
}
