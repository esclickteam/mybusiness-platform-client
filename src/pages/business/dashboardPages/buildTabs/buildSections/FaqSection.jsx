"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "@api";
import FaqTab from "../FaqTab";

export default function FaqSection({ currentUser, renderTopBar }) {
  const [faqs, setFaqs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/business/my/faqs")
      .then((res) => {
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
  const hasFaqs = faqs.length > 0;

  return (
    <>
      {/* =========================
         RIGHT – PREVIEW
      ========================= */}
      <div className="preview-column">
        {renderTopBar && renderTopBar()}
        <FaqTab faqs={faqs} isPreview />
      </div>

      {/* =========================
         LEFT – EDIT
      ========================= */}
      <div className="form-column">
        <FaqTab
          faqs={faqs}
          setFaqs={setFaqs}
          isPreview={false}
        />

        {/* ✅ CTA מחוץ ל־FaqTab */}
        {hasFaqs && businessId && (
          <button
            type="button"
            className="view-profile-btn"
            onClick={() =>
              navigate(`/business/${businessId}?tab=reviews`)
            }
          >
            👀 View Public Profile
          </button>
        )}
      </div>
    </>
  );
}
