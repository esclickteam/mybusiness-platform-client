// src/pages/business/dashboardPages/FaqSection.jsx
import React, { useState, useEffect } from "react";
import API from "@api";
import FaqTab from "@components/FaqTab";

export default function FaqSection({ currentUser, renderTopBar }) {
  // 1. ה־state של השאלות
  const [faqs, setFaqs] = useState([]);

  // 2. מקבלים את השאלות מהשרת פעם אחת בטעינת הקומפוננטה
  useEffect(() => {
    API.get("/business/my/faqs")
      .then(res => {
        // נניח שהשרת מחזיר מערך של שאלות ב־res.data
        setFaqs(res.data);
      })
      .catch(err => {
        console.error("❌ שגיאה בטעינת שאלות:", err);
      });
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
