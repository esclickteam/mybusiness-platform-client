import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import BusinessProfileView from "../components/shared/BusinessProfileView";
import checkFeatureAvailability from "../components/FeatureAvailability";

export default function BusinessPage() {
  const { businessId } = useParams();
  const [business, setBusiness] = useState(null);
  const [userPlan, setUserPlan] = useState("free");
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="business-page-container">
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
