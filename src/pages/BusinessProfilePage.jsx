import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function BusinessProfilePage({ currentUserId, currentUserBusinessId }) {
  const { businessId } = useParams();
  const navigate = useNavigate();

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

  // האם המשתמש הנוכחי הוא בעל העסק הנוכחי (העסק שמוצג בפרופיל)
  const isOwnerViewingOther =
    currentUserBusinessId && currentUserBusinessId !== businessId;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 30 }}>
      
      {/* כפתור חזרה לשיתופי פעולה — רק לבעל העסק שנכנס לפרופיל עסק אחר */}
      {isOwnerViewingOther && (
        <button
          onClick={() => navigate("/business/collaborations")}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#8e44ad",
            cursor: "pointer",
            fontSize: 16,
            marginBottom: 24,
            fontWeight: "600",
            padding: 0,
            textDecoration: "underline"
          }}
          aria-label="חזרה לשיתופי פעולה"
        >
          ← חזרה לשיתופי פעולה
        </button>
      )}

      {/* הכרטיס עם פרטי העסק — עיצוב כמו שהיה */}
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: "#333",
          padding: 30
        }}
      >
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
          <p>
            <b>📍 אזור פעילות:</b> {business.area || "לא מוגדר"}
          </p>
          <p>
            <b>📝 תיאור העסק:</b>
          </p>
          <p style={{ marginTop: 8, color: "#555" }}>
            {business.description || "אין תיאור זמין"}
          </p>
        </div>
      </div>

      {/* כפתור צור קשר מחוץ לכרטיס עם מרווח עליון */}
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
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#732d91")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#8e44ad")}
      >
        צור קשר עם העסק
      </button>
    </div>
  );
}
