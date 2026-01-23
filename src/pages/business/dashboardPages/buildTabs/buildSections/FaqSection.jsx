"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "@api";
import FaqTab from "../FaqTab";

export default function FaqSection({ currentUser, renderTopBar }) {
  const [faqs, setFaqs] = useState([]);
  const navigate = useNavigate();

  /* =========================
     Load FAQs
  ========================= */
  useEffect(() => {
    API.get("/business/my/faqs")
      .then((res) => {
        // Support both response types:
        // { faqs: [...] } OR direct array
        const faqsArr = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.faqs)
          ? res.data.faqs
          : [];

        setFaqs(faqsArr);
      })
      .catch((err) =>
        console.error("❌ Error loading FAQs:", err)
      );
  }, []);

  const businessId = currentUser?._id;

  return (
    <>
      {/* =========================
         LEFT – EDIT
      ========================= */}
      <div className="form-column">
        <FaqTab
          faqs={faqs}
          setFaqs={setFaqs}
          isPreview={false}
          navigate={navigate}
          businessId={businessId}
        />
      </div>

      {/* =========================
         RIGHT – PREVIEW
      ========================= */}
      <div className="preview-column">
        {renderTopBar && renderTopBar()}

        <FaqTab
          faqs={faqs}
          setFaqs={() => {}}
          isPreview={true}
          navigate={navigate}
          businessId={businessId}
        />
      </div>
    </>
  );
}
