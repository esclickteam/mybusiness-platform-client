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

  console.log("BusinessPage נטען עם ID:", businessId); // ✅ הוספה כאן


  useEffect(() => {
    console.log("🔍 Business ID:", businessId);

    const fetchBusinessData = async () => {
      try {
        const { data } = await API.get(`/business/${businessId}`);
        const b = data.business ?? data;
        console.log("📦 מידע שהתקבל:", b);
        setBusiness(b);
        setUserPlan(b.subscriptionPlan || "free");
      } catch (error) {
        console.error("❌ שגיאה בטעינת פרופיל העסק:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [businessId]);

  if (loading) return <p>🔄 טוען פרופיל העסק…</p>;
  if (!business) return <p>⚠️ העסק לא נמצא</p>;

  const canChat = checkFeatureAvailability("chat", userPlan);
  const canSchedule = checkFeatureAvailability("booking", userPlan);

  const isOwner =
    user?.role === "business" && user.businessId === businessId;

  return (
    <div className="business-page-container">
      {/* ✅ כפתור חזור לעריכה - רק לבעל העסק */}
      {isOwner && (
        <div style={{ textAlign: "center", margin: "2rem 0" }}>
          <button
            onClick={() => navigate("/business/build")}
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
            ✏️ חזור לעריכה
          </button>
        </div>
      )}

      <BusinessProfileView
        profileData={business}
        profileImage={business.logo?.preview || business.logo}
        canChat={canChat}
        canSchedule={canSchedule}
      />

      {/* ✅ תצוגת בדיקה זמנית של הנתונים */}
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
