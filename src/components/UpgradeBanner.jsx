import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/localeUtils";

export default function UpgradeBanner() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  return (
    <div
      dir={getTextDirection(i18n.language)}
      className="mt-6 p-4 bg-yellow-100 border border-yellow-500 rounded text-center"
    >
      <p>{t("leftover.upgradeBanner.text")}</p>
      <button
        type="button"
        onClick={() => navigate("/pricing")}
        className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded"
      >
        {t("leftover.upgradeBanner.cta")}
      </button>
    </div>
  );
}
