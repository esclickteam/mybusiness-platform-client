import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocaleDir } from "../hooks/useLocaleDir";
import "./HelpArticleLayout.css";

export default function HelpArticleLayout({ children }) {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const dir = useLocaleDir();
  const lang = (i18n.language || "en").split("-")[0];
  const helpHome = pathname.replace(
    /\/dashboard\/(?:articles|faq)(?:\/.*)?$/,
    "/dashboard/help-center"
  );
  const showBack = helpHome !== pathname && helpHome.includes("/help-center");

  return (
    <div className="guide-article-page" dir={dir} lang={lang}>
      <div className="guide-article-container">
        {showBack ? (
          <nav className="guide-article-crumb" aria-label={t("helpCenter.title")}>
            <Link to={helpHome}>{t("helpCenter.backToTopics")}</Link>
          </nav>
        ) : null}
        {children}
      </div>
    </div>
  );
}
