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
        // Support for both a response of the type { faqs: [...] } and a direct array
        const faqsArr =
          Array.isArray(res.data)
            ? res.data
            : (Array.isArray(res.data.faqs) ? res.data.faqs : []);
        setFaqs(faqsArr);
      })
      .catch(err => console.error("❌ Error loading questions:", err));
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
          setFaqs={() => {}} // In preview mode, there's no need to change state
          isPreview={true}
          currentUser={currentUser}
        />
      </div>
    </>
  );
}