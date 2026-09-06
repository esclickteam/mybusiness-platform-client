import React from "react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/localeUtils";

const AppErrorFallback = ({ resetErrorBoundary }) => {
  const { t, i18n } = useTranslation();
  return (
    <div
      dir={getTextDirection(i18n.language)}
      style={{
        padding: "2rem",
        textAlign: "center",
        color: "#0f172a",
        background: "#f8fafc",
        borderRadius: "12px",
        margin: "4rem auto",
        maxWidth: "600px",
        boxShadow: "0 0 10px rgba(0,0,0,0.08)",
        fontFamily: "sans-serif"
      }}
    >
      <h2>{t("leftover.appError.title")}</h2>
      <p>{t("leftover.appError.body")}</p>
      <button
        onClick={resetErrorBoundary}
        style={{
          marginTop: "2rem",
          padding: "0.75rem 1.5rem",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontSize: "1rem",
          cursor: "pointer"
        }}
      >
        {t("leftover.appError.refresh")}
      </button>
    </div>
  );
};

export default AppErrorFallback;
