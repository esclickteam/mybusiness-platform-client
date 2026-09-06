import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/localeUtils";

/**
 * Shown instead of a blocked module for plan-limited accounts
 * (e.g. "website only" buyers trying to open CRM / automations / AI).
 */
export default function UpgradeRequired({ businessId }) {
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);

  return (
    <div
      dir={pageDir}
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: "100%",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 8px 30px rgba(31, 41, 55, 0.08)",
          padding: "40px 32px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 44, marginBottom: 12 }} aria-hidden="true">
          &#128274;
        </div>
        <h2 style={{ margin: "0 0 12px", fontSize: 24, color: "#111827" }}>
          {t("billing.upgrade.title")}
        </h2>
        <p style={{ margin: "0 0 24px", color: "#4b5563", lineHeight: 1.8, whiteSpace: "pre-line" }}>
          {t("billing.upgrade.text")}
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/pricing"
            style={{
              background: "#6c63ff",
              color: "#fff",
              padding: "12px 28px",
              borderRadius: 10,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            {t("billing.upgrade.upgradeCta")}
          </Link>
          {businessId ? (
            <Link
              to={`/business/${businessId}/dashboard/website`}
              style={{
                background: "#f3f4f6",
                color: "#111827",
                padding: "12px 28px",
                borderRadius: 10,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              {t("billing.upgrade.backToWebsite")}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
