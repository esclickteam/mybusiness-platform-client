// src/pages/business/dashboardPages/buildTabs/buildSections/FaqSection.jsx
"use client";

import React, { useState, useEffect } from "react";
import API from "@api";
import FaqTab from "../FaqTab";

export default function FaqSection({ currentUser, renderTopBar }) {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    API.get("/business/my/faqs")
      .then(res => {
        // תמיכה גם בתשובה מסוג { faqs: [...] } וגם מערך ישיר
        const faqsArr =
          Array.isArray(res.data)
            ? res.data
            : (Array.isArray(res.data.faqs) ? res.data.faqs : []);
        setFaqs(faqsArr);
      })
      .catch(err => console.error("❌ שגיאה בטעינת שאלות:", err));
  }, []);

  return (
    <>
      <div className="form-column">
        <FaqTab
          faqs={faqs}
          setFaqs={setFaqs}
          isPreview={false}
          currentUser={currentUser}
        />
      </div>
      <div className="preview-column">
        {renderTopBar && renderTopBar()}
        <FaqTab
          faqs={faqs}
          setFaqs={() => {}} // בפועל ב־preview לא צריך לשנות state
          isPreview={true}
          currentUser={currentUser}
        />
      </div>
    </>
  );
}
