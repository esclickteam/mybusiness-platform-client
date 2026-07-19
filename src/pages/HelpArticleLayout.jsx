import React from "react";
import "./HelpArticleLayout.css";

export default function HelpArticleLayout({ children }) {
  return (
    <div className="guide-article-page" dir="rtl" lang="he">
      <div className="guide-article-container">{children}</div>
    </div>
  );
}
