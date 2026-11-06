import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getTextDirection } from "../../i18n/localeUtils";
import { readTrackingChoice, writeTrackingChoice } from "../../lib/trackingConsent";

declare global {
  interface Window {
    __BIZUPLY_PUBLIC_SITE__?: boolean;
  }
}

export default function PlatformConsentBanner() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (window.__BIZUPLY_PUBLIC_SITE__) return;
    setOpen(readTrackingChoice() === "unknown");
  }, []);

  if (!open) return null;

  function choose(choice: "essential" | "all") {
    writeTrackingChoice(choice);
    setOpen(false);
  }

  return (
    <div
      className="fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-none sm:inset-x-6"
      dir={getTextDirection(i18n.language)}
      role="dialog"
      aria-labelledby="tracking-consent-title"
    >
      <h2 id="tracking-consent-title" className="text-base font-black">
        {t("trackingConsent.title")}
      </h2>
      <p className="mt-2 text-sm font-medium leading-6 text-slate-700">
        {t("trackingConsent.body")}{" "}
        <Link className="font-bold underline" to="/privacy">
          {t("trackingConsent.policy")}
        </Link>
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold"
          onClick={() => choose("essential")}
        >
          {t("trackingConsent.essential")}
        </button>
        <button
          type="button"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white"
          onClick={() => choose("all")}
        >
          {t("trackingConsent.all")}
        </button>
      </div>
    </div>
  );
}
