import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import "../styles/Unsubscribe.css";
import { getTextDirection } from "../i18n/localeUtils";

/**
 * Legacy landing for ?status=&type= query redirects.
 * Primary flow now serves Hebrew HTML from GET /api/unsubscribe/:token.
 */
export default function Unsubscribe() {
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const status = params.get("status"); // success / invalid
  const type = params.get("type") || "onboarding";
  const typeLabel = t(`leftover.unsubscribe.${type}`, t("leftover.unsubscribe.mailing", "mailing list"));
  const homeUrl = "https://bizuply.com";

  const content = (() => {
    switch (status) {
      case "success":
        return (
          <div className="unsub-card fade" dir={pageDir} lang={i18n.language}>
            <h1>{t("leftover.unsubscribe.successTitle", "You were unsubscribed")}</h1>
            <p>
              {type === "onboarding"
                ? t(
                    "leftover.unsubscribe.successOnboarding",
                    "You were removed from Bizuply onboarding emails."
                  )
                : t("leftover.unsubscribe.successType", "You were removed from Bizuply {{type}}.", {
                    type: typeLabel,
                  })}
              <br />
              {t(
                "leftover.unsubscribe.successHint",
                "You can still receive important account, billing, and security messages."
              )}
            </p>
            <a className="unsub-home-btn" href={homeUrl}>
              {t("leftover.unsubscribe.home", "Back to Bizuply")}
            </a>
          </div>
        );

      case "invalid":
        return (
          <div className="unsub-card fade" dir={pageDir} lang={i18n.language}>
            <h1>{t("leftover.unsubscribe.invalidTitle", "Invalid link")}</h1>
            <p>
              {t(
                "leftover.unsubscribe.invalidBody",
                "The unsubscribe link is invalid or has expired."
              )}
            </p>
            <a className="unsub-home-btn" href={homeUrl}>
              {t("leftover.unsubscribe.home", "Back to Bizuply")}
            </a>
          </div>
        );

      default:
        return (
          <div className="unsub-card fade" dir={pageDir} lang={i18n.language}>
            <h1>{t("leftover.unsubscribe.badTitle", "Invalid request")}</h1>
            <p>
              {t("leftover.unsubscribe.badBody", "Parameters for unsubscribing are missing.")}
            </p>
            <a className="unsub-home-btn" href={homeUrl}>
              {t("leftover.unsubscribe.home", "Back to Bizuply")}
            </a>
          </div>
        );
    }
  })();

  return (
    <div className="unsub-container" dir={pageDir} lang={i18n.language}>
      {content}
    </div>
  );
}
