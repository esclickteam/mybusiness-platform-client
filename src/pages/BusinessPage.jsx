// src/pages/BusinessPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import BusinessProfileView from "../components/shared/BusinessProfileView";
import checkFeatureAvailability from "../components/FeatureAvailability";
import { useAuth } from "../context/AuthContext";

export default function BusinessPage() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [business, setBusiness] = useState(null);
  const [userPlan, setUserPlan] = useState("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBusinessData() {
      try {
        const { data } = await API.get(`/business/${businessId}`);
        const b = data.business ?? data;

        // ערכי ברירת מחדל למניעת קריסה
        b.services     = Array.isArray(b.services)    ? b.services    : [];
        b.gallery      = Array.isArray(b.gallery)     ? b.gallery     : [];
        b.galleryFits  = b.galleryFits && typeof b.galleryFits === "object"
                            ? b.galleryFits
                            : {};
        b.story        = Array.isArray(b.story)       ? b.story       : [];
        b.reviews      = Array.isArray(b.reviews)     ? b.reviews     : [];
        b.faqs         = Array.isArray(b.faqs)        ? b.faqs        : [];
        b.fullGallery  = Array.isArray(b.fullGallery) ? b.fullGallery : [];

        setBusiness(b);
        setUserPlan(b.subscriptionPlan || "free");
      } catch (err) {
        console.error("❌ שגיאה בטעינת פרופיל העסק:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBusinessData();
  }, [businessId]);

  if (loading) return <p>🔄 טוען פרופיל העסק…</p>;
  if (!business) return <p>⚠️ העסק לא נמצא</p>;

  // בדיקת זמינות תכונות עם guard למניעת קריסה
  let canChat = false;
  try {
    canChat = checkFeatureAvailability("chat", userPlan);
  } catch (e) {
    console.warn("checkFeatureAvailability(chat) failed:", e);
  }

  let canSchedule = false;
  try {
    canSchedule = checkFeatureAvailability("booking", userPlan);
  } catch (e) {
    console.warn("checkFeatureAvailability(booking) failed:", e);
  }

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
              fontSize: "16px",
            }}
          >
            ✏️ ערוך פרופיל
          </button>
        </div>
      )}

      <BusinessProfileView
        profileData={business}
        profileImage={business.logo?.preview || business.logo}
        canChat={canChat}
        canSchedule={canSchedule}
      />

      {/* תצוגת בדיקה של הנתונים */}
      <pre
        style={{
          background: "#eee",
          padding: "1rem",
          marginTop: "2rem",
          borderRadius: "8px",
          direction: "ltr",
          overflowX: "auto",
        }}
      >
        {JSON.stringify(business, null, 2)}
      </pre>
    </div>
  );
}
