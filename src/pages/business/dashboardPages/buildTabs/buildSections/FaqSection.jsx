// src/pages/business/dashboardPages/buildTabs/buildSections/FaqSection.jsx
"use client";

import React, { useState, useEffect } from "react";
import API from "@api";
import FaqTab from "../FaqTab";

export default function FaqSection({ currentUser, renderTopBar }) {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    API.get("/business/my/faqs")
      .then(res => setFaqs(res.data))
      .catch(err => console.error("❌ שגיאה בטעינת שאלות:", err));
  }, []);

  return (
    <>
      <div className="form-column">
        <FaqTab
          faqs={faqs}
          setFaqs={setFaqs}
          currentUser={currentUser}
          isPreview={false}
        />
      </div>
      <div className="preview-column">
        {renderTopBar()}
        <FaqTab
          faqs={faqs}
          setFaqs={setFaqs}
          currentUser={currentUser}
          isPreview={true}
        />
      </div>
    </>
  );
}
