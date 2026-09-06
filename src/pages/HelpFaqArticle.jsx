import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./faq.css";
import HelpArticleLayout from "./HelpArticleLayout";

export default function HelpFaqArticle({ ns, keys, titleKey = "title", subtitleKey }) {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <HelpArticleLayout>
      <h1 className="faq-title">{t(`${ns}.${titleKey}`)}</h1>
      {subtitleKey ? <p className="faq-subtitle">{t(`${ns}.${subtitleKey}`)}</p> : null}

      <div className="faq-list">
        {keys.map((key, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={key} className={`faq-item${isOpen ? " open" : ""}`}>
              <button
                className="faq-question"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${idx}`}
                id={`faq-question-${idx}`}
              >
                <span>{t(`${ns}.items.${key}.question`)}</span>
                <span className={`faq-plus ${isOpen ? "open" : ""}`} aria-hidden>
                  +
                </span>
              </button>
              {isOpen ? (
                <div
                  id={`faq-answer-${idx}`}
                  role="region"
                  aria-labelledby={`faq-question-${idx}`}
                  className="faq-answer"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {t(`${ns}.items.${key}.answer`)}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </HelpArticleLayout>
  );
}
