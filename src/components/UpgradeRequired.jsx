import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/localeUtils";
import "../pages/accountDesign.css";

/**
 * Shown instead of a blocked module for plan-limited accounts
 * (e.g. "website only" buyers trying to open CRM / automations / AI).
 */
export default function UpgradeRequired({ businessId }) {
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);

  return (
    <div dir={pageDir} className="acct-upgrade">
      <div className="acct-upgrade-card">
        <div className="acct-upgrade-mark" aria-hidden="true">
          +
        </div>
        <h2>{t("billing.upgrade.title")}</h2>
        <p>{t("billing.upgrade.text")}</p>
        <div className="acct-upgrade-actions">
          <Link className="acct-upgrade-primary" to="/pricing">
            {t("billing.upgrade.upgradeCta")}
          </Link>
          {businessId ? (
            <Link
              className="acct-upgrade-secondary"
              to={`/business/${businessId}/dashboard/website`}
            >
              {t("billing.upgrade.backToWebsite")}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
