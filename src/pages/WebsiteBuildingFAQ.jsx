import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./faq.css";
import HelpArticleLayout from "./HelpArticleLayout";

const FAQ_KEYS = [
  "createSite",
  "templateVsAi",
  "editSite",
  "publish",
  "seo",
  "manageMultiple",
  "notSaving",
  "notLoading",
  "editAfterPublish",
  "share",
];

export default function WebsiteBuildingFAQ() {
  const { t } = useTranslation();
  const f = "helpFaqs.websiteBuilding";
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <HelpArticleLayout>
      <h1 className="faq-title">{t(`${f}.title`)}</h1>
      <p className="faq-subtitle">{t(`${f}.subtitle`)}</p>

      <div className="faq-list">
        {FAQ_KEYS.map((key, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div key={key} className={`faq-item${isOpen ? " open" : ""}`}>
              <button
                className="faq-question"
                onClick={() => toggleIndex(idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${idx}`}
                id={`faq-question-${idx}`}
              >
                <span>{t(`${f}.items.${key}.question`)}</span>
                <span
                  className={`faq-plus ${isOpen ? "open" : ""}`}
                  aria-hidden
                >
                  +
                </span>
              </button>

              {isOpen && (
                <div
                  id={`faq-answer-${idx}`}
                  role="region"
                  aria-labelledby={`faq-question-${idx}`}
                  className="faq-answer"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {t(`${f}.items.${key}.answer`)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </HelpArticleLayout>
  );
}
