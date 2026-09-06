// src/pages/BusinessPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import Profile from "./business/dashboardPages/Profile";

export default function BusinessPage() {
  const { t } = useTranslation();
  const { businessId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isOwner =
    user?.role === "business" && user.businessId === businessId;

  return (
    <div className="business-page-container">
      {/* כפתור עריכת פרופיל - רק לבעל העסק */}
      {isOwner && (
        <div style={{ textAlign: "center", margin: "2rem 0" }}>
          <button
            onClick={() => navigate(`/business/${businessId}/build`)}
            style={{
              padding: "10px 20px",
              background: "#7c4dff",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            ✏️ {t("leftover.profile.editProfile")}
          </button>
        </div>
      )}

      {/* public profile now renders the same Profile component used in the dashboard */}
      <Profile />
    </div>
  );
}
