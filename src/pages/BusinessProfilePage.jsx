import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";

export default function BusinessProfilePage() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBusiness() {
      try {
        const res = await API.get(`/business/${businessId}`);
        setBusiness(res.data.business);
      } catch (err) {
        setError("שגיאה בטעינת פרטי העסק");
      } finally {
        setLoading(false);
      }
    }
    fetchBusiness();
  }, [businessId]);

  if (loading) return <p style={{ textAlign: "center", marginTop: 50 }}>טוען פרופיל...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red", marginTop: 50 }}>{error}</p>;
  if (!business) return <p style={{ textAlign: "center", marginTop: 50 }}>העסק לא נמצא.</p>;

  // בדיקה האם המשתמש בעל עסק וצופה בפרופיל של עסק אחר
  const isBusinessUser = user?.role === "business";
  const isNotOwnProfile = user?.businessId !== businessId;
  const showBackToCollaborationsButton = isBusinessUser && isNotOwnProfile;

  return (
    <div style={{
      maxWidth: 700,
      margin: "40px auto",
      padding: 30,
      backgroundColor: "#fff",
      borderRadius: 16,
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#333"
    }}>
      {/* כפתור חזרה לשיתופי פעולה - רק אם זה לא הפרופיל של העסק עצמו */}
      {showBackToCollaborationsButton && (
        <button
          onClick={() => navigate("/business/collaborations")} // כאן הנתיב לשיתופי פעולה מחוץ לדשבורד
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#8e44ad",
            cursor: "pointer",
            fontSize: 16,
            marginBottom: 24,
            fontWeight: "600",
            padding: 0
          }}
          aria-label="חזרה לשיתופי פעולה"
        >
          ← חזרה לשיתופי פעולה
        </button>
      )}

      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <img
          src={business.logo || "/default-logo.png"}
          alt={`${business.businessName} לוגו`}
          style={{
            width: 140,
            height: 140,
            objectFit: "cover",
            borderRadius: "50%",
            border: "4px solid #9b59b6",
            marginRight: 24,
            boxShadow: "0 4px 12px rgba(155,89,182,0.4)"
          }}
        />
        <div>
          <h1 style={{ fontSize: 28, marginBottom: 4, color: "#6c3483" }}>
            {business.businessName}
          </h1>
          <p style={{ fontSize: 18, color: "#9b59b6", fontWeight: "600" }}>
            {business.category}
          </p>
        </div>
      </div>

      <div style={{ lineHeight: 1.6, fontSize: 16 }}>
        <p><b>📍 אזור פעילות:</b> {business.area || "לא מוגדר"}</p>
        <p><b>📝 תיאור העסק:</b></p>
        <p style={{ marginTop: 8, color: "#555" }}>{business.description || "אין תיאור זמין"}</p>
      </div>

      <button
        style={{
          marginTop: 30,
          backgroundColor: "#8e44ad",
          color: "white",
          border: "none",
          padding: "12px 28px",
          borderRadius: 30,
          cursor: "pointer",
          fontSize: 16,
          boxShadow: "0 4px 14px rgba(142, 68, 173, 0.4)",
          transition: "background-color 0.3s ease"
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#732d91"}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#8e44ad"}
        aria-label="צור קשר עם העסק"
      >
        צור קשר עם העסק
      </button>
    </div>
  );
}
