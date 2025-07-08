import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFavorites() {
      console.log("🔄 fetchFavorites started");
      setLoading(true);
      setError(null);

      let gotUser = !!user?.userId;
      console.log("👤 gotUser:", gotUser, "user:", user);

      try {
        // 1️⃣ ראשון – קבלת פרטי המשתמש
        let res = gotUser
          ? await API.get("/auth/me", {
              headers: { Authorization: `Bearer ${user.token}` },
              withCredentials: true,
            })
          : await API.get("/auth/me", { withCredentials: true });

        console.log("📥 /auth/me response data:", res.data);

        // אם זרימת cookie הצליחה, עדכון ה־context
        if (!gotUser && res.data?.userId) {
          console.log("✅ Cookie auth הצליח, setUser:", res.data);
          setUser(res.data);
          gotUser = true;
        }

        if (!gotUser) {
          console.warn("⚠️ לא מזוהה, דורש התחברות");
          throw new Error("אנא התחבר כדי לראות את המועדפים שלך.");
        }

        // 2️⃣ שנית – האם השרת כבר החזיר לנו favorites?
        const favIds = res.data.favorites;
        console.log("🔗 raw favorites IDs:", favIds);

        let favoritesData = [];
        if (Array.isArray(favIds) && favIds.length > 0) {
          console.log("🚀 fetching details for each favorite business...");
          // נחמם את כל הפרטים של העסקים במועדפים
          const detailPromises = favIds.map((bizId) =>
            API.get(`/business/${bizId}`, {
              headers: { Authorization: `Bearer ${user.token}` },
              withCredentials: true,
            }).then((r) => r.data)
          );
          favoritesData = await Promise.all(detailPromises);
          console.log("⭐ favorites details loaded:", favoritesData);
        } else {
          console.log("ℹ️ אין פרטי favorites להורדה (מסד הנתונים ריק)");
        }

        setFavorites(favoritesData);
      } catch (err) {
        console.error("❌ Error fetching favorites:", err);
        setError(err.message || "שגיאה בטעינת המועדפים");
      } finally {
        console.log("✅ fetchFavorites finished");
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [user, setUser]);

  if (loading) return <div>טוען מועדפים...</div>;
  if (error)
    return (
      <div style={{ color: "red" }}>
        {error}
        <br />
        <button onClick={() => window.location.reload()}>נסה שוב</button>
      </div>
    );
  if (!favorites.length) return <div>אין לך עסקים במועדפים כרגע.</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>⭐ המועדפים שלי</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {favorites.map((biz) => (
          <li
            key={biz._id}
            onClick={() => {
              console.log("➡️ navigating to business:", biz._id);
              navigate(`/business/${biz._id}`);
            }}
            style={{
              cursor: "pointer",
              padding: "10px",
              borderBottom: "1px solid #ccc",
              marginBottom: "8px",
              borderRadius: "6px",
              backgroundColor: "#f9f9f9",
            }}
            title={`לחץ לפרופיל העסק ${biz.businessName}`}
          >
            <strong>{biz.businessName}</strong>
            <p>{biz.description?.slice(0, 100) || "אין תיאור"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
