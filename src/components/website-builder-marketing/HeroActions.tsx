import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type Props = {
  primaryTo?: string;
};

export default function HeroActions({ primaryTo = "/pricing" }: Props) {
  const { t } = useTranslation();

  return (
    <div className="wb-hero__actions">
      <Link to={primaryTo} className="wb-hero__btn wb-hero__btn--primary">
        {t("websitePage.heroActions.signUp")}
      </Link>
    </div>
  );
}
