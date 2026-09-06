import React from "react";
import { useTranslation } from "react-i18next";

const Upgrade = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h2>{t("leftover.upgrade.title", "Upgrade subscription")}</h2>
      {/* תוכן */}
    </div>
  );
};

export default Upgrade;
