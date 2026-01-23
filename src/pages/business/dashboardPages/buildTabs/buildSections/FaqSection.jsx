"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import FaqTab from "../FaqTab";

export default function FaqSection({
  faqs,
  setFaqs,
  currentUser,
  renderTopBar,
}) {
  const navigate = useNavigate();
  const businessId = currentUser?._id;
  const hasFaqs = Array.isArray(faqs) && faqs.length > 0;

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

        {/* 👀 CTA – עכשיו זה יעבוד */}
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
