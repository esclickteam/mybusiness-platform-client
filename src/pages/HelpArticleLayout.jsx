import React from "react";
import { useTranslation } from "react-i18next";
import { useLocaleDir } from "../hooks/useLocaleDir";
import "./HelpArticleLayout.css";

export default function HelpArticleLayout({ children }) {
  const { i18n } = useTranslation();
  const dir = useLocaleDir();
  const lang = (i18n.language || "en").split("-")[0];

  return (
    <div className="guide-article-page" dir={dir} lang={lang}>
      <div className="guide-article-container">{children}</div>
    </div>
  );
}
