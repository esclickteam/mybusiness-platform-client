import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/localeUtils";
import "../pages/accountDesign.css";

/**
 * Shown instead of a blocked module for plan-limited accounts
 * (e.g. "website only" buyers trying to open CRM / automations / AI).
 */
export default function UpgradeRequired({ businessId, variant = "default" }) {
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);
  const location = useLocation();
  const onWebsiteHub = String(location.pathname || "").includes("/dashboard/website");
  const backTo = businessId
    ? onWebsiteHub
      ? `/business/${businessId}/dashboard/dashboard`
      : `/business/${businessId}/dashboard/website`
    : "/";

  return (
    <div dir={pageDir} className="acct-upgrade">
      <div className="acct-upgrade-card">
        <div className="acct-upgrade-mark" aria-hidden="true">
          +
        </div>
        <h2>
          {variant === "website"
            ? t("billing.upgrade.websiteTitle")
            : t("billing.upgrade.title")}
        </h2>
        <p>
          {variant === "website"
            ? t("billing.upgrade.websiteText")
            : t("billing.upgrade.text")}
        </p>
        <div className="acct-upgrade-actions">
          <Link className="acct-upgrade-primary" to="/pricing">
            {t("billing.upgrade.upgradeCta")}
          </Link>
          {businessId ? (
            <Link className="acct-upgrade-secondary" to={backTo}>
              {onWebsiteHub
                ? t("billing.upgrade.backToDashboard")
                : t("billing.upgrade.backToWebsite")}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
